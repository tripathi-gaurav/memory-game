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
      {props.visible ? props.value : null}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, row, col, visible) {
    // console.log("creating: " + i);
    // console.log("this.props: " + this.props);
    // console.log("this.props.squares: " + this.props.squares);
    let unique_key = row + "_" + col;
    let isVisible = visible[row][col];

    //console.log("this.props.squares[i][j]: " + this.props.squares[i][i]);
    return (
      <Square
        // value={this.props.squares[i][i]}
        visible={isVisible}
        value={i}
        key={unique_key}
        onClick={() => this.props.onClick(unique_key)}
      />
    );
  }
  render() {
    let squares = this.props.squares;
    let visible = this.props.visible;
    let row_objects = [];
    let cells = [];
    //row_objects.push(cells);
    for (let i = 0; i < squares.length; i++) {
      for (let j = 0; j < squares[i].length; j++) {
        cells.push(this.renderSquare(squares[i][j], i, j, visible));
      }
      row_objects.push(
        <div className="board-row">{cells.splice(0, squares[i].length)}</div>
      );
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

    let _squares = [[]];
    let squares = [[]];
    let visible = [[]];
    let M = 4;
    let N = 4;
    for (let i = 0; i < M; i++) {
      _squares[i] = new Array();
      squares[i] = new Array();
      visible[i] = new Array();
      for (let j = 0; j < N; j++) {
        _squares[i].push("");
        squares[i].push(" ");
        visible[i].push(false);
      }
    }

    let characters = [];
    let first_character = 97;
    for (let i = 0; i < M + N; i++) {
      characters.push(String.fromCharCode(first_character));
      characters.push(String.fromCharCode(first_character++));
    }
    for (let i = 0; i < _squares.length; i++) {
      for (let j = 0; j < _squares[i].length; j++) {
        let my_char = characters.splice(getRandomInt(characters.length), 1);
        _squares[i][j] = my_char[0];
        //squares[i][j] = "";
      }
    }
    let _tiles = M * N;

    this.state = {
      squares: _squares,
      _squares: _squares,
      visible: visible,
      value_of_unhuid_item: null,
      position_of_unhid_item: [],
      number_of_clicks: 0,
      tiles_left: _tiles
    };
  }

  handleClick(key) {
    console.log(key);
    let row;
    let col;
    [row, col] = key.split("_");
    const _visible = this.state.visible;
    const value_of_unhuid_item = this.state.value_of_unhuid_item;
    const position_of_unhid_item = this.state.position_of_unhid_item;
    const squares = this.state.squares;
    const number_of_clicks = this.state.number_of_clicks;
    const tiles_left = this.state.tiles_left;

    console.log(squares);

    if (_visible[row][col]) {
      return;
    }
    let unhid_item;
    let new_position_of_unhid_item = null;
    let visible = _visible.slice();
    visible[row][col] = true;
    console.log("=" + value_of_unhuid_item);
    if (value_of_unhuid_item) {
      //second item revealed
      if (squares[row][col] === value_of_unhuid_item) {
        //second item IS equal to first item, valid pair
        unhid_item = null;
        new_position_of_unhid_item = [];
        this.setState({
          visible: visible,
          squares: squares,
          value_of_unhuid_item: unhid_item,
          position_of_unhid_item: new_position_of_unhid_item,
          number_of_clicks: number_of_clicks + 1,
          tiles_left: tiles_left - 2
        });
      } else {
        //second item revealed did not match.
        //hide after timeout
        new_position_of_unhid_item = position_of_unhid_item.concat([row, col]);
        this.setState({
          visible: visible,
          position_of_unhid_item: new_position_of_unhid_item,
          number_of_clicks: number_of_clicks + 1
        });
        setTimeout(() => {
          const _visible = this.state.visible;
          const _value_of_unhuid_item = this.state.value_of_unhuid_item;
          const _position_of_unhid_item = this.state.position_of_unhid_item;
          console.log("ahem 1" + _visible);
          console.log("ahem 2" + _value_of_unhuid_item);
          console.log("ahem 3" + _position_of_unhid_item);
          let r1 = _position_of_unhid_item[0];
          let c1 = _position_of_unhid_item[1];
          let r2 = _position_of_unhid_item[2];
          let c2 = _position_of_unhid_item[3];
          let visible = _visible.slice();
          visible[r1][c1] = false;
          visible[r2][c2] = false;

          this.setState({
            visible: visible,
            value_of_unhuid_item: null,
            position_of_unhid_item: []
          });
        }, 1000);
      }
    } else {
      //first item revealed
      unhid_item = squares[row][col];

      new_position_of_unhid_item = [];
      new_position_of_unhid_item.push(row);
      new_position_of_unhid_item.push(col);
      console.log(new_position_of_unhid_item);
      console.log(unhid_item);

      this.setState({
        visible: visible,
        squares: squares,
        value_of_unhuid_item: unhid_item,
        position_of_unhid_item: new_position_of_unhid_item,
        number_of_clicks: number_of_clicks + 1
      });
    }
  }

  render() {
    console.log("render()");
    const tiles_left = this.state.tiles_left;
    const status_number_of_clicks =
      "Attempts made so far: " + this.state.number_of_clicks;
    let status = tiles_left == 0 ? "Game completed" : "Game in progress";
    return (
      <div>
        <div className="game-info">
          <div>
            {" "}
            <h3>{status}</h3>
          </div>
          <div>
            {" "}
            <h4>{status_number_of_clicks}</h4>
          </div>
        </div>
        <div className="game">
          <div class="clear"></div>
          <br></br>
          <div className="game-board">
            <Board
              squares={this.state._squares}
              visible={this.state.visible}
              onClick={i => this.handleClick(i)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default function game_init(root) {
  ReactDOM.render(<MemoryGame />, root);
}
