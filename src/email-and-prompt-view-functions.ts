import type { Email, EmailPart } from "./interfaces";

export function displayEmailContent(email: Email): void {
    
    if(email.errorOnFetchingEmailMessage) {
        console.error("Error fetching email message:", email.errorOnFetchingEmailMessage);

        // Display error message to the user
    }

    var label = document.getElementById("emailLabel");
    if (label) {
        label.textContent = `Email from: ${email.from} - Subject: ${email.subject}`;
    }    
    
    if (email.message) {
        const emailContent = getFirstMessageBody(email.message);
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
    } catch (error: any) {
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
        throw new Error("Message cannot be displayed, no body found.");
    }
    return body;
}
