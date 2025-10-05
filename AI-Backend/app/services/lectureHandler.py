from app.services import QdrantManager
from app.utils import (
    generate_context,
    generate_queries,
    chunks_reranker,
    logsSystemInstance,
)
from concurrent.futures import ThreadPoolExecutor, as_completed
import time


class LectureHandler:
    def __init__(self, className):
        self.qdrant_Manager = QdrantManager(collection_name=className)
        self.transcription = ""
        self.context = ""

    def add_transcription(self, transcription):
        self.transcription += transcription
        logsSystemInstance.add_transcription(self.transcription)

        self.context = self._create_lecture_context()
        logsSystemInstance.add_lecture_context(self.context)

    def _process_query_concurrently(self, query, transcription, qdrant_Manager):

        search_results = qdrant_Manager.search_vectors(query=query, top_k=10)
        logsSystemInstance.add_lecture_chunks(
            query,
            [f"ID: {result.id}, Score: {result.score}" for result in search_results],
        )

        while True:
            try:
                filtered_results = chunks_reranker(
                    text=transcription,
                    query=query,
                    chunks=[result.payload["text"] for result in search_results],
                    mode="lecture",
                )
                logsSystemInstance.add_lecture_reranked_chunks(query, filtered_results)
                return filtered_results

            except Exception as e:
                time.sleep(10)

    def _create_lecture_context(self):
        queries = generate_queries(self.transcription, "lecture").split(",")
        queries = [q.strip() for q in queries if q.strip()]
        logsSystemInstance.add_lecture_queries(queries)

        print("Lecture queries:", len(queries))

        lecture_material = []

        if len(queries) != 0:
            with ThreadPoolExecutor(max_workers=len(queries)) as executor:
                future_to_query = {
                    executor.submit(
                        self._process_query_concurrently,
                        query,
                        self.transcription,
                        self.qdrant_Manager,
                    ): query
                    for query in queries
                }
                for future in as_completed(future_to_query):
                    result_chunks = future.result()
                    lecture_material.extend(result_chunks)

        return generate_context(lecture_material, self.transcription, "lecture")
