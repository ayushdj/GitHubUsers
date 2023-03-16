import axios from 'axios';


const usernamesUrl = "http://127.0.0.1:5000/api/v1/users"

/**
 * This function makes a call to the api set up by the backend 
 * and parses the results.
 * @param {} usernames the usernames list
 */
async function getRepoNames(usernames) {
    /*
        need to pass in a string as the query parameters, so we need
        to create that string. We loop over all the objects in the usernames
        list and in each object, we extract the userName field.  
    */
    let joinedString = "";
    for (let i = 0; i < usernames.length; i++) {
        joinedString += usernames[i].userName;
        if (i !== usernames.length - 1) {
            joinedString += ",";
        }
    }

    /*
        Make the get request and pass in query parameters, and extract
        the data
    */
    let response = await axios.get(usernamesUrl, {
        params: {
            users: joinedString
        }
    });
    return response.data;
}

// async function getUserData(username) {
//     // let response = await axios.get(base)
// }


const functions = {getRepoNames}

export default functions;