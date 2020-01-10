const clansBody = document.querySelector("#clans");
const checkPlayer = document.querySelector("#checkPlayer");
const playerTag = document.querySelector("#playerTag");
const playerResult = document.querySelector("#playerResult");
const errorNotification = document.querySelector("#error");
let clans, player;
let possibleClans = [];
const baseUrl = window.location.href;
const url = new URL(baseUrl);
const playerURLTag = url.searchParams.get("player") || null;

new Tablesort(document.querySelector("table"), {
  descending: true
});

async function getClanInfo() {
  try {
    return fetch("https://crboard.herokuapp.com/api/v1/clan")
      .then(resp => resp.json())
      .then(json => {
        return json.data;
      });
  } catch (error) {
    console.log("ops", error.message);
  }
}

window.onload = async () => {
  clansBody.innerHTML = "Loading...";
  clans = await getClanInfo();
  clansBody.innerHTML = "";

  clans.map(clan => {
    clansBody.innerHTML += `
        <tr id="${clan.tag}">
          <td>${clan.warTrophies}</td>
          <td><a href="/clan?tag=${clan.tag}">${clan.name}</a></td>
          <td class="has-text-centered">${
            clan.hasOwnProperty("clanRequirements") &&
            clan.clanRequirements.hasOwnProperty("level")
              ? clan.clanRequirements.level
              : ""
          }</td>
          <td class="has-text-centered">${
            clan.hasOwnProperty("clanRequirements") &&
            clan.clanRequirements.hasOwnProperty("requiredTrophies")
              ? clan.clanRequirements.requiredTrophies
              : clan.requiredScore
          }</td>
          <td class="has-text-centered">${
            clan.hasOwnProperty("clanRequirements") &&
            clan.clanRequirements.hasOwnProperty("allWinRate")
              ? clan.clanRequirements.allWinRate + "%"
              : ""
          }</td>
          <td class="has-text-centered">${
            clan.hasOwnProperty("clanRequirements") &&
            clan.clanRequirements.hasOwnProperty("cardLevels") &&
            clan.clanRequirements.cardLevels.hasOwnProperty("max")
              ? clan.clanRequirements.cardLevels.max + "%"
              : ""
          }</td>
          <td class="has-text-centered">${
            clan.hasOwnProperty("clanRequirements") &&
            clan.clanRequirements.hasOwnProperty("cardLevels") &&
            clan.clanRequirements.cardLevels.hasOwnProperty("legend")
              ? clan.clanRequirements.cardLevels.legend + "%"
              : ""
          }</td>
          <td class="has-text-centered">${
            clan.hasOwnProperty("clanRequirements") &&
            clan.clanRequirements.hasOwnProperty("cardLevels") &&
            clan.clanRequirements.cardLevels.hasOwnProperty("gold")
              ? clan.clanRequirements.cardLevels.gold + "%"
              : ""
          }</td>
          <td class="has-text-centered">${
            clan.hasOwnProperty("clanRequirements") &&
            clan.clanRequirements.hasOwnProperty("cardLevels") &&
            clan.clanRequirements.cardLevels.hasOwnProperty("silver")
              ? clan.clanRequirements.cardLevels.silver + "%"
              : ""
          }</td>
          <td class="has-text-centered">${
            clan.hasOwnProperty("clanRequirements") &&
            clan.clanRequirements.hasOwnProperty("cardLevels") &&
            clan.clanRequirements.cardLevels.hasOwnProperty("bronze")
              ? clan.clanRequirements.cardLevels.bronze + "%"
              : ""
          }</td>
        </tr>
        `;
  });

  if (playerURLTag !== null) {
    playerTag.value = playerURLTag;
    checkPlayer.click();
  }
};

// async function getPlayerInfo(tag) {
//   errorNotification.innerHTML = "";

//   return fetch(
//     "https://crboard.herokuapp.com/api/v1/player/" + tag.replace("#", "")
//   )
//     .then(resp => {
//       if (resp.status !== 200) {
//         errorNotification.innerHTML = `
//           <div class="notification is-danger" style="margin-top: 2em;">
//           <p>Can't find that user 😒 Try another? 🙄</p>
//           </div>
//           `;
//       }
//       return resp.json();
//     })
//     .then(json => json)
//     .catch(err => console.log(err));
// }
async function getPlayerInfo(tag) {
  try {
    return fetch(
      "https://crboard.herokuapp.com/api/v1/player/" + tag.replace("#", "")
    )
      .then(resp => {
        if (resp.status !== 200) {
          playerResult.innerHTML = "";
          errorNotification.innerHTML = `
          <div class="notification is-danger" style="margin-top: 2em;">
          <p>Can't find that user 😒 Try another? 🙄</p>
          </div>
          `;
        }
        return resp.json();
      })
      .then(json => json);
  } catch (error) {
    console.log("ops", error.message);
  }
}

