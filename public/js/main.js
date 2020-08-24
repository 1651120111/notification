
const chatForm = document.getElementById('chat-form');
const message = document.getElementById('chat-messages');
const btnmsg = document.getElementById('msg');
const listUsers = document.getElementById('users');
const userOnline = document.getElementById('user-online');
const nameRoom = document.getElementById('room-name');

const data = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});
const username = data.username;
const room = data.room;
const time = moment().format('hh:m a');
const timestamp = moment().format('h:m:s a');

nameRoom.innerText = room;
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
const db = firebase.database();

// Gui tin nhan
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Lay tin nhan tu form send
    const msg = document.getElementById('msg').value;
    db.ref(room + '/message').push().set({
        "sender": username,
        "message": msg,
        "date": time
    });

});

db.ref(room + "/message").on("child_added", function (data) {
    const data1 = data.val();

    let className = '';
    if (data1.sender == username){
        className = 'username';
    }

    message.innerHTML +=
        '<div class="message ' + className+'" id="message ">' +
        '<p class="meta">' + data1.sender + ' <span>' + data1.date + '</span></p>' +
        '<p class="text">' + data1.message + '</p>' +
        '</div>';
    btnmsg.value = '';
    message.scrollTop = message.scrollHeight;


});

// Theo dõi trang thái trên trình duyệt
const myConnectionsRef = db.ref('users/'+  room +'/' + username  +'/connections');

// Lưu trữ thời gian online lần gần nhất
const lastOnlineRef = db.ref('users/'+ room +'/'+ username  +'/lastOnline');

/*.info/connected là giá trị boolean không đồng bộ với db vì nó sẽ lấy giá trị theo trạng thái của client.
                Tức là khi client đọc được file .info hay không và lấy giá trị*/
const connectedRef = db.ref('.info/connected');

connectedRef.on('value', function (snap) {
    // snap.val() gia tri false || true
    // true: user đang kết nối
    // onDisconnect() check xem thiet bi co ket noi hay khong?
    if (snap.val() == true){
        const con = myConnectionsRef.push();

        // neu disconnect, thiet bi duoc remove
        con.onDisconnect().remove();

        // online set true: dang online
        con.set({"online": true});

        // Luu thoi gian gan nhat disconnect
        lastOnlineRef.onDisconnect().set(timestamp);
    }
});


firebase.database().ref('users/'+room).on("value",function (data){
    // value : toan bo gia tri tu user trở xuống
    // data bao gồm node, ref => dùng val() để get data
    // get key của value hiện tại là key của json tree dùng object.keys()
    const data1 = data.val();
    const data2 = Object.keys(data1);

    let i = 0;
    data2.forEach(function (value,index){
        data2[index] = "<li>"+value+"</li>";
        firebase.database().ref("users/"+room+"/" +value+"/connections")
            .on('child_added', function(snapshot) {
                console.log(snapshot.val());
                const online = snapshot.val();
                console.log(online)

                if (online.online == true){
                    data2[index] = '<li>'+value + '<span aria-label="Đang hoạt động" class="span-status" </span></li>';
                    i++;
                }
            });
    });

    listUsers.innerHTML = data2.join('');
    userOnline.innerText = i+'/'+data2.length;
});
