import React from "react";
import ReactDOM from "react-dom";
import "../css/app.css";
import _ from "lodash";

function Square(props) {
  return (
    <button
      className="square"
      onClick={() => {
        props.onClick();
      }}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    console.log("creating: " + i);
    console.log("this.props: " + this.props);
    console.log("this.props.squares: " + this.props.squares);
    console.log("this.props.squares: " + this.props.squares[i][i]);
    return (
      <Square
        value={this.props.squares[i][i]}
        key={i}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  render() {
    let squares = this.props.squares;

    let row = _.map(squares, subarray => {
      let cell = _.map(subarray, (xx, ii) => {
        console.log(xx);
        console.log(ii);
        return this.renderSquare(ii);
      });
      return <div className="board-row">{cell}</div>;
    });
    console.log("row= " + row);
    return <div>{row}</div>;
  }
}

//Attribution: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

class MemoryGame extends React.Component {
  constructor(props) {
    super(props);

    let my_squares = Array(8).fill(Array(8));
    const set1 = new Set();
    let first_character = 97;
    for (let i = 0; i < 8; i++) {
      set1.add(String.fromCharCode(first_character++));
    }
    for (let i = 0; i < 8; i++) {
      let start_memory = 97;
      for (let j = 0; j < 8; j++) {
        my_squares[i][j] = String.fromCharCode(start_memory++);
      }
    }
    console.log(my_squares);
    this.state = {
      squares: my_squares,
      stepNumber: 0
    };
  }

  render() {
    let status = "Game in progress";
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={this.state.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
        </div>
      </div>
    );
  }
}

export default function game_init(root) {
  ReactDOM.render(<MemoryGame />, root);
}
