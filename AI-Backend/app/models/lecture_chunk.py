import json


class LectureChunk:
    def __init__(
        self,
        lecture_chunk_index=0,
        lecture_chunk_path="None",
        transcription="None",
        queries= list(),
        reranked_chunks=dict(),
        lecture_context="",
    ):
        self._lecture_chunk_index = lecture_chunk_index
        self._lecture_chunk_path = lecture_chunk_path
        self._transcription = transcription
        self._queries = queries
        self._reranked_chunks = reranked_chunks
        self._lecture_context = lecture_context

    @property
    def lecture_chunk_index(self):
        return self._lecture_chunk_index

    @lecture_chunk_index.setter
    def lecture_chunk_index(self, value):
        self._lecture_chunk_index = value

    @property
    def lecture_chunk_path(self):
        return self._lecture_chunk_path

    @lecture_chunk_path.setter
    def lecture_chunk_path(self, value):
        self._lecture_chunk_path = value

    @property
    def transcription(self):
        return self._transcription

    @transcription.setter
    def transcription(self, value):
        self._transcription = value

    @property
    def queries(self):
        return self._queries

    @queries.setter
    def queries(self, value):
        self._queries = value

    @property
    def reranked_chunks(self):
        return self._reranked_chunks

    @reranked_chunks.setter
    def reranked_chunks(self, value):
        self._reranked_chunks = value

    @property
    def lecture_context(self):
        return self._lecture_context

    @lecture_context.setter
    def lecture_context(self, value):
        self._lecture_context = value

    def parse_to_json(self):
        with open(
            f"app/assets/json/lecutre_chunk{self.lecture_chunk_index}.json",
            "w",
            encoding="utf-8",
        ) as f:
            json.dump(self.__dict__, f, indent=4)
