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
  renderSquare(i, row, col) {
    // console.log("creating: " + i);
    // console.log("this.props: " + this.props);
    // console.log("this.props.squares: " + this.props.squares);
    let unique_key = row + "_" + col;
    //console.log("this.props.squares[i][j]: " + this.props.squares[i][i]);
    return (
      <Square
        // value={this.props.squares[i][i]}
        value={i}
        key={unique_key}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  render() {
    let squares = this.props.squares;

    let row_objects = [];
    let cells = [];
    row_objects.push(cells);
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let div_tag_open = '<div className="board-row">';
        let div_tag_end = "</div>";
        cells.push(this.renderSquare(squares[i][j], i, j));
      }
      row_objects.push(<div className="board-row">{cells.splice(0, 4)}</div>);
    }
    return <div>{row_objects}</div>;
  }
}

//Attribution: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

class MemoryGame extends React.Component {
  constructor(props) {
    super(props);

    let my_squares = [[]];
    for (let i = 0; i < 4; i++) {
      my_squares[i] = new Array();
      for (let j = 0; j < 4; j++) {
        my_squares[i].push("");
      }
    }

    let characters = [];
    let first_character = 97;
    for (let i = 0; i < 8; i++) {
      characters.push(String.fromCharCode(first_character));
      characters.push(String.fromCharCode(first_character++));
    }
    for (let i = 0; i < my_squares.length; i++) {
      for (let j = 0; j < my_squares[0].length; j++) {
        let my_char = characters.splice(getRandomInt(characters.length), 1);
        my_squares[i][j] = my_char[0];
      }
    }

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
