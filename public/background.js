messenger.runtime.onInstalled.addListener(() => {
  console.log("Extension installed!");
});

messenger.menus.create({
  id: "ai-reply-with-the-chat",
  title: "AI Reply with the Chat",
  contexts: ["message_list"]
});

const email = {
  messageId: "",
  headerMessageId: "",
  from: "",
  subject: "",
  message: null,
  errorOnFetchingEmailMessage: ""
};

let win = null;

messenger.menus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "ai-reply-with-the-chat") {
    win = await messenger.windows.create({
      url: "index.html",
      type: "popup",
      width: 1000,
      height: 800
    });

    // Get Email
    console.log("Fetching email content for message:", info);
    if (info.selectedMessages.messages[0]) {
      email.messageId = info.selectedMessages.messages[0].id;
      emailheaderMessageId = info.selectedMessages.messages[0].headerMessageId;
      email.subject = info.selectedMessages.messages[0].subject || "No Subject";
      email.from = info.selectedMessages.messages[0].author || "Unknown Sender";
      messenger.messages.getFull(email.messageId).then((message) => {
        console.log("Message content fetched:", message);         
        email.message = message;
      }).catch((error) => {
        console.error("Error fetching message content:", error);
        email.errorOnFetchingEmailMessage = error.message || "Unknown error";
      })
    }
  }
});

messenger.runtime.onMessage.addListener((message, sender, sendResponse) => {

  console.log("Received sendResponse:", sendResponse);

  if (message.action === "aiRG-getEmail") {
    sendResponse(email);
  }
  if (message.action === "aiRG-beginReply") {

    console.log("In aiRG-beginReply action");

    const apiKey = 'sk-P5uAQ8rTxE3mWzYT42IC7fzQlHJQC7YO';

    const body = {
      model: "mistral-tiny",
      messages: [
        { role: "user", content: "Hallo, wer bist du?" }
      ]
    };

    fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(err => {
      console.error(err);
    });


    // messenger.windows.remove(win.id).then(() => {
    //   messenger.compose.beginReply(email.messageId, "replyToAll", {isPlainText: true, plainTextBody: email.message}).then(() => {
    //     console.log("Reply composed successfully");
    //   });
    // }).catch((error) => {
    //   console.error("Error closing popup window:", error);
    // });

    return true; // Keep the message channel open for sendResponse
  }  
});
