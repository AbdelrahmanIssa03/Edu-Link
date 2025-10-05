import fitz

class FilesHandler:
    _instance = None

    def __new__(cls, *arg):
        if not cls._instance:
            cls._instance = super(FilesHandler, cls).__new__(cls)
        return cls._instance

    def extract_text_from_pdf_file_bytes(self, file_bytes):
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()

        return text

    def extract_text_from_txt_file_bytes(self, file_bytes):
        text = file_bytes.decode("utf-8")

        return text


FilesHandlerInstance = FilesHandler()
