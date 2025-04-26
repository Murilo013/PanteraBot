const puppeteer = require('puppeteer');

async function launchBrowser(url) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
  );

  await page.goto(url, { waitUntil: 'networkidle2' });

  return { browser, page };
}

async function getFuriaPlayers() {
  const url = 'https://www.hltv.org/team/8297/furia#tab-rosterBox';
  const { browser, page } = await launchBrowser(url);

  const players = await page.evaluate(() => {
    const playerCards = document.querySelectorAll('.bodyshot-team .col-custom');
    const cardCoach = document.querySelector('.table-container.coach-table');

    const nomeCoach = cardCoach.querySelector('.text-ellipsis')?.innerText.trim() || 'Nome não encontrado';
    const imgCoach = cardCoach.querySelector('img')?.src || 'Nome não encontrado';
    
    const playerArray = Array.from(playerCards).map(card => {
      const name = card.querySelector('.text-ellipsis')?.innerText.trim() || 'Nome não encontrado';
      const img = card.querySelector('img')?.src || '';
      return { name, img };
    });

    playerArray.push({ name: `Coach: ${nomeCoach}`, img: imgCoach });
    return playerArray;

  });

  await browser.close();
  return players;
}

async function getRanking() {

  const url = 'https://www.hltv.org/team/8297/furia';
  const { browser, page } = await launchBrowser(url);

  const rank = await page.evaluate(() => {
    const valor = document.querySelectorAll('.right a');
    return [
      valor[0] ? valor[0].innerText.trim() : 'Ranking Valve não encontrado', // SE ACHAR ELE RETIRA OS ESPAÇOS - SE NÃO ELE MOSTRA NÃO ENCONTRADO
      valor[1] ? valor[1].innerText.trim() : 'Ranking Mundial não encontrado'
    ];          
});

await browser.close();

  // Retorna string formatada
  return `📊 Ranking da FURIA:\n \n 🌍 Mundial: ${rank[1]} \n 🎯 Valve: ${rank[0]}`;
}


async function getMatches() {
  const url = 'https://www.hltv.org/team/8297/furia';
  const { browser, page } = await launchBrowser(url);


  const matches = await page.evaluate(() => {
    
    const matchTable = document.querySelector('.table-container.match-table'); 
    const allPastMatches = [];

  
    const rows = matchTable.querySelectorAll('.team-row');

    rows.forEach(row =>{
      const date = row.querySelector('.date-cell span')?.innerText.trim() || 'Data não encontrada';
      const team1 = row.querySelector('.team-name.team-1')?.innerText.trim() || 'Time 1 não encontrada';
      const team2 = row.querySelector('.team-name.team-2')?.innerText.trim() || 'Time 2 não encontrada';
      const scoreSpanAll = row.querySelectorAll('.score-cell span');
      const score = Array.from(scoreSpanAll).slice(0,3).map(span => span.innerText.trim()).join(' ') || 'Pontuação não encontrada';
      const linkpartida = row.querySelector('.stats-button-cell a');
      const href = linkpartida?.href; 
      
      allPastMatches.push({
       date,team1,team2,score,href});
      });

    return allPastMatches;
      
    });

  await browser.close();

  return matches;
}


getMatches();

module.exports = { getFuriaPlayers, getRanking, getMatches };

