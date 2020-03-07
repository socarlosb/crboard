const puppeteer = require("puppeteer");

const scrapeWars = async tag => {
  const url = `https://royaleapi.com/player/${tag}`;

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "networkidle2" });

    await page.$eval(".cw_history_container>button", el => el.click());

    await page.waitFor(".cw_history_container>style");

    const data = await page.evaluate(() => {
      const list = Array.from(
        document.querySelectorAll(".cw_history_container > *")
      );

      return list.slice(3, list.length).map(item => {
        const el = item.innerText.trim().split("\n");
        const [wins, games] = el[0].split(" / ");
        const cards = el[1];
        const date = el[2];
        const clan = el[3];

        return { wins, games, cards, date, clan };
      });
    });

    await browser.close();

    return getStats(data);
  } catch (error) {
    return "Couldn't scrape right now 🤨";
  }
};

function getStats(arr, limit = arr.length) {
  const rangedArr = arr.slice(0, limit);
  return {
    numberOfWars: rangedArr.length,
    wins: rangedArr.reduce((acc, item) => (acc += Number(item.wins)), 0),
    games: rangedArr.reduce((acc, item) => (acc += Number(item.games)), 0),
    cards: rangedArr.reduce((acc, item) => (acc += Number(item.cards)), 0)
  };
}

// Example of use
// main("LV9PCR9L")
//   .then(val => {
//     console.info(val);
//   })
//   .catch(err => console.err(err));

module.exports = { scrapeWars };
