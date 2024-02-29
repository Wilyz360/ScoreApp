import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import "./NextGames.css";

const NextGames = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data: response } = await axios.get(
          "http://localhost:4000/upcoming"
        );
        setData(response);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="upcoming-games-container">
      <div className="font_text">
        <h1>Upcoming Games</h1>
      </div>
      {loading && (
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
      {!loading &&
        data.map((team) => {
          return (
            <div className="shadow match-details rounded">
              <div className="teams">
                <div className="team">
                  <div style={{ display: "inline" }}>
                    <img alt="" srcset={team.localImage} />
                  </div>
                  {team.localTeam}
                </div>
                <div className="team">
                  <div style={{ display: "inline" }}>
                    <img alt="" srcset={team.awayImage} />
                  </div>
                  {team.awayTeam}
                </div>
              </div>
              <div>
                <div className="time">{team.date}</div>
                <div className="time">{team.time}</div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default NextGames;
