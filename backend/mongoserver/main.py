from pymongo import MongoClient

mongodb_uri = 'mongodb+srv://<user>:<password>@cluster0.nbszr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
port = 8000
client = MongoClient(mongodb_uri, port)
db = client["User"]