# 🧠 Servidor de Assistência Inteligente em Rede
Projeto desenvolvido por **Gustavo Luiz Xavier Calil** -
Trabalho Avaliativo Tópicos Especiais - Projeto 01


---

## 📋 Descrição
Este projeto implementa um **servidor de IA local** utilizando o **Jetson Nano** com aceleração via **GPU CUDA**.  
O sistema recebe requisições HTTP e responde perguntas simples, simulando um assistente técnico de redes em ambiente embarcado.

---

## ⚙️ Requisitos
- Python 3.8+
- Jetson Nano Developer Kit
- CUDA + cuDNN (JetPack)
- Dependências do arquivo `requirements.txt`

---

## 🚀 Instalação
```bash
git clone https://github.com/TheXerife/projeto01.git
cd projeto01
pip install -r requirements.txt
python3 server.py
