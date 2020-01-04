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
    clansBody.innerHTML += `
    <tr >
      <td>${clan.warTrophies}</td>
      <td><a href="/${clan.tag}">${clan.name}</a></td>
      
    </tr>
  `;
  });
};
