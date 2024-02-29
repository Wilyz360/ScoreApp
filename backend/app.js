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
  "liverpool-18",
  "chelsea-9",
  "newcastle-united-207",
  "brighton-hove-albion-670",
  "manchester-united-21",
  "milan-23",
  "juventus-17",
];

const createMatch = {
  title: "",
  localTeam: "",
  awayTeam: "",
  localScore: undefined,
  awayScore: undefined,
  localImage: "",
  awaitImage: "",
  date: "",
  time: "",
  live: false,
};

app.get("/live", async (req, res) => {
  const Live = [];
  for (const i of myTeam) {
    const newMatch = Object.create(createMatch);
    try {
      const results = await axios.get(`${process.env.ARSENAL}${i}`);
      const $ = cheerio.load(results.data);

      // ======    Get next match
      const teamsToPlay = $(
        ".SimpleMatchCardTeam_simpleMatchCardTeam__name__7Ud8D"
      );

      newMatch.title = "Live Match"; // obj

      newMatch.localTeam = $(teamsToPlay[0]).text();
      newMatch.awayTeam = $(teamsToPlay[1]).text(); // obj

      // ===== Get teams images

      const imageClass = $(".ImageWithSets_of-image__ovnCW");

      const images = [];

      // select img from source
      imageClass.each(function (i, element) {
        const a = $(this);
        const image = a
          .find(".ImageWithSets_of-image__picture__4hzsN")
          .find("source")
          .attr("srcset");
        images.push(image);
      });

      newMatch.localImage = images[0];
      newMatch.awayImage = images[1];

      // ====== Get live time

      const dateClass = $(".title-8-bold");

      newMatch.date = $(dateClass[0]).text();

      // check if it is halftime
      const halfTimeClass = $(".title-8-medium");

      const halfTime = $(halfTimeClass[0]).text();

      if (halfTime == "Half time") {
        newMatch.date = "Half time";
      }
      // // ====== Get game score

      const scoreClass = $(
        ".SimpleMatchCardTeam_simpleMatchCardTeam__score__UYMc_"
      );

      newMatch.localScore = $(scoreClass[0]).text();
      newMatch.awayScore = $(scoreClass[1]).text();

      // ===== Live
      newMatch.live = true;
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

      // ======    Get match teams
      const teamsToPlay = $(
        ".SimpleMatchCardTeam_simpleMatchCardTeam__name__7Ud8D"
      );

      newMatch.localTeam = $(teamsToPlay[0]).text();
      newMatch.awayTeam = $(teamsToPlay[1]).text();

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

      // if date.length is greater than 4 then add to results

      const dateClass = $(".title-8-bold");
      const date = $(dateClass[0]).text();
      console.log(date);
      newMatch.date = date.length; // obj

      // ==== get game score results

      const scoreClass = $(
        ".SimpleMatchCardTeam_simpleMatchCardTeam__score__UYMc_"
      );

      newMatch.localScore = $(scoreClass[0]).text();
      newMatch.awayScore = $(scoreClass[1]).text();

      newMatch.live = true; // obj

      if (newMatch.date <= 10) {
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

      // ======    Get match teams
      const teamsToPlay = $(
        ".SimpleMatchCardTeam_simpleMatchCardTeam__name__7Ud8D"
      );

      const isNext = $(teamsToPlay[2]).text();

      // ===== Get next match teams
      newMatch.title = "Next Match"; // obj
      if (isNext !== undefined) {
        newMatch.localTeam = $(teamsToPlay[2]).text(); // obj
        newMatch.awayTeam = $(teamsToPlay[3]).text(); // obj

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

        // ====== Get next match date

        const dates = [];
        const dateClass = $(".title-8-bold");
        for (const i of dateClass) {
          dates.push($(i).text());
        }

        let date = $(dateClass[1]).text();

        console.log(date);
        newMatch.date = date; // obj

        // ====== Get next match time

        const timeClass = $(
          ".SimpleMatchCard_simpleMatchCard__infoMessage___NJqW"
        );

        let time = $(timeClass[1]).text();
        if (time == undefined) {
          (newMatch.time = ""), (newMatch.date = "Postponed");
        } else {
          newMatch.time = time; // obj
        }
        console.log(time);

        newMatch.live = false;

        upcoming.push(newMatch);
      }
    } catch (error) {
      console.error(error);
    }
  }
  res.status(200).json(upcoming);
});

app.get("/img", async (req, res) => {
  try {
    const results = await axios.get(`${process.env.ARSENAL}${myTeam[0]}`);
    const $ = cheerio.load(results.data);

    // ======    Get images teams
    const imageClass = $(".ImageWithSets_of-image__ovnCW");

    const images = [];

    // select img from source
    imageClass.each(function (i, element) {
      const a = $(this);
      const image = a
        .find(".ImageWithSets_of-image__picture__4hzsN")
        .find("source")
        .attr("srcset");
      images.push(image);
    });

    res.json({ img1: images[0], img2: images[1] });
  } catch (error) {
    console.error(error);
  }
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
