document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded event fired");
    messenger.runtime.sendMessage({ action: "getMessageRaw" }).then(response => {
         // Set the email content in the input field
         if (response && response.messageRaw) {
            document.getElementById("email").value = response.messageRaw;
        }
    });
});