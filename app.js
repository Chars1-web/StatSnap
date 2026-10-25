const demo = {
  NFL: [
    { name: "Patrick Mahomes", team: "Kansas City", stat: "Pass Yds", value: 3928 },
    { name: "Josh Allen", team: "Buffalo", stat: "Pass Yds", value: 3850 },
    { name: "Lamar Jackson", team: "Baltimore", stat: "Pass Yds", value: 3678 },
    { name: "Jalen Hurts", team: "Philadelphia", stat: "Pass Yds", value: 3540 },
    { name: "Joe Burrow", team: "Cincinnati", stat: "Pass Yds", value: 3412 }
  ],

  NBA: [
    { name: "Player One", team: "Team A", stat: "PPG", value: 30.1 },
    { name: "Player Two", team: "Team B", stat: "PPG", value: 28.4 },
    { name: "Player Three", team: "Team C", stat: "PPG", value: 27.2 },
    { name: "Player Four", team: "Team D", stat: "PPG", value: 25.9 },
    { name: "Player Five", team: "Team E", stat: "PPG", value: 24.8 }
  ],

  MLB: [
    { name: "Player One", team: "Team A", stat: "HR", value: 48 },
    { name: "Player Two", team: "Team B", stat: "HR", value: 44 },
    { name: "Player Three", team: "Team C", stat: "HR", value: 41 },
    { name: "Player Four", team: "Team D", stat: "HR", value: 38 },
    { name: "Player Five", team: "Team E", stat: "HR", value: 35 }
  ],

  Soccer: [
    { name: "Player One", team: "Club A", stat: "Goals", value: 28 },
    { name: "Player Two", team: "Club B", stat: "Goals", value: 25 },
    { name: "Player Three", team: "Club C", stat: "Goals", value: 23 },
    { name: "Player Four", team: "Club D", stat: "Goals", value: 21 },
    { name: "Player Five", team: "Club E", stat: "Goals", value: 19 }
  ]
};

let currentSport = "NFL";

function renderRows(sport, query = "", sort = "value") {
  const rows = (demo[sport] || demo.NFL).filter(player =>
    (player.name + " " + player.team)
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  if (sort === "name") {
    rows.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    rows.sort((a, b) => b.value - a.value);
  }

  const tbody = document.getElementById("leaderRows");

  if (!tbody) return;

  tbody.innerHTML = rows.map((player, index) => `
    <tr>
      <td>${index + 1}</td>
      <td><strong>${player.name}</strong></td>
      <td>${player.team}</td>
      <td>${player.stat}</td>
      <td class="stat-value">${player.value.toLocaleString()}</td>
    </tr>
  `).join("") || `
    <tr><td colspan="5">No matching demo players.</td></tr>
  `;

  const title = document.getElementById("leaderTitle");

  if (title) {
    title.textContent = sport + " leaders";
  }
}

function setupHome() {
  document.querySelectorAll(".sport-card").forEach(button => {
    button.addEventListener("click", () => {
      currentSport = button.dataset.sport;

      document.querySelectorAll(".sport-card").forEach(card => {
        card.classList.toggle("selected", card === button);
      });

      renderRows(
        currentSport,
        document.getElementById("playerSearch")?.value || ""
      );
    });
  });

  const search = document.getElementById("playerSearch");

  const runSearch = () => {
    renderRows(currentSport, search?.value || "");

    const message = document.getElementById("searchMessage");

    if (message) {
      message.textContent =
        "Searching sample data only — connect the API to search real players.";
    }
  };

  document.getElementById("searchBtn")?.addEventListener("click", runSearch);

  search?.addEventListener("keydown", event => {
    if (event.key === "Enter") runSearch();
  });
}

function setupLeaderboard() {
  const sport = document.getElementById("sportSelect");
  const sort = document.getElementById("sortSelect");

  if (!sport) return;

  const update = () => {
    renderRows(sport.value, "", sort.value);
  };

  sport.addEventListener("change", update);
  sort.addEventListener("change", update);

  update();
}

function setupCompare() {
  const playerA = document.getElementById("playerA");
  const playerB = document.getElementById("playerB");
  const output = document.getElementById("compareResult");

  if (!output) return;

  const players = [
    {
      name: "Patrick Mahomes (demo)",
      team: "Kansas City",
      metrics: [
        ["Passing yards", 3928],
        ["Touchdowns", 26],
        ["Completion %", 67.2]
      ]
    },
    {
      name: "Josh Allen (demo)",
      team: "Buffalo",
      metrics: [
        ["Passing yards", 3850],
        ["Touchdowns", 29],
        ["Completion %", 63.6]
      ]
    }
  ];

  const draw = () => {
    const selected = [
      players[Number(playerA.value)],
      players[Number(playerB.value)]
    ];

    output.innerHTML = selected.map(player => `
      <article class="player-card">
        <h2>${player.name}</h2>
        <div class="team">${player.team}</div>

        ${player.metrics.map(metric => `
          <div class="metric">
            <span>${metric[0]}</span>
            <b>${metric[1]}</b>
          </div>
        `).join("")}
      </article>
    `).join("");
  };

  playerA.addEventListener("change", draw);
  playerB.addEventListener("change", draw);

  draw();
}

setupHome();
setupLeaderboard();
setupCompare();