checkPlayer.addEventListener("click", async () => {
  console.info("player", player);
  console.info("----------------");
  console.info("playerTag.value", playerTag.value);
  console.info("----------------");
  if (!playerTag.value) return;
  checkPlayer.classList.add("is-loading");
  checkPlayer.disabled = true;
  try {
    errorNotification.innerHTML = "";
    player = await getPlayerInfo(playerTag.value);
    checkPlayer.classList.remove("is-loading");
    checkPlayer.disabled = false;
  } catch (error) {
    console.error(error);
    playerResult.innerHTML = "";
    errorNotification.innerHTML = error;
  }

  console.info("player", player);
  console.info("----------------");

  playerResult.innerHTML = `
    <div class="notification is-success" style="margin-top: 2em;">
      <p>Player name: <a target="_blank"
      href="https://royaleapi.com/player/${player.tag}">${player.name}</a></p>
      <p>In a clan!?: <a target="_blank" href="https://royaleapi.com/clan/${
        player.clanTag
      }">${player.clan} (#${player.clanTag}</a>)</p>
      <p>Lvl ${player.level}</p>
      <p>Trophies: ${player.trophies}</p>
      <p>Win Rate: ${player.allWinRate}%</p>
      <p>Cards Levels:</p>
      <p>> Max ${(player.cardLevels.max * 100).toFixed(0)}%</p>
      <p>> Lvl 12 ${(player.cardLevels.legend * 100).toFixed(0)}%</p>
      <p>> Lvl 11 ${(player.cardLevels.gold * 100).toFixed(0)}%</p>
      <p>> Lvl 10 ${(player.cardLevels.silver * 100).toFixed(0)}%</p>
      <p>> Lvl 9 ${(player.cardLevels.bronze * 100).toFixed(0)}%</p>
      <p>
        <a target="_blank" href="https://royaleapi.com/player/${player.tag}">
          More info here?
        <!-- <img src="https://royaleapi.com/static/img/branding/cr-api-logo.png"></img> -->
        </a>
      </p>
      <p>
        <a href="javascript:copyToClipboard('https://gavetas-cr.netlify.com/?player=${
          player.tag
        }')">
          Get the link 🔗
        </a>
      </p>
      </br>
      <div class="notification is-info" id="possibleClans"></div>
    </div>
  `;

  possibleClans = checkPossibleClans(player, clans);

  updateTableClass(possibleClans);

  const possible = document.querySelector("#possibleClans");

  possible.innerHTML = `
    </br>
    <p>Good News, <strong>${possibleClans.length}</strong> clans might have a space for you 😊 Check them out below 👇 and join us on our Discord server to know more, see you there 👍</p>
  `;
});

function copyToClipboard(text) {
  var dummy = document.createElement("textarea");
  document.body.appendChild(dummy);
  dummy.value = text;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
}

function checkPossibleClans(player, clans) {
  player.cardLevels.max = (player.cardLevels.max * 100).toFixed(0);
  player.cardLevels.legend = (player.cardLevels.legend * 100).toFixed(0);
  player.cardLevels.gold = (player.cardLevels.gold * 100).toFixed(0);
  player.cardLevels.silver = (player.cardLevels.silver * 100).toFixed(0);
  player.cardLevels.bronze = (player.cardLevels.bronze * 100).toFixed(0);

  return clans.filter(clan => {
    if (!clan.clanRequirements) return clan;
    const possible =
      // Check level
      (clan.clanRequirements.level === undefined ||
        player.level >= clan.clanRequirements.level) &&
      // Check requiredTrophies
      (clan.clanRequirements.requiredTrophies === undefined ||
        player.trophies >= clan.clanRequirements.requiredTrophies ||
        player.trophies >= clan.requiredScore) &&
      // Check allWinRate
      (clan.clanRequirements.allWinRate === undefined ||
        player.allWinRate >= clan.clanRequirements.allWinRate) &&
      // Check cardLevels
      (clan.clanRequirements.cardLevels === undefined ||
        // Check cardLevels max
        ((clan.clanRequirements.cardLevels.max === undefined ||
          player.cardLevels.max >= clan.clanRequirements.cardLevels.max) &&
          // Check cardLevels legend
          (clan.clanRequirements.cardLevels.legend === undefined ||
            player.cardLevels.legend >=
              clan.clanRequirements.cardLevels.legend) &&
          // Check cardLevels gold
          (clan.clanRequirements.cardLevels.gold === undefined ||
            player.cardLevels.gold >= clan.clanRequirements.cardLevels.gold) &&
          // Check cardLevels silver
          (clan.clanRequirements.cardLevels.silver === undefined ||
            player.cardLevels.silver >=
              clan.clanRequirements.cardLevels.silver) &&
          // Check cardLevels bronze
          (clan.clanRequirements.cardLevels.bronze === undefined ||
            player.cardLevels.bronze >=
              clan.clanRequirements.cardLevels.bronze)));

    return possible;
  });
}

function updateTableClass(clanList) {
  const rows = [...document.querySelectorAll("tbody tr")];
  clanList.map(({ tag }) => {
    const row = rows.filter(row => row.id === tag);
    console.info("row", row);
    console.info("----------------");
    if (row[0]) {
      row[0].classList.add("has-background-info");
      row[0].classList.add("has-text-white");
      row[0].classList.add("possible-link");
    }
  });
}
