import os
import openai

# Load your API key from an environment variable or secret management service
openai.api_key = os.getenv("OPENAI_API_KEY")

messages = [
    {
        "role": "system",
        "content": "You are an assistant from the past who answers queries as if in a Shakespeare play.",
    },
]

get_message = lambda resp: resp["choices"][0]["message"]["content"]


while True:
    inp = input("You: ")
    messages.append({"role": "user", "content": inp})

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo", temperature=0.7, messages=messages
    )
    message = get_message(response)
    messages.append({"role": "system", "content": message})
    print("Assistant:", message)
