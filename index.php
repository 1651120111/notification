<!--
chat {
    ten room,
    message {ten user, message user, date}
    ngay,
    room
}
-->

<!-- The core Firebase JS SDK is always required and must be listed first -->
<script src="https://www.gstatic.com/firebasejs/7.20.0/firebase-app.js"></script>
<link rel="stylesheet" href="public/css/style.css">

<!-- include firebase database -->
<script src="https://www.gstatic.com/firebasejs/7.20.0/firebase-database.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

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
    db = firebase.database()
    const name = "Hoang";
    const room = document.getElementById('room');
    let id = "04"

    let stt = "05"
    const date = Date.now()

    function sendMessage() {
        db.ref("chatapp/" + id).on('value', function (snapshot) {
            if (!snapshot.hasChild('time')) {
                db.ref("chatapp/" + id).set({
                    time: date
                })
            }
        })
        db.ref("chatapp/" + id + "/data/" + stt).set({
            _id: stt,
            message: "hi " + stt,
            name: name,
            idUser: id,
            date: date,
            seen_by_admin: false,
            seen_by_user: false,
        })

        db.ref("chatapp/" + id).update({
            timeLastMessage: date
        })


        db.ref("chatapp/" + id + "/read").set({
            admin: false,
            user: true,
            count_admin: 0,
            count_user: 0,
        })

        db.ref("chatapp/" + id + "/user").set({
            avatar: "https://img.favpng.com/7/5/8/computer-icons-font-awesome-user-font-png-favpng-YMnbqNubA7zBmfa13MK8WdWs8.jpg",
            id: id,
            name: name,
            phone: "0708501835",
        })

        db.ref("users/" + id).set({
            name: name
        }, (e) => {
            if (!e)
                console.log('user -id')
        })

        // handle user online/offline
        // Theo dõi trang thái trên trình duyệt

        db.ref("chatapp/" + id).on('value', function (snapshot) {
            if (!snapshot.hasChild('time')) {
                console.log("ok")
                db.ref("chatapp/" + id).update({
                    time: Date.now()
                })
            }
        })
    }

    const myConnectionsRef = db.ref('chatapp/' + id + '/user/connections');

    // Lưu trữ thời gian online lần gần nhất
    const lastOnlineRef = db.ref('chatapp/' + id + '/user/connections');

    const connectedRef = db.ref('.info/connected');

    function connectionUser() {
        connectedRef.on('value', function (snap) {
            // snap.val() gia tri false || true
            // true: user đang kết nối
            // onDisconnect() check xem thiet bi co ket noi hay khong?
            if (snap.val() == true) {
                const con = myConnectionsRef;

                // neu disconnect, thiet bi duoc remove
                con.onDisconnect().update({"online": false});

                // online set true: dang online
                con.set({"online": true});

                // Luu thoi gian gan nhat disconnect
                lastOnlineRef.onDisconnect().set(Date.now());
            }
        });
    }

    db.ref('chatapp/' + id).on('value', function (snapshot) {
        const child = snapshot.hasChild('data')
        if (!child) return false
        return connectionUser()
    })


</script>

<form action="" id="chat_form" onsubmit="return sendMessage();">
    <input type="text" id="message">
    <input type="submit">
</form>

<ul id="messages"></ul>

<div id="divtest" style="white-space: pre-line"></div>
<div class="test" id="test" contenteditable="true" placeholder="Type something...">

</div>

<script>
    document.getElementById('test').addEventListener('keypress', function (event) {
        if (event.shiftKey) {
            if (event.keyCode == 13) {

            }
        } else if (event.keyCode == 13){
            let test = document.getElementById('test').innerHTML;
            let test1 = test.replaceAll("<br>","\n");
            console.log(test1)
            document.getElementById('divtest').innerHTML = test1;
            document.getElementById('test').innerHTML = '';
            return event.preventDefault()
        }
    })
</script>