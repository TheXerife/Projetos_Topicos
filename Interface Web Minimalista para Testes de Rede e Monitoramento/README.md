# Network Diagnostics & System Monitor

Uma ferramenta web interativa e minimalista para diagnóstico de rede e monitoramento de sistema em tempo real. Desenvolvida para projetos de infraestrutura de rede do IFMT.

## Características

A aplicação oferece **9 ferramentas principais** de diagnóstico e monitoramento:

| Ferramenta | Descrição |
|-----------|-----------|
| **Speed Test** | Teste de velocidade de download para análise de largura de banda |
| **Public IP** | Detecção do endereço IP público da conexão |
| **Local IP** | Exibição do endereço IP local da máquina |
| **Latency (Ping)** | Teste de latência com estatísticas (min/avg/max/loss) |
| **Traceroute** | Mapeamento de rota até o gateway/servidor remoto |
| **CPU Status** | Monitoramento de uso de processador em tempo real |
| **Memory** | Visualização de uso de memória RAM com gráfico de progresso |
| **GPU Status** | Monitoramento de GPU (NVIDIA) com temperatura |
| **Network Info** | Listagem de interfaces de rede com IPs e MACs |

## Tecnologia

O projeto utiliza uma arquitetura moderna full-stack:

**Frontend:**
- React 19 com TypeScript
- Tailwind CSS 4 para estilização minimalista
- Lucide React para ícones
- Interface otimizada para telas touch

**Backend:**
- Express 4 com tRPC 11
- Node.js com utilitários do sistema operacional
- APIs públicas para testes de velocidade e IP

**Banco de Dados:**
- MySQL/TiDB com Drizzle ORM
- Autenticação via Manus OAuth

## Instalação

### Pré-requisitos

- Node.js 22+ e pnpm
- Ubuntu/Linux (para comandos de rede como `ping` e `traceroute`)
- MySQL 8+ ou TiDB (opcional, para persistência de dados)

### Passos de Instalação

1. **Clone o repositório:**
```bash
git clone <seu-repositorio>
cd network_diagnostics_tool
```

2. **Instale as dependências:**
```bash
pnpm install
```

3. **Configure as variáveis de ambiente:**
```bash
# Crie um arquivo .env.local na raiz do projeto
cp .env.example .env.local
```

4. **Inicie o servidor de desenvolvimento:**
```bash
pnpm dev
```

A aplicação estará disponível em `http://localhost:3000`

## Uso

### Página Inicial

Acesse a página inicial que apresenta um resumo das funcionalidades e um botão para acessar o painel de diagnósticos.

### Painel de Diagnósticos

Clique em **"Launch Diagnostics"** para acessar o painel com as 9 ferramentas:

1. **Executar testes individuais:** Clique em qualquer botão para executar o teste correspondente
2. **Auto-refresh:** Ative o toggle "Auto-refresh ON" para monitorar CPU, GPU e memória a cada 2 segundos
3. **Visualizar resultados:** Os resultados aparecem em cards abaixo de cada botão

### Otimização para Telas Touch

A interface foi desenvolvida com:
- Botões grandes e espaçados para fácil toque
- Feedback visual imediato
- Sem elementos que exigem hover
- Responsiva em todos os tamanhos de tela

## Estrutura do Projeto

```
network_diagnostics_tool/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx           # Página inicial
│   │   │   └── Diagnostics.tsx    # Painel de diagnósticos
│   │   ├── components/            # Componentes reutilizáveis
│   │   ├── lib/
│   │   │   └── trpc.ts           # Cliente tRPC
│   │   └── App.tsx               # Roteamento
│   └── public/                   # Arquivos estáticos
├── server/                 # Backend Express
│   ├── diagnostics.ts      # Lógica de diagnóstico
│   ├── routers.ts          # Rotas tRPC
│   └── db.ts               # Helpers de banco de dados
├── drizzle/                # Schema do banco de dados
│   └── schema.ts           # Definição de tabelas
└── package.json            # Dependências do projeto
```

## Desenvolvimento

### Adicionar Nova Ferramenta de Diagnóstico

1. **Adicione a função em `server/diagnostics.ts`:**
```typescript
export async function myNewTool(): Promise<MyResult> {
  // Implementação
  return result;
}
```

2. **Crie a rota tRPC em `server/routers.ts`:**
```typescript
myNewTool: publicProcedure.query(async () => {
  const result = await myNewTool();
  return result;
}),
```

3. **Adicione o card na página `client/src/pages/Diagnostics.tsx`:**
```tsx
<Card className="bg-slate-800 border-slate-700 p-6">
  {/* Implementação do card */}
</Card>
```

### Executar em Produção

Para executar em produção no Ubuntu:

```bash
# Build da aplicação
pnpm build

# Iniciar servidor de produção
pnpm start
```

## Requisitos de Sistema

Para que todas as ferramentas funcionem corretamente:

- **Ping/Traceroute:** Requer privilégios de rede (geralmente funcionam sem sudo)
- **GPU (NVIDIA):** Requer `nvidia-smi` instalado (opcional)
- **Speed Test:** Requer conexão com internet
- **IP Público:** Requer acesso à API `ipify.org`

## Troubleshooting

### Ping/Traceroute não funcionam
```bash
# Verifique se os comandos estão disponíveis
which ping
which traceroute

# Se não estiverem, instale:
sudo apt-get install iputils-ping traceroute
```

### GPU não detectada
```bash
# Verifique se nvidia-smi está instalado
nvidia-smi

# Se não estiver, instale os drivers NVIDIA
# Visite: https://www.nvidia.com/Download/driverDetails.aspx
```

### Erro de conexão com banco de dados
Verifique a variável `DATABASE_URL` no arquivo `.env.local` e certifique-se de que o servidor MySQL está rodando.

## Hospedagem no Git

Para hospedar este projeto no GitHub/GitLab:

1. **Crie um repositório vazio:**
```bash
git init
git add .
git commit -m "Initial commit: Network Diagnostics & System Monitor"
git branch -M main
git remote add origin <seu-repositorio-url>
git push -u origin main
```

2. **Configure o `.gitignore`** (já incluído):
```
node_modules/
.env.local
dist/
build/
```

3. **Adicione um GitHub Actions workflow** (opcional):
Crie `.github/workflows/ci.yml` para testes e build automáticos.

## Licença

Desenvolvido para IFMT - Instituto Federal de Mato Grosso

## Contribuições

Para contribuir com melhorias:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Suporte

Para dúvidas ou problemas, abra uma issue no repositório ou entre em contato com a equipe de desenvolvimento do IFMT.
