const { all } = require('axios');
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
    //const imgCoach = cardCoach.querySelector('img')?.src || 'Nome não encontrado';
    
    const playerArray = Array.from(playerCards).map(card => {
      const name = card.querySelector('.text-ellipsis')?.innerText.trim() || 'Nome não encontrado';
      //const img = card.querySelector('img')?.src || '';
      return { name };
    });

    playerArray.push({ name: `Coach: ${nomeCoach}`});
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
      valor[0] ? valor[0].innerText.trim() : 'Ranking Valve não encontrado', 
      valor[1] ? valor[1].innerText.trim() : 'Ranking Mundial não encontrado'
    ];          
});

await browser.close();

  return `📊 Ranking da FURIA:\n \n 🌍 Mundial: ${rank[1]} \n 🎯 Valve: ${rank[0]}`;
}


async function getMatches(matchTableNumber) {
  const url = 'https://www.hltv.org/team/8297/furia';
  const { browser, page } = await launchBrowser(url);

  const matches = await page.evaluate((matchTableNumber) => {

    let matchTable = null;
    let matchTables = null;
    let naotemproximas = null;

    if (matchTableNumber === 0) {
      naotemproximas = document.querySelectorAll('.empty-state');
      if (naotemproximas.length == 1) {
        return null;
      }
      matchTables = document.querySelectorAll('.table-container.match-table');
      matchTable = matchTables[0];
    } else {
      matchTables = document.querySelectorAll('.table-container.match-table');
      if (matchTables.length > 1) {
        matchTable = matchTables[1];
      } else if (matchTables.length === 1) {
        matchTable = matchTables[0];
      } else {
        return null; // Nenhuma tabela encontrada
      }
    }

    if (!matchTable) {
      return null; // Proteção extra caso ainda esteja undefined
    }


  
    const rows = matchTable.querySelectorAll('.team-row');
    const allMatches = [];

    rows.forEach(row => {
      const date = row.querySelector('.date-cell span')?.innerText.trim() || 'Data não encontrada';
      const team1 = row.querySelector('.team-name.team-1')?.innerText.trim() || 'Time 1 não encontrado';
      const team2 = row.querySelector('.team-name.team-2')?.innerText.trim() || 'Time 2 não encontrado';
      const scoreSpanAll = row.querySelectorAll('.score-cell span');
      const score = Array.from(scoreSpanAll).slice(0, 3).map(span => span.innerText.trim()).join(' ') || 'Pontuação não encontrada';
      const linkpartida = matchTableNumber === 1
        ? row.querySelector('.stats-button-cell a')
        : row.querySelector('.matchpage-button-cell a');
      const href = linkpartida?.href;

      allMatches.push({
        date,
        team1,
        team2,
        score,
        href
      });
    });

    return allMatches;
  }, matchTableNumber);

  console.log(matches);
  await browser.close();
  return matches;
}

getMatches(0);


/*
async function getNameChampionship(urlmatch) {
  const { browser, page } = await launchBrowser(urlmatch);

  const nameChampionship = await page.evaluate(() => {
    // Certifique-se de que a classe está correta
    const boxteams = document.querySelector('.standard-box.teamsBox');
    const nameElement = boxteams.querySelector('.event.text-ellipsis');
    return nameElement.innerText.trim();  
  });

  await browser.close();
  return nameChampionship;
}
*/



async function getNews() {

  const url = 'https://www.hltv.org/team/8297/furia#tab-newsBox';
  const { browser, page } = await launchBrowser(url);

  const news = await page.evaluate(() => {
    const newsTable = document.querySelectorAll('#newsBox a');
    const allNews = [];

    newsTable.forEach(news => {
      const href = news?.href;
      const titulo = news.innerText.trim();

      if (titulo.includes('FURIA')) { // 🔥 filtra só os títulos com 'FURIA'
        allNews.push({ href, titulo });
      }
    });

    return allNews;
  });

  await browser.close();

  return news;
}


module.exports = { getFuriaPlayers, getRanking, getMatches, getNews };

