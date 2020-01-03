const membersBody = document.querySelector("#members");
const clanName = document.querySelector("#clanName");
const clanDesc = document.querySelector("#clanDesc");
const clanRequirements = document.querySelector("#clanRequirements");

async function getClanInfo() {
  // const clanTag = window.location.pathname;
  const clanTag = "/8VLRRC28";
  try {
    return fetch("/api/v1/clan" + clanTag)
      .then(resp => resp.json())
      .then(json => {
        return json.data;
      });
  } catch (error) {
    console.log("ops");
  }
}
window.onload = async () => {
  const clan = await getClanInfo();

  clanName.innerHTML = `${clan.name} Members`;
  clanDesc.innerHTML = `${clan.description}`;
  if (clan.clanRequirements)
    clanRequirements.innerHTML = `
    Requirements:
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

  clan.members.map(member => {
    if (member.inClan === true) {
      let classRole,
        classCardsLimit,
        classWarLimit = "";

      if (member.role === "leader") classRole = "has-text-primary";
      if (member.role === "coLeader") classRole = "has-text-info";
      if (member.role === "elder") classRole = "has-text-success";
      if (
        clan.clanRequirements.warWinRate &&
        member.stats.warWinRate * 100 < clan.clanRequirements.warWinRate
      )
        classWarLimit = "has-background-warning";
      if (
        clan.clanRequirements.cardLevels.max &&
        member.stats.cardLevels.max * 100 < clan.clanRequirements.cardLevels.max
      )
        classCardsLimit = "has-background-warning";
      if (
        clan.clanRequirements.cardLevels.legend &&
        member.stats.cardLevels.legend * 100 <
          clan.clanRequirements.cardLevels.legend
      )
        classCardsLimit = "has-background-warning";
      if (
        clan.clanRequirements.cardLevels.gold &&
        member.stats.cardLevels.gold * 100 <
          clan.clanRequirements.cardLevels.gold
      )
        classCardsLimit = "has-background-warning";

      membersBody.innerHTML += `
        <tr >
          <td>${member.rank}</td>
          <td><a target="_blank" href="https://royaleapi.com/player/${
            member.tag
          }">${member.name}</a></td>
          <td class=${classRole} >${member.role}</td>
          <td class=${classWarLimit}>
          ${(member.stats.warWinRate * 100).toFixed(0)}%
          </td>
          <td>${member.stats.warDayWins}</td>
          <td>${member.trophies}</td>
          <td>${member.donations}</td>
          <td class=${classCardsLimit}>
            ${(member.stats.cardLevels.max * 100).toFixed(0)}% MAX | 
            ${(member.stats.cardLevels.legend * 100).toFixed(0)}% L | 
            ${(member.stats.cardLevels.gold * 100).toFixed(0)}% G | 
            ${(member.stats.cardLevels.silver * 100).toFixed(0)}% S | 
            ${(member.stats.cardLevels.bronze * 100).toFixed(0)}% B
          </td>
        </tr>
      `;
    }
  });
};
