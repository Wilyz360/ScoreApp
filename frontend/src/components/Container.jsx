import React from "react";
import "./Container.css";
import { Scoreboard } from "./Scoreboard";
import Results from "./Results";
import NextGames from "./NextGames";

function Container() {
  return (
    <div className="container">
      <div className="row mt-4 ">
        <div className="col-12 games-container">
          <Scoreboard />
        </div>
      </div>
      <div className="row mt-4 justify-content-between row-game">
        <div className="col-6">
          <Results />
        </div>
        <div className="col-6">
          <NextGames />
        </div>
      </div>
    </div>
  );
}

export default Container;
