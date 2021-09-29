///////////////////////////////////// USING INDEXED_DB ////////////////////////////////////////

// function register(username, password, email){
//     const conn = indexedDB.open('RoyalSuperMarket');
 
//     conn.onsuccess = function(){
//         var db = conn.result;
//         console.log('Database successfully Initialized');

//         const data = {
//             "username": username,
//             "password": password,
//             "email": email
//         }
        
//         if (valid(username, password, email, 'register')){
//             let dataTransaction = db.transaction('user_info', "readwrite");
//             let user = dataTransaction.objectStore("user_info");

//             let request = user.add(data);

//             request.onerror = function(){
//                 alert(`Error While upload data to datbase ${request.error}`);
//             }

//             request.onsuccess = function(){
//                 console.log("User data uploaded successfully");
//             }
//         }
//         else{

//         }

//     }

//     conn.onupgradeneeded = function(){
//         var db = conn.result;
//         db.createObjectStore('user_info', {keyPath: 'username'});
//         alert('New database created successfully');
//     };

//     conn.onerror = function(){
//         alert(`Error! Encountered ${conn.error}`);
//     }

// }

//////////////////////////////////////// USING FIREBASE /////////////////////////////////////////

function updateDatabase(value, type, path){
    firebase.database().ref(`${path}/${type}`).get().then(dataSet => {
        
        if (Array.isArray(dataSet.val())){
            let credentials = dataSet.val();
            credentials.push(value);
            firebase.database().ref(`${path}/${type}`).set(credentials);
        }else{
            let credentials = [dataSet.val()];
            credentials.push(value);
            firebase.database().ref(`${path}/${type}`).set(credentials);
        }
        
    });
}


async function register(username, password, email){
    console.log(`CRL => Register and values are ${username} & ${password} & ${email}`);
    if (username == "" || password == "" || email == ""){
        return "please don't leave fields empty"
    }
    var avatarPaths = ['Avatars/Avatar 1.png', 'Avatars/Avatar 2.png', 'Avatars/Avatar 3.png',
    'Avatars/Avatar 4.png', 'Avatars/Avatar 5.png','Avatars/Avatar 6.png', 'Avatars/Avatar 7.png',
    'Avatars/Avatar 8.png', 'Avatars/Avatar 9.png', 'Avatars/Avatar 10.png', 'Avatars/Avatar 11.png',
    'Avatars/Avatar 12.png', 'Avatars/Avatar 13.png', 'Avatars/Avatar 14.png']
    let random = Math.floor(Math.random() * avatarPaths.length);

    console.log('HEHE' + username);
    let resp = await valid(username, password, email, 'register');
    if (resp[0] === 'Success'){
        console.log('Successfully Regestired');
        firebase.database().ref(`Users/${username}`).set({
            username: username,
            email: email,
            password: password,
            balance: 500,
            address: "",
            status: "",
            pinCode: "",
            MobNumber: "",
            avatar: avatarPaths[random],
            totalPurchase: 0,
            orders: ["None"]
        })
        // Logic to add username , email and password in their respective directory

        updateDatabase(username, 'usernames', 'U');
        updateDatabase(password, 'passwords', 'P');
        updateDatabase(email, 'emails', 'E');
    }
    else{
        return `${resp[1]} already taken`;
    }
}

