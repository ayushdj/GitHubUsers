# GitHubUsers

This repository contains the full-stack application to search public repositories by username. After cloning this repo, run the application by following these steps:

1. Open your .bashrc, .zshrc or .bash_profile and add the following information to the end of that file:
```
export ANALOG_DB_USER=dhananjai
export ANALOG_DB_PASSWORD=eD68qSmbQO7A235T
```

2. 'cd' into this cloned repository and run the following commands:
```
> make dependencies
> make server
```

These commands start up the back-end of the application

3. Open another terminal window and follow these commands to start the application's front-end

```
> cd github-users-client
> npm run start
```

To run the python script 'write_to_db.py', please follow these following steps:

1. In the root of the project directory, run the following command:
```
> make write_to_db
```

2. The 'write_to_db' executable takes in a single argument: a comma separated string of all the usernames you want to add/update the database with. To do that, run the following example
```
> ./write_to_db <username_1>,<username_2>,<username3>
```

If you wish to add more usernames to the database, simply extend the command line argument further with more commas separating each username. 

Enjoy!
