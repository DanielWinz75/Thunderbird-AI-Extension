// import { Mistral } from "@mistralai/mistralai";

// const mistral = new Mistral({ apiKey: "P5uAQ8rTxE3mWzYT42IC7fzQlHJQC7YO" });

export function aiGenerateReply(): string {
    const emailInput = document.getElementById("email") as HTMLInputElement | null;
    let email: string;
    emailInput ? email = emailInput.value : email = "";

    const promptInput = document.getElementById("prompt") as HTMLInputElement | null;
    let prompt: string;
    promptInput ? prompt = promptInput.value : prompt = "";

    console.log("Email:", email, "Prompt:", prompt);

    // getGeneratedEmailContent(email, prompt);

    return "Reply generation initiated";
}

/*
function getGeneratedEmailContent(email: string, prompt: string): void {
    console.log("Generating reply with Mistral AI...");
    console.log("Email:", email, "Prompt:", prompt);

    mistral.chat.complete({
        model: 'mistral-large-latest',
        messages: [{role: 'user', content: 'What is the best French cheese?'}],
    }).then(chatResponse => {
        console.log('Chat:', chatResponse.choices[0].message.content);
    }).catch(error => {
        console.error("Error during AI reply generation:", error);
    });
}*/