from flask import Flask, render_template, request, jsonify
from modules import system_info, tools
import webview
import threading

app = Flask(__name__)

# ========================
# ROTAS DE INTERFACE
# ========================

@app.route('/')
def index():
    # Página principal com dashboard de status
    return render_template('index.html', title='Dashboard • Painel Jetson', active='dashboard')

@app.route('/tools')
def tools_page():
    # Página com ferramentas (ping, base64, QR)
    return render_template('tools.html', title='Ferramentas • Painel Jetson', active='tools')

# ========================
# ROTAS DE API (BACKEND)
# ========================

@app.route('/api/status')
def status():
    """Retorna status do sistema (CPU, RAM, Temperatura, etc)."""
    return jsonify(system_info.get_system_status())

@app.route('/api/ping', methods=['POST'])
def ping():
    """Executa um teste de ping."""
    data = request.get_json()
    host = data.get('host')
    result = tools.ping_host(host)
    return jsonify({"result": result})

@app.route('/api/base64', methods=['POST'])
def base64_tool():
    """Codifica ou decodifica texto em Base64."""
    data = request.get_json()
    text = data.get('text')
    mode = data.get('mode')
    if not text:
        return jsonify({"error": "Texto não fornecido."}), 400

    if mode == "encode":
        return jsonify({"result": tools.encode_base64(text)})
    elif mode == "decode":
        return jsonify({"result": tools.decode_base64(text)})
    else:
        return jsonify({"error": "Modo inválido."}), 400

@app.route('/api/qr', methods=['POST'])
def qr():
    """Gera um QR Code a partir do texto enviado."""
    data = request.get_json()
    text = data.get('text')
    return tools.generate_qr(text)

# ========================
# INICIALIZAÇÃO DO WEBVIEW
# ========================

def start_webview():
    """Abre o painel em modo fullscreen via PyWebView."""
    webview.create_window(
        title='Painel Jetson',
        url='http://127.0.0.1:5000',
        fullscreen=True,
        easy_drag=False,
        confirm_close=True
    )
    webview.start()

# ========================
# MAIN
# ========================

if __name__ == '__main__':
    # Thread separada para o PyWebView
    t = threading.Thread(target=start_webview)
    t.daemon = True
    t.start()

    # Inicia o servidor Flask
    app.run(host='0.0.0.0', port=5000, debug=False)
