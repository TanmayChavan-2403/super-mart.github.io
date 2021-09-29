let chooseFileBtn = document.getElementById('chooseFileButton');

function upload(){
    var file = document.getElementById('inputFileButton').files[0];
    // Updating path for filepath 
    path += file.name;
    filePath.value = path;

    // Creating reference to storage
    console.log(path, 'from Firestore');
    const storageRef = firebase.storage().ref(path);

    // Upload File
    const task = storageRef.put(file);

    // Upload progress

    task.on("state_changed",
        function progress(snapshot){
            console.log('Progressing....');
        },

        function error(err){
            console.log('Opps! We have got as error' + err);
            displayStatus('500', 'Image not Uploaded');
        },

        function complete(){
            console.log('Its completed IG');
            displayStatus('200', 'Image uploaded Successfully');
        }
    )
}

function uploadFileData(){
    var firestore = firebase.firestore();
    

    const fileName = document.getElementById('file-name').value;
    const filePath = document.getElementById('file-path').value;
    const Price = document.getElementById('price').value;
    const totalImages = document.getElementById('total-images').value;
    const totalProducts = document.getElementById('total-products').value;
    const collection  = filePath.split('/')[0];
    console.log(collection, 'From file upload section');

    var docRef = firestore.collection(collection);

    if (filePath === "") {
        alert('Please complte previous procedures first');
        return;
    } else {
        docRef.add({
            Name: fileName,
            Path: filePath,
            Price: Price,
            totalImages: totalImages,
            totalProducts: totalProducts
        })
        .then( resp => {
            console.log('Databse updated successfully :) ', resp);
            displayStatus('200', 'Data uploaded successfully');
        })
        .catch(err => {
            console.log('Opps!, We have got an error :( ', err);
            displayStatus('500', 'Failed to upload data');
        })
       
        // docRef.get()
        // .then(resp => {
        //     resp.forEach(doc => {
        //         console.log(doc.data());
        //     })
        // })
        // .catch(err => {
        //     console.log(err);
        // })
    }

    // docRef.set({
    //     YoMyFirstLog: 'Hey Hey Hey!',
    // }).then(resp => {
    //     console.log('Yayy, We have update the database successfully :) ');
    // }).catch(err => {
    //     console.log('Opps! we have got an error :( ', err);
    // })
}

function fetchDataFromDatabase(collection, callbackResp){
    var firestore = firebase.firestore();
    var docRef = firestore.collection(collection);
    response = []
    docRef.get()
    .then(resp => {
        resp.forEach(doc => {
            response.push(doc.data());
        })
        callbackResp(response);
    })
    .catch(err => {
        console.log('Opps! We Encountered an error :( ', err);
    })
}   

// Function to apply images on received cards
function fetchImageUrls(cards, collection, callbackResp){
    var firestore = firebase.storage();
    result = {};
    cards.forEach(card => {
        firestore.ref(card.getAttribute('data-imgPath')).getDownloadURL()
        .then(resp => {
            card.children[0].src = resp;
            result[card.getAttribute('data-imgPath')] = resp;
        })
        .catch(err => {
            console.log(err);
        })
    })
    callbackResp();
    setTimeout(() => {
        if (!(Object.keys(result).length === 0 && result.constructor === Object)){
            sessionStorage.setItem(collection, JSON.stringify(result));
        } else {
            console.log('Result was empty so we didnt updated sesstion storage');
        }
        
    }, 5000)
}

