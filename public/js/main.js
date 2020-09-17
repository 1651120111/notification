const chatForm = document.getElementById('chat-form');
const message = document.getElementById('chat-messages');
const btnmsg = document.getElementById('msg');
const listUsers = document.getElementById('users');
const userOnline = document.getElementById('user-online');
const nameRoom = document.getElementById('room-name');
let app = document.querySelector('#chat-messages');


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


const messaging = firebase.messaging();
messaging.usePublicVapidKey("BE-3C-FHE14TefIg6jgrVpWyAEYmCwYjJdEgxOKq4vo6BOg4hkQMb11dpXPkYKvlmPRKZfaEsRpWlNiWgltH1a8");

navigator.serviceWorker.register('./firebase-messaging-sw.js')
    .then((registration) => {
        messaging.useServiceWorker(registration);

        // Request permission and get token.....
        messaging.requestPermission().then(function () {
            return messaging.getToken();
        }).then(function (token) {
            console.log(token)
            firebase.database().ref('fcmTokens').child(username).set({token_id: token});
        })
    });


messaging.onMessage((payload) => {
    alert("ok")
    console.log('Message received. ', payload);
});


let token = '';

function getTokenUser() {
    return new Promise(resolve => {
        db.ref('users/' + room).on('value', function (snapshot) {
            const data = snapshot.val();
            const key = Object.keys(data)
            const value = Object.values(data)
            key.forEach(function (value, index) {
                if (key[index] != username) {
                    db.ref('fcmTokens/' + key[index]).on('value', (snapshot) => {
                        resolve(snapshot.val().token_id)
                    })
                }

            })
        })
    })
}

getTokenUser().then((e) => {
    token = e;
})


// Gui tin nhan
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Lay tin nhan tu form send
    const msg = document.getElementById('msg').value;
    let className = '';
    if (username == 'admin') {
        db.ref(room + '/message').push().set({
                "sender": username,
                "message": msg,
                "date": Date.now(),
                "seen_by_user": false,
                "seen_by_admin": true,
            }, function (error) {
                if (!error) {
                    let token = '';
                    db.ref('fcmTokens').once('value', function (snapshot) {
                        console.log(snapshot.val())
                        const key = Object.keys(snapshot.val());
                        const value1 = Object.values(snapshot.val());
                        key.forEach(function (value, index) {
                            if (value != username) {
                                token = value1[index]['token_id'];
                                $.ajax({
                                    url: 'https://fcm.googleapis.com/fcm/send',
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': 'key=AAAAFglIZpo:APA91bFy3YQKaUOfpuDGL28XeMvYWh8UhK3IfIYe-xyIYY6_goswE6BeZXGKZdNMSHyjXtb6RcRphGEl4fmy9BNyOfpbe8xU1wIupVxD8Izf8iPVpms9SRtU47fY4CJcF4xi1tuG223G'
                                    },
                                    data: JSON.stringify({
                                        'to': token,
                                        "notification": {
                                            "title":username,
                                            "body": msg,
                                            "click_action": "http://localhost/firebasechat/public/chat.html?username="+key[index]+"&room=JavaScript"
                                        },
                                        "data": {
                                            "name": "nhan"
                                        }
                                    }),
                                    success: function (response) {
                                        console.log(response)
                                    },
                                    error: function (xhr, status, error) {
                                        console.log(xhr + " : " + error);
                                    }
                                })

                            }
                        })
                    })
                }
            }
        )
    } else {
        db.ref(room + '/message').push().set({
            "sender": username,
            "message": msg,
            "date": Date.now(),
            "seen_by_user": true,
            "seen_by_admin": false,
        }, function (error) {
            if (!error) {
                console.log("done")
                db.ref('fcmTokens').once('value', function (snapshot) {
                    console.log(snapshot.val())
                    const key = Object.keys(snapshot.val());
                    const value1 = Object.values(snapshot.val());
                    let token = '';
                    key.forEach(function (value, index) {
                        if (value != username) {
                            token = value1[index]['token_id'];
                            $.ajax({
                                url: 'https://fcm.googleapis.com/fcm/send',
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'key=AAAAFglIZpo:APA91bFy3YQKaUOfpuDGL28XeMvYWh8UhK3IfIYe-xyIYY6_goswE6BeZXGKZdNMSHyjXtb6RcRphGEl4fmy9BNyOfpbe8xU1wIupVxD8Izf8iPVpms9SRtU47fY4CJcF4xi1tuG223G'
                                },
                                data: JSON.stringify({
                                    to: token,
                                    "notification": {
                                        "title": username,
                                        "body": msg,
                                        "click_action": "http://localhost/firebasechat/public/chat.html?username="+key[index]+"&room=JavaScript"
                                    },
                                }),
                                success: function (response) {
                                    console.log(response)
                                },
                                error: function (xhr, status, error) {
                                    console.log(xhr + " : " + error);
                                }
                            })
                        }
                    })
                })
            }
        })
    }


});

