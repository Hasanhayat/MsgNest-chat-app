# MsgNest - Modern Chat Application

MsgNest is a sleek and modern real-time chat application built with React.js and powered by Firebase for authentication and data storage. This application allows users to seamlessly sign up, log in, and engage in real-time messaging while offering a responsive and user-friendly interface.

## 🚀 Features

- **User Authentication:** Secure sign-up and login using Firebase Authentication.
- **Real-Time Messaging:** Instantly send and receive messages using Firebase Firestore.
- **Responsive UI:** Optimized for all screen sizes with modern styling using Tailwind CSS.
- **User Profiles:** Personalized user profiles for a more engaging experience.
- **Persistent Sessions:** Automatically retains user sessions with Firebase.
- **Dark/Light Mode:** Theme switcher using a global context for a better user experience.
- **Error Handling:** Graceful handling of errors and real-time feedback with toast notifications.

## 🛠️ Tech Stack

- **Frontend:** React.js, React Router, Tailwind CSS
- **Backend:** Firebase (Firestore, Authentication, Analytics)
- **State Management:** React Context API
- **Icons & Notifications:** Lucide React, react-hot-toast

## 📂 Project Structure

```
MsgNest/
├── public/
├── src/
│   ├── components/        # Reusable UI components (Navbar, etc.)
│   ├── context/           # Global Context (Auth & Theme Management)
│   ├── pages/             # Page components (Home, Signup, Login, etc.)
│   ├── store/             # Theme and authentication store
│   ├── App.js             # Main application file
│   └── main.js            # Application entry point
└── package.json
```

## 📦 Installation

1. Clone the repository:

```bash
   git clone https://github.com/your-username/MsgNest.git
   cd MsgNest
```

2. Install dependencies:

```bash
   npm install
```

3. Set up Firebase:

- Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
- Add your Firebase configuration to `firebaseConfig` in `App.js`.

4. Start the development server:

```bash
   npm run dev
```

## 🔐 Environment Variables

Ensure you configure your Firebase credentials in the project. Replace the values in `firebaseConfig` with your project details:

```javascript
const firebaseConfig = {
   apiKey: "YOUR_API_KEY",
   authDomain: "YOUR_AUTH_DOMAIN",
   projectId: "YOUR_PROJECT_ID",
   storageBucket: "YOUR_STORAGE_BUCKET",
   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
   appId: "YOUR_APP_ID",
   measurementId: "YOUR_MEASUREMENT_ID"
};
```


## 📌 Upcoming Features

- Group Chats
- Message Reactions
- Typing Indicators
- Push Notifications

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repository and create a pull request.

## 📄 License

This project is licensed under the MIT License.

## 🌟 Acknowledgements

Special thanks to the open-source community and the Firebase team for their amazing tools and resources.

---

Built with 💙 by Hassan Hayat

