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
    db = firebase.database()
    const user = 'asd';
    const room = document.getElementById('room');
    let id = 1651120111
    let stt = 0
    db.ref('chatapp/'+id+'/data').on('value',function (snapshot){
        console.log(snapshot.val())
    })
    function sendMessage() {
        db.ref("chatapp/" + id + "/data/" + 1+stt).set({
            _id: id,
            message: "hi" + 2,
            name: 1651120111,
            date: Date.now(),
            seen_by_admin: false,
            seen_by_user: false,
        })
        db.ref("chatapp/" + id).update({
            time: Date.now()
        })
        // khoi tao phong chat: check admin,user seen

        db.ref("chatapp/" + id + "/read").set({
            admin: false,
            user: true,
            count_user: 0,
            count_admin: 0,
        })

        // kiem tra xem co thong tin user chua
        db.ref("chatapp/" + id + "/user").set({
            id : id,
            name: 1651120111,
            phone: '0708601835',
            avatar: 'https://img.favpng.com/7/5/8/computer-icons-font-awesome-user-font-png-favpng-YMnbqNubA7zBmfa13MK8WdWs8.jpg',
        })

        db.ref("users/"+id).set({
            name : 1651120111
        })
    }

    // handle user online/offline
    // Theo dõi trang thái trên trình duyệt
    const myConnectionsRef = db.ref('chatapp/' + id + '/user/connections');

    // Lưu trữ thời gian online lần gần nhất
    const lastOnlineRef = db.ref('chatapp/' + id + '/user/connections');

    const connectedRef = db.ref('.info/connected');

    db.ref('chatapp/'+id).on('value',function (snapshot) {
        const child = snapshot.hasChild('data')
        if(!child) return false
        return connectionUser()
    })

    function connectionUser(){
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
</script>

<form action="" id="chat_form" onsubmit="return sendMessage();">
    <input type="text" id="message">
    <input type="submit">
</form>

<ul id="messages"></ul>