import React, { useState, useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import { useNavigate } from "react-router-dom";

const CreateLobby = () => {
  const [playerName, setPlayerName] = useState()
  const [lobby, setLobby] = useState(null);
  const navigate = useNavigate();

  const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7143/planningpokerhub")
    .build();

  connection.on("LobbyFetched", (gameId, playerId) => {
    navigate(`/game/${gameId}/${playerId}/true`);
  });

  connection.on("LobbyCreated", (data => {
    console.log(data.id, playerName)
    joinLobby(data.id, playerName)
  }))

  const createLobby = (playerName) => {
    setPlayerName(playerName)
    connection
      .start()
      .then(() => {
        connection.invoke("CreateLobby")
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };


  const joinLobby = (lobbyId, playerName) => {
    connection.invoke("JoinLobby", lobbyId, playerName, true).catch((error) => {
      console.error(error);
    });
  };

  useEffect(() => {
    if (playerName) {
      createLobby(playerName);
    }
  }, [playerName]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setPlayerName(e.target.elements.playerName.value);
      }}
    >
      <div className="playerFields">
        <label htmlFor="playerName">Your Name:</label>
        <input
          type="text"
          id="playerName"
          name="playerName"
          defaultValue="Adam"
        />
      </div>
      <button type="submit">create Lobby</button>
    </form>
  );
};

export default CreateLobby;
