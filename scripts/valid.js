function Exists(target, type, root){
    return new Promise((resolve, reject) => {
        let records;

        firebase.database().ref(`${root}/${type}`).once("value", function(dataSet){
            if (dataSet.exists()){
                records = dataSet.val();
                for (let i = 0; i < records.length; i++){
                    if  (target === records[i]){
                        reject(type);
                        return;
                    }
                }
                resolve('Success');
            }
            else{
                resolve('Success');
            }
        });
    });
}


async function valid(username, password, email, type){
    if (type === 'register'){
        try{
            await Exists(username, 'usernames', 'U');
            await Exists(email, 'emails', 'E');
            await Exists(password, 'passwords', 'P');
        } catch(err) {
            return ['Failed', err];
        }
        return ['Success'];
    }
}