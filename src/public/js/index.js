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
  player = await getPlayerInfo(playerTag.value);

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
      <p>Max ${(player.cardLevels.max * 100).toFixed(0)}%</p>
      <p>Lvl 12 ${(player.cardLevels.legend * 100).toFixed(0)}%</p>
      <p>Lvl 11 ${(player.cardLevels.gold * 100).toFixed(0)}%</p>
      <p>Lvl 10 ${(player.cardLevels.silver * 100).toFixed(0)}%</p>
      <p>Lvl 9 ${(player.cardLevels.bronze * 100).toFixed(0)}%</p>
      <p>Want to know more?
        <a target="_blank" href="https://royaleapi.com/player/${player.tag}">
        <img src="https://royaleapi.com/static/img/branding/cr-api-logo.png"></img>
        </a>
      </p>
      <div id="possibleClans"></div>
    </div>
  `;

  const test = checkPossibleClans(player, clans);
  console.info(test);
  console.info("----------------");
});

function checkPossibleClans(player, clans) {
  const arr = [...clans];
  // console.info("arr", arr);
  // console.info("----------------");
  let possibleClans = [];
  clans.forEach(clan => {
    // console.log(
    //   clan.name,
    //   (clan.clanRequirements && clan.clanRequirements.requiredTrophies) || null
    // );
    // console.log(player.trophies);
    // console.info(
    //   "is?",
    //   clan.clanRequirements &&
    //     clan.clanRequirements.requiredTrophies < player.trophies
    // );
    // console.info("----------------");

    // Check level
    (clan.clanRequirements &&
      clan.clanRequirements.level &&
      clan.clanRequirements.level <= player.level) ||
    (clan.clanRequirements && clan.clanRequirements.level === null)
      ? possibleClans.push(clan)
      : "";

    // Check trophies
    (clan.clanRequirements &&
      clan.clanRequirements.requiredTrophies &&
      clan.clanRequirements.requiredTrophies <= player.trophies) ||
    (clan.clanRequirements && clan.clanRequirements.requiredTrophies === null)
      ? possibleClans.push(clan)
      : "";

    // Check win rate overall
    (clan.clanRequirements &&
      clan.clanRequirements.allWinRate &&
      clan.clanRequirements.allWinRate <= player.allWinRate) ||
    (clan.clanRequirements && clan.clanRequirements.allWinRate === null)
      ? possibleClans.push(clan)
      : "";

    // Check max cards
    (clan.clanRequirements &&
      clan.clanRequirements.cardLevels &&
      clan.clanRequirements.cardLevels.max &&
      clan.clanRequirements.cardLevels.max <= player.cardLevels.max) ||
    (clan.clanRequirements &&
      clan.clanRequirements.cardLevels &&
      clan.clanRequirements.cardLevels.max === null)
      ? possibleClans.push(clan)
      : "";

    // Check cards lvl 12
    (clan.clanRequirements &&
      clan.clanRequirements.cardLevels &&
      clan.clanRequirements.cardLevels.legend &&
      clan.clanRequirements.cardLevels.legend <= player.cardLevels.legend) ||
    (clan.clanRequirements &&
      clan.clanRequirements.cardLevels &&
      clan.clanRequirements.cardLevels.legend === null)
      ? possibleClans.push(clan)
      : "";
    // Check cards lvl 11
    // Check cards lvl 10
    // Check cards lvl 9

    console.info("possibleClans", possibleClans);
    console.info("----------------");
  });
  return possibleClans;
}
