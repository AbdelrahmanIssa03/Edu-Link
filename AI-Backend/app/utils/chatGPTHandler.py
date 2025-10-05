from langchain_openai import ChatOpenAI
from app.utils import promptTemplateInstance, logsSystemInstance
from os import getenv
import time
from openai import RateLimitError, APITimeoutError, APIError, APIConnectionError

instructor_llm_key = getenv("OPENAI_API_KEY")
student_llm_key = getenv("OPENAI_API_STUDENT_KEY")

MAX_RETRIES = 5
BASE_DELAY = 1

instructor_llm = ChatOpenAI(model="gpt-4o-mini", api_key=instructor_llm_key)
student_llm = ChatOpenAI(model="gpt-4o-mini", api_key=student_llm_key)


def api_call_with_retry(func, *args, **kwargs):
    retries = 0
    while True:
        try:
            return func(*args, **kwargs)
        except RateLimitError as e:

            retries += 1
            if retries > MAX_RETRIES:
                raise
            
            delay = BASE_DELAY * (2 ** (retries - 1)) + (retries * 0.1)
            
            time.sleep(delay)

def generate_context(chunks, text, mode):
    context = ""
    if mode == "question":
        context = _generate_context_from_question(chunks, text)
    elif mode == "lecture":
        context = _generate_context_from_lecture(chunks, text)

    return context


def _generate_context_from_question(chunks, text):
    chain = promptTemplateInstance.student_question_context_prompt | student_llm
    return api_call_with_retry(chain.invoke, {"question": text, "chunks": chunks}).content


def _generate_context_from_lecture(chunks, text):
    chain = promptTemplateInstance.transcription_context_prompt | instructor_llm
    return api_call_with_retry(chain.invoke, {"transcription": text, "chunks": chunks}).content


def generate_answer(question, lecture, question_context, lecture_context):
    context_relationship = _find_relationship_with_context(
        question_context, lecture_context
    )

    non_context_relationship = _find_relationship_without_context(question, lecture)

    answer = _generate_answer_from_relationships(
        question, context_relationship, non_context_relationship
    )

    logsSystemInstance.add_question_lecture_relationship(non_context_relationship)
    logsSystemInstance.add_context_relationship(context_relationship)

    return answer


def _find_relationship_without_context(question, lecture):
    chain = promptTemplateInstance.question_lecture_relation_prompt | student_llm
    return api_call_with_retry(chain.invoke, {"transcription": lecture, "question": question}).content


def _find_relationship_with_context(question_context, lecture_context):
    chain = promptTemplateInstance.context_relation_prompt | student_llm
    return api_call_with_retry(
        chain.invoke,
        {"question_context": question_context, "lecture_context": lecture_context}
    ).content


def _generate_answer_from_relationships(
    question, context_relationship, non_context_relationship
):
    chain = promptTemplateInstance.final_answer_prompt | student_llm
    return api_call_with_retry(
        chain.invoke,
        {
            "question": question,
            "relation_question_lecture": non_context_relationship,
            "relation_contexts": context_relationship,
        }
    ).content


def generate_queries(context, mode):
    queries = []
    if mode == "question":
        queries = _generate_queries_from_question(context)
    elif mode == "lecture":
        queries = _generate_queries_from_lecture(context)

    return queries


def _generate_queries_from_question(context):
    chain = (
        promptTemplateInstance.student_question_queries_extraction_prompt | student_llm
    )
    return api_call_with_retry(chain.invoke, {"question": context}).content


def _generate_queries_from_lecture(context):
    chain = (
        promptTemplateInstance.transcription_queries_extraction_prompt | instructor_llm
    )
    return api_call_with_retry(chain.invoke, {"transcription": context}).content


def chunks_reranker(text, query, chunks, mode):
    new_chunks = []

    if mode == "question":
        new_chunks = _rerank_chunks_from_question(text, query, chunks)
    elif mode == "lecture":
        new_chunks = _rerank_chunks_from_lecture(text, query, chunks)

    return new_chunks


def _rerank_chunks_from_question(question, query, chunks):
    chain = (
        promptTemplateInstance.student_question_query_chunks_reranking_prompt
        | student_llm
    )
    return api_call_with_retry(
        chain.invoke,
        {"question": question, "query": query, "chunks": chunks}
    ).content


def _rerank_chunks_from_lecture(transcription, query, chunks):
    chain = (
        promptTemplateInstance.transcription_query_chunks_reranking_prompt
        | instructor_llm
    )
    return api_call_with_retry(
        chain.invoke,
        {"transcription": transcription, "query": query, "chunks": chunks}
    ).content