let currentPage = 1;

function test() {
    if (document.getElementById("chat-messages").scrollTop == 0) {
        //  const data1 = data.val();
        //  const data2 = Object.keys(data1);
        // -MFFF2uVMDHll33KF5id :  key lay duoc tu data2
        db.ref(room + "/message")
            .on('value', function (snapshot) {

                const data1 = snapshot.val();
                //data3 : lay value trong node con message
                const data3 = Object.values(data1).sort();

                //data2 : lay key (key random) trong node con message
                const data2 = Object.keys(data1).sort();

                const length = data2.length - 1;
                const perPage = 10;
                /*console.log(data3[length-getPage().page]);
                length-getPage().page : lay key 0-14 trong mang data2 va data3
                data2[length-getPage().page] la key/node trong message*/
                /* console.log("page : " + currentPage)
                 console.log(data3[length - getPage(currentPage + 1, perPage, length).page].date)
                 console.log(data2[length - getPage(currentPage + 1, perPage, length).page])
                 console.log(getPage(currentPage, perPage, length).perPage)*/
                if (currentPage < getNumberPage(length, perPage)) {
                    db.ref(room + "/message").orderByChild('date')
                        .endAt(data3[length - getPage(currentPage + 1, perPage, length).page].date,
                            data2[length - getPage(currentPage + 1, perPage, length).page]).limitToLast(getPage(currentPage + 1, perPage, length).perPage)
                        .on('value', function (snapshot) {
                            const data1 = snapshot.val();
                            const key = Object.keys(data1).reverse();
                            const value = Object.values(data1).reverse();
                            let html = [];
                            value.forEach(function (value, index) {
                                html.push(value);
                            })
                            console.log(html)
                            html.forEach(function (value, index) {
                                let className = '';
                                if (value.sender == username) {
                                    className = 'username';
                                }
                                const date = new Date(value.date);
                                const text = '<div class="message ' + className + '" id="message ">' +
                                    '<p class="meta">' + value.sender + ' <span>' + date.toLocaleTimeString() + '</span></p>' +
                                    '<p class="text">' + value.message + '</p>' +
                                    '</div>';
                                $(document).ready(function () {
                                    $('#chat-messages').prepend(text);
                                });
                            })

                        });
                } else {
                    $(document).ready(function () {
                        if (!$('#chat-messages').find(".end-session").length) {
                            $('#chat-messages').prepend("<p class='end-session'>End</p>")
                        } else {
                            return false;
                        }
                    });

                }
                currentPage++;
            });

    }
}

/*db.ref(room + "/message")
    .on('value', function (snapshot) {
        const data1 = snapshot.val();

        //data3 : lay value trong node con message
        const data3 = Object.values(data1);

        //data2 : lay key (key random) trong node con message
        const data2 = Object.keys(data1);
        const length = data2.length - 1;
        const perPage = 10;
        console.log(data1);
        db.ref(room + "/message").orderByChild('date')
            .limitToLast(getPage(2, perPage, length).perPage)
            .on('child_added', function (snapshot) {
                const data1 = snapshot.val();
                console.log(data1);
                //console.log(data1);
                /!*let className = '';
                if (data1.sender == username) {
                    className = 'username';
                }

                message.innerHTML +=
                    '<div class="message ' + className + '" id="message ">' +
                    '<p class="meta">' + data1.sender + ' <span>' + data1.date + '</span></p>' +
                    '<p class="text">' + data1.message + '</p>' +
                    '</div>';
                btnmsg.value = '';
                message.scrollTop = message.scrollHeight;*!/

            });
    });*/

