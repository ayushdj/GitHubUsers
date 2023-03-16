dependencies:
	pip install Flask
	pip install flask-cors
	pip install certifi
	pip install requests
	pip install pymongo
	pip install python-dotenv
server:
	python3 server.py
write_to_db:
	cp write_to_db.py write_to_db && chmod +x write_to_db
clean:
	rm write_to_db