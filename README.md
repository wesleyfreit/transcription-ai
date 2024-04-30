## 💻 Project

### 📖 Title

**Transcription Ai App**

### 📝 Description

**The TranscriptionAi App is used to transcribe videos, audios and speeches into text**

## 🚀 Quick Start

**Requirements: Node >=18**

---

**1. Install the project dependencies.**

**2. Set environment variables based on .env examples.**

**3. Run the web app based on commands section.**

## ⌨️ Commands

**Run the install dependencies command**

```bash
pnpm i
```

**Run the development web app command:**

```bash
pnpm run dev
```

**Run the build command:**

```bash
pnpm run build
```

**Run the builded web app command:**

```bash
pnpm start
```

**Run the linter code command:**

```bash
pnpm run lint
```

## 📝 Requirements

### 🛠️ Functional Requirements

- ✅ It must be possible to transcribe video or audio to text
- ✅ It must be possible to speech recognition to text

- ✅ It must be possible to change the generated result

### 🛠️ Non-Functional Requirements

- ✅ It must be possible to select files to transcribe

- ✅ It must be possible to insert prompts to transcribe

- ✅ It must be possible to change temperature to transcribe

- ✅ It must be possible to use a microphone to speech recognition

### 📚 Business Rules

- ✅ The user cannot modify the text until it is generated

- ✅ Videos must be in .mp4 or .mkv format

- ✅ Audios must be in .mp3 format

- ✅ Prompts must be separated by commas

- ✅ Temperature must be between 0 and 1
