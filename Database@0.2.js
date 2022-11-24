
/**
 * This is a helper class that help you read and write Firebase realtime database easily. 
 * Before loading this class, you must add Firebase cdn in your HTML document:
 * <script src="https://www.gstatic.com/firebasejs/7.19.0/firebase-app.js"></script>
 * <script src="https://www.gstatic.com/firebasejs/7.19.0/firebase-database.js"></script>
 */
 class Database {
    #db;
    #root;
    /**
     * 
     * @param {String} root The root location the data stored in your database.
     * @param {
     * {apiKey: String, 
     * authDomain: String, 
     * databaseURL: String, 
     * projectId: String,
     * storageBucket: String,
     * messagingSenderId: String,
     * appId: String,
     * measurementId: String}
     * } config  Your web app's Firebase configuration
     * @param {String} [appName]
     */
    constructor(root, config, appName) {
        this.#root = root;
        if (appName) {
            firebase.initializeApp(config, appName);
        } else {
            firebase.initializeApp(config);
        }
        
        this.#db = firebase.database();
    }

    /**
     * 
     * @param {String} newRoot The root location of your data stored in firebase realtime database.
     * @returns {String} the new root.
     */
    setRoot(newRoot) {
        this.#root = newRoot;
        return this.#root;
    }
    
    /**
     * 
     * @param {String} location The location of the data. Enter "" if the data is stored in the root folder.
     * @param {(Data) => {}} callback The callback function when data is retrived from the database.
     */
    read(location, callback){
        this.#db.ref(this.#root + '/' + location).once("value").then( snapshot => {
            callback( snapshot.val() );
        }, error => {
            console.log("ERROR: " + error.code);
        });
    }

    /**
     * 
     * @param {String} location The location of the data. Enter "" if the data is stored in the root folder.
     * @param {(Data) => {}} callback The callback function when data is retrived from the database.
     */
     readWithFilter(location, orderByChild, keyword, callback){
        this.#db.ref(this.#root + '/' + location).orderByChild(orderByChild).equalTo(keyword).once("value").then( snapshot => {
            callback( snapshot.val() );
        }, error => {
            console.log("ERROR: " + error.code);
        });
    }

    getKey(location, callback) {
        this.#db.ref(this.#root + '/' + location).once("value").then( snapshot => {
            callback( snapshot.key );
        }, error => {
            console.log("ERROR: " + error.code);
        });
    }

    getChildrenKeys(location, callback) {
        this.#db.ref(this.#root + '/' + location).once("value").then( snapshot => {
            const keys = [];
            snapshot.forEach(child => {
                keys.push(child.key);
            });
            callback( keys );
        }, error => {
            console.log("ERROR: " + error.code);
        });
    }
    
    /**
     * 
     * @param {String} location 
     * @param {String} key 
     * @param {()=>{}} callback 
     */
    listItemsByKey(location, key, callback){
        this.read(location, data => {
            const items = [];
            data.forEach( item => {
                if (!items.includes(item[key])) {
                    items.push(item[key]);
                }
            });
            callback(items);
        });
    }
    
    /**
     * Listen to the data of a location and run the callback function when the data is upadted.
     * @param {String} location 
     * @param {(Data) => {}} callback 
     */
    onDataUpdated(location, callback){
        this.#db.ref(this.#root + '/' + location).on("value", snapshot => {
            callback( snapshot.val() );
        });
    }
    
    
    /**
     * 
     * @param {String} id 
     * @returns {Boolean}
     */
    hasId(location, id){
    
        console.log("isIdTaken");
    
        this.#db.ref(this.#root + '/' + location).once("value").then( snapshot => {
            if (snapshot.val()[id]) {
                return true;
            } else {
                return false;
            }
        }, error => {
            console.log("ERROR: " + error.code);
        });
    }

    /**
     * 
     * @param {String} location 
     * @param {Object} data 
     * @param {()=>{}} callback 
     */
    update(location, data, callback) {
        this.#db.ref(this.#root + '/' + location).update(data).then(() => {
            if (callback) {
                callback();
            }
        });
    }
    
    /**
     * Set or update the value of a location. 
     * @param {String} location 
     * @param {*} value 
     * @param {()=>{}} callback 
     */
    set(location, value, callback){
        // console.log("set data");
        if (callback) {
            this.#db.ref(this.#root + '/' + location).set(value, callback());
        } else {
            this.#db.ref(this.#root + '/' + location).set(value);
        }
    }

    /**
     * 
     * @param {String} location 
     * @param {*} data 
     * @param {()=>{}} callback 
     */
    append(location, data, callback){
        // console.log("append Data");
        if (callback) {
            this.#db.ref(this.#root + '/' + location).push().set(data, callback());
        } else {
            this.#db.ref(this.#root + '/' + location).push().set(data);
        }
        
    }
    /**
     * Increment the selected value by a certain number. 
     * @param {String} pathToValue the value of the path must be a number.
     * @param {Number} incrementValue
     */
     increment(pathToValue, incrementValue){
        this.#db.ref(this.#root + '/' + pathToValue).set(firebase.database.ServerValue.increment(incrementValue));
    }

    remove(location, callback){
        if (callback) {
            this.#db.ref(this.#root + '/' + location).remove().then(() => {
                console.log(callback());
            });
        } else {
            this.#db.ref(this.#root + '/' + location).remove().then(() => {
                console.log("Following data is deleted: " + location)
            });
        }
       
    }
}


