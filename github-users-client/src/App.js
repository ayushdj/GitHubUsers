import React, { Fragment, useState, useEffect } from 'react';
import Header from './components/Header/header';
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';
import List from '@mui/material/List';
import CircularProgress from '@mui/material/CircularProgress';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import { v4 as uuidv4 } from 'uuid'
import asyncApiFunctions from './api/service';

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
      - openModal: state variable to keep track of opening and closing of modal.
      - isClicked: state variable to store information regarding one user's public repository information.
      - displayCount: keeps track of the number of repo names that are being displayed at any given time.
      - unfoundUsersList: keeps track of all the users who haven't been found in the database.
      - loading: state variable to show the data is loading.
      - errorMsg: this displays any error message that we may get.
  */
  const [usernames, setUsernames] = useState([]);
  const [repoNames, setRepoNames] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [isClicked, setIsClicked] = useState([]);
  const [displayCount, setDisplayCount] = useState(10);
  const [unfoundUsersList, setUnfoundUsersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  // const [showMoreDisabled, setShowMoreDisabled] = useState()

  /**
   * Loads 10 more repository names for a user to show on the screen
   */
  const handleLoadMore = () => {
    setDisplayCount(displayCount + 10);
  };


  /**
   * Loads 10 less repository names for a user to show on the screen
   */
  const handleLoadLess = () => {
    setDisplayCount(displayCount - 10);
  }

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
      setLoading(false);

      // reset all other information
      setUnfoundUsersList([]);
      setRepoNames([]);
      setOpenModal(false);
      setIsClicked([]);
      setDisplayCount(10);
    });



  };
  
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

  /**
   * Callback method to handle opening of a particular user's modal
   * @param {*} username the username whose modal we want to open
   */
  const handleOpenModal = (username) => {
    // set the isClicked object to be that of the username we're looking for
    setIsClicked(repoNames.find(x => x.username === username));

    // set the state variable to be open
    setOpenModal(true);

  }

  /**
   * Closes the modal in question
   */
  const handleCloseModal = (e) => {

    // we only close if we click outside the modal or the 'x' button in 
    // the modal
    if (e.target.id === 'wrapper' || e.target.id === 'close_modal_button') {
      // sets the 'open' state variable to false
      setOpenModal(false);

      // nullify the object in question
      setIsClicked([]);

      // reset the display count.
      setDisplayCount(10);
    }
    
  }

  return (
  <Fragment>
    <Header/>
    <div className='flex items-center justify-center flex-col'>
      <h1 className='text-xl text-center'>Search for public repositories by username!</h1>
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
    

    <div className='flex justify-center flex-wrap'>
      {repoNames.map((each) => (
        <div id={each.username} className='inline-block flex-row' key={each.username}>
          <div className='p-4 max-w-sm'>
            <div className='rounded-lg h-full bg-[#2b3945] dark:bg-slate-50 p-8 flex-col shadow-lg '>
              <div className='flex items-center mb-3'>
                <div className='w-12 h-12 mt-1 mr-3 inline-flex items-center justify-center rounded-full text-white flex-shrink-0'>
                  <img src={each.userInformation.avatarUrl} alt={"avatar image for" + each.userInformation.name} width="1000" height="1000" className='rounded-full'></img>
                </div>
                <div>
                  <h2 className='text-black text-lg font-medium dark:text-black text-white'><a href={'https://github.com/' + each.username} target='_blank' rel='noreferrer'>{each.username} </a></h2>
                  <div className='flex flex-col'>
                    <span className='text-sm dark:text-black text-white'>{each.userInformation.name}</span>
                    {each.userInformation.location !== null ? <span className='text-sm dark:text-black text-white'><i class="fa-solid fa-location-dot"></i> {each.userInformation.location}</span> : <span></span>}
                  </div>
                </div>
              </div>

              <div>
                <Button className='dark:text-black text-white' onClick={() => handleOpenModal(each.username)}>Show public repositories</Button>
                {openModal ? 
                  <div className='fixed inset-0 bg-black bg-opacity-25
                  backdrop-blur-sm flex justify-center items-center rounded pb-4' id='wrapper' onClick={handleCloseModal}>
                    <div className='xs:w-[300px] sm:w-[400px] md:w-[500px] flex 
                    flex-col h-[600px] overflow-y-auto overflow-x-auto
                    '>
                      <div className='dark:bg-white bg-[#2b3945] p-2' id={`${isClicked.username}-${isClicked.username}`}>
                        <div className='flex flex-row justify-between ml-2'>
                          <h2 id='modal-modal-title' className='text-lg dark:text-black text-white'>
                              <span className='font-mono inline-block font-bold '>{isClicked.username}'s</span> Public Repositories:
                          </h2>
                          <CloseRoundedIcon id='close_modal_button' className='border rounded cursor-pointer mt-1 dark:text-black text-white mr-2' onClick={() => handleCloseModal()}/>
                        </div>

                        <div className='flex justify-center flex-col ml-2 mr-2'>
                            <span className='text-md font-medium dark:text-black text-white'>({isClicked.repositoryInformation?.length} total repositories)</span>
                            <List id='modal-modal-description' sx={{ mt: 2 }} >
                            {
                              isClicked.repositoryInformation?.length === 0 ? 
                              
                              <div className='flex flex-col mb-5 justify-center items-center text-center'>
                                <div>
                                  <i class='fa-solid fa-triangle-exclamation dark:text-black text-white fa-3x'></i>
                                </div>
                                <div className='dark:text-black text-white'>
                                  No public repositories to display
                                </div>
                              </div>
                              
                              : <></>
                            }
                            {isClicked.repositoryInformation?.slice(0, displayCount).map((repoInfo, idx) => (
                                <div className='flex flex-row pb-5 justify-between' key={idx}>
                                  <div className='xxs:text-xs xxs:truncate xs:text-sm md:text-lg dark:text-black text-white'>
                                    <div className='flex flex-col'>
                                      <div className='font-bold font-mono underline underline-offset-4'><a rel="noreferrer" target="_blank" href={repoInfo.repoHtmlUrl}>{idx + 1}. {repoInfo.repoName}</a></div>
                                      {repoInfo.repoDescription === null ? <div className='text-sm max-w-[50%]'>*No Description*</div> : <div className='text-sm max-w-[50%]'>Description: {repoInfo.repoDescription}</div>}                                      
                                    </div>
                                    
                                  </div>
                                  <div>
                                    <a rel="noreferrer" className='dark:text-black text-white' target="_blank" href={repoInfo.repoHtmlUrl}><i className='fa-sharp fa-solid fa-up-right-from-square'></i></a>
                                  </div>
                                </div>
                                ))}
                            </List>
                        </div>
                        <div className='flex justify-center mt-2 mb-5'>
                          <Button variant='outlined' className='dark:disabled:text-gray-300
                          dark:disabled:border-gray-300 disabled:text-gray-500 disabled:border-gray-500 border-white text-white dark:border-zinc-800 dark:text-zinc-800' onClick={handleLoadMore} disabled={displayCount >= isClicked.repositoryInformation?.length ? true : false}>
                              Show More
                          </Button>
                          &nbsp;
                          <Button variant='outlined' className='dark:disabled:text-gray-300
                          dark:disabled:border-gray-300 disabled:text-gray-500 disabled:border-gray-500 border-white text-white dark:border-zinc-800 dark:text-zinc-800' onClick={handleLoadLess} disabled={displayCount - 10 <= 0 ? true : false}>
                              Show Less
                          </Button>
                        </div>
                      </div>  
                    </div>
                  </div> : <></>}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </Fragment>
  )
}


export default GitHubUsernames;