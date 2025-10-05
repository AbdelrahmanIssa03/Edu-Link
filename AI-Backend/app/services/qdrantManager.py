import os
from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient, models
from qdrant_client.http.models import Distance, VectorParams
from app.services import EmbeddingsProcessorInstance
import time

QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
QDRANT_URL = os.getenv("QDRANT_URL")


class QdrantManager:

    def __init__(self, collection_name):
        self.collection_name = collection_name
        # Set longer timeouts to prevent timeout issues with large files
        self.client = QdrantClient(
            url=QDRANT_URL, 
            api_key=QDRANT_API_KEY,
            timeout=300  # 5-minute timeout
        )

        if not self.client.collection_exists(collection_name):
            self._create_collection(collection_name)

    def _create_collection(self, collection_name):
        self.client.create_collection(
            collection_name=collection_name,
            vectors_config=VectorParams(size=3072 , distance=Distance.COSINE),
        )

    def _delete_collection(self, collection_name):
        self.client.delete_collection(collection_name)

    def upload_vectors(self, file_embeddings, file_chunks, batch_size=100):
        total_vectors = len(file_embeddings)
        
        for i in range(0, total_vectors, batch_size):
            batch_end = min(i + batch_size, total_vectors)
            
            batch_vectors = []
            for j in range(i, batch_end):
                batch_vectors.append({
                    "id": j,
                    "vector": file_embeddings[j],
                    "payload": {"text": file_chunks[j]},
                })
            
            max_retries = 3
            for retry in range(max_retries):
                try:
                    self.client.upsert(
                        collection_name=self.collection_name,
                        points=batch_vectors,
                        wait=True
                    )
                    break
                except Exception as e:
                    if retry < max_retries - 1:
                        wait_time = 2 ** retry
                        print(f"Upload failed, retrying in {wait_time} seconds... Error: {e}")
                        time.sleep(wait_time)
                    else:
                        print(f"All retries failed for batch {i//batch_size + 1}")
                        raise

    def search_vectors(self, query, top_k=10):
        query = EmbeddingsProcessorInstance.embed_text_to_vector(query)
        search_results = self.client.search(
            collection_name=self.collection_name,
            query_vector=query,
            limit=top_k,
        )
        return search_results
