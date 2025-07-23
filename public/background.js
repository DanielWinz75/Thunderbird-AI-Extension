messenger.runtime.onInstalled.addListener(() => {
  console.log("Extension installed!");
});

messenger.menus.create({
  id: "reply-with-ai",
  title: "Reply with AI",
  contexts: ["message_list"]
});

email = {
  from: "",
  subject: "",
  message: null,
  errorOnFetchingEmailMessage: ""
};

messenger.menus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "reply-with-ai") {
    const win = await browser.windows.create({
      url: "index.html",
      type: "popup",
      width: 1000,
      height: 800
    });

    // Get Email
    console.log("Fetching email content for message:", info);
    if (info.selectedMessages.messages[0]) {
      messageId = info.selectedMessages.messages[0].id;
      headerMessageId = info.selectedMessages.messages[0].headerMessageId;
      email.subject = info.selectedMessages.messages[0].subject || "No Subject";
      email.from = info.selectedMessages.messages[0].author || "Unknown Sender";
      messenger.messages.getFull(messageId).then((message) => {
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
  if (message.action === "getMessage") {
    sendResponse(email);
  }
});
