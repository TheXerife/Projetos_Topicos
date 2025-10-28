from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch, datetime, json

app = Flask(__name__)

# Carregar configurações
config = json.load(open("config.json"))
model_name = config.get("model", "microsoft/phi-1_5")

# Carregar modelo na GPU
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name).to("cuda")

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    prompt = data.get("msg", "")
    inputs = tokenizer(prompt, return_tensors="pt").to("cuda")
    outputs = model.generate(**inputs, max_length=80)
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    
    # Logar requisição
    with open("logs/exec.log", "a") as f:
        f.write(f"{datetime.datetime.now()} | {prompt} -> {response}\n")
    
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(host=config.get("host", "0.0.0.0"), port=config.get("port", 5000))
