from google.cloud import storage
from google.oauth2 import service_account
import os
from io import BytesIO

GOOGLE_BUCKET_NAME = os.getenv("GOOGLE_BUCKET_NAME")
GOOGLE_APPLICATION_CREDENTIALS = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")


class CloudStorageController:
    _instance = None

    def __new__(cls, *arg):
        if not cls._instance:
            cls._instance = super(CloudStorageController, cls).__new__(cls)
        return cls._instance

    def __init__(self, bucket_name):
        credentials = service_account.Credentials.from_service_account_file(
            GOOGLE_APPLICATION_CREDENTIALS
        )

        self.client = storage.Client(credentials=credentials)
        self.bucket = self.client.bucket(bucket_name)

    def upload_file(self, file, class_name):
        try:

            blob = self.bucket.blob(f'{class_name}/{file["file_name"]}')

            blob.upload_from_file(BytesIO(bytes(file["file_content"])))

        except Exception as e:

            raise Exception(
                f"Error occurred while uploading file {file["file_name"]}: {e}"
            )

    def download_files(self, filename):
        return


cloudStorageControllerInstance = CloudStorageController(GOOGLE_BUCKET_NAME)
