const urls = {
  baseUrl: "https://crproxy.herokuapp.com",
  clanInfo: "/clans",
  clanCurrentRiver: "/currentriverrace",
  clanRiverLog: "/riverracelog",
  player: "/players",
};

/**
 * Tabelas
 */
new Tablesort(document.querySelector("table"), {
  descending: true,
});

/**
 * Fim de tabelas
 */

const fetchClanInfo = async (clanTag) => {
  try {
    const tagEncoded = String(clanTag).includes("#")
      ? encodeURIComponent(String(clanTag).toUpperCase())
      : encodeURIComponent(`#${String(clanTag).toUpperCase()}`);

    const response = await fetch(
      `${urls.baseUrl}${urls.clanInfo}/${tagEncoded}`
    );
    return await response.json();
  } catch (error) {
    console.info("error", error);
    console.info("----------------");
    return error;
  }
};

const fetchClanCurrentRiverInfo = async (clanTag) => {
  try {
    const tagEncoded = String(clanTag).includes("#")
      ? encodeURIComponent(String(clanTag).toUpperCase())
      : encodeURIComponent(`#${String(clanTag).toUpperCase()}`);

    const response = await fetch(
      `${urls.baseUrl}${urls.clanInfo}/${tagEncoded}${urls.clanCurrentRiver}`
    );
    return await response.json();
  } catch (error) {
    console.info("error", error);
    console.info("----------------");
    return error;
  }
};

function getClanTrophiesBadge(trophies) {
  const clanTrophiesBadge = {
    bronze1: "https://royaleapi.com/static/img/ui/cw-l-bronze-1.png",
    bronze2: "https://royaleapi.com/static/img/ui/cw-l-bronze-2.png",
    bronze3: "https://royaleapi.com/static/img/ui/cw-l-bronze-3.png",
    silver1: "https://royaleapi.com/static/img/ui/cw-l-silver-1.png",
    silver2: "https://royaleapi.com/static/img/ui/cw-l-silver-2.png",
    silver3: "https://royaleapi.com/static/img/ui/cw-l-silver-3.png",
    gold1: "https://royaleapi.com/static/img/ui/cw-l-gold-1.png",
    gold2: "https://royaleapi.com/static/img/ui/cw-l-gold-2.png",
    gold3: "https://royaleapi.com/static/img/ui/cw-l-gold-3.png",
    legend: "https://royaleapi.com/static/img/ui/cw-l-legendary.png",
  };

  let badge = "";

  switch (true) {
    case trophies >= 3000:
      badge = clanTrophiesBadge.legend;
      break;
    case trophies >= 2500:
      badge = clanTrophiesBadge.gold3;
      break;
    case trophies >= 2000:
      badge = clanTrophiesBadge.gold2;
      break;
    case trophies >= 1500:
      badge = clanTrophiesBadge.gold1;
      break;
    case trophies >= 1200:
      badge = clanTrophiesBadge.silver3;
      break;
    case trophies >= 900:
      badge = clanTrophiesBadge.silver2;
      break;
    case trophies >= 600:
      badge = clanTrophiesBadge.silver1;
      break;
    case trophies >= 400:
      badge = clanTrophiesBadge.bronze3;
      break;
    case trophies >= 200:
      badge = clanTrophiesBadge.bronze2;
      break;
    default:
      badge = clanTrophiesBadge.bronze1;
      break;
  }
  return badge;
}

const parseDate = (rawDate) => {
  const strDate = String(rawDate);
  const year = strDate.slice(0, 4);
  const month = strDate.slice(4, 6);
  const day = strDate.slice(6, 8);
  const hours = strDate.slice(9, 11);
  const minutes = strDate.slice(11, 13);
  const seconds = strDate.slice(13, 15);
  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
};

window.onload = async () => {
  const clansBody = document.querySelector("#clans");
  const clansGroup = [
    "2QG8V2C9",
    "8VLRRC28",
    "9C9VCRUQ",
    "9CL90JVJ",
    "9LU2Y8LU",
    "9CGQ29LR",
    "Y0RC9CRJ",
    "PQQURYYP",
    "PL20RYLV",
    "P8JYVYGJ",
    "PJV8900L",
  ];

  clansBody.innerHTML = "Loading...";

  clansBody.innerHTML = "";
  const test = await Promise.all(
    clansGroup.map(async (clan) => {
      try {
        const clanInfo = await fetchClanInfo(clan);
        const clanWarInfo = await fetchClanCurrentRiverInfo(clan);

        const body = `
        <tr id="${clanInfo.data.tag}">
          <td class="table-trophies"><img src="${getClanTrophiesBadge(
            clanInfo.data.clanWarTrophies
          )}"></img></td>
          <td>${clanInfo.data.name}</td>
          <td>${clanInfo.data.clanScore}</td>
          <td>${clanInfo.data.clanWarTrophies}</td>
          <td>${clanInfo.data.members}</td>
          <td>${clanWarInfo.data.clan.fame}</td>
          <td>${clanWarInfo.data.clan.repairPoints}</td>
          <td>${parseDate(clanWarInfo.data.clan.finishTime)}</td>
          <td>${clanWarInfo.data.clan["participants"].length}</td>
        </tr>
        `;

        return body;
      } catch (error) {
        console.error(error);
      }
    })
  );

  clansBody.innerHTML = test.join("");
};
