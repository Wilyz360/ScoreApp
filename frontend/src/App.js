import "./App.css";
import ball from "./imgs/ball.jpg";
import Container from "./components/Container";

function App() {
  return (
    <div className="App">
      <div className="w-25 position-absolute top-0 start-0">
        <img src={ball} alt="ball" srcset="" />
      </div>
      <Container />
    </div>
  );
}

export default App;
