import os
from app.models import LectureChunk


class LogsSystem:
    _instance = None

    def __new__(cls, *args):
        if not cls._instance:
            cls._instance = super(LogsSystem, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        self.lecture_chunks_index = 0
        self.lecture_chunk_path = None
        self.question_path = None
        self.chunk_json_file = None
        os.makedirs("app/assets/logs", exist_ok=True)

    def create_new_lecture_txt_file(self):
        self.lecture_chunk_path = f"app/assets/logs/lecture_chunks/log_lecture_chunk{self.lecture_chunks_index}.txt"

        self.chunk_json_file = LectureChunk(
            lecture_chunk_index=self.lecture_chunks_index,
            lecture_chunk_path=self.lecture_chunk_path,
        )

        with open(self.lecture_chunk_path, "w", encoding="utf-8") as f:
            pass

    def create_new_question_txt_file(self, question):
        safe_question = (
            "".join(c if c.isalnum() or c in (" ", "_") else "_" for c in question)
            .strip()
            .replace(" ", "_")
        )
        self.question_path = f"app/assets/logs/questions/log_{safe_question}.txt"
        with open(self.question_path, "w", encoding="utf-8") as f:
            pass

    def _append_to_file(self, path, title, content):
        with open(path, "a", encoding="utf-8") as f:
            f.write(f"\n\n===== {title.upper()} =====\n")
            if isinstance(content, list):
                for item in content:
                    f.write(str(item).strip() + "\n")
            else:
                f.write(str(content).strip() + "\n")

    def add_question(self, question):
        self._append_to_file(self.question_path, "Question", question)

    def add_question_queiries(self, queries):
        self._append_to_file(self.question_path, "Question Queries", queries)

    def add_question_chunks(self, query, chunks):
        self._append_to_file(self.question_path, f"{query} Chunks", chunks)

    def add_question_reranked_chunks(self, query, chunks):
        self._append_to_file(self.question_path, f"{query} Reranked Chunks", chunks)

    def add_question_context(self, context):
        self._append_to_file(self.question_path, "Question Context", context)

    def add_question_lecture_relationship(self, lecture_relationship):
        self._append_to_file(
            self.question_path, "Lecture Relationship", lecture_relationship
        )

    def add_context_relationship(self, context_relationship):
        self._append_to_file(
            self.question_path, "Context Relationship", context_relationship
        )

    def add_question_answer(self, answer):
        self._append_to_file(self.question_path, "Answer", answer)

    def add_transcription(self, transcription):
        self.chunk_json_file.transcription = transcription
        self._append_to_file(self.lecture_chunk_path, "Transcription", transcription)

    def add_lecture_queries(self, queries):
        self.chunk_json_file.queries = queries
        self._append_to_file(self.lecture_chunk_path, "Lecture Queries", queries)

    def add_lecture_chunks(self, query, chunks):
        self._append_to_file(self.lecture_chunk_path, f"{query} Chunks", chunks)

    def add_lecture_reranked_chunks(self, query, chunks):
        self.chunk_json_file.reranked_chunks[query] = chunks
        self._append_to_file(
            self.lecture_chunk_path, f"{query} Reranked Chunks", chunks
        )

    def add_lecture_context(self, context):
        self.chunk_json_file.lecture_context = context
        self._append_to_file(self.lecture_chunk_path, "Lecture Context", context)

    def close_lecture_chunk_file(self):
        self.chunk_json_file.parse_to_json()
        self.lecture_chunks_index += 1


logsSystemInstance = LogsSystem()
