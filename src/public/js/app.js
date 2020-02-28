const membersBody = document.querySelector("#members");
const clanName = document.querySelector("#clanName");
const clanDesc = document.querySelector("#clanDesc");
const clanRequirements = document.querySelector("#clanRequirements");
const clanUpdated = document.querySelector("#clanUpdated");
const th = document.getElementsByTagName("th");
const average = document.querySelector("#average");
const topDonators = document.querySelector("#topDonators");
const lastDonators = document.querySelector("#lastDonators");
const topWarWinRate = document.querySelector("#topWarWinRate");
const lastWarWinRate = document.querySelector("#lastWarWinRate");
const topWarCollections = document.querySelector("#topWarCollections");
const lastWarCollections = document.querySelector("#lastWarCollections");

new Tablesort(document.querySelector("table"), {
  descending: true
});

function compareValues(key, order = "asc") {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      console.log("property doesn't exist on either object");
      return 0;
    }

    const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
    const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];
    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return order === "desc" ? comparison * -1 : comparison;
  };
}

function compareSubValues(prop, arr, order = "asc") {
  prop = prop.split(".");
  var len = prop.length;

  // return order === "desc" ? comparison * -1 : comparison;

  arr.sort(function(a, b) {
    var i = 0;
    while (i < len) {
      a = a[prop[i]];
      b = b[prop[i]];
      i++;
    }
    if (a < b) {
      return order === "desc" ? -1 : 1;
    } else if (a > b) {
      return order === "desc" ? 1 : -1;
    } else {
      return 0;
    }
  });
  return arr;
}

