import React from "react";
import { useState } from "react";
import "./Match.css";

function Match(props) {
  console.log(props.team);
  return (
    <div className="container">
      <div className="match-container">
        <div className="match-card">
          <div className="teams">
            <div className="team">{props.team.localTeam}</div>
            <div className="team">{props.team.awayTeam}</div>
          </div>
          <div className="date-time">
            <div>{props.team.date}</div>
            <div>{props.team.time}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Match;
