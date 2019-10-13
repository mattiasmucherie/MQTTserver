import React from "react";
import "./App.css";

function App() {
  async function handleClick(e) {
    try {
      const data = { message: e.target.innerHTML };
      await fetch("/send-mqtt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
    } catch (err) {
      console.error(`Error: ${err}`);
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        <button className="btn-send" onClick={handleClick}>
          On
        </button>
        <button className="btn-send" onClick={handleClick}>
          Off
        </button>
      </header>
    </div>
  );
}

export default App;
