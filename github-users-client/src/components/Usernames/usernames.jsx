import React from "react";
import '@fortawesome/free-solid-svg-icons'
import {useState} from 'react';
import Button from '@material-ui/core/Button';

import SpecificUserModal from "../SpecificUsernameModal/specificUserModal";

/**
 * Represents the list of all the username cards 
 * @param {*} usernames All the usernames and their objects based on the usernames
 *                      that the client inputted into the search bar
 * @returns the Usernames object
 */
const Usernames = ({usernames}) => {

    /**
     * States:
     *      openModal: represents whether the modal is open or closed
     *      isClicked: the current username object that is clicked
     *      displayCount: the number of usernames that are displayed
     */
    const [openModal, setOpenModal] = useState(false);
    const [isClicked, setIsClicked] = useState([]);
    const [displayCount, setDisplayCount] = useState(10);


    /**
     * Callback method to handle opening of a particular user's modal
     * @param {*} username the username whose modal we want to open
     */
    const handleOpenModal = (username) => {
        // set the isClicked object to be that of the username we're looking for
        setIsClicked(usernames.find(x => x.username === username));

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
        <div className='flex justify-center flex-wrap'>
            {usernames.map((each) => (
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
                                <SpecificUserModal isClicked={isClicked} handleCloseModal={handleCloseModal} displayCount={displayCount} setDisplayCount={setDisplayCount}/>
                                : <></>}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Usernames;