const membersBody = document.querySelector("#members");
const clanName = document.querySelector("#clanName");
const clanDesc = document.querySelector("#clanDesc");
const clanRequirements = document.querySelector("#clanRequirements");
const clanUpdated = document.querySelector("#clanUpdated");
const th = document.getElementsByTagName("th");

new Tablesort(document.querySelector("table"), {
  descending: true
});

async function getClanInfo() {
  const clanTag = document.URL.split("/")[3];
  try {
    return fetch("/api/v1/clan/" + clanTag)
      .then(resp => resp.json())
      .then(json => {
        return json.data;
      });
  } catch (error) {
    console.log("ops", error.message);
  }
}
window.onload = async () => {
  membersBody.innerHTML = "Loading...";
  const clan = await getClanInfo();
  membersBody.innerHTML = "";

  document.title = `${clan.name} (#${clan.tag})`;
  clanName.innerHTML = `${clan.name} (#${clan.tag})`;
  clanDesc.innerHTML = `${clan.description}`;
  clanUpdated.innerHTML = `Updated ${moment(clan.updatedAt).fromNow()} with ${
    clan.members.length
  } members`;

  // if (clan.hasOwnProperty("clanRequirements"))
  //   clanRequirements.innerHTML = `
  //   Requirements:
  //   ${
  //     clan.clanRequirements.hasOwnProperty("warWinRate")
  //       ? clan.clanRequirements.warWinRate + "% WW | "
  //       : ""
  //   }
  //   ${
  //     clan.clanRequirements.hasOwnProperty("warDayWins")
  //       ? clan.clanRequirements.warDayWins + " WWT | "
  //       : ""
  //   }
  //   ${
  //     clan.clanRequirements.hasOwnProperty("cardLevels")
  //       ? `
  //   Cards Levels:
  //   ${
  //     clan.clanRequirements.cardLevels.hasOwnProperty("max")
  //       ? clan.clanRequirements.cardLevels.max + "% MAX | "
  //       : ""
  //   }
  //   ${
  //     clan.clanRequirements.cardLevels.hasOwnProperty("legend")
  //       ? clan.clanRequirements.cardLevels.legend + "% L | "
  //       : ""
  //   }
  //   ${
  //     clan.clanRequirements.cardLevels.hasOwnProperty("gold")
  //       ? clan.clanRequirements.cardLevels.gold + "% G | "
  //       : ""
  //   }
  //   ${
  //     clan.clanRequirements.cardLevels.hasOwnProperty("silver")
  //       ? clan.clanRequirements.cardLevels.silver + "% S | "
  //       : ""
  //   }
  //   ${
  //     clan.clanRequirements.cardLevels.hasOwnProperty("bronze")
  //       ? clan.clanRequirements.cardLevels.bronze + "% B | "
  //       : ""
  //   }`
  //       : "..."
  //   }
  //   `;

  clan.members.map(member => {
    let classRole = "",
      requiredTrophies = "",
      warDayWins = "",
      warWinRate = "",
      warAvgCollections = "",
      cardLevelsMax = "",
      cardLevelsLegend = "",
      cardLevelsGold = "",
      cardLevelsSilver = "",
      cardLevelsBronze = "",
      level = "",
      allWinRate = "";

    if (member.role === "leader") classRole = "has-text-danger";
    if (member.role === "coLeader") classRole = "has-text-info";
    if (member.role === "elder") classRole = "has-text-success";

    if (clan.hasOwnProperty("clanRequirements")) {
      if (
        clan.clanRequirements.hasOwnProperty("requiredTrophies") &&
        member.trophies < clan.clanRequirements.requiredTrophies
      )
        requiredTrophies = "has-background-warning";
      if (
        clan.clanRequirements.hasOwnProperty("level") &&
        member.stats.level < clan.clanRequirements.level
      )
        level = "has-background-warning";
      if (
        clan.clanRequirements.hasOwnProperty("allWinRate") &&
        member.stats.allWinRate < clan.clanRequirements.allWinRate
      )
        allWinRate = "has-background-warning";

      if (
        clan.clanRequirements.hasOwnProperty("warDayWins") &&
        member.stats.warDayWins < clan.clanRequirements.warDayWins
      )
        warDayWins = "has-background-warning";

      if (
        clan.clanRequirements.hasOwnProperty("warWinRate") &&
        member.stats.warWinRate * 100 < clan.clanRequirements.warWinRate
      )
        warWinRate = "has-background-warning";

      if (
        clan.clanRequirements.hasOwnProperty("warAvgCollections") &&
        (
          member.warStats.collectionDayBattlesPlayed /
          member.warStats.battleCount
        ).toFixed(2) < clan.clanRequirements.warAvgCollections
      )
        warAvgCollections = "has-background-warning";

      if (
        clan.clanRequirements.hasOwnProperty("cardLevels") &&
        clan.clanRequirements.cardLevels.hasOwnProperty("max") &&
        member.stats.cardLevels.max * 100 < clan.clanRequirements.cardLevels.max
      )
        cardLevelsMax = "has-background-warning";
      if (
        clan.clanRequirements.hasOwnProperty("cardLevels") &&
        clan.clanRequirements.cardLevels.hasOwnProperty("legend") &&
        member.stats.cardLevels.legend * 100 <
          clan.clanRequirements.cardLevels.legend
      )
        cardLevelsLegend = "has-background-warning";
      if (
        clan.clanRequirements.hasOwnProperty("cardLevels") &&
        clan.clanRequirements.cardLevels.hasOwnProperty("gold") &&
        member.stats.cardLevels.gold * 100 <
          clan.clanRequirements.cardLevels.gold
      )
        cardLevelsGold = "has-background-warning";
      if (
        clan.clanRequirements.hasOwnProperty("cardLevels") &&
        clan.clanRequirements.cardLevels.hasOwnProperty("silver") &&
        member.stats.cardLevels.silver * 100 <
          clan.clanRequirements.cardLevels.silver
      )
        cardLevelsSilver = "has-background-warning";
      if (
        clan.clanRequirements.hasOwnProperty("cardLevels") &&
        clan.clanRequirements.cardLevels.hasOwnProperty("bronze") &&
        member.stats.cardLevels.bronze * 100 <
          clan.clanRequirements.cardLevels.bronze
      )
        cardLevelsBronze = "has-background-warning";
    }

    membersBody.innerHTML += `
    <tr >
      <td class='has-text-centered'>${member.rank}</td>
      <td><a target="_blank" href="https://royaleapi.com/player/${
        member.tag
      }">${member.name}</a></td>
      <td class=${classRole} >${member.role}</td>
      <td class=${level} >${member.stats.level}</td>
      <td class='has-text-centered ${requiredTrophies}'>${member.trophies}</td>
      <td class='has-text-centered ${allWinRate}'>${
      member.stats.allWinRate
    }</td>
      <td class='has-text-centered ${warDayWins}'>${
      member.stats.warDayWins
    }</td>
      <td class='has-text-centered'>${member.donations}</td>
      <td class='has-text-centered'>${member.warStats.battleCount}</td>
      <td class='has-text-centered ${warWinRate}'>
      ${(member.stats.warWinRate * 100).toFixed(0)}%
      </td>
      <td class='has-text-centered'}>
      ${
        member.warStats.cardsEarned
          ? (member.warStats.cardsEarned / member.warStats.battleCount).toFixed(
              0
            )
          : "---"
      }
      </td>
      <td class='has-text-centered ${warAvgCollections}'>
      ${
        member.warStats.collectionDayBattlesPlayed
          ? (
              member.warStats.collectionDayBattlesPlayed /
              member.warStats.battleCount
            ).toFixed(2)
          : "---"
      }
      </td>
      
      <td class='has-text-centered ${warAvgCollections}'>
      ${(member.stats.cardLevels.max * 100).toFixed(0)}% 
      </td>
      <td class='has-text-centered ${cardLevelsMax}'>
      ${(member.stats.cardLevels.legend * 100).toFixed(0)}%
      </td>
      <td class='has-text-centered ${cardLevelsGold}'>
      ${(member.stats.cardLevels.gold * 100).toFixed(0)}% 
      </td>
      <td class='has-text-centered ${cardLevelsSilver}'>
      ${(member.stats.cardLevels.silver * 100).toFixed(0)}% 
      </td>
      <td class='has-text-centered ${cardLevelsBronze}'>
        ${(member.stats.cardLevels.bronze * 100).toFixed(0)}%
      </td>
    </tr>
  `;
  });
};
