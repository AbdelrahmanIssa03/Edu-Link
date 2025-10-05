from langchain.prompts import PromptTemplate


class PromptTemplates:
    _instance = None

    def __new__(cls, *arg):
        if not cls._instance:
            cls._instance = super(PromptTemplates, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        self.transcription_queries_extraction_prompt = PromptTemplate(
            input_variables=["transcription"],
            template="""
        You are an AI assistant helping build a semantic search system for academic content.

        Your task is to extract a set of concise, academic search queries from a transcription of a university-level lecture.
        These queries will be used for semantic search in a vector database.

        Your queries must:

        - Be strictly academic — skip greetings, casual language, or filler speech
        - Cover a diverse range of key concepts, definitions, relationships, and examples from the lecture
        - Reflect academic terminology and structure
        - Represent content from throughout the transcription
        - Be formatted as a single line, comma-separated

        If the transcription does not contain academic content, return an empty string.

        Lecture Transcription:
        {transcription}

        Extracted Academic Semantic Search Queries (comma-separated):
        """,
        )

        self.student_question_queries_extraction_prompt = PromptTemplate(
            input_variables=["question"],
            template="""
        You are an AI assistant that enhances academic search by expanding a student's question into multiple academic search queries.
        
        You will receive a question about a university-level lecture or topic. Your task is to rephrase and expand the question into a diverse list of concise, academic-style queries suitable for semantic search in a vector database.

        Your expanded queries must:
        - Use technical and academic phrasing relevant to the topic
        - Cover different angles, subtopics, keywords, and interpretations of the original question
        - Avoid casual rewordings or repetition

        If the question does not include academic content or is unclear, return an empty string.

        Student Question:
        {question}

        Expanded Academic Search Queries (comma-separated):
        """,
        )

        self.student_question_query_chunks_reranking_prompt = PromptTemplate(
            input_variables=["question", "query", "chunks"],
            template="""
            You are an AI assistant that helps answer academic questions by synthesizing content retrieved via semantic search.

            You will be given:
            - A student question (expressing their academic intent)
            - A semantic search query (automatically derived from the question)
            - A list of content chunks (retrieved from academic documents using semantic search)

            Your task is to:
            1. Carefully read the chunks and identify those that directly help answer the student’s question.
            2. Remove any chunks that are off-topic, redundant, or too vague to be useful.
            3. If at least one relevant chunk remains, write a single, clear, well-structured academic paragraph that synthesizes the relevant information to answer the student’s question.
            4. If none of the chunks are relevant, return an empty string (`""`).

            ✅ Do not list the chunks individually — integrate the information into one cohesive paragraph.  
            ✅ Maintain an academic tone and avoid bullet points or casual language.  
            ✅ Use paraphrasing to ensure smooth flow and eliminate repetition.  
            ✅ If no relevant content is found, output only an empty string.

            Student Question:  
            {question}

            Search Query:  
            {query}

            Retrieved Chunks:  
            {chunks}

            Synthesized Answer (one academic paragraph or empty string if irrelevant):
            """,
        )

        self.transcription_query_chunks_reranking_prompt = PromptTemplate(
            input_variables=["transcription", "query", "chunks"],
            template="""
        You are an AI assistant helping to extract the most important and representative content from a university-level lecture transcription.

        You will receive:
        - A list of retrieved chunks (from a vector search over lecture transcripts or notes)
        - The actual lecture transcription that is currently being delivered (partial or full)
        - The search query generated from the transcription

        Your job is to:
        1- Identify which chunks are clearly related to the lecture's current content.
        2- Remove any chunks that are off-topic, repetitive, or not helpful in understanding the lecture’s main points.
        3- Rerank the remaining chunks by how well they explain or support the key ideas discussed in the transcription.

        ✅ Only include chunks that help reinforce or summarize the core academic content of the lecture.
        ✅ Format each chunk as a single, complete academic-style sentence.
        ✅ Avoid bullets, list markers, or casual phrasing.
        ✅ Separate chunks using commas `,` (commas only, no other punctuation).

        Lecture Transcription:
        {transcription}

        Search Query:
        {query}

        Retrieved Chunks:
        {chunks}

        Filtered and Reranked Chunks (commas separated, most relevant first):
        """,
        )

        self.student_question_context_prompt = PromptTemplate(
            input_variables=["question", "chunks"],
            template="""
            You are an AI assistant supporting an intelligent learning system that processes university-level lecture content.

            You will receive:
            - A student’s academic question
            - A list of previously generated academic paragraphs. Each paragraph was synthesized from relevant content chunks retrieved to help answer the question.

            Your task is to:
            - Analyze the combined material across these paragraphs.
            - If the list is not empty, write a single academic paragraph that summarizes the full *scope of material* the question touches upon, based on what is covered in those paragraphs.
            - If no paragraphs are provided or they are not relevant, return an empty string.

            ✅ Your summary must:
            - Clearly and accurately describe the topic area implied by the content
            - Serve as a high-quality academic context for understanding or answering the question
            - Maintain an objective, formal, and logically structured tone

            ❌ Do not copy or list the input paragraphs  
            ❌ Do not include the original question  
            ❌ Do not speculate beyond the given content — stay grounded in the provided material  
            ❌ If the input is empty or irrelevant, output an empty string

            Student Question:  
            {question}

            Synthesized Paragraphs:  
            {chunks}

            Academic Context Summary (or empty string if none):
            """,
        )

        self.transcription_context_prompt = PromptTemplate(
            input_variables=["transcription", "chunks"],
            template="""
            You are an AI assistant supporting a learning system by summarizing the key academic material from a university-level lecture.

            You will receive:
            - The original transcription of the lecture (spoken form)
            - A list of filtered and reranked chunks representing the most relevant content extracted from that lecture
            - Your task is to synthesize a clear, structured, and cohesive academic context that reflects the material taught in the lecture.

            You should:
            - Rely primarily on the filtered chunks as your source of signal
            - Use the lecture transcription to refine meaning, clarify concepts, or fill in missing transitions and explanations

            ✅ The synthesized lecture context must:
            - Accurately reflect the core academic ideas and explanations from the lecture
            - Include key concepts, definitions, relationships, and examples discussed
            - Be suitable for question answering, knowledge tracking, or comparison with other lecture content
            - Maintain an academic tone, clarity, and coherence

            ❌ Do not include or reference the original transcription or chunks directly in your output
            ❌ Do not list items bullet-style — write a natural, academic summary

            Lecture Transcription:
            {transcription}

            Filtered and Reranked Chunks:
            {chunks}

            Synthesized Lecture Context:
        """,
        )

        self.question_lecture_relation_prompt = PromptTemplate(
                input_variables=["question", "transcription"],
                template="""
                You are an AI assistant analyzing the alignment between a student's academic question and the content of a university-level lecture.

                You will receive:
                - A student’s academic question
                - A lecture transcription (may be partial or complete)

                Your task is to:
                1. Determine whether the question refers to a **specific part or time** in the lecture (e.g. "earlier in the lecture", "what was said five minutes ago", "before the example", etc.).
                - If so, focus your analysis on that segment.
                - If not, evaluate the lecture transcription as a whole.

                2. Assess the relationship between the question and the lecture content, and decide on one of the following outcomes:

                ---

                ### 🔹 Relationship Categories (choose one and explain accordingly):

                #### ✅ **1. Question is related and clearly covered in the lecture**
                - The topic of the question aligns with the lecture.
                - The lecture provides direct or indirect information to answer it.
                - ✅ State: *The question is directly answerable based on the lecture content.*

                #### ⚠️ **2. Question is related to the topic but not covered in this lecture**
                - The topic is relevant to the course/lecture theme, but this lecture didn’t cover it.
                - ✅ State: *The question is related but not covered in this lecture; an answer should still be provided, based on broader understanding.*

                #### ❓ **3. Question refers to the lecture structurally but not topically**
                - Examples: “What was said 5 minutes ago?”, “What homework was assigned?”
                - ✅ State: *The question is about lecture structure or timeline, and should be answered based only on the scope implied by the question.*

                #### ❌ **4. Question is unrelated and non-academic**
                - Example: Lecture is on algorithms, question is about cooking pasta.
                - ✅ State: *The question is unrelated to the lecture or academic context and should not be answered.*

                #### 🔄 **5. Question is academic but on a different topic**
                - Example: Lecture is on recursion, question is about sorting algorithms.
                - ✅ State: *The question is valid academically but targets a different topic; answer briefly and clearly, without assuming coverage in the lecture.*

                ---

                ✅ Return a **single academic paragraph** explaining the match or mismatch clearly and instructing how the question should be handled.  
                ❌ Do not copy or restate the original question or transcription.

                Student Question:  
                {question}

                Lecture Transcription:  
                {transcription}

                Relationship Analysis:
                """,
            )

        self.context_relation_prompt = PromptTemplate(
            input_variables=["question_context", "lecture_context"],
            template="""
            You are an AI assistant analyzing the alignment between a student's learning needs and the academic content covered in a lecture.

            You will receive:
            - A **Question Context**: a synthesized academic paragraph representing the material needed to address a student's academic question. This may be empty if no relevant content was found.
            - A **Lecture Context**: a synthesized academic paragraph representing the material needed to address the lecture.

            Your task is to:
            1. First, check if the Question Context is empty.
            - If it is empty, clearly state that there is no basis to evaluate alignment and that the lecture does not cover the needed material.
            - Do not attempt to match concepts or infer relevance.

            2. If the Question Context is not empty, evaluate the alignment and determine whether the Lecture Context:
            - **Fully** covers the required material (state this and mention what is covered).
            - **Partially** covers it (state this, list what is covered and what is missing).
            - **Does not** cover it at all (state this and list the main missing points).

            ✅ Your output must be a clear and concise analytical paragraph written in academic tone.  
            ✅ Focus only on the relationship between the two contexts.  
            ❌ Do not copy or restate the original contexts.  
            ❌ Do not speculate beyond what is given in the two inputs.

            Question Context:  
            {question_context}

            Lecture Context:  
            {lecture_context}

            Context Relationship Analysis:
            """,
        )

        self.final_answer_prompt = PromptTemplate(
            input_variables=[
                "question",
                "relation_question_lecture",
                "relation_contexts",
            ],
            template="""
            You are a helpful and friendly AI assistant answering a student's academic question.

            You are given:
            - The student’s question
            - An analysis of how the question relates to the lecture transcription ("relation_question_lecture")
            - An analysis of how the material required to answer the question (question context) aligns with the content actually covered in the lecture (lecture context), labeled "relation_contexts"

            Your task is to:
            1. Carefully read the two relationship analyses.
            2. Based on both, determine which of the following categories applies:
            - ✅ The lecture fully answers the question
            - 🟡 The lecture partially answers the question
            - 🔴 The lecture does not answer the question but the topic is still related
            - ❓ The question refers to a specific time/structure of the lecture
            - ❌ The question is unrelated to the lecture or off-topic
            - 🔄 The question is academic but about a different topic than this lecture

            3. Based on the category:
            - If ❓ structural (e.g. homework, “what was said earlier”): If the lecture transcription analysis shows that the answer is clearly covered, **prioritize it** and generate a concise, direct answer using the details provided.
            - If ❌ unrelated/non-academic: **Do not attempt to answer.** Instead, tell the student that the question falls outside the scope of the lecture or academic context and should not be answered within that framework.
            - If 🔄 different academic topic: Write a **brief, helpful academic explanation** of the question, without assuming it was covered.
            - For all other categories (✅, 🟡, 🔴), write a complete answer:
                - Do not mention what was or wasn't covered in the lecture.
                - Do not say things like “the lecture discusses…” or “this wasn’t covered.”
                - Simply explain the concept or process directly, based only on available relevant content.
                - If the answer is incomplete, gently imply it with phrasing like “this typically involves…” without highlighting missing pieces.

            ✅ If the two relationship inputs conflict, **trust the transcription-level analysis** for structural or timing-based questions.
            ✅ Do not include the original question or relationship analysis in the final output.  
            ✅ Keep your tone warm and clear — as if explaining to a curious student.  
            ✅ Your answer must be natural and academic — not robotic or overly formal.

            Student Question:  
            {question}

            Relationship Between Question and Lecture Transcription:  
            {relation_question_lecture}

            Relationship Between Question Context and Lecture Context:  
            {relation_contexts}

            Final Answer to Student:
            """,
        )


promptTemplateInstance = PromptTemplates()
