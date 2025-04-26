const { getFuriaPlayers, getRanking, getMatches } = require('./webscraping'); // Importa as funções de webscraping
const config = require('./config')
const { Telegraf,Markup } = require('telegraf');

const bot = new Telegraf(config.token);

bot.start((ctx) => {
  const msg = 
`🐾 Fala, Furioso(a)! Aqui é o bot da FURIA!

Quer ficar por dentro de tudo sobre a FURIA no CS? Acompanhe nosso time, jogos ao vivo, campeonatos, e as novidades do mundo do Counter-Strike! Tá tudo aqui para você não perder nenhum lance!.

Vem acompanhar de perto cada vitória da FURIA no CS! 🖤🔥

Fique a vontade para me pedir qualquer informação`; 

return ctx.reply(msg, Markup.inlineKeyboard([
  [Markup.button.callback('👥 Elenco', 'elenco')],
  [Markup.button.callback('📊 Ranking', 'ranking')],
  [Markup.button.callback('📅 Partidas Recentes', 'partidas')],
]));

});


// /elenco
bot.action('elenco', async (ctx) => {
  await ctx.reply('🔍 Buscando elenco da FURIA...')

  const players = await getFuriaPlayers();

  for (const player of players) {
    if (player.img) {
      await ctx.replyWithPhoto(player.img, { caption: `${player.name}` });
    } else {
      await ctx.reply(`${player.name} (sem foto disponível)`);
    }
  }

  await mostrarMenu(ctx);
});
  

bot.action('ranking', async (ctx) => {
  await ctx.reply('🔍 Buscando ranking da FURIA...');
  const response = await getRanking();
  ctx.reply(response);

  await mostrarMenu(ctx);
});


bot.action('partidas', async (ctx) => {

  //MENSAGEM DO BOT PARA INFORMAR QUE ESTA BUSCANDO
  await ctx.reply('🔍 Buscando últimas partidas...');
  const matches = await getMatches();

  // VERIFICAÇÃO SE NÃO HOUVER PARTIDAS
  if (matches.length === 0) {
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


function mostrarMenu(ctx) {
  return ctx.reply('📌 Selecione uma opção:', Markup.inlineKeyboard([
      [Markup.button.callback('👥 Elenco', 'elenco')],
      [Markup.button.callback('📊 Ranking', 'ranking')],
      [Markup.button.callback('📅 Partidas Recentes', 'partidas')],
    ])
  );
}

bot.launch();