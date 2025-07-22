const messenger: typeof browser = browser;

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded event fired");
    messenger.runtime.sendMessage({ action: "getMessage" }).then(response => {

        console.log("Received message content:", response);
        console.log("Message Content Type:", response.contentType);

        displayEmailContent(response);

    });
});

interface EmailPart {
  contentType: string;
  body: string | null;
  parts?: EmailPart[];
  headers: {
    [key: string]: string[];
  };
}

function displayEmailContent(response: EmailPart): void {
  if (response.parts && response.parts?.length > 0) {
    const emailContent = getFirstMessageBody(response);
    console.log("Email content:", emailContent);

    const emailInput = document.getElementById("email") as HTMLInputElement | null;
    if (emailInput) {
      emailInput.value = emailContent;
    }
  }
}

function decodeBase64ToUtf8(base64: string): string | null {
    try {
        const binary = atob(base64.replace(/\s/g, ""));
        const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
        return new TextDecoder("utf-8").decode(bytes);
    } catch (error) {
        console.error("Unable to decode base64 to Utf8:", error.message);
        return null;
    }
}

function findBody(part: EmailPart): string | null {
    if (part.contentType === "text/plain" && part.body) {
        const encoding = part.headers["content-transfer-encoding"]?.[0]?.toLowerCase();
        if (encoding === "base64") {
            part.body = decodeBase64ToUtf8(part.body);
        }
        return part.body;
    }
    
    if (part.parts) {
        for (const subpart of part.parts) {
            const body = findBody(subpart);
            if (body) {
                return body;
            }
        }
    }
    return null;
}

function getFirstMessageBody(full: EmailPart): string {
    const body = findBody(full);
    if (!body) {
        throw new Error("Kein Textkörper gefunden");
    }
    return body;
}
