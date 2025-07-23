import type { Email } from "./interfaces";
import { displayEmailContent } from "./email-and-prompt-view-functions";
import { aiGenerateReply } from "./ai-generate-reply-functions";

const messenger: typeof browser = browser;

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded event fired");
    messenger.runtime.sendMessage({ action: "aiRG-getEmail" }).then((email: Email) => {

        console.log("Received email:", email);

        displayEmailContent(email);
    });
});

document.getElementById("generateReply")?.addEventListener("click", () => {

    const aiGeneratedMail = aiGenerateReply();

    messenger.runtime.sendMessage({ action: "aiRG-beginReply", aiGeneratedMail }).then(() => {
        console.log("Reply generation initiated");
    }).catch((error) => {
        console.error("Error generating reply:", error);
    });
});
