const clansBody = document.querySelector("#clans");

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
          <td>${
            clan.hasOwnProperty("clanRequirements") &&
            clan.clanRequirements.hasOwnProperty("level")
              ? clan.clanRequirements.level
              : ""
          }</td>
          <td>${
            clan.hasOwnProperty("clanRequirements") &&
            clan.clanRequirements.hasOwnProperty("requiredTrophies")
              ? clan.clanRequirements.requiredTrophies
              : ""
          }</td>
          <td>${
            clan.hasOwnProperty("clanRequirements") &&
            clan.clanRequirements.hasOwnProperty("allWinRate")
              ? clan.clanRequirements.allWinRate + "%"
              : ""
          }</td>
          <td>${
            clan.hasOwnProperty("clanRequirements") &&
            clan.clanRequirements.hasOwnProperty("warDayWins")
              ? clan.clanRequirements.warDayWins
              : ""
          }</td>
          <td>${
            clan.hasOwnProperty("clanRequirements") &&
            clan.clanRequirements.hasOwnProperty("warWinRate")
              ? clan.clanRequirements.warWinRate + "%"
              : ""
          }</td>
          <td>${
            clan.hasOwnProperty("clanRequirements") &&
            clan.clanRequirements.hasOwnProperty("warAvgCollections")
              ? clan.clanRequirements.warAvgCollections
              : ""
          }</td>
          <td>${
            clan.hasOwnProperty("clanRequirements") &&
            clan.clanRequirements.hasOwnProperty("cardLevels") &&
            clan.clanRequirements.cardLevels.hasOwnProperty("max")
              ? clan.clanRequirements.cardLevels.max + "%"
              : ""
          }</td>
          <td>${
            clan.hasOwnProperty("clanRequirements") &&
            clan.clanRequirements.hasOwnProperty("cardLevels") &&
            clan.clanRequirements.cardLevels.hasOwnProperty("legend")
              ? clan.clanRequirements.cardLevels.legend + "%"
              : ""
          }</td>
          <td>${
            clan.hasOwnProperty("clanRequirements") &&
            clan.clanRequirements.hasOwnProperty("cardLevels") &&
            clan.clanRequirements.cardLevels.hasOwnProperty("gold")
              ? clan.clanRequirements.cardLevels.gold + "%"
              : ""
          }</td>
          <td>${
            clan.hasOwnProperty("clanRequirements") &&
            clan.clanRequirements.hasOwnProperty("cardLevels") &&
            clan.clanRequirements.cardLevels.hasOwnProperty("silver")
              ? clan.clanRequirements.cardLevels.silver + "%"
              : ""
          }</td>
          <td>${
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
