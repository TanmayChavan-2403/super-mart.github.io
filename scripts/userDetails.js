function storeDataInSession(data, callbackResp){
    sessionStorage.setItem('Avatar', data['avatar']);
    sessionStorage.setItem('Email', data['email']);
    sessionStorage.setItem('Status', data['status']);
    sessionStorage.setItem('PinCode', data['pinCode']);
    sessionStorage.setItem('Balance', data['balance']);
    sessionStorage.setItem('Address', data['address']);
    sessionStorage.setItem('MobileNumber', data['MobNumber']);
    sessionStorage.setItem('TotalPurchase', data['totalPurchase']);
    sessionStorage.setItem('Password', data['password']);
    callbackResp();
    // document.getElementById('userPage').href = path;
    // location.href = path;
}

function getUserDetails(callbackResp){
    var DBreference = firebase.database().ref(`Users/${sessionStorage.getItem('User')}`);
    DBreference.get()
    .then(resp => {
        if (resp.exists()){
            storeDataInSession(resp.val(), callbackResp);
        } else {
            console.log('No records found');
        }
    })
    .catch(err => {
        console.log('Opps! Error Encountered', err);
    })
    
}

function fetchImageForAvatar(callbackResp){
    var imgPath = sessionStorage.getItem('Avatar');
    var firestore = firebase.storage();
    firestore.ref(imgPath).getDownloadURL()
    .then(resp => {
        callbackResp(resp);
        sessionStorage.setItem('AvatarURL', resp)  
    })
    .catch(err => {
        // callbackResp('Opps! Sorry to inform you pal, but something went wrong while fetching data :( ');
        callbackResp('404');
        callbackResp(err);
    })

}

function updateAddress(callbackResp){
    let address = document.getElementById('address').value;
    let pinCode = document.getElementById('pin-code').value;
    let mobileNumber = document.getElementById('mobileNumber').value;
    var username = sessionStorage.getItem('User');

    var updates = {}
    updates[`Users/${username}/address`] = address;
    updates[`Users/${username}/pinCode`] = pinCode;
    updates[`Users/${username}/MobNumber`] = mobileNumber;
    
    sessionStorage.setItem('PinCode', pinCode);
    sessionStorage.setItem('address', address);
    sessionStorage.setItem('MobNumber', mobileNumber);

    var resp = firebase.database().ref().update(updates, callbackResp('Update Successfull'));
}

function allEmpty(cred1, cred2, cred3, cred4){
    if (cred1 === "" && cred2 === "" && cred3 === "" && cred4 === ""){
        return true 
    } else {
        return false
    }
}

