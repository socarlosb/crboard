const clansBody = document.querySelector("#clans");
const checkPlayer = document.querySelector("#checkPlayer");
const playerTag = document.querySelector("#playerTag");
const playerResult = document.querySelector("#playerResult");

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
  const clans = await getClanInfo();
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
            clan.clanRequirements.hasOwnProperty("warDayWins")
              ? clan.clanRequirements.warDayWins
              : ""
          }</td>
          <td class="has-text-centered">${
            clan.hasOwnProperty("clanRequirements") &&
            clan.clanRequirements.hasOwnProperty("warWinRate")
              ? clan.clanRequirements.warWinRate + "%"
              : ""
          }</td>
          <td class="has-text-centered">${
            clan.hasOwnProperty("clanRequirements") &&
            clan.clanRequirements.hasOwnProperty("warAvgCollections")
              ? clan.clanRequirements.warAvgCollections
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
      .then(json => {
        console.info("json", json);
        console.info("----------------");
        return json;
      });
  } catch (error) {
    console.log("ops", error.message);
  }
}

checkPlayer.addEventListener("click", async () => {
  if (!playerTag.value) return;
  const player = await getPlayerInfo(playerTag.value);

  playerResult.innerHTML = `
    <div class="notification is-success" style="margin-top: 2em;">
      <p>Player name: ${player.name}</p>
      <p>In a clan!?: ${player.clan}</p>
      <p>Lvl ${player.level}</p>
      <p>Trophies: ${player.trophies}</p>
      <p>Win Rate: ${player.allWinRate}</p>
      <p>Cards:</p>
      <p>${(player.cardLevels.max * 100).toFixed(0)}% Max</p>
      <p>${(player.cardLevels.legend * 100).toFixed(0)}% 12</p>
      <p>${(player.cardLevels.gold * 100).toFixed(0)}% 11</p>
      <p>${(player.cardLevels.silver * 100).toFixed(0)}% 10</p>
      <p>${(player.cardLevels.bronze * 100).toFixed(0)}% 9</p>
    </div>
  `;
});
