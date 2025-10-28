# 🇩🇪 German Notebook

A simple and fast desktop notebook for building your personal German vocabulary. Save and organize nouns, verbs, adjectives, and adverbs all in one place. This app is designed for a seamless, fast user experience, helping you focus on learning.

![Add Word Form](/public/noun-form.png) ![Word List](/public/list-page.png)

---

## ✨ Key Features

- 🗂️ **Organize by Word Type:** Easily add Nouns (with `der/die/das`), Verbs (with tenses), Adjectives, and Adverbs.
- 🤖 **Automatic Translation:** Automatically translates your German words into Bulgarian to save you time.
- 📚 **Personal Dictionary:** All your words are saved locally in a clean, searchable table.
- ⚡ **Fast & Local:** Built with Tauri, this app is tiny and fast. All your data is stored _only_ on your computer for 100% privacy.

---

## 🚀 How to Install (For Regular Users)

You can download and install this app on any Windows computer.

1.  Go to the [**Releases Page**](https://github.com/kirilchobansky/notebook/releases) of this repository.

2.  Find the latest release (it will have a tag like `v1.0.0`).

3.  Under the "Assets" section, download the file that ends in `_x64-setup.exe`.

4.  Run the installer file you just downloaded.

### ⚠️ **Important Windows Warning**

When you run the installer, Windows will show a blue popup that says **"Windows protected your PC."** This is normal because I am not a registered Microsoft developer.

To continue, you **must** do the following:

1.  Click the **"More info"** text.
2.  A new button will appear. Click **"Run anyway"**.

After that, the app will install, and you can use it from your Start Menu just like any other program!

---

## 💻 For Developers (How to Run Locally)

This app is built with Tauri, React, and TypeScript.

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/kirilchobansky/notebook.git
    cd notebook
    ```

2.  **Set up your Environment:**
    This app requires a DeepL API key for translations. Create a `.env` file in the root of the project and add your key:

    ```bash
    echo "DEEPL_API_KEY=your-deepl-key-goes-here" > .env
    ```

3.  **Install dependencies:**

    ```bash
    npm install
    ```

4.  **Run the app in development mode:**
    ```bash
    npm run tauri dev
    ```

---

## 🛠️ Technology Stack

- **Core:** [Tauri](https://tauri.app/) (v2)
- **Frontend:** [React](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **Routing:** [React Router](https://reactrouter.com/)
- **Translation:** [DeepL API](https://www.deepl.com/pro-api)
- **Local Storage:** [Tauri Store Plugin](https://v2.tauri.app/plugin/store/)
