# 🐾 Bot da FURIA no Telegram

Este projeto é um bot desenvolvido com foco nos fãs da **FURIA Esports**, que desejam acompanhar de forma rápida e prática as principais informações sobre o time de **CS** diretamente pelo **Telegram**.

## 🎯 Objetivo

Fornecer uma forma interativa, automatizada e em tempo real para os torcedores acessarem conteúdos como:

- 📰 Últimas notícias da equipe  
- 🧑‍🤝‍🧑 Elenco atual  
- 📈 Ranking mundial e da Valve  
- 🗓️ Partidas recentes e futuras  
- 🛒 Acesso direto à loja oficial da FURIA  

## ⚙️ Como funciona

O bot foi desenvolvido utilizando a biblioteca **[Telegraf](https://telegraf.js.org/)** para integração com o Telegram e o **[Puppeteer](https://pptr.dev/)** para realizar **web scraping** no site da **[HLTV.org](https://www.hltv.org/)**, capturando e processando as informações mais recentes sobre a equipe.

[DOCUMENTAÇÃO TÉCNICA](https://drive.google.com/file/d/1QLe1zRTa5mzox11iVcJ0DIeeTFEKbpfg/view?usp=drive_link)

O usuário interage com o bot por meio de comandos e botões no chat do Telegram, recebendo respostas automatizadas com os dados atualizados em tempo real.

## 📌 Funcionalidades

| Comando         | Descrição                                                                      |
|-----------------|----------------------------------------------------------------------------------|
| `/elenco`       | Mostra os jogadores atuais da FURIA.                                            |
| `/ranking`      | Mostra o ranking atual da equipe (HLTV e Valve).                                |
| `/partidas`     | Lista os últimos confrontos e próximos jogos agendados.                         |
| `/noticias`     | Exibe as manchetes mais recentes envolvendo a FURIA.                            |
| `/loja`         | Fornece link direto para a loja oficial da equipe.                              |
| 🔔 Notificações | inscreve o usuario para receber notificações das mensagens |

## 🧠 Tecnologias principais

- 🟩 **Node.js** – Ambiente de execução JavaScript.  
- 🤖 **Telegraf** – Framework para criação de bots no Telegram.  
- 🕷️ **Puppeteer** – Biblioteca para automação de navegação e extração de dados da web.  

## 🎥 Demonstração

[VÍDEO DEMONSTRAÇÃO](https://drive.google.com/file/d/13S-oWuSBgOOkH_FNTa8G1yNSJab7R3VT/view?usp=drive_link)
