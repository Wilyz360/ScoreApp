import React from "react";
import "./Match.css";

function Match(props) {
  //console.log(props.teams);

  return (
    <div className="container">
      <div className="match-container">
        <div className="match-card">
          <div className="teams">
            <div className="team">
              <span>{props.teams.localTeam}</span>
              {props.teams.localScore !== "" ? (
                <span className="scores">{props.teams.localScore}</span>
              ) : null}
            </div>
            <div className="team">
              <span>{props.teams.awayTeam}</span>
              {props.teams.awayScore !== "" ? (
                <span className="scores">{props.teams.awayScore}</span>
              ) : null}
            </div>
          </div>
          <div className="date-time">
            <div>
              <span>{props.teams.date}</span>
            </div>
            <div>
              <span>{props.teams.time}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Match;
