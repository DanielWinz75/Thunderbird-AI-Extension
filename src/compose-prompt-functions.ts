import type { AIReplySettings } from "./interfaces";
const messenger: typeof browser = browser;

export async function composePrompt(): Promise<string> {
    const defaults: AIReplySettings = {
        aiReplyPromptMain: "",
        aiReplyPromptFormat: "",
    };

    const settings: AIReplySettings = await messenger.storage.local.get(defaults);

    const emailInput = document.getElementById("email") as HTMLInputElement | null;
    let email: string;
    emailInput?.value ? email = emailInput.value : email = "";

    const promptInput = document.getElementById("prompt") as HTMLInputElement | null;
    let prompt: string;
    promptInput?.value ? prompt = promptInput.value : prompt = "undefined";

    const composedPrompt = settings.aiReplyPromptMain + "\n\n\n" + settings.aiReplyPromptFormat + "\n\n\n" + "Detailed user Instructions how to respond to the original email: \n" + prompt + "\n\n\n" + "Content of the original email: \n" + email;

    return composedPrompt;
}
