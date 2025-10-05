from app.utils import generate_context, generate_answer, logsSystemInstance
from app.services import LectureHandler
from app.models import LectureChunk
import json
import os
import glob


class AnswerGenerator:
    _instance = None

    def __new__(cls, *arg):
        if not cls._instance:
            cls._instance = super(AnswerGenerator, cls).__new__(cls)
        return cls._instance

    def add_lecture(self, className):
        self.lecture = LectureHandler(className)

    def append_transcription(self, transcription):
        self.lecture.add_transcription(transcription)

    def generate_answer(self, question, question_material):
        question_context = generate_context(question_material, question, "question")
        logsSystemInstance.add_question_context(question_context)

        return generate_answer(
            question, self.lecture.transcription, question_context, self.lecture.context
        )

    def generate_answer_offline(self, question, question_material):
        question_context = generate_context(question_material, question, "question")
        logsSystemInstance.add_question_context(question_context)

        with open("app/assets/json/lecutre_chunk36.json", "r", encoding="utf-8") as f:
            data = json.load(f)

        lecture_chunk = LectureChunk(
            lecture_chunk_index=data.get("_lecture_chunk_index"),
            lecture_chunk_path=data.get("_lecture_chunk_path"),
            transcription=data.get("_transcription"),
            queries=data.get("_queries"),
            reranked_chunks=data.get("_reranked_chunks"),
            lecture_context=data.get("_lecture_context"),
        )

        return generate_answer(
            question,
            lecture_chunk.transcription,
            question_context,
            lecture_chunk._lecture_context,
        )


answerGeneratorInstance = AnswerGenerator()
answerGeneratorInstance.add_lecture("MyClass")