/*'<span><i class="fas fa-eye" style="font-size: 100%;margin-left: 100%;color: green"></i></span>'+*/

// Lấy ra tin nhắn hiển thị ban đầu
db.ref(room + "/message").limitToLast(10).once("value", function (data) {
    let i = 0;
    let o = 0;
    let className = '';
    let eyeIcon = '';
    let userIcon = '';
    const value1 = Object.values(data.val());
    const key = Object.keys(data.val());
    // /console.log(data.val())
    data.forEach(function (data) {
        if (data.val().seen_by_admin == true) {
            i++;
        }
        if (data.val().seen_by_user == true) {
            o++;
        }
    })
    // pop để bỏ phần tử cuối/ khi hiển thị không bị trùng với tin nhắn
    value1.pop();
    value1.forEach(function (value, index) {
        if (value.sender == username) {
            className = 'username';
        } else {
            className = '';
        }
        if (JSON.stringify(value) === JSON.stringify(value1[i - 1])) {
            eyeIcon = '<span id="icon"><i class="fas fa-eye" <="" i=""></i></span>';
        } else {
            eyeIcon = '';
        }
        if (JSON.stringify(value) === JSON.stringify(value1[o - 1])) {
            userIcon = '<span id="icon"><i class="fas fa-user" <="" i=""></i>&nbsp;</span>';
        } else {
            userIcon = '';
        }
        const date = new Date(value.date);
        message.innerHTML +=
            '<div class="message ' + className + '" id="message ">' +
            '<p class="meta">' + value.sender + ' <span>' + date.toLocaleTimeString() + '</span></p>' +
            '<p class="text">' + value.message + userIcon + eyeIcon + '</p>' +
            '</div>';
    })
    message.scrollTop = message.scrollHeight;


});
db.ref(room + '/message').orderByChild('date').limitToLast(1).on('child_added', function (snapshot) {
    console.log(snapshot.val())
    let className = '';
    let iconCheck = '<i class="fa fa-check" style="float: right;color: green"></i>';
    const data = snapshot.val();
    const date = new Date(data.date);
    let html = '';
    let eyeIcon = '<span id="icon"><i class="fas fa-eye" <="" i=""></i></span>';
    let userIcon = '<span id="icon"><i class="fas fa-user" <="" i=""></i>&nbsp;</span>';

    if (data.sender == username) {
        className = 'username';
    }
    if (username == 'admin' && data.seen_by_user == true) {
        html = '<div class="message ' + className + '" id="message ">' +
            '<p class="meta">' + data.sender + ' <span>' + date.toLocaleTimeString() + '</span></p>' +
            '<p class="text">' + data.message + '</p>' + eyeIcon +
            '</div>';
    } else if (username == 'admin' && data.seen_by_user == true) {
        html = '<div class="message ' + className + '" id="message ">' +
            '<p class="meta">' + data.sender + ' <span>' + date.toLocaleTimeString() + '</span></p>' +
            '<p class="text">' + data.message + '</p>' + userIcon +
            '</div>';
    } else {
        html = '<div class="message ' + className + '" id="message ">' +
            '<p class="meta">' + data.sender + ' <span>' + date.toLocaleTimeString() + '</span></p>' +
            '<p class="text">' + data.message + '</p>' + iconCheck +
            '</div>';
    }

    message.innerHTML += html;
    btnmsg.value = '';
    message.scrollTop = message.scrollHeight;
})
// Theo dõi trang thái trên trình duyệt
const myConnectionsRef = db.ref('users/' + room + '/' + username + '/connections');

// Lưu trữ thời gian online lần gần nhất
const lastOnlineRef = db.ref('users/' + room + '/' + username + '/lastOnline');

/*.info/connected là giá trị boolean không đồng bộ với db vì nó sẽ lấy giá trị theo trạng thái của client.
                Tức là khi client đọc được file .info hay không và lấy giá trị*/
