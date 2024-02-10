const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
require("dotenv").config();
//const cors = require("cors");

const app = express();
const PORT = 4000;

// middleware
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// endpoints

const myTeam = [
  "arsenal-2",
  "barcelona-5",
  "real-madrid-26",
  "juventus-17",
  "liverpool-18",
  "newcastle-united-207",
  "valencia-143",
];

const createMatch = {
  title: "",
  localTeam: "",
  awayTeam: "",
  localScore: undefined,
  awayScore: undefined,
  date: "",
  time: "",
  live: false,
  success: false,
};

app.get("/", async (req, res) => {
  const allMatches = [];
  for (const i of myTeam) {
    const newMatch = Object.create(createMatch);
    try {
      const results = await axios.get(`${process.env.ARSENAL}${i}`);
      const $ = cheerio.load(results.data);

      // ======    Get next match teams
      const teamsToPlay = $(
        ".SimpleMatchCardTeam_simpleMatchCardTeam__name__7Ud8D"
      );

      let teams = [];
      for (const i of teamsToPlay) {
        teams.push($(i).text());
      }

      if (teams[2] == undefined) {
        newMatch.title = "Live Match"; // obj

        console.log(teams[0], teams[1]);

        newMatch.localTeam = teams[0]; // obj
        newMatch.awayTeam = teams[1]; // obj

        // // ====== Get next match date

        const dates = [];
        const dateClass = $(".title-8-bold");
        for (const i of dateClass) {
          dates.push($(i).text());
        }
        const date = dates[0];
        console.log(date);
        newMatch.date = date; // obj

        // // ====== Get next match time

        const scoreClass = $(
          ".SimpleMatchCardTeam_simpleMatchCardTeam__score__UYMc_"
        );
        const scores = [];
        for (const i of scoreClass) {
          scores.push($(i).text());
        }

        console.log(scores[0], scores[1]);
        newMatch.localScore = scores[0];
        newMatch.awayScore = scores[1];

        // ===== Live
        newMatch.live = true;
        newMatch.success = true;

        allMatches.push(newMatch);
      } else {
        newMatch.title = "Next Match"; // obj

        console.log(teams[2], teams[3]);
        newMatch.localTeam = teams[2]; // obj
        newMatch.awayTeam = teams[3]; // obj

        // ====== Get next match date

        const dates = [];
        const dateClass = $(".title-8-bold");
        for (const i of dateClass) {
          dates.push($(i).text());
        }
        const date = dates[1];
        console.log(date);
        newMatch.date = date; // obj

        // ====== Get next match time

        const timeClass = $(
          ".SimpleMatchCard_simpleMatchCard__infoMessage___NJqW"
        );

        const times = [];
        for (const i of timeClass) {
          times.push($(i).text());
        }
        const time = times[1];
        console.log(time);
        newMatch.time = time; // obj

        newMatch.live = false;

        newMatch.success = true; // obj

        allMatches.push(newMatch);
      }
    } catch (error) {
      console.error(error);
    }
  }
  res.status(200).json(allMatches);
});

const newCastle = "newcastle-united-207";

app.get("/liveNow", async (req, res) => {
  const newMatch = Object.create(createMatch);
  try {
    const results = await axios.get(`${process.env.ARSENAL}${newCastle}`);
    const $ = cheerio.load(results.data);

    // ======    Get next match
    const teamsToPlay = $(
      ".SimpleMatchCardTeam_simpleMatchCardTeam__name__7Ud8D"
    );

    newMatch.title = "Live Match"; // obj

    const teams = [];
    for (const i of teamsToPlay) {
      teams.push($(i).text());
    }

    console.log(teams[0], teams[1]);
    newMatch.localTeam = teams[0]; // obj
    newMatch.awayTeam = teams[1]; // obj

    // // ====== Get next match date

    const dates = [];
    const dateClass = $(".title-8-bold");
    for (const i of dateClass) {
      dates.push($(i).text());
    }
    const date = dates[0];
    console.log(date);
    newMatch.date = date; // obj

    // // ====== Get next match time

    const scoreClass = $(
      ".SimpleMatchCardTeam_simpleMatchCardTeam__score__UYMc_"
    );
    const scores = [];
    for (const i of scoreClass) {
      scores.push($(i).text());
    }

    console.log(scores[0], scores[1]);
    newMatch.localScore = scores[0];
    newMatch.awayScore = scores[1];

    // ===== Live
    newMatch.live = true;
    newMatch.success = true;

    allMatches.push(newMatch);

    res.status(200).json({ newMatch });
  } catch (error) {
    console.error(error);
  }
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
