import React from "react";
import * as signalR from "@microsoft/signalr";
import "./Lobby.css";
import LobbyTable from "../molecules/LobbyTable";

function Lobby() {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7143/planningpokerhub")
    .build();

  const joinLobby = (id, playerName) => {
    connection
      .start()
      .then(() => {
        fetch(`https://localhost:7143/api/Lobby/${id}/join`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(playerName),
        }).then((response) => response.json());
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const createLobby = () => {
    connection
      .start()
      .then(() => {
        fetch("https://localhost:7143/api/Lobby/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((response) => response.json());
      })
      .catch((error) => {
        console.error(error);
      });
  };

  connection.on("LobbyStatusUpdated", (data) => {});

  const startGame = (lobbyId) => {
    connection.invoke("ChangeLobbyStatus", lobbyId).catch((err) => {
      console.error(err);
    });
  };

  return (
    <div className="app">
      <div className="lobbyInput">
        <h2>Lobby Page</h2>
        <p>
          Welcome to the lobby page! Please enter a lobby code to join a game:
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            joinLobby(
              e.target.elements.lobbyCode.value,
              e.target.elements.playerName.value
            );
          }}
        >
          <div className="playerFields">
            <label htmlFor="lobbyCode">Lobby Code:</label>
            <input
              type="text"
              id="lobbyCode"
              name="lobbyCode"
              defaultValue={1}
            />
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
        <p>Or Create one!</p>
        <form>
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              createLobby();
            }}
          >
            Create Lobby
          </button>
        </form>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            startGame(e.target.elements.gameStart.value);
          }}
        >
          <label htmlFor="gameStart">Lobby Code:</label>
          <input type="text" id="gameStart" name="gameStart" />
          <button type="submit">Start Lobby</button>
        </form>
      </div>
      <div className="lobbyInfo">
        <LobbyTable />
      </div>
    </div>
  );
}

export default Lobby;