function updateUserDetails(){
    var username = document.getElementById('User').value;
    var email = document.getElementById('Email').value;
    var password = document.getElementById('password').value;
    var ConfmPassword = document.getElementById('confirmPassword').value;

    if (allEmpty(username, email, password, ConfmPassword)){
        displayStatus('500', 'Nothing to update');
    } 
    if(username !== ""){
        if (username === sessionStorage.getItem('User')){
            displayStatus('500', 'You are choosing same username');
            return;
        } else if (username.includes('.') || username.includes('/')){
            displayStatus('500', "Please don't use '.' or '/' in your username");
            return;
        }
        let usernameID;
        var flag = true;
        var DBreference = firebase.database().ref(`U/usernames`);
        DBreference.get()
        .then(resp => {
            if (resp.exists()){
                // For loop to check weather new username already taken by someone else and simultaneously
                // Take the id of the username which we have to change in case the username is not taken
                // by anyone else which is stored in usernameID
                for(let i = 0; i < resp.val().length; i++){
                    if (sessionStorage.getItem('User') === resp.val()[i]){
                        usernameID = i;
                    } 
                    if (username === resp.val()[i]){
                        displayStatus('500', 'Username already exists!');
                        flag = false;
                    }
                }

                // If we reach till this if condition means the new username is not taken by anyone
                // so now we can proceed further with updation of user data
                if (flag && usernameID !== undefined){

                    // Getting old data from database to assing it to new username
                    firebase.database().ref(`Users/${sessionStorage.getItem('User')}`).get()
                    .then(resp => {
                        if (resp.exists()){
                            var Newdata = resp.val(); // Before assigning the data to new username we change the username present in data 
                            Newdata['username'] = username;
                            firebase.database().ref(`Users/${username}`).set(Newdata)
                            .then(resp => displayStatus('200', 'Successfully Updated User'))
                            .catch(err => displayStatus('500', 'Could not update username'));
                        } else {
                            console.log('No Data found on server :( ');
                        }
                    })
                    .catch(err => {
                        console.log('firebase Error', err);
                    })

                    // Deleting the old username with its values
                    firebase.database().ref(`Users/${sessionStorage.getItem('User')}`).remove();

                    // Deleting the record from usernames field
                    firebase.database().ref(`U/usernames/${usernameID}`).set(username);

                    // Updating the value of username in sessionStorage
                    sessionStorage.setItem('User', username);
                }
            } else {
                displayStatus('500', 'Internal Error! Please try again later');
            }
        })
        .catch(err => {
            console.log('Opps! we have Encountered an error', err);
        })

    }
    // Applying timeout because if we are having username and email both for 
    // update then we have to wait for atleast 2 seconds or else it will overlap
    setTimeout(() => {
        if(email !== ""){
            const re = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
            if (re.test(email) && (email.includes('gmail.com') || email.includes('yahoo.com'))){

                let emailID;
                var flag = true;
                firebase.database().ref('E/emails').get()
                .then(resp => {
                    for(let i = 0; i < resp.val().length; i++){
                        if (sessionStorage.getItem('Email') === resp.val()[i]){
                            emailID = i;
                            console.log('We got our email ID', emailID);
                        }
                        if (email === resp.val()[i]){
                            displayStatus('500', 'This email is already registered');
                            flag = false;
                        }
                    }
                    if (flag && emailID !== undefined){

                        // Updating email of user
                        firebase.database().ref(`Users/${sessionStorage.getItem('User')}/email`).set(email)
                            .then(response => {
                                displayStatus('200','Successfully Updated Email');
                                // Updating the email in session storage
                                sessionStorage.setItem('Email', email);
                                firebase.database().ref(`E/emails/${emailID}`).set(email);
                            })
                            .catch(err => {
                                displayStatus('500','Could not update email');
                                console.log(err);
                            });
                    }
                })
                .catch(err => {
                    displayStatus('500', 'Internal Error');
                    console.log(err);
                });

            } else {
                displayStatus('500', 'Please enter valid Email');
            }
        }
        // Code to update password if entered
        if (password !== ""){
            if (ConfmPassword === ""){
                displayStatus('500', 'Please also enter the confirm password');
                return;
            } else if (ConfmPassword !== password){
                displayStatus('500', 'Password does not match with Confirm password');
                return;
            }
            let passwordID;
            var flag = true;
            firebase.database().ref(`P/passwords`).get()
            .then(resp => {
                for(var i = 0; i < resp.val().length; i++){
                    if (sessionStorage.getItem('Password') === resp.val()[i]){
                        passwordID = i;
                    } else if(email === resp.val()[i]){
                        console.log('Reaching here');
                        displayStatus('500', 'Password is already in use');
                        flag = false;
                    }

                    if (flag && passwordID !== undefined){
                        // Updating password of the user
                        firebase.database().ref(`Users/${sessionStorage.getItem('User')}/password`).set(password)
                        .then(resp => {
                            // Updating passwords in session and passwords list in firebase
                            sessionStorage.setItem('Password', password);
                            firebase.database().ref(`P/passwords/${passwordID}`).set(password);
                            console.log('Password is updated ig');
                            displayStatus('200','Password updated successfully');
                        })
                        .catch(err => {
                            console.log('Opps! we have got an error', err);
                        })
                    }
                }
            })
            .catch(err => {
                console.log(err);
            })
        }


    }, 2000)
    
}

