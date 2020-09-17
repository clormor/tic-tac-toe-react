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

class Board extends React.Component {
  renderSquare(i) {
    // create a square with a unique value (position)
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      xIsNext: this.isXNext(0),
      moveNumber: 0,
    };
  }

  isXNext(moveNumber) {
    return moveNumber % 2 === 0;
  }

  jumpTo(moveNumber) {
    this.setState({
      history: this.state.history,
      xIsNext: this.isXNext(moveNumber),
      moveNumber: moveNumber,
    });
  }

  renderHistoryButton(moveNumber) {
    let desc = moveNumber ? "b" : "a";
    return (
      <li key={moveNumber}>
        <button onClick={() => this.jumpTo(moveNumber)}>{desc}</button>
      </li>
    );
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.moveNumber];
    const winner = calculateWinner(current.squares);
    let historyButtons = history.map((_board, moveNumber) =>
      this.renderHistoryButton(moveNumber)
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
    const history = this.state.history.slice(0, this.state.moveNumber + 1);
    const current = history[this.state.moveNumber];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      moveNumber: history.length,
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
