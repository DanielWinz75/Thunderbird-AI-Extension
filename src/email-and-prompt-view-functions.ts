import type { Email, EmailPart } from "./interfaces";

export function displayEmailContent(email: Email): void {
    
    if(email.errorOnFetchingEmailMessage) {
        console.error("Error fetching email message:", email.errorOnFetchingEmailMessage);
    }

    let emailContent: string | null;
    if (email.fullMessage) {
        emailContent = findBody(email.fullMessage);

        if (!emailContent) {
            console.warn("No text/plain body found in email, displaying raw message instead.");
            emailContent = ""+email.rawMessage;
        } else {
            const rawWarning = document.getElementById("displayRaw");
            if (rawWarning) {
                rawWarning.classList.toggle("hideRawWarning");
            }
        }

        const emailInput = document.getElementById("email") as HTMLInputElement | null;
        if (emailInput) {
            emailInput.value = emailContent;
        }
    }

    const subject = document.getElementById("subject") || null;
    if (subject) {
        subject.textContent = email.subject;
    }

    const sender = document.getElementById("sender") || null;
    if (sender) {
        sender.textContent = email.from;
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

// function getFirstMessageBody(full: EmailPart): string {
//     const body = findBody(full);
//     if (!body) {
//         throw new Error("Message in text/plain format cannot be found. Display raw message instead.");
//     }
//     return body;
// }
