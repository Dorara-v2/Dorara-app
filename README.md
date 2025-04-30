# Dorara 📚✨

**Dorara** is your personal offline-first productivity app — helping you manage your **to-dos**, **notes**, **bookmarks**, **routines**, and **expenses** with seamless cloud backup.

Built for minimalism, speed, and true ownership of your data.

---

## Features 🚀

- ✅ **To-Dos**  
  Organize your tasks with categories, due dates, and optional reminders.

- 📝 **Notes (Markdown-based)**  
  Create and edit markdown notes in folders, fully offline with Drive sync.

- 🔖 **Bookmarks**  
  Save links and organize them into categories for easy access.

- 🔁 **Routines**  
  Create repeating tasks to build habits and track progress.

- 💸 **Expenses**  
  Log and categorize your expenses with a simple and intuitive flow.

- ☁️ **Cloud Sync**  
  Offline-first experience with automatic sync to Firestore + Google Drive when online.

- 🔔 **Local Notifications**  
  Get timely task reminders even without internet.

---

## Tech Stack 🛠️

- **React Native** (Expo)
- **Firebase Firestore** (for cloud database)
- **Google Drive API** (for notes backup)
- **SQLite** (for offline-first data)
- **Zustand** (for state management)
- **Expo Notifications** (for local alerts)

---

## Folder structure
```

Dorara-app/
├── assets/                                   # Images, fonts, and other static files
├── components/                         # Reusable React Native components       
├── firebase/                                # Firebase configuration and utilities
├── navigation/                            # React Navigation setup and navigators
├── screens/                                 # All Screens
├── store/                                     # Zustand Stores
├── sqlite/                                    # init sqlite 
├── utils/                                      # Utility Functions
        ├── driveDirectory/             # drive functions
        ├── offlineDirectory/           # local file system functions 
```

---

## Roadmap

- [ ] Todo:
    - [x] categories
    - [x] Local CRUD
    - [x] Firebase integration
    - [x] Firebase backup on login
    - [] Notifications
    - [x] editable todo and category

- [ ] Notes: 
    - [x] local file/folder CRUD
    - [x] firebase integration
    - [x] drive integration
    - [ ] notes editor
- [ ] Bookmarks:
    - [ ] local CRUD
    - [ ] firebase integration
    - [ ] extension integration
    - [ ] webview
- [ ] expense: 
    - [ ] categories
    - [ ] local CRUD
    - [ ] firebase integration
    - [ ] budgeting
    - [ ] monthly autopay
- [ ] routines: 
    - [ ] local crud
    - [ ] integration with todos
    - [ ] firebase integration
    - [ ] repeatation
    - [ ] track progress

---   

## Contributing 🤝

We welcome contributions to Dorara! Here's how you can help:

### Development Setup

1. **Fork and Clone**
```bash
git clone https://github.com/yourusername/Dorara.git
cd Dorara
```

2. **Install Dependencies**
```bash
npm install
#or
bun install
```

3. **Environment Setup**
- Copy `.env.example` to `.env`
- Add your Firebase and Google credentials

### Making Changes

1. **Create a Branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Code Style**
- Follow the existing code style
- Use TypeScript for type safety
- Add comments for complex logic

3. **Testing**
- Add tests for new features


### Submitting Changes

1. **Commit Your Changes**
```bash
git add .
git commit -m "feat: description of your changes"
```

2. **Push to Your Fork**
```bash
git push origin feature/your-feature-name
```

3. **Create a Pull Request**
- Open a PR against the `main` branch
- Provide a clear description of changes
- Link related issues

### Bug Reports and Feature Requests

- Use the GitHub Issues tab
- Follow the issue templates
- Be specific and provide examples

### Code of Conduct

- Be respectful and inclusive
- Help others learn and grow

---

## License
This project is open source and available under the [MIT License](https://github.com/Dorara-v2/Dorara-app/blob/master/LICENSE).