const connectedRef = db.ref('.info/connected');

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
        lastOnlineRef.onDisconnect().set(timestamp);
    }
});

// thanh status left
firebase.database().ref('users/' + room).on("value", function (data) {
    // value : toan bo gia tri tu user trở xuống
    // data bao gồm node, ref => dùng val() để get data
    // get key của value hiện tại là key của json tree dùng object.keys()
    const data1 = data.val();
    const data2 = Object.keys(data1);
    //console.log(data2)
    let i = 0;
    data2.forEach(function (value, index) {
        data2[index] = "<li>" + value + "</li>";
        firebase.database().ref("users/" + room + "/" + value + "/connections")
            .on('value', function (snapshot) {
                const online = snapshot.val();
                if (online.online == true) {
                    data2[index] = '<li>' + value + '<span aria-label="Đang hoạt động" class="span-status" </span></li>';
                    i++;
                }
            });
    });
    listUsers.innerHTML = data2.join('');
    userOnline.innerText = i + '/' + data2.length;
});

function getNumberPage(total, perPage) {
    return Math.ceil(total / perPage);
}

// perpage = 10 total = 22 page =2 => page =3 -> perpage = 2
// Object.keys(data).length kiem tra Object co trong hay khong?

function getPage(page = 1, perPage = 5, totalRecord = 0) {
    if (page == 1) {
        return {page: 1, perPage};
    } else if (page > getNumberPage(totalRecord, perPage)) {
        return {
            page: getNumberPage(totalRecord, perPage) * perPage - perPage,
            perPage: 0
        };
    } else if (page == getNumberPage(totalRecord, perPage)) {
        return {
            page: getNumberPage(totalRecord, perPage) * perPage - perPage,
            perPage: totalRecord - (getNumberPage(totalRecord, perPage) * perPage - perPage - 1)
        }
    } else {
        return {page: perPage * page - perPage, perPage};
    }
}

var input_focused = false;
btnmsg.addEventListener("focus", function () {
    if (username == 'admin') {
        firebase.database().ref(room + '/message').orderByChild('seen_by_admin').equalTo(false).on('value', function (snapshot) {
            if (snapshot.val() != null) {
                const key = Object.keys(snapshot.val());
                const values = Object.values(snapshot.val());
                values.forEach(function (value, index) {
                    db.ref(room + '/message/' + key[index]).update({
                        'seen_by_admin': true
                    })
                })
            }
        });
    } else {
        firebase.database().ref(room + '/message').orderByChild('seen_by_user').equalTo(false).on("value", function (snapshot) {
            if (snapshot.val() != null) {
                const key = Object.keys(snapshot.val());
                const values = Object.values(snapshot.val());
                values.forEach(function (value, index) {
                    db.ref(room + '/message/' + key[index]).update({
                        'seen_by_user': true
                    })
                })
            }
        })
    }
});
btnmsg.addEventListener("blur", function () {
    console.log(2);
});


/*document.addEventListener("visibilitychange", handleVisibilityChange, false);

function handleVisibilityChange(){
    console.log(username +" : "+ document.visibilityState);
    if (username == 'admin' &&  document.visibilityState === 'visible') {
        console.log("admin vao");
        firebase.database().ref(room+'/message').orderByChild('seen_by_admin').equalTo(false).on('value',function (snapshot){
            if (snapshot.val() != null) {
                const data2 = Object.keys(snapshot.val());
                for (let i in data2) {
                    firebase.database().ref(room+'/message/' + data2[i]).update({
                        'seen_by_admin': true,
                    });
                }
            }
        });
    }

    if (username == '1651120111' && document.visibilityState === 'visible'){
        console.log("user vao");
        firebase.database().ref(room+'/message').orderByChild('seen_by_user').equalTo(false).on('value',function (snapshot){
            if (snapshot.val() != null) {
                const data2 = Object.keys(snapshot.val());
                for ( let i in data2) {
                    firebase.database().ref(room+'/message/' + data2[i]).update({
                        'seen_by_user': true,
                    });
                }
            }
        });

    }

}*/

