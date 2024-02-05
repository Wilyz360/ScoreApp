import "./App.css";
import { useState, useEffect } from "react";
import Match from "./components/Match";
import axios from "axios";
//import api from "./api/api.js";

function App() {
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: response } = await axios.get("http://localhost:4000/");
        setTeam(response);
      } catch (error) {
        console.log(error.message);
      }
      setLoading(false);
    };
    fetchData();
    //console.log(team);
  }, []);

  return (
    <div className="App">
      {loading && <div>Loading</div>}
      {!loading && (
        <div>
          <h1>Next Match</h1>
          <Match team={team} />
        </div>
      )}
    </div>
  );
}

export default App;
