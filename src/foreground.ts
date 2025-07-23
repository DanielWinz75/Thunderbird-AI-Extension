import { Email } from "./interfaces";
import { displayEmailContent } from "./email-and-prompt-view-functions";

const messenger: typeof browser = browser;

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded event fired");
    messenger.runtime.sendMessage({ action: "getMessage" }).then((email: Email) => {

        console.log("Received email:", email);

        displayEmailContent(email);
    });
});
