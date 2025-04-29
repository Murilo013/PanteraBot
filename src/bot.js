const { getFuriaPlayers, getRanking, getMatches, getNews } = require('./webscraping'); // Importa as funções de webscraping
const config = require('./config')
const { Telegraf,Markup } = require('telegraf');

const bot = new Telegraf(config.token);

bot.start(async (ctx) => {
  const msg = 
`<b>🐾 Fala, Furioso(a)! Aqui é o bot da FURIA!</b>

Quer ficar por dentro de tudo sobre a FURIA no CS? Acompanhe nosso time, jogos ao vivo, campeonatos, e as novidades do mundo do Counter-Strike! Tá tudo aqui para você não perder nenhum lance!.

Vem acompanhar de perto cada vitória da FURIA no CS! 🖤🔥

Fique a vontade para me pedir qualquer informação`; 

await ctx.reply(msg, { parse_mode: 'HTML' });
await mostrarMenu(ctx);
});


// /elenco
bot.action('elenco', async (ctx) => {
  await ctx.reply('🔍 Buscando elenco da FURIA...');

  const players = await getFuriaPlayers();

  let msg = `Elenco atual da FURIA no CS:\n\n`; 

  for (const player of players) {
    msg += `- ${player.name}\n`;
  }

  msg += `\n VAMOS COM TUDO !\n\n🐾🔥 `;

  await ctx.reply(msg);
  await mostrarMenu(ctx);
});
  

bot.action('ranking', async (ctx) => {
  await ctx.reply('🔍 Buscando ranking da FURIA...');
  const response = await getRanking();
  ctx.reply(response);

  await mostrarMenu(ctx);
});


bot.action('partidasrecentes', async (ctx) => {

  //MENSAGEM DO BOT PARA INFORMAR QUE ESTA BUSCANDO
  await ctx.reply('🔍 Buscando últimas partidas...');
  const matches = await getMatches(1);

  // VERIFICAÇÃO SE NÃO HOUVER PARTIDAS
  if (matches == null) {
    await ctx.reply('Não foram encontrados resultados de partidas.');
  } else {
    await ctx.reply('📺 Últimas 5 partidas da FURIA 📺');

    // PEGAR AS 5 PRIMEIRAS PARTIDAS
    for (const match of matches.slice(0, 5)) {
      let responseMessage = '';
 
      // CONVERTENDO PLACAR PARA INT PARA A VERIFICAÇÃO DE VITÓRIA
      const furiaScore = parseInt(match.score[0]);
      const adversarioScore = parseInt(match.score[4]);

      // VERIFICAÇÃO DE VITÓRIA
        if (furiaScore > adversarioScore) {
          responseMessage += `✅ ${match.date}\n`;
        } else {
          responseMessage += `❌ ${match.date}\n`;
        }

      responseMessage += `- [CS] ${match.team1} vs ${match.team2} - ${match.score}\n`;

      //  BOTÃO DE REDIRECIONAMENTO PARA A PARTIDA NO SITE DA HLTV
      await ctx.reply(responseMessage.trim(), Markup.inlineKeyboard([
        Markup.button.url('Mais detalhes', match.href)
      ]));
    }
  }

  await mostrarMenu(ctx);
});

bot.action('partidasfuturas', async (ctx) => {
  await ctx.reply('🔍 Buscando próxima partida...');
  const matches = await getMatches(0);

  if (matches == null) {
    await ctx.reply('Por enquanto a FURIA não tem partidas marcadas');
  } else {
    await ctx.reply('📺 Próxima partida da FURIA 📺');

    for (const match of matches.slice(0, 5)) {
      let responseMessage = `- [CS] ${match.team1} vs ${match.team2} - ${match.date}`;

      if (match.href) {
        await ctx.reply(responseMessage.trim(), Markup.inlineKeyboard([
          Markup.button.url('Mais detalhes', match.href)
        ]));
      } else {
        // Se não tiver link, envia só o texto
        await ctx.reply(responseMessage.trim());
      }
    }
  }

  await mostrarMenu(ctx);
});

bot.action('noticias', async (ctx) => {
  await ctx.reply('🔍 Buscando notícias da FURIA...');

  const noticias = await getNews();

  await ctx.reply('📰 Ultimas noticias da FURIA')
  for (const noticia of noticias.slice(0,5)) {
    await ctx.reply(
      `Data: ` + noticia.titulo.trim(),
      Markup.inlineKeyboard([
        Markup.button.url('Link da Notícia', noticia.href)
      ])
    );
  }

  await mostrarMenu(ctx);
});

bot.action('loja',async(ctx) => {
  await ctx.reply(
    `🐾 Leve a FURIA com você — confira a loja oficial! `,
      Markup.inlineKeyboard([
        Markup.button.url('Loja', 'https://www.furia.gg/')
      ])
  )
});


function mostrarMenu(ctx) {
  return ctx.reply('📌 Selecione uma opção:', Markup.inlineKeyboard([
      [Markup.button.callback('👥 Elenco', 'elenco')],
      [Markup.button.callback('📊 Ranking', 'ranking')],
      [Markup.button.callback('📅 Partidas Recentes', 'partidasrecentes')],
      [Markup.button.callback('📅 Partidas Futuras', 'partidasfuturas')],
      [Markup.button.callback('📰 Noticias','noticias')],
      [Markup.button.callback('🛒 Loja da Pantera', 'loja')]
    ])
  );
}

bot.launch();