async function getClanInfo() {
  const baseUrl = window.location.href;
  const url = new URL(baseUrl);
  const clanTag = url.searchParams.get("tag");

  try {
    return fetch("https://crboard.herokuapp.com/api/v1/clan/" + clanTag)
      .then(resp => resp.json())
      .then(json => {
        return json.data;
      });
  } catch (error) {
    console.log("ops", error.message);
  }
}
window.onload = async () => {
  const totals = {
    level: 0,
    trophies: 0,
    allWinRate: 0,
    warDayWins: 0,
    donations: 0,
    battleCount: 0,
    warMia: 0,
    warWinRate: 0,
    warCardsEarned: 0,
    warAvgCollections: 0,
    cardMax: 0,
    cardLegend: 0,
    cardGold: 0,
    cardSilver: 0,
    cardBronze: 0
  };
  let activeMembers = 0;

  membersBody.innerHTML = "Loading...";
  const clan = await getClanInfo();
  membersBody.innerHTML = "";

  document.title = `${clan.name} (#${clan.tag})`;
  // clanName.innerHTML = `${clan.name} (<a href="https://link.clashroyale.com/en?clan?id=${clan.tag}">#${clan.tag}</a>)`;
  clanName.innerHTML = `${clan.name} (#${clan.tag})`;
  clanDesc.innerHTML = `${clan.description}`;
  clanUpdated.innerHTML = `Updated ${moment(clan.updatedAt).fromNow()} with ${
    clan.members.length
  } members ${
    clan.lastWarDate
      ? `(Last war data was ${moment(clan.lastWarDate).fromNow()})`
      : ""
  }`;

  clan.members.map(member => {
    member.warStats.battleCount > 0 ? (activeMembers += 1) : null;

    totals.level += member.stats.level || 0;
    totals.trophies += member.trophies || 0;
    totals.allWinRate += member.stats.allWinRate || 0;
    totals.warDayWins += member.stats.warDayWins || 0;
    totals.donations += member.donations || 0;
    totals.battleCount += member.warStats.battleCount || 0;
    totals.warMia += member.warStats.battlesMissed || 0;
    totals.warWinRate +=
      Number((member.stats.warWinRate * 100).toFixed(0)) || 0;
    totals.warCardsEarned +=
      Number(
        (member.warStats.cardsEarned / member.warStats.battleCount).toFixed(0)
      ) || 0;
    totals.warAvgCollections +=
      Number(
        (
          member.warStats.collectionDayBattlesPlayed /
          member.warStats.battleCount
        ).toFixed(2)
      ) || 0;
    totals.cardMax +=
      Number((member.stats.cardLevels.max * 100).toFixed(0)) || 0;
    totals.cardLegend +=
      Number((member.stats.cardLevels.legend * 100).toFixed(0)) || 0;
    totals.cardGold +=
      Number((member.stats.cardLevels.gold * 100).toFixed(0)) || 0;
    totals.cardSilver +=
      Number((member.stats.cardLevels.silver * 100).toFixed(0)) || 0;
    totals.cardBronze +=
      Number((member.stats.cardLevels.bronze * 100).toFixed(0)) || 0;

    let classRole = "",
      requiredTrophies = "",
      warDayWins = "",
      classWarMia = "",
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
        level = "has-background-warning has-text-centered";
      else level = "has-text-centered";
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
        clan.clanRequirements.hasOwnProperty("warMia") &&
        member.stats.warMia < clan.clanRequirements.warMia
      )
        classWarMia = "has-background-warning";

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
      <td class='has-text-centered'>${member.rank} ${
      member.rank < member.previousClanRank
        ? '<img style="width:0.8em" src="/img/green.png"></img>'
        : member.rank > member.previousClanRank
        ? '<img style="width:0.8em" src="/img/red.png"></img>'
        : ""
    }</td>
      <td><a target="_blank" href="https://royaleapi.com/player/${
        member.tag.split("#")[1]
      }">${member.name}</a></td>
      <td class=${classRole} >${member.role}</td>
      <td class=${level} >${member.stats.level}</td>
      <td class="table-trophies has-text-centered ${requiredTrophies}">
        <img src="${getPlayerTrophiesBadge(member.trophies)}"></img>
      </td>
      <td class="has-text-centered ${requiredTrophies}">
        ${member.trophies}
      </td>
      <td class='has-text-centered ${allWinRate}'>${
      member.stats.allWinRate
    }</td>
      <td class='has-text-centered ${warDayWins}'>${
      member.stats.warDayWins
    }</td>
      <td class='has-text-centered'>${member.donations}</td>
      <td class='has-text-centered'>${member.warStats.battleCount}</td>
      <td class='has-text-centered'>${member.warStats.battlesMissed}</td>
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
      
      <td class='has-text-centered ${cardLevelsMax}'>
      ${(member.stats.cardLevels.max * 100).toFixed(0)}% 
      </td>
      <td class='has-text-centered ${cardLevelsLegend}'>
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

  // Top 5 Stuff
  const membersOrderByName = clan.members.sort(compareValues("name"));

  // Top 5 War Win Rate
  const byWarWinRate = compareSubValues("stats.warWinRate", membersOrderByName);
  byWarWinRate.slice(0, 5).map((member, index) => {
    topWarWinRate.innerHTML += `
      <li>${index + 1} - ${member.name} (${(
      member.stats.warWinRate * 100
    ).toFixed(0)}% (${member.warStats.battlesPlayed}/10 wars)</li>
    `;
  });

  // Last 5 War Win Rate
  byWarWinRate
    .slice(byWarWinRate.length - 5, byWarWinRate.length)
    .map((member, index) => {
      lastWarWinRate.innerHTML += `
      <li>${byWarWinRate.length - 4 + index} - ${member.name} (${(
        member.stats.warWinRate * 100
      ).toFixed(0)}% (${member.warStats.battlesPlayed}/10 wars)</li>
    `;
    });

  // Top 5 Donations
  const byDonations = membersOrderByName.sort(
    compareValues("donations", "desc")
  );
  byDonations.slice(0, 5).map((member, index) => {
    topDonators.innerHTML += `
    <li>${index + 1} - ${member.name} (${member.donations})</li>
    `;
  });

  // Last 5 Donations
  byDonations
    .slice(byDonations.length - 5, byDonations.length)
    .map((member, index) => {
      lastDonators.innerHTML += `
    <li>${byDonations.length - 4 + index} - ${member.name} (${
        member.donations
      })</li>
    `;
    });

  average.innerHTML = `
    <th class="has-text-centered"> - </th>  
    <th class="has-text-centered">Global Average</th>
    <th class="has-text-centered"> --- </th>
    <th class="has-text-centered">${(totals.level / clan.memberCount).toFixed(
      0
    )}</th>
    <th class="has-text-centered"> --- </th>
    <th class="numeric-sort has-text-centered">${(
      totals.trophies / clan.memberCount
    ).toFixed(0)}</th>
    <th class="numeric-sort has-text-centered">${(
      totals.allWinRate / clan.memberCount
    ).toFixed(0)}</th>
    <th class="numeric-sort has-text-centered">${(
      totals.warDayWins / clan.memberCount
    ).toFixed(0)}</th> 
    <th class="numeric-sort has-text-centered">${(
      totals.donations / clan.memberCount
    ).toFixed(0)}</th>
    <th class="numeric-sort has-text-centered">${(
      totals.battleCount / clan.memberCount
    ).toFixed(0)}</th>
    <th class="numeric-sort has-text-centered">${(
      totals.warMia / clan.memberCount
    ).toFixed(2)}</th>
    <th class="numeric-sort has-text-centered">${(
      totals.warWinRate / activeMembers
    ).toFixed(0)}%</th>
    <th class="numeric-sort has-text-centered">${(
      totals.warCardsEarned / clan.memberCount
    ).toFixed(0)}</th>
    <th class="numeric-sort has-text-centered">${(
      totals.warAvgCollections / clan.memberCount
    ).toFixed(2)}</th>
    <th class="has-text-centered"><abbr title="Cards Max">${(
      totals.cardMax / clan.memberCount
    ).toFixed(0)}%</th>
    <th class="has-text-centered"><abbr title="Cards Legend">${(
      totals.cardLegend / clan.memberCount
    ).toFixed(0)}%</th>
    <th class="has-text-centered"><abbr title="Cards Gold">${(
      totals.cardGold / clan.memberCount
    ).toFixed(0)}%</th>
    <th class="has-text-centered"><abbr title="Cards Silver">${(
      totals.cardSilver / clan.memberCount
    ).toFixed(0)}%</th>
    <th class="has-text-centered"><abbr title="Cards Bronze">${(
      totals.cardBronze / clan.memberCount
    ).toFixed(0)}%</th>
  `;
};

