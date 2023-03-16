from flask import Flask, jsonify, request
from flask.helpers import send_from_directory
from flask_cors import CORS, cross_origin
from write_to_db import GithubDatabaseManager

app = Flask(__name__, static_folder='github-users-client/build', static_url_path='')
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# use the GithubDatabaseManager class to create a connection to the database
database_connection = GithubDatabaseManager()


@app.route('/api/v1/user/<username>', methods=['GET'])
@cross_origin()
def users_detail_handler(username):
    """
    Gets the repository names for one user
    """
    actual_username_data = database_connection.get_user(username)
    return jsonify({'result': actual_username_data})


@app.route('/api/v1/users', methods=['GET'])
@cross_origin()
def users_list_handler():
    """
    Get all the repository names for a group of users
    """
    # extract the query parameter
    users = request.args.get('users')

    # the 'users' variable above is a string separated by commas, so we want to split it
    # and set the username list in the database connection
    split_users = users.split(',')
    database_connection.set_usernames(split_users)

    # initialize our result list
    result = []

    # loop over all the usernames
    for username in database_connection.usernames:
        # extract the actual data and only if the user exists in the database do we append the data.
        if username != '':
            actual_username_data = database_connection.get_user(username)
            if actual_username_data:
                result.append(actual_username_data)

    return jsonify(result)


@app.route('/')
@cross_origin()
def serve():
    return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    app.run()
