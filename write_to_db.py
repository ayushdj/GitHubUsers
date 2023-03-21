#!/usr/bin/env python3
import certifi
import requests
from pymongo import MongoClient
import argparse
import os


class GithubDatabaseManager:
    # The base URL for the API that extracts the repositories for a particular user
    BASE_GITHUB_API_URL = 'https://api.github.com/users/'

    def __init__(self):

        # extract environment variables 
        db_user = os.getenv('ANALOG_DB_USER')
        db_key = os.getenv('ANALOG_DB_PASSWORD')

        client = MongoClient(
            f'mongodb+srv://{db_user}:{db_key}@cluster0.3layqrx.mongodb.net/github?retryWrites=true&w=majority',
            tlsCAFile=certifi.where())

        # extract the database we need
        db = client.github

        # extract the specific collection for repositories
        self.repos_collection = db.user_repos

        # parse the usernames
        self.usernames = []

    def populate_repo_collection(self):
        """
        Populate the database with the names of all the repositories
        """
        # loop over all the names in our username array
        for current_username in self.usernames:
            # update the endpoint url for both users and repos
            repository_url = f'{self.BASE_GITHUB_API_URL}{current_username}/repos'
            user_url = f'{self.BASE_GITHUB_API_URL}{current_username}'
            try:
                repo_response = requests.get(repository_url)
                user_response = requests.get(user_url)
            except Exception:
                print(f'Failed to fetch data from github')
                continue

            if repo_response.status_code != 200 or user_response.status_code != 200:
                print(f'Github returned a status code of {repo_response.status_code}, skipping user {current_username}')
                continue

            # extract all the repository names for this user and save the results in a list
            repository_information = [{'repoName': repository['name'], 'repoHtmlUrl': repository['html_url'],
                                       'repoDescription': repository['description']} for repository
                                      in repo_response.json()]

            user_information = {'avatarUrl': user_response.json()['avatar_url'], 'name': user_response.json()['name'],
                                'location': user_response.json()['location']}

            # Here we are checking to see if the data already exists in the database. 
            user_data = self.get_user(current_username)

            # set the data and update it
            new_repo_and_user_information = {'$set': {'repositoryInformation': repository_information,
                                    'userInformation': user_information}}
            self.repos_collection.update_one({'username': current_username}, new_repo_and_user_information, upsert=True)

            # let the user know if we updated the data or inserted new data.
            if user_data:
                print(f'Updated repository and user information for username = {current_username}')
            else:
                print(f'Inserted new data for username = {current_username}')

    def set_usernames(self, all_usernames: list) -> None:
        """
        A setter method to set the usernames class variable to a new set of usernames that come in string format.
        """
        self.usernames = all_usernames

    def get_user(self, username: str):
        """
        A helper method to determine if a username is in the database
        """
        return self.repos_collection.find_one({'username': username}, {'_id': False})


def main(usernames: list):

    # make an instance of the class
    github_db_manager = GithubDatabaseManager()

    # set the usernames
    github_db_manager.set_usernames(usernames)
    
    # populate the database with the repository names for all users, old and new
    github_db_manager.populate_repo_collection()


if __name__ == '__main__':
    # Parse the command line arguments
    parser = argparse.ArgumentParser(prog='Write to DB')
    parser.add_argument('usernames', type=lambda s: s.split(','))
    args = parser.parse_args()
    main(args.usernames)
