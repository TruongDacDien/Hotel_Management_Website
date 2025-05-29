from flask import Flask, request, jsonify
from db import get_available_rooms
from chatbot import ask_gemini

app = Flask(__name__)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    question = data.get("message", "")
    if not question:
        return jsonify({"error": "Câu hỏi không được để trống."}), 400

    rooms = get_available_rooms()
    answer = ask_gemini(rooms, question)
    return jsonify({"reply": answer})

if __name__ == "__main__":
    app.run(debug=True, port=5001)
