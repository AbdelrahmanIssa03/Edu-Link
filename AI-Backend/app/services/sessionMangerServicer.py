from app.gRPC import service_pb2_grpc, service_pb2
from app.utils import generate_queries, chunks_reranker, logsSystemInstance
from app.services import QdrantManager, transcriberInstance, answerGeneratorInstance
from concurrent.futures import ThreadPoolExecutor, as_completed
import time


class SessionManagerServicer(service_pb2_grpc.SessionManagerServicer):
    def SendAudio(self, request, context):
        error_messages = []

        try:
            audio_bytes = request.audioData
            class_name = request.className

            if not audio_bytes:
                raise ValueError("No audio data received.")

            logsSystemInstance.create_new_lecture_txt_file()

            transcription = transcriberInstance.transcribe_audio_bytes(
                audio_bytes, class_name
            )

            answerGeneratorInstance.append_transcription(transcription)

        except Exception as e:
            print("Error in SendAudio:", str(e))
            error_messages.append(str(e))

        logsSystemInstance.close_lecture_chunk_file()
        return service_pb2.SendAudioResponse(
            success=len(error_messages) == 0, errorMessages=error_messages
        )

    def SendQuestion(self, request, context):
        error_messages = []
        question_material = []
        qdrant_Manager = QdrantManager(collection_name=request.className)

        queries = generate_queries(request.question, "question").split(",")
        queries = [q.strip() for q in queries if q.strip()]

        logsSystemInstance.create_new_question_txt_file(request.question)
        logsSystemInstance.add_question(request.question)
        logsSystemInstance.add_question_queiries(queries)

        if len(queries) != 0:
            with ThreadPoolExecutor(max_workers=len(queries)) as executor:
                future_to_query = {
                    executor.submit(
                        self._process_query_concurrently,
                        query,
                        request.question,
                        qdrant_Manager,
                    ): query
                    for query in queries
                }
                for future in as_completed(future_to_query):
                    result_chunks = future.result()
                    question_material.extend(result_chunks)

        answer = answerGeneratorInstance.generate_answer_offline(
            request.question, question_material
        )

        logsSystemInstance.add_question_answer(answer)
        return service_pb2.SendQuestionResponse(
            success=len(error_messages) == 0,
            errorMessages=error_messages,
            answer=answer,
        )

    def _process_query_concurrently(self, query, question, qdrant_Manager):
        search_results = qdrant_Manager.search_vectors(query=query, top_k=10)
        logsSystemInstance.add_question_chunks(
            query,
            [f"ID: {result.id}, Score: {result.score}" for result in search_results],
        )

        max_retries = 3
        retry_count = 0
        
        while retry_count < max_retries:
            try:
                filtered_results = chunks_reranker(
                    text=question,
                    query=query,
                    chunks=[result.payload["text"] for result in search_results],
                    mode="question",
                )
                logsSystemInstance.add_question_reranked_chunks(query, filtered_results)
                return filtered_results

            except Exception as e:
                retry_count += 1
                if retry_count >= max_retries:

                    logsSystemInstance.add_question_reranked_chunks(
                        query, [f"Error after {max_retries} retries: {str(e)}"]
                    )

                    return [f"Failed to process query '{query}' after multiple attempts."]
                    
                sleep_time = 2 ** retry_count
                logsSystemInstance.add_question_reranked_chunks(
                    query, [f"Retry {retry_count}/{max_retries}: {str(e)}. Waiting {sleep_time}s..."]
                )
                time.sleep(sleep_time)
