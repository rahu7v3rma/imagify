import os
from dotenv import load_dotenv

load_dotenv()

env = {
    "API_BASE_URL": os.getenv("API_BASE_URL")
}
