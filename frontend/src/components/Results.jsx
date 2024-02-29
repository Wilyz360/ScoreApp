import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import "./Results.css";

const Results = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data: response } = await axios.get(
          "http://localhost:4000/results"
        );
        setData(response);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    })();
  }, []);
  return (
    <div className="results-container">
      <div className="font_text">
        <h1>Results</h1>
      </div>
      {loading && (
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
      {!loading &&
        data.map((team) => {
          return (
            <div className="shadow result-details rounded">
              <div className="teams">
                <div className="team">
                  <div style={{ display: "inline" }}>
                    <img alt="Arsenal" srcset={team.localImage} />
                  </div>
                  {team.localTeam}
                </div>
                <div className="team">
                  <div style={{ display: "inline" }}>
                    <img alt="Arsenal" srcset={team.awayImage} />
                  </div>
                  {team.awayTeam}
                </div>
              </div>
              <div className="teams">
                <div className="result-score">{team.localScore}</div>
                <div className="result-score">{team.awayScore}</div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Results;
