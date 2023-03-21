import React from "react";
import '@fortawesome/free-solid-svg-icons'

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import List from '@mui/material/List';
import Button from '@material-ui/core/Button';


/**
 * Represents the specific user modal for a particular username
 * @param {*} isClicked: the object for the current user
 * @param {*} handleCloseModal: closes the modal
 * @param {*} displayCount: the number of repositories that are displayed for this user
 * @param {*} setDisplayCount: setter method for the Display count
 * @returns the Modal for a specific user
 */
const SpecificUserModal = ({isClicked, handleCloseModal, displayCount, setDisplayCount}) => {

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


    return (
        <div className='fixed inset-0 bg-black bg-opacity-25
            backdrop-blur-sm flex justify-center items-center rounded pb-4' id='wrapper' onClick={handleCloseModal}>
            <div className='xs:w-[300px] sm:w-[400px] md:w-[500px] flex flex-col h-[600px] overflow-y-auto overflow-x-auto'>
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
                                        <div className='font-bold font-mono underline underline-offset-4'>{idx + 1}. {repoInfo.repoName}</div>
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
        </div>
    )
}

export default SpecificUserModal;