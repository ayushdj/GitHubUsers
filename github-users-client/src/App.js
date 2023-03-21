import React, { Fragment, useState, useEffect } from 'react';
import Header from './components/Header/header';
import SendIcon from '@material-ui/icons/Send';
import CircularProgress from '@mui/material/CircularProgress';

import { v4 as uuidv4 } from 'uuid'
import asyncApiFunctions from './api/service';
import Usernames from './components/Usernames/usernames';

// declare a set to keep track of duplicate usernames
const allUserNames = new Set();

/**
 * The main application that renders a list of repo names based on a given set of usernames
 * @returns the GitHubUsernames component.
 */
const GitHubUsernames = () => {

  /*
    States:
      - usernames: declare a state variable that keeps track of all the usernames added so far.
      - repoNames: declare a state variable that tracks the names of the repositories. 
      - unfoundUsersList: keeps track of all the users who haven't been found in the database.
      - loading: state variable to show the data is loading.
      - errorMsg: this displays any error message that we may get.
  */
  const [usernames, setUsernames] = useState([]);
  const [repoNames, setRepoNames] = useState([]);
  const [unfoundUsersList, setUnfoundUsersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  /**
   * This method is called when the 'send' button is pressed.
   * @param {*} e the event 
   */
  const handleSubmit = (e) => {

    // set the loading icon to be true
    setLoading(true);
    e.preventDefault();

    // make a call to the service file 
    asyncApiFunctions.getRepoNames(usernames).then(returnedData => {
      
      
      // set the repoNames variable to what is returned
      // from the database
      setRepoNames(returnedData);

      // separate the input username list into two lists: one for
      // users who exist in the database and one for users who don't..
      let actualUsersReturned = new Set();

      // transfer all the returned usernames into a set for quick lookup and extract
      // the previous state of the 'unfound' list
      for (let i = 0; i < returnedData.length; i++) {
        actualUsersReturned.add(returnedData[i].username);
      }

      let notFoundList = [];

      /**
       * if the username doesn't exist in our set from before, then we add it 
       * to the list of usernames that haven't been found and show it to the user.
       * @param {*} username the username in question. 
       */
      function determineOccurrence(username) {
        if (!actualUsersReturned.has(username) && !notFoundList.includes(username)) {
          notFoundList.push(username);
        }
      }

      // go through the set of all usernames the user inputted initially, and 
      // apply the determineOccurrence function on them.
      allUserNames.forEach((each) => determineOccurrence(each));
      
      // set the state variable that shows which usernames haven't been found.
      setUnfoundUsersList(notFoundList);

      // if there was an error message, then reset it and turn the loading symbol off.
      setErrorMsg('');
      setLoading(false);
    }).catch(err => {
      // let the user know that there is an error
      setErrorMsg('Uh oh! Unable to retrieve the data for the following reason: ' + err.message);

      resetStateVars();

    });

  };

  /**
   * 
   */
  const resetStateVars = () => {
    setLoading(false);

    // reset all other information
    setUnfoundUsersList([]);
    setRepoNames([]);
  }
  
  /**
   * Re-render the component whenever the usernames, repoNames or displayCount 
   * state variables change.
   */
  useEffect(() => {
    // console.log(unfoundUsersList);
    console.log(repoNames);
  }, [repoNames]);

  /**
   * Callback function to remove a field/username entry from
   * the inputFields array
   * @param {*} id the id of the field in question
   */
	const removeUsernames = (id) => {
    // extract the previous state
    const values  = [...usernames];

    // find the index at which the username exists in our state variable
    let idxToDelete = values.findIndex(value => value.id === id);

    // extract the username
    const usernameToDelete = values[idxToDelete].userName;
    
    // find the username we want to remove
    values.splice(idxToDelete, 1);

    // set the usernames variable again
    setUsernames(values);

    // remove the username from the set
    allUserNames.delete(usernameToDelete);
	};
  
  /**
   *  Callback function to add a new entry to the usernames array
   * @param {*} event 
   */
	const addUsernames = event => {
    // we only add an entry of there is a username typed in
		if (event.target.value !== '' && !allUserNames.has(event.target.value)) {

      // extract the previous state of the usernames array and save
      // it in a new variable
      const values = [...usernames];

      // push a new object to the values array
      values.push({ id: uuidv4(),  userName: event.target.value});

      // set the usernames state variable
      setUsernames(values);

      // add to the set
      allUserNames.add(event.target.value);

      // make the input field empty
			event.target.value = '';
		}
	};

  return (
    <Fragment>
      <Header/>
        <div className='flex items-center justify-center flex-col'>
          <h1 className='text-xl text-center dark:text-black text-white'>Search for public repositories by username!</h1>
          <div className='flex items-center flex-wrap rounded border bg-gray-200 py-2 px-4 max-w-[500px] xs:min-w-[400px] sm:min-w-[500px] md:min-w-[500px] mx-5 my-5'>
            {usernames.map((username) => (
              <li key={username.id} className='mr-2 my-1 px-2 py-1 rounded-full bg-gray-300 text-gray-700 flex flex-wrap'>
                <span>{username.userName}</span>
                <span onClick={() => removeUsernames(username.id)}>
                  <i className='fa-solid fa-x pl-2'></i>
                </span>
              </li>
            ))}
            <input type='text' placeholder='Press enter to add username' onKeyDown={event => event.key === 'Enter' ? addUsernames(event) : null} 
            className='bg-gray-200 focus:outline-none w-full'/>
          </div>
          <button onClick={handleSubmit} className='bg-transparent dark:hover:bg-blue-500 dark:hover:border-transparent
          text-white font-semibold hover:text-white py-2 px-4 border bg-[#2b3945] dark:hover:text-white
          dark:border-blue-700 dark:text-blue-700 hover:border-transparent rounded 
          hover:bg-[#2b3945] hover:text-white'  id='send-button'>
            Send &nbsp; <SendIcon />
          </button>

          {unfoundUsersList.length > 0 ? 
            <div className='flex mt-2 justify-center dark:text-black text-white mx-auto text-center max-w-[500px]'>
              <span>No data for the following user(s) in the database: 
              {unfoundUsersList.map((each, idx) => ( <span key={idx}>
                {
                  idx < unfoundUsersList.length - 1 ? <>"{each}", </> : <>"{each}".</>
                } </span>
              ))}</span>
            </div> : <></>}
            {errorMsg.length > 0 ? <><i class='mt-5 fa-regular fa-3x fa-face-sad-tear dark:text-black text-white'></i>
            <span className='mt-2 dark:text-black text-white'>{errorMsg}</span> </> : <></>}
            {loading ? <div className='mt-5'>
              <CircularProgress color='success'/> </div>
            : <></>
            }
        </div> 
      <Usernames usernames={repoNames} />
    </Fragment>
  )
}


export default GitHubUsernames;