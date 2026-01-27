from openai import OpenAI
from typing import Generator
from ..config import get_settings
from ..prompts.system import SYSTEM_PROMPT, RAG_CONTEXT_TEMPLATE
from .rag_service import query_documents

settings = get_settings()


def create_chat_completion(
    messages: list[dict],
    stream: bool = True
) -> Generator[str, None, None] | str:
    """
    Create a chat completion with RAG context.
    """
    client = OpenAI(api_key=settings.openai_api_key)

    # Get the last user message for RAG query
    user_message = ""
    for msg in reversed(messages):
        if msg["role"] == "user":
            user_message = msg["content"]
            break

    # Query RAG for relevant context
    rag_context = query_documents(user_message)

    # Build system message with optional RAG context
    system_content = SYSTEM_PROMPT
    if rag_context:
        system_content += "\n\n" + RAG_CONTEXT_TEMPLATE.format(context=rag_context)

    # Prepare messages with system prompt
    full_messages = [
        {"role": "system", "content": system_content},
        *messages
    ]

    if stream:
        response = client.chat.completions.create(
            model=settings.model_name,
            messages=full_messages,
            stream=True,
            temperature=0.7,
            max_tokens=1500
        )

        for chunk in response:
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content
    else:
        response = client.chat.completions.create(
            model=settings.model_name,
            messages=full_messages,
            stream=False,
            temperature=0.7,
            max_tokens=1500
        )
        return response.choices[0].message.content
