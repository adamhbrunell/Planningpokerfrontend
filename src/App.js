import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import JoinLobby from "./pages/JoinLobby";
import CreateLobby from "./pages/CreateLobby";
import StartPage from "./pages/StartPage";
import Game from "./pages/Game";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<StartPage />} />
        <Route exact path="/join" element={<JoinLobby />} />
        <Route exact path="/create" element={<CreateLobby />} />
        <Route
          exact
          path="/game/:gameId/:playerId/:isAdmin"
          element={<Game />}
        />
      </Routes>
    </Router>
  );
}

export default App;
