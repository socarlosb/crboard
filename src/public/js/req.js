const clanTag = document.querySelector("#clanTag");
const requiredTrophies = document.querySelector("#requiredTrophies");
const warDayWins = document.querySelector("#warDayWins");
const warWinRate = document.querySelector("#warWinRate");
const warAvgCollections = document.querySelector("#warAvgCollections");
const cardMax = document.querySelector("#cardMax");
const cardLegend = document.querySelector("#cardLegend");
const cardGold = document.querySelector("#cardGold");
const cardSilver = document.querySelector("#cardSilver");
const cardBronze = document.querySelector("#cardBronze");
const add = document.querySelector("button");
const message = document.querySelector(".message");
const pass = document.querySelector("#pass");

add.addEventListener("click", () => {
  const obj = {
    cardLevels: {}
  };
  if (requiredTrophies.value) obj.requiredTrophies = requiredTrophies.value;
  if (warDayWins.value) obj.warDayWins = warDayWins.value;
  if (warWinRate.value) obj.warWinRate = warWinRate.value;
  if (warAvgCollections.value) obj.warAvgCollections = warAvgCollections.value;
  if (cardMax.value) obj.cardLevels.max = cardMax.value;
  if (cardLegend.value) obj.cardLevels.legend = cardLegend.value;
  if (cardGold.value) obj.cardLevels.gold = cardGold.value;
  if (cardSilver.value) obj.cardLevels.silver = cardSilver.value;
  if (cardBronze.value) obj.cardLevels.bronze = cardBronze.value;

  fetch(`/api/v1/clan/${clanTag.value}`, {
    method: "POST",
    headers: {
      pass: pass.value,
      "content-type": "application/json"
    },
    body: JSON.stringify(obj)
  })
    .then(response => {
      console.log(response);
      message.innerHTML = response.statusText;
    })
    .catch(err => {
      console.log(err);
      message.innerHTML = err.statusText;
    });
});
