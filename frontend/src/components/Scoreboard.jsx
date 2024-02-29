import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import "./Scoreboard.css";

export const Scoreboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data: response } = await axios.get(
          "http://localhost:4000/live"
        );
        setData(response);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="playing-container">
      <div className="text-center font_text">
        <h1>Live</h1>
      </div>
      {loading && (
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
      {!loading &&
        data.map((team) => {
          return (
            <div className="shadow scoreboard rounded">
              <div className="team away-team">
                <div style={{ display: "inline" }}>
                  <img alt=" " srcset={team.localImage} />
                </div>
                {team.localTeam}
              </div>
              <div className="score">
                <div>
                  {team.localScore} - {team.awayScore}{" "}
                </div>
                <div className="live-time">{team.date}</div>
              </div>
              <div className="team local-team">
                <div style={{ display: "inline" }}>
                  <img alt="" srcset={team.awayImage} />
                </div>
                {team.awayTeam}
              </div>
            </div>
          );
        })}
    </div>
  );
};
