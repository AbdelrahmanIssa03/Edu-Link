# Load environment variables first, before other imports
import os
from dotenv import load_dotenv

# Get the absolute path to the .env file
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
env_path = os.path.join(base_dir, '.env')

# Load the .env file
load_dotenv(env_path)

# Now import other modules
from .services.test_audio_transfering import send_lecture
from .services.test_question_inquiring import send_question
from .services.test_file_uploading import upload_single_file
from .gRPC.grpc_channel import class_stub, session_stub
