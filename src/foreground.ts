import type { Email } from "./interfaces";
import { displayEmailContent } from "./email-and-prompt-view-functions";
import { composePrompt } from "./compose-prompt-functions";

const messenger: typeof browser = browser;

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded event fired");
    messenger.runtime.sendMessage({ action: "aiRG-getEmail" }).then((email: Email) => {

        console.log("Received email:", email);

        displayEmailContent(email);
    });
});

document.getElementById("generateReplyButton")?.addEventListener("click", () => {
    composePrompt().then((prompt) => {
        messenger.runtime.sendMessage({ action: "aiRG-generateReplyAndOpenReplyWindow", prompt }).then(() => {
            console.log("Reply generation initiated");
        }).catch((error) => {
            console.error("Error generating reply:", error);
        });
    }).catch((error) => {
        console.error("Error composing prompt:", error);
    });
});
