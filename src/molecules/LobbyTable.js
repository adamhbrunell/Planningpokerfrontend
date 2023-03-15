import React, { useState, useEffect } from "react";
import * as signalR from "@microsoft/signalr";

const LobbyTable = () => {
  const [lobbies, setLobbies] = useState([]);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7143/planningpokerhub")
      .build();

    connection.start().then(() => {
      console.log("SignalR connected!");
    });

    connection.on("LobbiesFetched", (data) => {
      setLobbies(data);
    });

    connection.on("LobbyCreated", (data) => {
      setLobbies((prevLobbies) => [...prevLobbies, data]);
    });

    connection.on("LobbyChanged", (data) => {
      setLobbies(data);
    });

    // Request the list of lobbies from the server when the component mounts

    return () => {
      connection.off("LobbyCreated");
      connection.off("LobbyChanged");
      connection.stop();
    };
  }, []);

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Lobby ID</th>
            <th>Players</th>
          </tr>
        </thead>
        <tbody>
          {lobbies.length === 0 ? (
            <tr>
              <td colSpan="2">No lobbies found.</td>
            </tr>
          ) : (
            lobbies.map((lobby) => (
              <tr key={lobby.id}>
                <td>{lobby.id}</td>
                <td>
                  <ul>
                    {lobby.players &&
                      lobby.players.map((player) => (
                        <li key={player.id}>{player.name}</li>
                      ))}
                  </ul>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
};

export default LobbyTable;
