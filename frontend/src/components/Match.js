import React from "react";
import { useState } from "react";
import "./Match.css";

function Match(props) {
  console.log(props.teams);
  return (
    <div className="container">
      <div className="match-container">
        <div className="match-card">
          <div className="teams">
            <div className="team">{props.teams.localTeam}</div>
            <div className="team">{props.teams.awayTeam}</div>
          </div>
          <div className="date-time">
            <div>{props.teams.date}</div>
            <div>{props.teams.time}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Match;
