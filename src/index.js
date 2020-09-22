import React from "react";
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

class Game extends React.Component {
  state = {
    history: [
      {
        squares: Array.of({ length: 9 }).fill(null),
      },
    ],
    xIsNext: this.isXNext(0),
    move: 0,
  };

  isXNext(move) {
    return move % 2 === 0;
  }

  jumpTo(move) {
    this.setState({
      history: this.state.history,
      xIsNext: this.isXNext(move),
      move,
    });
  }

  renderHistoryButton(move) {
    let desc = move ? `Move ${move + 1}` : "Restart";
    return (
      <li key={move}>
        <button onClick={() => this.jumpTo(move)}>{desc}</button>
      </li>
    );
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.move];
    const winner = calculateWinner(current.squares);
    let historyButtons = history.map((_board, move) =>
      this.renderHistoryButton(move)
    );

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{historyButtons}</ol>
        </div>
      </div>
    );
  }

  handleClick(i) {
    let move = this.state.move;
    let history = this.state.history.slice(0, move + 1);
    let current = history[move];
    let squares = Array.from(current.squares);
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    history.push({ squares });
    this.setState({
      history,
      move: ++move,
      xIsNext: !this.state.xIsNext,
    });
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
