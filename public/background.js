
messenger.runtime.onInstalled.addListener(() => {
  console.log("Extension installed!");
});

messenger.menus.create({
  id: "reply-with-ai",
  title: "Reply with AI",
  contexts: ["message_list"]
});

emailContent = "";

messenger.menus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "reply-with-ai") {
    const win = await browser.windows.create({
      url: "index.html",
      type: "popup",
      width: 1000,
      height: 800
    });

    // E-Mail-Inhalt holen
    console.log("Fetching email content for message ID:", info);
    if (info.selectedMessages.messages[0]) {
      messageId = info.selectedMessages.messages[0].id;
      headerMessageId = info.selectedMessages.messages[0].headerMessageId;

      console.log("Message header ID, id:", headerMessageId, messageId);

      messenger.messages.getFull(messageId).then((message) => {
        console.log("Message content fetched:", message);
        emailContent = message;
      }).catch((error) => {
        console.error("Error fetching message content:", error);
      })
    }
  }
});

messenger.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getMessage") {
    sendResponse(emailContent);
  }
});
