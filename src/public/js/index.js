const clansBody = document.querySelector("#clans");
const checkPlayer = document.querySelector("#checkPlayer");
const playerTag = document.querySelector("#playerTag");
const playerResult = document.querySelector("#playerResult");
let clans, player;

new Tablesort(document.querySelector("table"), {
  descending: true
});

async function getClanInfo() {
  try {
    return fetch("/api/v1/clan")
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
  let classTrophies = "";

  clans.map(clan => {
    let requirements = "";
    if (clan.hasOwnProperty("clanRequirements")) {
      requirements = `
    ${
      clan.clanRequirements.hasOwnProperty("requiredTrophies")
        ? clan.clanRequirements.requiredTrophies + " T | "
        : ""
    }
    ${
      clan.clanRequirements.hasOwnProperty("warWinRate")
        ? clan.clanRequirements.warWinRate + "% WW | "
        : ""
    }
    ${
      clan.clanRequirements.hasOwnProperty("warDayWins")
        ? clan.clanRequirements.warDayWins + " WWT | "
        : ""
    }
    ${
      clan.clanRequirements.hasOwnProperty("cardLevels")
        ? `
      Cards Levels:
      ${
        clan.clanRequirements.cardLevels.hasOwnProperty("max")
          ? clan.clanRequirements.cardLevels.max + "% MAX | "
          : ""
      }
      ${
        clan.clanRequirements.cardLevels.hasOwnProperty("legend")
          ? clan.clanRequirements.cardLevels.legend + "% L | "
          : ""
      }
      ${
        clan.clanRequirements.cardLevels.hasOwnProperty("gold")
          ? clan.clanRequirements.cardLevels.gold + "% G | "
          : ""
      }
      ${
        clan.clanRequirements.cardLevels.hasOwnProperty("silver")
          ? clan.clanRequirements.cardLevels.silver + "% S | "
          : ""
      }
      ${
        clan.clanRequirements.cardLevels.hasOwnProperty("bronze")
          ? clan.clanRequirements.cardLevels.bronze + "% B | "
          : ""
      }
    `
        : "..."
    }`;
    }

    clansBody.innerHTML += `
        <tr class=${classTrophies}>
          <td>${clan.warTrophies}</td>
          <td><a href="/${clan.tag}">${clan.name}</a></td>
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
              : ""
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
};

async function getPlayerInfo(tag) {
  try {
    return fetch("/api/v1/player/" + tag.replace("#", ""))
      .then(resp => resp.json())
      .then(json => json);
  } catch (error) {
    console.log("ops", error.message);
  }
}

checkPlayer.addEventListener("click", async () => {
  if (!playerTag.value) return;
  checkPlayer.classList.add("is-loading");
  checkPlayer.disabled = true;
  try {
    player = await getPlayerInfo(playerTag.value);
    checkPlayer.classList.remove("is-loading");
    checkPlayer.disabled = false;
  } catch (error) {}

  playerResult.innerHTML = `
    <div class="notification is-success" style="margin-top: 2em;">
      <p>Player name: ${player.name}</p>
      <p>In a clan!?: ${
        player.clan
      } (<a target="_blank" href="https://royaleapi.com/clan/${
    player.clanTag
  }">#${player.clanTag}</a>)</p>
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
      </br>
      <div class="notification is-info" id="possibleClans"></div>
    </div>
  `;

  const possibleClans = checkPossibleClans(player, clans);

  const possible = document.querySelector("#possibleClans");

  possible.innerHTML = `
    </br>
    <p>Good News, <strong>${
      possibleClans.length
    }</strong> clans might have a space for you 😊 Check them out and join us on our Discord server to know more, see you there 👍</p>
    <p>Possible clans:</p>
    </br>
    <ul>
      ${possibleClans
        .map(clan => `<li>> ${clan.name} (#${clan.tag})</li>`)
        .join("")}
    </ul>
  `;
});

function checkPossibleClans(player, clans) {
  player.cardLevels.max = (player.cardLevels.max * 100).toFixed(0);
  player.cardLevels.legend = (player.cardLevels.legend * 100).toFixed(0);
  player.cardLevels.gold = (player.cardLevels.gold * 100).toFixed(0);
  player.cardLevels.silver = (player.cardLevels.silver * 100).toFixed(0);
  player.cardLevels.bronze = (player.cardLevels.bronze * 100).toFixed(0);

  const possibleClans = clans.filter(clan => {
    if (!clan.clanRequirements) return clan;
    const possible =
      // Check level
      (clan.clanRequirements.level === undefined ||
        player.level >= clan.clanRequirements.level) &&
      // Check requiredTrophies
      (clan.clanRequirements.requiredTrophies === undefined ||
        player.trophies >= clan.clanRequirements.requiredTrophies) &&
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
  return possibleClans;
}
