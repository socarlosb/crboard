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
  const clans = await getClanInfo();

  clans.map(clan => {
    let requirements = "";
    if (clan.clanRequirements) {
      requirements = `
    ${
      clan.clanRequirements.warWinRate
        ? clan.clanRequirements.warWinRate + "% WW | "
        : ""
    }
    ${
      clan.clanRequirements.warDayWins
        ? clan.clanRequirements.warDayWins + " WW | "
        : ""
    }
    Cards Levels:
    ${
      clan.clanRequirements.cardLevels.max
        ? clan.clanRequirements.cardLevels.max + "% MAX | "
        : ""
    }
    ${
      clan.clanRequirements.cardLevels.legend
        ? clan.clanRequirements.cardLevels.legend + "% L | "
        : ""
    }
    ${
      clan.clanRequirements.cardLevels.gold
        ? clan.clanRequirements.cardLevels.gold + "% G | "
        : ""
    }
    ${
      clan.clanRequirements.cardLevels.silver
        ? clan.clanRequirements.cardLevels.silver + "% S | "
        : ""
    }
    ${
      clan.clanRequirements.cardLevels.bronze
        ? clan.clanRequirements.cardLevels.bronze + "% B | "
        : ""
    }
    `;
    }

    clansBody.innerHTML += `
    <tr >
      <td>${clan.warTrophies}</td>
      <td><a href="/${clan.tag}">${clan.name}</a></td>
      ${
        requirements !== ""
          ? "<td>" + requirements + "</td>"
          : "<td>Soon...</td>"
      }
    </tr>
  `;
  });
};
