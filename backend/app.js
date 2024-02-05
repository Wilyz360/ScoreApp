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
];

const createMatch = {
  title: "",
  localTeam: "",
  awayTeam: "",
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

      // ======    Get next match
      const teamsToPlay = $(
        ".SimpleMatchCardTeam_simpleMatchCardTeam__name__7Ud8D"
      );

      newMatch.title = "Next Match"; // obj

      const teams = [];
      for (const i of teamsToPlay) {
        teams.push($(i).text());
      }

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

      newMatch.success = true; // obj
      allMatches.push(newMatch);

      // res.status(200).json({
      //   title: "Next Match",
      //   localTeam: teams[2],
      //   awayTeam: teams[3],
      //   date: date,
      //   time: time,
      //   live: false,
      //   success: true,
      // });
    } catch (error) {
      console.error(error);
    }
  }
  res.status(200).json(allMatches);
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
