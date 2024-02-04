import React from "react";
import "./Match.css";

function Match({ local, away, time, date }) {
  return (
    <div className="container">
      <div className="match-container">
        <div className="match-card">
          <div className="teams">
            <div className="team">{local}</div>
            <div className="team">{away}</div>
          </div>
          <div className="date-time">
            <div>{date}</div>
            <div>{time}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Match;
