import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Row(props) {
  let rowNum = props.rowNum;
  let start = 3 * rowNum;
  let renderSquare = (i) => (
    <Square value={props.squares[i]} onClick={() => props.onClick(i)} />
  );
  return (
    <div className="board-row">
      {renderSquare(start++)}
      {renderSquare(start++)}
      {renderSquare(start++)}
    </div>
  );
}

function Board(props) {
  let renderRow = (i) => (
    <Row rowNum={i} squares={props.squares} onClick={props.onClick} />
  );
  return (
    <div>
      {renderRow(0)}
      {renderRow(1)}
      {renderRow(2)}
    </div>
  );
}

function Game() {
  const isXNext = (move) => move % 2 === 0;
  const initialHistory = [
    {
      squares: Array.of({ length: 9 }).fill(null),
    },
  ];

  const [xIsNext, setXIsNext] = useState(isXNext(0));
  const [history, setHistory] = useState(initialHistory);
  const [move, setMove] = useState(0);

  function jumpTo(move) {
    setMove(() => move);
    setXIsNext(isXNext(move));
  }

  function renderHistoryButton(move) {
    let desc = move ? `Move ${move + 1}` : "Restart";
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  }

  const current = history[move];
  const winner = calculateWinner(current.squares);
  let historyButtons = history.map((_board, move) => renderHistoryButton(move));

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={current.squares} onClick={(i) => handleClick(i)} />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{historyButtons}</ol>
      </div>
    </div>
  );

  function handleClick(i) {
    let newHistory = history.slice(0, move + 1);
    let squares = Array.from(current.squares);
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? "X" : "O";
    newHistory.push({ squares });
    setMove((prevMove) => ++prevMove);
    setXIsNext((prevXIsNext) => !prevXIsNext);
    setHistory(() => newHistory);
  }
}

/**
 * Determines if someone has won a game of tic-tac-toe
 * @param {Array} squares An array of length 9 that represents the board (each element should be null, 'X' or 'O')
 * @returns null if no winner or the winning player (e.g. 'X' or 'O')
 */
function calculateWinner(squares) {
  /* Possible winning lines */
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  /* Check every possible winning line */
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    /* If every square in the winning line is non-null and equal, that player has won */
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  /* If we get here, no one has won (yet) */
  return null;
}

ReactDOM.render(<Game />, document.getElementById("root"));
