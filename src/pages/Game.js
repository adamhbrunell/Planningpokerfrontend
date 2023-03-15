import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as signalR from "@microsoft/signalr";
import Card from "../atoms/Card";
import Table from "../molecules/Table";
import Hand from "../molecules/Hand";
import Player from "../molecules/Player";
import Task from "../atoms/Task";
import Overlay from "../molecules/Overlay";
import "./Game.css";

function Game() {
  const { gameId, playerId, isAdmin } = useParams();

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7143/planningpokerhub")
      .build();

    connection.start().then(() => {
      connection.invoke("JoinGame", parseInt(gameId), playerId);
    });

    connection.on("PlayerJoined", (player) => {
      console.log("Player joined:", player.name)
      setPlayers(prevPlayers => [...prevPlayers, player]);
    });

    connection.on("YouJoined", (playerName, otherPlayers) => {
      console.log(`Welcome ${playerName}!`)
      console.log(`Here are the people already in your game:  ${otherPlayers.map(npc => npc.name)}`)
      const player = { ...defaultPlayerState, id: playerId, name: playerName, deck: deck, card: 'none' }
      setPlayers([...otherPlayers, player])
    });

    connection.on("PlayerLeft", playerId => {
      console.log(`${playerId} left`)
      setPlayers(prevPlayers => prevPlayers.filter(player => player.id !== playerId))
    })

    connection.on("PlayerReconnected", playerId => {
      console.log(`${playerId} reconnected`)
    })

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, []);

  const [deck, setDeck] = useState({
    name: "shirt",
    values: ["none", "huh", "XS", "S", "M", "L", "XL"]
  });
  const [cardsShown, setCardsShown] = useState(false);
  const defaultPlayerState = { id: null, name: "null", deck: deck, card: 'none', openCard: false }
  const [players, setPlayers] = useState([defaultPlayerState]);
  const [tasks, setTasks] = useState([
    {
      id: 1,
      header: "First task that needs to be completed",
      content: "This is the content of the first task",
    },
    {
      id: 2,
      header: "Second task",
      content: "This is the content of the second task",
    },
  ]);
  const [selectedTask, setSelectedTask] = useState(<Task {...tasks[0]} />);

  const changeDeck = (newName) => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7143/planningpokerhub")
      .build();

    connection.start().then(() => {
      fetch(`https://localhost:7143/api/Deck/${newName}`)
        .then((response) => response.json())
        .then((data) => {
          const cards = data["values"].map((value) => {
            if (!isNaN(value)) {
              return parseInt(value, 10);
            }
            return value;
          });
          setDeck({ name: newName, values: cards });
          resetPlayerCards()
          setCardsShown(false);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  };

  const resetPlayerCards = () => {
    setPlayers(prevPlayers => prevPlayers.map(player => ({
      ...player,
      card: 'none',
      openCard: false,
    })));
  }

  useEffect(() => {
    resetPlayerCards();
    setCardsShown(false);
  }, [deck]);

  function chooseRandomCard() {
    return deck.values[Math.floor(Math.random() * deck.values.length)];
  }

  function createNewTask() {
    const newId = Math.max(...tasks.map((task) => task.id)) + 1;
    const newTask = {
      id: newId,
      header: "New task",
      content: "This is the content of the new task",
      isNew: true,
    };
    setTasks([...tasks, newTask]);
  }

  useEffect(() => {
    resetPlayerCards();
    setCardsShown(false);
  }, [selectedTask]);

  const handleTaskClick = (task) => {
    setSelectedTask(<Task {...task} />);
  };

  const handleCardClick = (value) => {
    setPlayers((prevPlayers) => [
      { ...prevPlayers[0], card: value },
      ...prevPlayers.slice(1),
    ]);
  };

  const showAllCards = () => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) => ({ ...player, openCard: true }))
    );
    setCardsShown(true);
  };

  const getAverage = (votes, deck) => {
    const filteredArr = votes.filter((val) => !isNaN(val));

    if (filteredArr.length) {
      const sum = filteredArr.reduce((acc, val) => acc + Number(val), 0);
      const avg = (sum / filteredArr.length).toFixed(2);
      return avg;
    }

    const indexes = votes
      .filter((vote) => deck.values.includes(vote))
      .map((vote) => deck.values.indexOf(vote))
      .filter((index) => index >= 2);

    if (indexes.length === 0) {
      return 0;
    }

    const sum = indexes.reduce((total, index) => total + index, 0);
    const averageIndex = Math.round(sum / indexes.length);

    return averageIndex;
  };

  const getNearestCard = (average, values) => {
    let numericValues = values.filter((value) => !isNaN(value));
    let isNonNumDeck = false;

    if (numericValues.length === 0) {
      numericValues = values.map((value, index) => index);
      isNonNumDeck = true;
    } else {
      numericValues = numericValues.map((val) => parseInt(val));
    }

    if (isNonNumDeck) {
      return values[average];
    } else {
      const nearestCard = numericValues.reduce((prev, curr) => {
        if (curr < average) {
          return prev;
        }
        return Math.abs(curr - average) < Math.abs(prev - average)
          ? curr
          : prev;
      }, numericValues[0]);
      return nearestCard;
    }
  };

  const [average, setAverage] = useState(0);
  const [nearestCard, setNearestCard] = useState(0);

  const tallyVotes = () => {
    let votes = [];
    for (let i = 0; i < players.length; i++) {
      votes.push(players[i].card);
    }
    let avg = getAverage(votes, deck);
    let nearest = getNearestCard(avg, deck.values);
    setAverage(avg);
    setNearestCard(nearest);
    toggleOverlay();
    setTasks(
      tasks.map((task) => {
        if (task.id === selectedTask.props.id) {
          return {
            ...task,
            value: nearest,
          };
        } else {
          return task;
        }
      })
    );
  };

  const [showMenu, setShowMenu] = useState(true);
  const [overlay, setOverlay] = useState(false);

  const toggleOverlay = () => {
    setOverlay(!overlay);
  };

  return (
    <div className="App">
      <Overlay isOpen={overlay} onClose={toggleOverlay}>
        <div>
          <h2>Voting done!</h2>
          <p>
            The average value was:{" "}
            {deck.name === "shirt" ? deck.values[average] : average}
          </p>
          <p>The recommended value is therefore: </p>
          <Card deck={deck.name} value={nearestCard} />
        </div>
      </Overlay>
      <div className="Game">
        <div className="top row">
          {players.slice(1, Math.ceil(players.length / 2)).map((player) => (
            <Player
              key={player.id}
              id={player.id}
              name={player.name}
              deck={deck.name}
              card={player.card}
              openCard={player.openCard}
            />
          ))}
        </div>

        <div className="middle row">
          <Player
            key={players[0].id}
            id={players[0].id}
            name={players[0].name}
            deck={deck.name}
            card={players[0].card}
            openCard={players[0].openCard}
          />
          <Table task={selectedTask.props.header}>

            {isAdmin === "true" && cardsShown ? (
              <button onClick={() => tallyVotes()}>Tally the votes!</button>
            ) : isAdmin === "true" ? (
              <button onClick={() => showAllCards()}>Finish voting!</button>
            ) : null}
          </Table>
          {players.length > 1 ? (
            <Player
              key={players[players.length - 1].id}
              id={players[players.length - 1].id}
              deck={deck.name}
              name={players[players.length - 1].name}
              card={players[players.length - 1].card}
              openCard={players[players.length - 1].openCard}
            />
          ) : (
            <></>
          )}
        </div>

        <div className="bottom row">
          {players
            .slice(Math.ceil(players.length / 2), players.length - 1)
            .map((player) => (
              <Player
                key={player.id}
                id={player.id}
                name={player.name}
                deck={deck.name}
                card={player.card}
                openCard={player.openCard}
              />
            ))}
        </div>

        <Hand
          className="hand"
          deck={deck}
          onCardClick={(value) => handleCardClick(value)}
        />
      </div>
      <button onClick={() => setShowMenu(!showMenu)}>Menu</button>
      <div className={`menu ${showMenu ? "show" : ""}`}>
        {isAdmin === 'true' &&
          <select
            className="select"
            onChange={(event) => changeDeck(event.target.value)}
          >
            <option value={"shirt"}>T-shirt Sizes</option>
            <option value={"fib"}>Fibonacci</option>
          </select>
        }
        {tasks.map((task) => (
          <div className="item">
            <Task
              key={task.id}
              id={task.id}
              header={task.header}
              content={task.content}
              value={task.value}
              swapTask={() => handleTaskClick(task)}
              isSelected={selectedTask.props.id === task.id}
            />
          </div>
        ))}
        {isAdmin === 'true' &&
          <button onClick={createNewTask}>Create new task</button>
        }
      </div>
    </div>
  );
}

export default Game;
