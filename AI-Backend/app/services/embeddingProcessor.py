from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import TokenTextSplitter
from app.utils import FilesHandlerInstance


class EmbeddingsProcessor:
    _instance = None

    def __new__(cls, *arg):
        if not cls._instance:
            cls._instance = super(EmbeddingsProcessor, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        self.embeddings = OpenAIEmbeddings(model="text-embedding-3-large")
        self.text_splitter = TokenTextSplitter(chunk_size=1000, chunk_overlap=200)
        return

    def chunk_file(self, file):
        chunks = []

        text = FilesHandlerInstance.extract_text_from_pdf_file_bytes(
            file["file_content"]
        )
        chunks.extend(self.text_splitter.split_text(text))

        return chunks

    def embed_file_to_vectors(self, chunks, batch_size=100):
        all_embeddings = []

        for i in range(0, len(chunks), batch_size):
            batch = chunks[i:i + batch_size]
            vectors = self.embeddings.embed_documents(batch)
            all_embeddings.extend(vectors)
        
        return all_embeddings

    def embed_text_to_vector(self, text):
        return self.embeddings.embed_query(text)


EmbeddingsProcessorInstance = EmbeddingsProcessor()
