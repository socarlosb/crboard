const requiredTrophies = document.querySelector("#requiredTrophies");
const warDayWins = document.querySelector("#warDayWins");
const warWinRate = document.querySelector("#warWinRate");
const allWinRate = document.querySelector("#allWinRate");
const warAvgCollections = document.querySelector("#warAvgCollections");
const playerLevel = document.querySelector("#playerLevel");
const cardMax = document.querySelector("#cardMax");
const cardLegend = document.querySelector("#cardLegend");
const cardGold = document.querySelector("#cardGold");
const cardSilver = document.querySelector("#cardSilver");
const cardBronze = document.querySelector("#cardBronze");
const add = document.querySelector("button");
const message = document.querySelector(".message");
const pass = document.querySelector("#pass");
const clanList = document.querySelector("[data-info='clanList']");
let clansArray = [];

add.addEventListener("click", () => {
  const obj = {
    cardLevels: {}
  };
  if (requiredTrophies.value) obj.requiredTrophies = requiredTrophies.value;
  if (warDayWins.value) obj.warDayWins = warDayWins.value;
  if (allWinRate.value) obj.allWinRate = allWinRate.value;
  if (warWinRate.value) obj.warWinRate = warWinRate.value;
  if (warAvgCollections.value) obj.warAvgCollections = warAvgCollections.value;
  if (playerLevel.value) obj.level = playerLevel.value;
  if (cardMax.value) obj.cardLevels.max = cardMax.value;
  if (cardLegend.value) obj.cardLevels.legend = cardLegend.value;
  if (cardGold.value) obj.cardLevels.gold = cardGold.value;
  if (cardSilver.value) obj.cardLevels.silver = cardSilver.value;
  if (cardBronze.value) obj.cardLevels.bronze = cardBronze.value;

  const selectedTag = clanList.options[clanList.selectedIndex].getAttribute(
    "data-tag"
  );

  fetch(`https://crboard.herokuapp.com/api/v1/clan/${selectedTag}`, {
    method: "POST",
    headers: {
      pass: pass.value,
      "content-type": "application/json"
    },
    body: JSON.stringify(obj)
  })
    .then(response => {
      message.innerHTML = response.statusText;
    })
    .catch(err => {
      console.log(err);
      message.innerHTML = err.statusText;
    });
});

window.onload = async () => {
  const data = await getClanList();
  clansArray = data;

  clansArray.forEach(el => {
    clanList.innerHTML += `
      <option data-tag="${el.tag}">${el.name}</option>
    `;
  });
};

clanList.addEventListener("change", e => {
  const selectedTag = clanList.options[e.target.selectedIndex].getAttribute(
    "data-tag"
  );

  if (!selectedTag) {
    cleanUp();
    return;
  }

  const selectedClan = clansArray.find(el => el.tag === selectedTag);

  requiredTrophies.value = selectedClan.clanRequirements.requiredTrophies || 0;
  warDayWins.value = selectedClan.clanRequirements.warDayWins || 0;
  allWinRate.value = selectedClan.clanRequirements.allWinRate || 0;
  warWinRate.value = selectedClan.warWinRate || 0;
  warAvgCollections.value = selectedClan.warAvgCollections || (0).toFixed(2);
  playerLevel.value = selectedClan.clanRequirements.level || 0;
  cardMax.value = selectedClan.clanRequirements.cardLevels.max || 0;
  cardLegend.value = selectedClan.clanRequirements.cardLevels.legend || 0;
  cardGold.value = selectedClan.clanRequirements.cardLevels.gold || 0;
  cardSilver.value = selectedClan.clanRequirements.cardLevels.silver || 0;
  cardBronze.value = selectedClan.clanRequirements.cardLevels.bronze || 0;
});

function getClanList() {
  return new Promise((resolve, reject) => {
    fetch(`https://crboard.herokuapp.com/api/v1/clan`, {
      method: "GET"
    })
      .then(response => response.json())
      .then(json => resolve(json.data))
      .catch(err => {
        console.log(err);
        reject(err.statusText);
      });
  });
}

function cleanUp() {
  requiredTrophies.value = "";
  warDayWins.value = "";
  allWinRate.value = "";
  warWinRate.value = "";
  warAvgCollections.value = "";
  playerLevel.value = "";
  cardMax.value = "";
  cardLegend.value = "";
  cardGold.value = "";
  cardSilver.value = "";
  cardBronze.value = "";
}
