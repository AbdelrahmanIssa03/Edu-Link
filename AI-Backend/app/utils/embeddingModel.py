from sentence_transformers import SentenceTransformer
from langchain.embeddings.base import Embeddings
from transformers import AutoTokenizer, AutoModel
import torch


class EmbeddingModel(Embeddings):
    def __init__(self, model_name):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model_name = model_name
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
            torch.cuda.reset_peak_memory_stats()

    def load_model(self):
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        self.model = AutoModel.from_pretrained(self.model_name)
        self.model.to(self.device)

    def save_model(self):
        save_dir = f"app/utils/models/{self.model_name}"
        self.tokenizer.save_pretrained(save_dir)
        self.model.save_pretrained(save_dir)

    def embed_documents(self, texts):
        return [self._embed(text, prefix="passage: ") for text in texts]

    def embed_query(self, text):
        return self._embed(text, prefix="query: ")

    def _embed(self, text, prefix):
        input_text = prefix + text
        inputs = self.tokenizer(
            input_text, return_tensors="pt", truncation=True, padding=True
        ).to(self.device)
        with torch.no_grad():
            outputs = self.model(**inputs)
        embeddings = outputs[:, 0]
        return embeddings.squeeze(0).cpu().numpy()
