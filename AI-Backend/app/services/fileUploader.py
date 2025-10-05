from app.services import cloudStorageControllerInstance
from app.services import EmbeddingsProcessorInstance
from app.services import QdrantManager


class FileUploader:
    def _upload_to_cloud_bucket(self, request, context):
        error_messages = []

        for file in request.files:
            try:
                new_file = {
                    "file_name": file.fileName,
                    "file_content": file.data,
                }

                cloudStorageControllerInstance.upload_file(new_file, request.className)
            except Exception as e:
                error_messages.append(f"Error uploading file {file.fileName}: {str(e)}")

        return error_messages

    def _upload_to_qdrant(self, request, context):
        error_messages = []

        for file in request.files:
            try:
                new_file = {
                    "file_name": file.fileName,
                    "file_content": file.data,
                }
                
                try:
                    qdrant_Manager = QdrantManager(collection_name=request.className)
                except Exception as coll_error:
                    error_messages.append(f"Error creating Qdrant collection: {str(coll_error)}")
                    continue 

                try:
                    file_chunks = EmbeddingsProcessorInstance.chunk_file(new_file)
                except Exception as chunk_error:
                    error_messages.append(f"Error processing file {file.fileName}: {str(chunk_error)}")
                    continue

                try:
                    file_vectors = EmbeddingsProcessorInstance.embed_file_to_vectors(file_chunks)
                except Exception as embed_error:
                    error_messages.append(f"Error creating embeddings for {file.fileName}: {str(embed_error)}")
                    continue

                try:
                    qdrant_Manager.upload_vectors(file_vectors, file_chunks)
                except Exception as upload_error:
                    error_messages.append(f"Error storing vectors for {file.fileName}: {str(upload_error)}")

            except Exception as e:
                error_messages.append(f"Unexpected error processing {file.fileName}: {str(e)}")

        return error_messages
