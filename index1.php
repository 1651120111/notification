<!--
room {
    message {ten user, message user, date}
}
-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/qs/6.9.4/qs.min.js" integrity="sha512-BHtomM5XDcUy7tDNcrcX1Eh0RogdWiMdXl3wJcKB3PFekXb3l5aDzymaTher61u6vEZySnoC/SAj2Y/p918Y3w==" crossorigin="anonymous"></script>

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

    //const room = prompt("Nhap ten room");

    const userListRef = firebase.database().ref("USERS_ONLINE");
    const myUserRef = userListRef.push();

    // Monitor connection state on browser tab
    var myConnectionsRef = firebase.database().ref('users/javascript/joe1/connections');

    // stores the timestamp of my last disconnect (the last time I was seen online)
    var lastOnlineRef = firebase.database().ref('users/javascript/joe/lastOnline');

    /*.info/connected là giá trị boolean không đồng bộ với db vì nó sẽ lấy giá trị theo trạng thái của client.
                        Tức là khi client đọc được file .info hay không và lấy giá trị*/
    var connectedRef = firebase.database().ref('.info/connected');
    connectedRef.on('value', function(snap) {
        if (snap.val() === true) {
            // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
            var con = myConnectionsRef.push();

            // When I disconnect, remove this device
            con.onDisconnect().remove();

            // Add this device to my connections list
            // this value could contain info about the device or a timestamp too
            // online: true de co the filter nhung user co online = true. Neu khong co thi key rat xau
            con.set({"online": true});

            // When I disconnect, update the last time I was seen online
            lastOnlineRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
        }
    });
    /*firebase.database().ref('users').on("value",function (data){
        // value : toan bo gia tri tu user trở xuống
        // data bao gồm node, ref => dùng val() để get data
        // get key của value hiện tại là key của json tree dùng object.keys()
        const data1 = data.val();
        const data2 = Object.keys(data1);
        let i = 0;
        data2.forEach(function (value,index){
            firebase.database().ref("users/"+value+"/connections")
                .on('child_added', function(snapshot) {
                    const online = snapshot.val();
                    if (online.online == true){
                        data2[index] = value + "dang nhap";
                        i++;
                    }
                });
            });

        console.log("So nguoi dang nhap: "+i);
        console.log(data2);
        });*/

    firebase.database().ref("JavaScript/message").orderByChild('sender').equalTo('1').limitToFirst(2)
        .on('child_added', function(snapshot) {
            //console.log(snapshot.val());
        });

    const data = Qs.parse(location.search, {
        ignoreQueryPrefix: true
    });
    const currentPage = data.page;
    //  const data1 = data.val();
    //  const data2 = Object.keys(data1);
    // -MFFF2uVMDHll33KF5id :  key lay duoc tu data2
    const totalNumberPage = 0;

    firebase.database().ref("JavaScript/message")
        .once('value', function(snapshot) {

            const data1 = snapshot.val();
            //data3 : lay value trong node con message
            const data3 = Object.values(data1);
            //data3 : lay key (key random) trong node con message
            const data2 = Object.keys(data1);

            /*console.log(data2);
            console.log(data3);*/
            //console.log(data2[13]);
            //console.log(length);
            // page=1 length = 14
            // page = 2 length = 11
            // page = 3 length = 8
            const length = data2.length-1;

            // /console.log(data3[length-getPage().page]);
            // length-getPage().page : lay key 0-14 trong mang data2 va data3
            // data2[length-getPage().page] la key/node trong message
            firebase.database().ref("JavaScript/message").orderByChild('date')
                .endAt(data3[length-getPage(data.page,5,length).page].date,
                    data2[length-getPage(data.page,5,length).page]).limitToLast(getPage(data.page,5,length).perPage)
                .on('child_added', function(snapshot) {
                    //console.log(snapshot.val());
                });
            /**/

        });

    function getNumberPage(total ,perPage){
        return Math.ceil(total/perPage);
    }

    // Object.keys(data).length kiem tra Object co trong hay khong?
    function getPage( page = 1,perPage = 5, totalRecord = 0){
        if ( currentPage === undefined || currentPage == 1){
            return {page : 1,perPage};
        } else if (page > getNumberPage(totalRecord,perPage)){
            return  {page : getNumberPage(totalRecord,perPage)*perPage-perPage,perPage};
        } else {
            return {page: parseInt(currentPage)*perPage-perPage,perPage};
        }
    }

    //tin nhan chua doc

    function getNumberMessageUnReadByHost(){
        return new Promise(resolve => {
            firebase.database().ref("JavaScript/message").orderByChild('seen_by_host')
                .equalTo(false).on('value', function (snapshot) {
                   if (snapshot.val() != null){
                    resolve(Object.keys(snapshot.val()).length)
                   } else {
                       resolve(5)
                   }
            })
        })

    }
    /*getNumberMessageUnReadByHost().then(data => {
        firebase.database().ref('JavaScript/read').set({})
    })*/

    // Neu tin nhan dau tien da doc thi cho read/admin ||read/user : false => true
    firebase.database().ref('JavaScript/message').limitToFirst(1).on('child_added',function (snapshot){
        const data = snapshot.val();
        if (data.seen_by_host == true){
            firebase.database().ref('JavaScript/read').update({
                'admin':true,
            });
        }
        else {
            firebase.database().ref('JavaScript/read').update({
                'admin': false,
            });
        }
        if (data.seen_by_user == true){
            firebase.database().ref('JavaScript/read').update({
                'user':true,
            });
        } else {
            firebase.database().ref('JavaScript/read').update({
                'user':false,
            });
        }
    })

    // check co o  tab hien tai hay khong
     document.addEventListener("visibilitychange", function() {

         if (document.visibilityState === 'visible') {
             // chuyen trang thai seen_by_host : false => true
             firebase.database().ref('JavaScript/message').orderByChild('seen_by_host').equalTo(false).on('value',function (snapshot){
                 if (snapshot.val() != null) {
                     const data2 = Object.keys(snapshot.val());
                     for (i in data2) {
                         firebase.database().ref('JavaScript/message/' + data2[i]).update({
                             'seen_by_host': true,
                         });
                     }
                 }
             })

             getNumberMessageUnReadByHost().then(data => {
                 firebase.database().ref('JavaScript/read').update({
                     'count_admin' : data,
                     'count_user' : 5,
                 })
             })
         } else {
             firebase.database().ref('JavaScript/read').update({
                 'count_admin': 3,
                 'count_user' :2,
             })

         }
     });

    /*firebase.database().ref('read').set({
        'admin':false,
        'user':false,
        'count_admin': 0,
        'count_user' :0,
    })*/
</script>


<ul id="messages"></ul>