import io
import openai
import os

openai.api_key = os.getenv("OPENAI_API_KEY")


class AudioTranscriber:
    _instance = None

    def __new__(cls, *arg):
        if not cls._instance:
            cls._instance = super(AudioTranscriber, cls).__new__(cls)
        return cls._instance

    def transcribe_audio_bytes(self, audio_bytes, file_name):
        audio_file = io.BytesIO(audio_bytes)
        audio_file.name = file_name + ".wav"

        transcript = openai.audio.transcriptions.create(
            model="whisper-1", file=audio_file, response_format="text"
        )
        return transcript


transcriberInstance = AudioTranscriber()
