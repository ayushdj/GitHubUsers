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
> cd cd github-users-client
> npm run start
```
