# AI Reply with the Chat

An experimental **Mozilla Thunderbird extension** that adds AI-powered email reply functionality.  
It integrates with Thunderbird’s message display and composition interfaces, enabling context-aware draft generation using the [Mistral AI API](https://docs.mistral.ai).

---

## 🧩 Purpose

This extension aims to streamline email communication by automatically generating draft replies based on message context.  
It is intended for users who want to integrate generative AI directly into Thunderbird, keeping control over how and when AI assistance is used.

**Core features:**
- Read message content in Thunderbird.
- Generate context-aware replies using Mistral AI.
- Insert generated text directly into the compose window.
- Configure settings and API key locally. The API key has to be added to "public/secret.json"

---

## Configuration

The API key has to be added to "public/secret.json":

```json
{
    "mistralsecret": "XYZ"
}
```
---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/DanielWinz75/Thunderbird-AI-Extension.git
cd Thunderbird-AI-Extension
```

### 2. Install dependencies

```bash
npm install
```

### 3. Build the project

```bash
npm run build
```

This runs TypeScript compilation and the Vite bundler.

### 4. (Optional) Build an `.xpi` package

```bash
npm run build:xpi
```

This executes the `build-xpi.cmd` script to generate an installable Thunderbird add-on package.

### 5. Load the extension in Thunderbird

1. Open Thunderbird.  
2. Go to **Tools → Add-ons and Themes → Extensions**.  
3. Click the gear icon → **Debug Add-ons**.  
4. Select **Load Temporary Add-on**.  
5. Choose the `manifest.json` file or the generated `.xpi`.

---

## 🛠 Configuration

### Mistral API Access

The extension calls:
```
https://api.mistral.ai/*
```

It requires a valid Mistral API key.  
You can store it securely using Thunderbird’s `storage` API:

```javascript
browser.storage.local.set({
  mistralApiKey: "YOUR_MISTRAL_API_KEY"
});
```

Before sending a request, retrieve it:

```javascript
const { mistralApiKey } = await browser.storage.local.get("mistralApiKey");
```

Do **not** hardcode the API key inside the source code.

---

## 🧾 Manifest Overview

Your current `manifest.json`:

```json
{
  "manifest_version": 2,
  "name": "AI Reply with the Chat",
  "version": "1.0",
  "applications": {
    "gecko": {
      "id": "test-addon@example.com",
      "strict_min_version": "91.0"
    }
  },
  "background": {
    "scripts": ["background.js"],
    "persistent": true
  },
  "message_display_action": {
    "default_title": "AI Reply with the Chat"
  },
  "icons": {
    "16": "icons/UnChat16.png",
    "32": "icons/UnChat32.png",
    "48": "icons/UnChat48.png"
  },
  "permissions": [
    "messagesRead",
    "menus",
    "activeTab",
    "tabs",
    "webRequest",
    "webRequestBlocking",
    "https://api.mistral.ai/*",
    "storage",
    "compose"
  ]
}
```

### Permission details

| Permission | Purpose |
|-------------|----------|
| `messagesRead` | Read selected email text for AI input |
| `compose` | Insert or modify email drafts |
| `storage` | Save API key and configuration |
| `webRequest`, `webRequestBlocking` | Manage and secure API communication |
| `https://api.mistral.ai/*` | Allow access to Mistral AI |
| `menus`, `activeTab`, `tabs` | UI integration and user actions |

---

## 🧱 Project Structure

```
.
├── background.js           # Core logic (AI call, message handling)
├── manifest.json           # Thunderbird extension definition
├── package.json            # Dependencies and build scripts
├── icons/                  # Toolbar and menu icons
├── src/                    # TypeScript/Vite sources
├── dist/                   # Build output
└── build-xpi.cmd           # Optional packaging script
```

---

## 📜 Scripts

| Command | Description |
|----------|-------------|
| `npm run dev` | Start Vite in development mode |
| `npm run build` | Compile TypeScript and bundle via Vite |
| `npm run preview` | Preview the built output |
| `npm run build:xpi` | Package the extension for Thunderbird |

---

## 🔐 Security and Privacy

- Only messages that you actively open and request AI assistance for are processed.
- Requests are sent exclusively to `https://api.mistral.ai/`.
- No third-party tracking or analytics are included.
- Always review code for compliance with local data protection laws.

---

## 🧠 Customization

You can modify:
- Which Mistral model is used (e.g., `mistral-small`, `mistral-large`).
- Prompt templates inside `background.js`.
- Menu labels, icons, or trigger actions.

Example snippet (conceptual):

```javascript
const prompt = `Reply to this email politely:\n\n${emailBody}`;
const response = await mistralClient.chat({
  model: "mistral-small",
  messages: [{ role: "user", content: prompt }]
});
```

---

## 🧾 License

License
This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

---

## 📬 Contact

**Author:** Daniel Winz  
**GitHub:** [https://github.com/DanielWinz75](https://github.com/DanielWinz75)  
**Project:** [Thunderbird-AI-Extension](https://github.com/DanielWinz75/Thunderbird-AI-Extension)

---
