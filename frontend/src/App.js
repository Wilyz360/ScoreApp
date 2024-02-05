import "./App.css";
import Match from "./components/Match";

//import scores from "./script/scores.js";

function App() {
  return (
    <div className="App">
      <Match local="Arsenal" away="Liverpool" date="Today" time="11/02/2024" />
      <Match local="Newcastle" away="Luton" date="Today" time="10:00" />
    </div>
  );
}

export default App;