function getPlayerTrophiesBadge(trophies) {
  const playerTrophiesBadge = {
    ultimateChampion: "https://royaleapi.com/static/img/arenas/arena22.png",
    royalChampion: "https://royaleapi.com/static/img/arenas/arena21.png",
    grandChampion: "https://royaleapi.com/static/img/arenas/arena20.png",
    champion: "https://royaleapi.com/static/img/arenas/arena19.png",
    master3: "https://royaleapi.com/static/img/arenas/arena18.png",
    master2: "https://royaleapi.com/static/img/arenas/arena17.png",
    master1: "https://royaleapi.com/static/img/arenas/arena16.png",
    challenger3: "https://royaleapi.com/static/img/arenas/arena15.png",
    challenger2: "https://royaleapi.com/static/img/arenas/arena14.png",
    legendary: "https://royaleapi.com/static/img/arenas/arena13.png"
  };

  let badge = "";

  switch (true) {
    case trophies >= 7000:
      badge = playerTrophiesBadge.ultimateChampion;
      break;
    case trophies >= 6600:
      badge = playerTrophiesBadge.royalChampion;
      break;
    case trophies >= 6300:
      badge = playerTrophiesBadge.grandChampion;
      break;
    case trophies >= 6000:
      badge = playerTrophiesBadge.champion;
      break;
    case trophies >= 5600:
      badge = playerTrophiesBadge.master3;
      break;
    case trophies >= 5300:
      badge = playerTrophiesBadge.master2;
      break;
    case trophies >= 5000:
      badge = playerTrophiesBadge.master1;
      break;
    case trophies >= 4600:
      badge = playerTrophiesBadge.challenger3;
      break;
    case trophies >= 4300:
      badge = playerTrophiesBadge.challenger2;
      break;
    case trophies >= 4000:
      badge = playerTrophiesBadge.legendary;
      break;
    default:
      badge = "";
      break;
  }
  return badge;
}
