const aiReplyApiKey = 'ClCEpJcm9Sh9h9r5R3plKSO8T6W1FHiJ';
const aiReplyApiAddress = 'https://api.mistral.ai/v1/chat/completions';
const aiReplyPromptMain = "General system instructions what to do: \nGenerate a reply to the email content provided below. Generate the reply text only. Don't generate any comments. Don't put the subject of the email into the reply message. Be concise with names for salutation and ending of the reply. The reply should be relevant to the email's subject and content. The reply should be in the same language as the original email. The reply should be concise and to the point. Do not include any personal information or sensitive data in the reply.";
const aiReplyPromptFormat = "How to format the reply: \nThe reply should be formatted as a complete email text with a salutation and closing. The subject should not be repeated in the reply. The reply should be in plain text format. Do not include any HTML or rich text formatting in the reply.";
const aiReplyModel = "mistral-small-latest";
messenger.storage.local.set({aiReplyApiKey});
messenger.storage.local.set({aiReplyApiAddress});
messenger.storage.local.set({aiReplyPromptMain});
messenger.storage.local.set({aiReplyPromptFormat});
messenger.storage.local.set({aiReplyModel});

const email = {
  messageId: "",
  headerMessageId: "",
  from: "",
  subject: "",
  originalMessage: null,
  fullMessage: null,
  rawMessage: null,
  errorOnFetchingEmailMessage: "",
  isHtml: false
};

messenger.runtime.onInstalled.addListener(() => {
  console.log("Extension installed!");
});

messenger.menus.create({
  id: "ai-reply-with-the-chat",
  title: "AI Reply with the Chat",
  contexts: ["message_list"]
});

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
      email.headerMessageId = info.selectedMessages.messages[0].headerMessageId;
      email.subject = info.selectedMessages.messages[0].subject || "No Subject";
      email.from = info.selectedMessages.messages[0].author || "Unknown Sender";

      messenger.messages.getFull(email.messageId).then((message) => {
        console.log("Message content fetched:", message);         
        email.originalMessage = message;

      }).catch((error) => {
        console.error("Error fetching message content:", error);
        email.errorOnFetchingEmailMessage = error.message || "Unknown error";
      });
     
      fetchEmailContentFullAndRaw().then(() => {
        console.log("Email data fetched successfully:", email);
      }).catch((error) => {
        console.error("Error fetching email data:", error);
      });
    }
  }
});

async function fetchEmailContentFullAndRaw() {
  let error = null;

  try {
    // getFull returns an EmailPart object
    email.fullMessage = await messenger.messages.getFull(email.messageId);
    checkPartsForContentType(email.fullMessage.parts);
    console.log("Full message fetched successfully:", email.fullMessage);
  } catch (err) {
    error = "Error on getFull message: "+err+"\n";
  }

  try {
    // getRaw returns a string
    email.rawMessage = await messenger.messages.getRaw(email.messageId);
  } catch (err) {
    error += "Error on getRaw message: "+err;
  }

  if (error) {
    throw new Error(error);
  }
}

messenger.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "aiRG-getEmail") {
    sendResponse(email);
  }
  if (message.action === "aiRG-generateReplyAndOpenReplyWindow") {
    fetchAIReply(message.prompt).then((aiGeneratedMessageText) => {

      closePopupAndOpenReplyWindow(aiGeneratedMessageText);
      
    }).catch((error) => {
      console.error("Error in fetchAIReply:", error);
    });

    return true; // Keep the message channel open for sendResponse
  }  
});

async function fetchAIReply(prompt) {

  const settings = await messenger.storage.local.get({aiReplyApiKey, aiReplyApiAddress, aiReplyModel});

  const apiRequestBody = {
    model: settings.aiReplyModel,
    messages: [
      { role: "user", content: prompt },
    ]
  };

  const response = await fetch(settings.aiReplyApiAddress, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${settings.aiReplyApiKey}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(apiRequestBody)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}, message: ${response.detail[0].msg}`);
  }

  const aiGeneratedReply = await response.json();
  console.log("AI reply fetched successfully:", aiGeneratedReply);

  return aiGeneratedReply.choices[0].message.content.trim();
}

async function closePopupAndOpenReplyWindow(aiGeneratedReply) {
  try {
    tab = await messenger.compose.beginReply(email.messageId, "replyToAll", {isPlainText: !email.isHtml});

    let details = await messenger.compose.getComposeDetails(tab.id);

    console.log("Compose details fetched:", details);
    if (details.isPlainText) {
      await messenger.compose.setComposeDetails(tab.id, {
        plainTextBody: aiGeneratedReply + "\n\n" + details.plainTextBody
      });
    } else {
      await messenger.compose.setComposeDetails(tab.id, {
        body: "<p>" + aiGeneratedReply + "</p><br><br>" + details.body
      });
    }    

    await browser.windows.remove(win.id);

    return { success: true, tabId: tab.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}


function checkPartsForContentType(parts) {
  for (let part of parts) {
    if (part.contentType === "text/html") {
      email.isHtml = true;
    }
    if (part.parts && part.parts.length > 0) {
      checkPartsForContentType(part.parts);
    }
  }
}




// Compose-Event-Handler
// function handleComposeReady(info, state) {

//     console.log("Compose state changed:", info, state, tab);

//     if (info.tabId !== tab.id || info.state !== "ready") {
//         return;
//     }

//     // Listener wieder entfernen, da wir ihn nur einmal brauchen
//     messenger.compose.onComposeStateChanged.removeListener(handleComposeReady);

//     (async () => {
//         // Compose-Details holen
//         let details = await messenger.compose.getComposeDetails(tab.id);

//         // Body vorbereiten
//         let newBody;
//         if (details.isPlainText) {
//             newBody = aiGeneratedReply + "\n\n" + details.body;
//         } else {
//             newBody = "<p>" + aiGeneratedReply + "</p><br><br>" + details.body;
//         }

//         console.log("Setting new body:", newBody);

//         await messenger.compose.setComposeDetails(tab.id, { body: newBody });
//     })();
// }

// messenger.compose.onComposeStateChanged.addListener(handleComposeReady);
