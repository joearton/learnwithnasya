# Learn With Nasya 🎓📚

Welcome to **Learn With Nasya** — a fun and interactive platform designed to help non-native children learn to read, pronounce, and understand English through simple games 🗣️💡.

Inspired by the real learning journey of a child named Nasya, this project aims to create an accessible, personalized educational tool that listens, transcribes, and provides constructive feedback — just like a patient and encouraging teacher.

---

## 🛠️ Features

* 🎤 **Voice Input** — Speak a word, and the app will listen!
* 📝 **Speech-to-Text** — Transcribes speech using OpenAI's Whisper.
* 🤖 **AI Feedback** — Offers helpful pronunciation feedback via GPT.
* 🌍 **Multilingual Support** — Adaptable for ESL and multilingual learners.
* 💻 **Local or Cloud Processing** — Use Whisper and GPT locally or via OpenAI API.

---

## 📸 Demo

> 🌐 Try it now at: [https://learnwithnasya.my.id](https://learnwithnasya.my.id)

---

## 🧰 Tech Stack

* **Python 3.11**
* **Flask** – Lightweight web backend
* **HTML/CSS/JavaScript** – Optional frontend enhancements

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/joearton/learnwithnasya.git
cd learnwithnasya
```

### 2. Create a Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the Application

```bash
python app.py
```

---

## 🎮 Creating a New Game

You can create modular, self-contained English learning games by following a consistent directory structure and file format. Each game lives inside the `games/` folder, and the platform automatically loads its assets.

### 📁 Game Folder Structure

```
games/
└── your-game-name/
    ├── index.html        # Main layout extending base_game.html
    ├── info.json         # Game metadata
    ├── script.js         # Game logic
    ├── style.css         # Optional additional styles
    └── thumbnail.jpg     # Game thumbnail for dashboard
```

### 🧩 Example: `choose-sentence`

#### `index.html`

```html
{% extends "base_game.html" %}

{% block title %}Choose Sentence to Answer{% endblock %}

{% block game %}
<!-- Your game HTML goes here -->
{% endblock %}
```

#### `info.json`

```json
{
  "title": "Choose Sentence to Answer",
  "description": "Practice reading English sentences",
  "author": "Your Name",
  "version": "1.0",
  "difficulty": "easy",
  "thumbnail_alt": "Illustration of sentence game"
}
```

#### `script.js`

This script is automatically loaded. You may use the following global functions:

* `playGameAudio('game-audio-true')` – for correct answers
* `playGameAudio('game-audio-false')` – for incorrect answers

Also:

* Any element with the `.click-to-speak` class will be automatically read aloud using speech synthesis.
* You are encouraged to implement a timer or countdown manually to enhance gameplay.

#### `style.css`

Use minimal styles only for enhancements. Do **not override** Bootstrap 5 or Font Awesome.

#### `thumbnail.jpg`

Provide a 4:3 representative image for the game. This will be shown in the game selection interface.

---

### 🧒 Accessibility & UX Guidelines

* Use large, clear fonts and buttons suitable for children.
* Use `.click-to-speak` to make text interactive and accessible.
* Reinforce feedback with both audio (`playGameAudio`) and visual cues.
* Include a visible timer to promote focus and excitement.

---

## 🎯 Goals & Vision

* Empower children to learn pronunciation independently
* Support parents and teachers with accessible, AI-powered tools
* Create intuitive, speech-based learning interfaces
* Build an open-source foundation for broader educational applications

---

## 🤝 Contributing

Contributions are welcome and appreciated!

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add new feature"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

Licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more details.

---

## 👨‍👩‍👧 About the Author

Created with ❤️ by [Joe Arton](https://github.com/joearton), inspired by Nasya’s curiosity and the potential of open AI tools to empower children everywhere.

---

## 🌟 Support & Feedback

If you enjoy the project, please ⭐ it, share it, or open an issue with ideas or feedback. Your input helps make it better for all learners!

