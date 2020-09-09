importScripts('https://www.gstatic.com/firebasejs/7.18.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.18.0/firebase-messaging.js');
firebase.initializeApp({
    apiKey: "AIzaSyBqn9ULQtJpdZ-MU6jasyfJ_j_6VG3a0KE",
    authDomain: "chat-74ccb.firebaseapp.com",
    databaseURL: "https://chat-74ccb.firebaseio.com",
    projectId: "chat-74ccb",
    storageBucket: "chat-74ccb.appspot.com",
    messagingSenderId: "94645020314",
    appId: "1:94645020314:web:7f4c065330405f438ca123",
    measurementId: "G-16CR1MDHCV"
});
// Initialize Firebase

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: '/firebase-logo.png'
    };

    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});
