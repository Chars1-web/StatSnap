export default async function handler(req, res) {
  const key = process.env.API_SPORTS_KEY;

  if (!key) {
    return res.status(500).json({
      error: "Missing API_SPORTS_KEY environment variable in Vercel."
    });
  }

  const sport = String(req.query.sport || "nfl").toLowerCase();
  const path = String(req.query.path || "/status");

  const hosts = {
    nfl: "https://v1.american-football.api-sports.io",
    nba: "https://v2.nba.api-sports.io",
    mlb: "https://v1.baseball.api-sports.io",
    soccer: "https://v3.football.api-sports.io"
  };

  if (!hosts[sport]) {
    return res.status(400).json({
      error: "sport must be nfl, nba, mlb, or soccer"
    });
  }

  if (
    !path.startsWith("/") ||
    path.startsWith("//") ||
    path.includes("://")
  ) {
    return res.status(400).json({
      error: "Invalid API path"
    });
  }

  try {
    const response = await fetch(hosts[sport] + path, {
      headers: {
        "x-apisports-key": key
      }
    });

    const data = await response.json();

    res.setHeader(
      "Cache-Control",
      "s-maxage=60, stale-while-revalidate=300"
    );

    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(502).json({
      error: "Could not reach the sports API."
    });
  }
}