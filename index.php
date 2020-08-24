<!--
chat {
    ten room,
    message {ten user, message user, date}
    ngay,
    room
}
-->


<!-- The core Firebase JS SDK is always required and must be listed first -->
<script src="https://www.gstatic.com/firebasejs/6.6.1/firebase-app.js"></script>

<!-- include firebase database -->
<script src="https://www.gstatic.com/firebasejs/6.6.1/firebase-database.js"></script>

<script>
    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyBqn9ULQtJpdZ-MU6jasyfJ_j_6VG3a0KE",
        authDomain: "chat-74ccb.firebaseapp.com",
        databaseURL: "https://chat-74ccb.firebaseio.com",
        projectId: "chat-74ccb",
        storageBucket: "chat-74ccb.appspot.com",
        messagingSenderId: "94645020314",
        appId: "1:94645020314:web:7f4c065330405f438ca123",
        measurementId: "G-16CR1MDHCV"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    const username = document.getElementById('username');
    const room = document.getElementById('room');

    function sendMessage(e){
        var message = document.getElementById('message').value;

        firebase.database().ref('messages').push().set({
           "sender":myName,
           "message":message
        });
        return false;
    }

    firebase.database().ref("messages").on("child_added",function (data){
        data1 = data.val();
        var html = '';
        html += "<li>";
        html +=   data1.sender +': '+data1.message;
        html += "</li>";
        document.getElementById('messages').innerHTML += html;
        document.getElementById('message').value = '';
    });
</script>

<form action="" >
    <input type="text" name="username" id="username">
    <input type="text" name="room" id="room">
</form>

<form action="" onsubmit="return sendMessage();">
    <input type="text" id="message">
    <input type="submit">
</form>

<ul id="messages"></ul>