function getAllAvatars(callbackResp){
    var avatarPaths = ['Avatars/Avatar 1.png', 'Avatars/Avatar 2.png', 'Avatars/Avatar 3.png',
    'Avatars/Avatar 4.png', 'Avatars/Avatar 5.png','Avatars/Avatar 6.png', 'Avatars/Avatar 7.png',
    'Avatars/Avatar 8.png', 'Avatars/Avatar 9.png', 'Avatars/Avatar 10.png', 'Avatars/Avatar 11.png',
    'Avatars/Avatar 12.png', 'Avatars/Avatar 13.png', 'Avatars/Avatar 14.png', 'Avatars/Avatar 15.gif'];

    var data = {};

    avatarPaths.forEach(path => {
        firebase.storage().ref(path).getDownloadURL()
        .then(url => {
            firebase.storage().ref(path).getMetadata()
            .then(metadata => {
                data[path] = [metadata['name'], url];
                if (path === 'Avatars/Avatar 14.png'){
                    setTimeout(()=> {
                        callbackResp(data);
                        sessionStorage.setItem('allAvatars', data);
                    }, 2000)
                }
            })
        })
        .catch(err => {
            callbackResp(err);
        })
    })
}

// Function to update avatar of user 
function updateAvatar(name, link){
    if (name === undefined || link === undefined){
        displayStatus('500', 'Please select avatar first');
        return;
    }
    console.log('Updating details');
    console.log(name, link);

    // Updating avatar details in database
    firebase.database().ref(`Users/${sessionStorage.getItem('User')}/avatar`).set(name)
    .then(resp => displayStatus('200', 'Successfully Updated'))
    .catch(err => displayStatus('500', 'Internal Error'))


    // updating avatar name & url in session storage
    sessionStorage.setItem('Avatar', name);
    sessionStorage.setItem('AvatarURL', link);

    // Rerloading page after updating avatar to display updates
    setTimeout(() => {
        location.reload();
    }, 2000);

}

function getCurrentWeekDay(returnDate){
    switch(new Date().getDay()){
        case 0:
            returnDate("Sunday");
            break
        case 1:
            returnDate("Monday");
            break
        case 2:
            returnDate("Tuesday");
            break
        case 3:
            returnDate("Wednesday");
            break
        case 4:
            returnDate("Thursday");
            break
        case 5:
            returnDate("Friday");
            break
        case 6:
            returnDate("Saturday");
    }
}


// Function to update orders list of user when he orders something
function bookOrBuyProduct(imgPath, prodName, callbackFunc){
    let currUser = sessionStorage.getItem('User');
    let d = new Date();
    let currDay = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    let currTime = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
    let totalOrders = parseInt(sessionStorage.getItem('TotalPurchase'));
    
    getCurrentWeekDay(weekDay => {
        let orderData = {
                'orderName': prodName,
                'orderImg' : imgPath,
                'orderWeekDay' : weekDay,
                'orderCurrTime' : `${currDay}  ${currTime}`
                }
        var currUpdate = {};
        // add order details
        currUpdate[`Users/${sessionStorage.getItem('User')}/orders/${totalOrders}`] = orderData;
        firebase.database().ref().update(currUpdate);

        // Updating total order count in session storage 
        sessionStorage.setItem('TotalPurchase', totalOrders + 1)

        // Updating total order count in database
        firebase.database().ref(`Users/${sessionStorage.getItem('User')}/totalPurchase`).set(totalOrders + 1)
        .then(resp => callbackFunc('200'))
        .catch(err => callbackFunc('500'))

        // Calling success callback function 
        
    })
}

// Function to fetch order details
function getOrderHistory(user, callbackFunc){
    firebase.database().ref(`Users/${user}/orders`).get()
    .then(resp => {
        sessionStorage.setItem('orders', JSON.stringify(resp.val()))
        callbackFunc('200');
    })
    .catch(err => {
        console.log(err)
        callbackFunc('500');
    })
}