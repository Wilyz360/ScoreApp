const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
require("dotenv").config();
//const cors = require("cors");

const app = express();
const PORT = 4000;

const myTeam = [
  "arsenal-2",
  "barcelona-5",
  "real-madrid-26",
  "liverpool-18",
  "chelsea-9",
  "newcastle-united-207",
  "brighton-hove-albion-670",
  "manchester-united-21",
  "milan-23",
  "atletico-de-madrid-3",
];

const createMatch = {
  title: "",
  localTeam: "",
  awayTeam: "",
  localScore: undefined,
  awayScore: undefined,
  localImage: "",
  awayImage: "",
  date: "",
  time: "",
};

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
app.use(function (req, res, next) {
  console.log(
    req.method + " " + req.path + " - " + req.ip + " - " + Date.now()
  );
  next();
});

// endpoints

app.get("/live", async (req, res) => {
  const Live = [];
  for (const i of myTeam) {
    const newMatch = Object.create(createMatch);
    try {
      const results = await axios.get(`${process.env.ARSENAL}${i}`);
      const $ = cheerio.load(results.data);

      // === Title
      newMatch.title = "Live";

      // ======    Get next match
      const teamsToPlay = $(
        ".SimpleMatchCardTeam_simpleMatchCardTeam__name__7Ud8D"
      );

      newMatch.localTeam = $(teamsToPlay[0]).text();
      newMatch.awayTeam = $(teamsToPlay[1]).text(); // obj

      console.log(newMatch.title + " teams readed");

      // ===== Get teams images

      const imageClass = $(".ImageWithSets_of-image__ovnCW");

      // === Select image from source

      newMatch.localImage = $(imageClass[0])
        .find(".ImageWithSets_of-image__picture__4hzsN")
        .find("source")
        .attr("srcset");
      newMatch.awayImage = $(imageClass[1])
        .find(".ImageWithSets_of-image__picture__4hzsN")
        .find("source")
        .attr("srcset");

      console.log(newMatch.title + " images readed");

      // ====== Get live time

      const dateClass = $(".title-8-bold");
      newMatch.date = $(dateClass[0]).text();

      // check if it is halftime
      const halfTimeClass = $(".title-8-medium");

      const halfTime = $(halfTimeClass[0]).text();

      if (halfTime == "Half time") {
        newMatch.date = "Half time";
      }

      console.log(newMatch.title + " date readed");

      // // ====== Get live game score

      const scoreClass = $(
        ".SimpleMatchCardTeam_simpleMatchCardTeam__score__UYMc_"
      );

      newMatch.localScore = $(scoreClass[0]).text();
      newMatch.awayScore = $(scoreClass[1]).text();

      console.log(newMatch.title + " live scores readed");

      // ===== Live
      if (newMatch.date.length < 4 || halfTime == "Half time") {
        Live.push(newMatch);
      }
    } catch (error) {
      console.error(error);
    }
  }
  res.status(200).json(Live);
});

app.get("/results", async (req, res) => {
  const Results = [];
  for (const i of myTeam) {
    const newMatch = Object.create(createMatch);
    try {
      const results = await axios.get(`${process.env.ARSENAL}${i}`);
      const $ = cheerio.load(results.data);

      // ====== Title
      newMatch.title = "Results";

      const timeClass = $(
        ".SimpleMatchCard_simpleMatchCard__infoMessage___NJqW"
      );

      let time = $(timeClass[0]).text();

      if (time === "Full time" || time === "Pens") {
        // ======    Get match teams
        const teamsToPlay = $(
          ".SimpleMatchCardTeam_simpleMatchCardTeam__name__7Ud8D"
        );

        newMatch.localTeam = $(teamsToPlay[0]).text();
        newMatch.awayTeam = $(teamsToPlay[1]).text();

        console.log(`${newMatch.title}: teams readed`);

        // ===== Get teams images

        const imageClass = $(".ImageWithSets_of-image__ovnCW");

        newMatch.localImage = $(imageClass[0])
          .find(".ImageWithSets_of-image__picture__4hzsN")
          .find("source")
          .attr("srcset");

        newMatch.awayImage = $(imageClass[1])
          .find(".ImageWithSets_of-image__picture__4hzsN")
          .find("source")
          .attr("srcset");

        console.log(`${newMatch.title}: images readed`);

        // ==== get game score results

        const scoreClass = $(
          ".SimpleMatchCardTeam_simpleMatchCardTeam__score__UYMc_"
        );

        newMatch.localScore = $(scoreClass[0]).text();
        newMatch.awayScore = $(scoreClass[1]).text();

        console.log(`${newMatch.title}: scores readed`);

        // ===== Push result match to Results obj
        Results.push(newMatch);
      }
    } catch (error) {
      console.error(error);
    }
  }
  res.status(200).json(Results);
});

app.get("/upcoming", async (req, res) => {
  const upcoming = [];
  for (const i of myTeam) {
    const newMatch = Object.create(createMatch);
    try {
      const results = await axios.get(`${process.env.ARSENAL}${i}`);
      const $ = cheerio.load(results.data);

      // ====== Title
      newMatch.title = "Upcoming";

      // ======    Get match teams
      const teamsToPlay = $(
        ".SimpleMatchCardTeam_simpleMatchCardTeam__name__7Ud8D"
      );

      const isNext = $(teamsToPlay[2]).text(); // use to check if next game is vesible is the website

      // ===== Get next match teams
      newMatch.title = "Next Match"; // obj

      if (isNext !== "") {
        newMatch.localTeam = $(teamsToPlay[2]).text(); // obj
        newMatch.awayTeam = $(teamsToPlay[3]).text(); // obj

        console.log(`${newMatch.title}: teams readed`);

        // ===== Get teams images

        const imageClass = $(".ImageWithSets_of-image__ovnCW");

        newMatch.localImage = $(imageClass[2])
          .find(".ImageWithSets_of-image__picture__4hzsN")
          .find("source")
          .attr("srcset");

        newMatch.awayImage = $(imageClass[3])
          .find(".ImageWithSets_of-image__picture__4hzsN")
          .find("source")
          .attr("srcset");

        console.log(`${newMatch.title}: images readed`);

        // ====== Get next match date

        const dateClass = $(".title-8-bold");
        let date = $(dateClass[1]).text();
        newMatch.date = date; // obj

        console.log(`${newMatch.title}: date readed`);

        // ====== Get next match time

        const timeClass = $(
          ".SimpleMatchCard_simpleMatchCard__infoMessage___NJqW"
        );

        let time = $(timeClass[1]).text();
        if (time == undefined) {
          // if timeClass is empty it will be no game to play on that date
          (newMatch.time = ""), (newMatch.date = "Postponed");
        } else {
          newMatch.time = time; // obj
        }

        if (date === time) {
          // date has the same name class and time and this happens when the game is schedule for tomorrow
          newMatch.date = "Tomorrow";
        }

        console.log(`${newMatch.title}: time readed`);

        upcoming.push(newMatch);
      }
    } catch (error) {
      console.error(error);
    }
  }
  res.status(200).json(upcoming);
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
