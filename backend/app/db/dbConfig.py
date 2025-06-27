from mongoengine import connect
import os
from dotenv import load_dotenv

dotenv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..', '.env'))
load_dotenv(dotenv_path)

MONGODB_URI = os.getenv("MONGODB_URI")

connect(host=MONGODB_URI)
