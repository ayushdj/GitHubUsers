import React from "react";
import '@fortawesome/free-solid-svg-icons'
import {useState, useEffect} from 'react';

/**
 * This function represents the Header component of the application. It is
 * also responsible for handling the light and dark modes of the application.
 * 
 * @returns the Header component
 */
const Header = () => {

  // extract the current theme from local storage
  let currTheme = localStorage.getItem("github_theme_mode");

  // define a state variable for the light and dark mode
  const [theme, setTheme] = useState(currTheme !== undefined ? currTheme : "light");

  // on loading this page, the theme is set to either dark or 
  // light based on what the value of `theme` is initially from
  // local storage. 
  useEffect(() => {
      if (theme === 'dark') {
          document.documentElement.classList.add("dark");
          document.body.style.backgroundColor = "white"
          localStorage.setItem('github_theme_mode', 'dark');
      } else {
          document.documentElement.classList.remove('dark');
          document.body.style.backgroundColor = 'hsl(207, 26%, 17%)'
          localStorage.setItem('github_theme_mode', 'light');
      }
  }, [theme])

  /**
   * A callback for setting the `theme` state variable. 
   */
  const handleThemeSwitch = () => {
      if (theme === "dark") {
          setTheme("light");
      } else {
          setTheme("dark");
      }
  }

  return (
    <nav className='lg:w-full'>
      <div className='w-100% shadow-lg py-5 px-2 mb-16 bg-[#2b3945] dark:bg-white'>
        <div className="flex container mx-auto dark:text-black text-white">
          <i className='fa-brands fa-github pt-[6px]'></i>
          <h1 className="font-bold md:text-l dark:text-black text-white lg:text-xl pl-2">GitHub User Public Repositories</h1>
          <div className="ml-auto font-medium md:text-l lg:text-xl">
            <button className="lg:text-md" 
                      onClick={() => handleThemeSwitch()}> {theme==='dark' ? <i className="fa-solid fa-moon"></i> : <i className="fa-solid fa-sun"> </i>}
                      <span className="">{theme === 'dark' ? <span> Dark Mode</span> : <span> Light Mode</span>}</span></button>
          </div>
        </div>
      </div>
    </nav>

  );
}

export default Header;