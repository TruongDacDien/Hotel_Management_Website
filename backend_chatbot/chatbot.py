import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-pro")

def ask_gemini(rooms_data, user_question):
    rooms_text = "\n".join([f"- {r['name']} ({r['price']} VND)" for r in rooms_data])
    prompt = f"""
Dữ liệu các phòng khách sạn còn trống:
{rooms_text}

Câu hỏi khách hàng: "{user_question}"

Vui lòng trả lời một cách thân thiện, rõ ràng và chính xác dựa vào thông tin trên.
"""
    response = model.generate_content(prompt)
    return response.text
