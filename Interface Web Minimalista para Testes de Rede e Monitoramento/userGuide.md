# Network Diagnostics & System Monitor - Guia de Uso

## Bem-vindo

O **Network Diagnostics & System Monitor** é uma ferramenta web moderna para análise de rede e monitoramento de sistema em tempo real. Esta página guia você através de todos os recursos disponíveis.

## Powered by Manus

Este projeto foi desenvolvido com tecnologia de ponta:

**Frontend:** React 19 + TypeScript + Tailwind CSS 4 + Lucide React para uma interface moderna e responsiva.

**Backend:** Express 4 + tRPC 11 + Node.js com APIs de diagnóstico de sistema.

**Banco de Dados:** MySQL/TiDB com Drizzle ORM para persistência de dados.

**Autenticação:** Manus OAuth integrado para segurança.

**Deployment:** Auto-scaling infrastructure com global CDN para máxima performance e disponibilidade.

## Usando Sua Ferramenta de Diagnóstico

### Página Inicial

Ao acessar a aplicação, você verá a página inicial com:

- **Título:** "Network Diagnostics & System Monitor"
- **Descrição:** Resumo das funcionalidades
- **Lista de Features:** Quatro principais categorias de ferramentas
- **Botão "Launch Diagnostics":** Clique para acessar o painel completo

### Painel de Diagnósticos

O painel apresenta **9 ferramentas** organizadas em um grid responsivo:

#### 1. Speed Test (Teste de Velocidade)
- **Ícone:** ⚡ Amarelo
- **Função:** Mede a velocidade de download em Mbps
- **Como usar:** Clique em "Run Test" e aguarde o resultado
- **Resultado:** Exibe velocidade de download em Mbps

#### 2. Public IP (IP Público)
- **Ícone:** 🌐 Verde
- **Função:** Detecta seu endereço IP público
- **Como usar:** Clique em "Check IP"
- **Resultado:** Mostra seu IP externo visível na internet

#### 3. Local IP (IP Local)
- **Ícone:** 📶 Roxo
- **Função:** Mostra o IP local da sua máquina
- **Como usar:** Clique em "Get Local IP"
- **Resultado:** Exibe IP da rede local (ex: 192.168.x.x)

#### 4. Latency (Latência/Ping)
- **Ícone:** 📊 Vermelho
- **Função:** Testa latência até servidores remotos
- **Como usar:** Clique em "Test Latency"
- **Resultado:** Mostra Avg, Min, Max em ms e % de perda de pacotes

#### 5. Traceroute (Rastreamento de Rota)
- **Ícone:** 📈 Laranja
- **Função:** Mapeia a rota até o servidor remoto
- **Como usar:** Clique em "Run Traceroute"
- **Resultado:** Lista cada "hop" (salto) com IP e tempo de resposta

#### 6. CPU Status (Status da CPU)
- **Ícone:** ⚙️ Ciano
- **Função:** Monitora uso do processador
- **Como usar:** Clique em "Check CPU"
- **Resultado:** Exibe percentual de uso, número de cores e modelo

#### 7. Memory (Memória RAM)
- **Ícone:** 💾 Rosa
- **Função:** Monitora uso de memória
- **Como usar:** Clique em "Check Memory"
- **Resultado:** Mostra percentual, MB usado/total e barra de progresso visual

#### 8. GPU Status (Status da GPU)
- **Ícone:** ⚡ Índigo
- **Função:** Monitora GPU NVIDIA (se disponível)
- **Como usar:** Clique em "Check GPU"
- **Resultado:** Exibe uso, memória e temperatura (ou "GPU not available")

#### 9. Network Info (Informações de Rede)
- **Ícone:** 🌐 Verde-limão
- **Função:** Lista todas as interfaces de rede
- **Como usar:** Clique em "Show Interfaces"
- **Resultado:** Mostra nome, IP e MAC de cada interface

### Recursos Especiais

#### Auto-Refresh
Na parte superior do painel, encontre o toggle **"Auto-refresh"**:

- **OFF (padrão):** Você executa cada teste manualmente
- **ON:** CPU, GPU e memória atualizam automaticamente a cada 2 segundos

**Como usar:** Clique no botão para ativar/desativar. Ideal para monitoramento contínuo durante testes de rede.

#### Visualização de Resultados
Cada ferramenta exibe resultados em um card com:

- **Ícone colorido:** Identifica a ferramenta
- **Botão de ação:** Executa o teste
- **Indicador de carregamento:** Mostra quando o teste está em andamento
- **Área de resultado:** Exibe os dados quando prontos

## Gerenciando Sua Ferramenta

### Acessar o Painel de Controle

Clique no ícone de menu (☰) no canto superior direito para acessar:

- **Settings:** Configure nome, logo e visibilidade
- **Secrets:** Gerencie variáveis de ambiente (se necessário)
- **Database:** Acesse dados persistidos (se aplicável)
- **Dashboard:** Visualize analytics e status

### Otimização para Telas Touch

A interface foi desenvolvida especificamente para telas touch:

- **Botões grandes:** Fáceis de tocar com dedos
- **Espaçamento:** Espaço suficiente entre elementos
- **Sem hover:** Todos os elementos funcionam com toque
- **Feedback visual:** Cores e animações indicam ações

## Próximos Passos

**Fale com o Manus AI a qualquer momento para solicitar mudanças ou adicionar novas funcionalidades.**

Sugestões de melhorias:
- Adicionar gráficos históricos de performance
- Exportar resultados em PDF
- Agendamento de testes automáticos
- Alertas de limites de performance
- Comparação de resultados ao longo do tempo

Comece executando um teste de velocidade ou verificando seu IP público para explorar todas as capacidades da ferramenta!
