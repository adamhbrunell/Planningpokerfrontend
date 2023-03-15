import React from "react";
import { useNavigate } from "react-router-dom";
import * as signalR from "@microsoft/signalr";

const JoinLobby = () => {
  const navigate = useNavigate();
  const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7143/planningpokerhub")
    .build();

  connection.on("LobbyFetched", (gameId, playerId) => {
    navigate(`/game/${gameId}/${playerId}/false`);
  });

  const joinLobby = (lobbyId, playerName) => {
    connection
      .start()
      .then(() => {
        console.log(lobbyId, playerName);
        connection.invoke("JoinLobby", lobbyId, playerName, false)
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        joinLobby(
          parseInt(e.target.elements.lobbyCode.value),
          e.target.elements.playerName.value
        );
      }}
    >
      <div className="playerFields">
        <label htmlFor="lobbyCode">Lobby Code:</label>
        <input type="text" id="lobbyCode" name="lobbyCode" defaultValue={1} />
        <label htmlFor="playerName">Your Name:</label>
        <input
          type="text"
          id="playerName"
          name="playerName"
          defaultValue="Adam"
        />
      </div>
      <button type="submit">Join Lobby</button>
    </form>
  );
};

export default JoinLobby;
