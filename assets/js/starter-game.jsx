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

function ResetButton(props) {
  return (
    <button
      onClick={() => {
        props.onClick();
      }}
    >
      {"Reset"}
    </button>
  );
}

class ReactButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <button
        key={"Reset"}
        onClick={() => {
          this.props.onClick();
        }}
      >
        {"Reset"}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i, row, col, visible) {
    let unique_key = row + "_" + col;
    //console.log(visible[row][col] + " " + i);
    //console.log("unique_key = " + unique_key);

    const isVisible = visible[row][col];
    //console.log(isVisible);
    return (
      <Square
        visible={isVisible}
        value={i}
        key={unique_key}
        onClick={() => this.props.onClick(unique_key)}
      />
    );
  }

  renderResetButton() {
    return <ResetButton onClick={() => this.props.onClick("reset")} />;
  }
  render() {
    let squares = this.props.squares;
    let visible = this.props.visible;
    let row_objects = [];
    let cells = [];
    // console.log("============ ");
    // console.log(visible);

    // console.log("============ ");
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
    console.log(props);

    this.channel = props.channel;
    this.init2();
    //borrowed from in class
    console.log("joining");
    this.channel
      .join()
      .receive("ok", this.onJoin.bind(this))
      .receive("error", resp => {
        console.log("Unable to join", resp);
      });
    console.log("joined");
  }

  onJoin({ game }) {
    this.setState(game.state);
    //console.log(game.state);
  }

  onUpdate({ game }) {
    this.setState(game.state);
  }

  init2() {
    let _squares = [[]];
    let squares = [[]];
    let visible = [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false]
    ];
    let M = 4;
    let N = 4;

    this.state = {
      squares: _squares,
      _squares: _squares,
      visible: visible,
      value_of_unhuid_item: null,
      position_of_unhid_item: [],
      number_of_clicks: 0,
      tiles_left: 16,
      disabled_for_delay: false
    };
  }
  init() {
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
      tiles_left: _tiles,
      disabled_for_delay: false
    };
  }

  reset(ev) {
    let _squares = this.state.squares.slice();
    let _visible = this.state.visible.slice();
    let M = _squares.length;
    let N = _squares[0].length;
    const _tiles_left = M * N;

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
        _visible[i][j] = false;
      }
    }

    this.setState({
      visible: _visible,
      squares: _squares,
      value_of_unhuid_item: null,
      position_of_unhid_item: [],
      number_of_clicks: 0,
      disabled_for_delay: false,
      tiles_left: _tiles_left
    });
  }

  handleClick(key) {
    //console.log(key);
    let row;
    let col;

    [row, col] = key.split("_");
    let _visible = this.state.visible;
    let value_of_unhuid_item = this.state.value_of_unhuid_item;
    let squares = this.state.squares;
    let _disabled_for_delay = this.state.disabled_for_delay;
    console.log(row + col);
    if (_disabled_for_delay || _visible[row][col]) {
      return;
    }

    this.channel
      .push("guess", { row: row, col: col })
      .receive("ok", this.onUpdate.bind(this));

    _visible = this.state.visible;
    value_of_unhuid_item = this.state.value_of_unhuid_item;
    squares = this.state.squares;
    _disabled_for_delay = this.state.disabled_for_delay;
    const position_of_unhid_item = this.state.position_of_unhid_item;

    console.log(_visible);
    console.log(value_of_unhuid_item);
    console.log(squares);

    if (value_of_unhuid_item) {
      //second item revealed
      if (squares[row][col] !== value_of_unhuid_item) {
        //hide after timeout
        console.log("adding the timeout");

        let unhid_item = this.state.unhid_item;
        _disabled_for_delay = !_disabled_for_delay;
        //If the two tiles don’t match, the values should be hidden again after a delay
        setTimeout(() => {
          const _visible = this.state.visible;
          const _value_of_unhuid_item = this.state.value_of_unhuid_item;
          const _position_of_unhid_item = this.state.position_of_unhid_item;

          let r1 = _position_of_unhid_item[0];
          let c1 = _position_of_unhid_item[1];
          let r2 = _position_of_unhid_item[2];
          let c2 = _position_of_unhid_item[3];

          this.channel
            .push("hideTiles", { row1: r1, col1: c1, row2: r2, col2: c2 })
            .receive("ok", this.onUpdate.bind(this));
          // let visible = _visible.slice();
          // visible[r1][c1] = false;
          // visible[r2][c2] = false;

          // this.setState({
          //   visible: visible,
          //   value_of_unhuid_item: null,
          //   position_of_unhid_item: [],
          //   disabled_for_delay: false
          // });
        }, 1000);
      }
    }

    /*
    const _visible = this.state.visible;
    const value_of_unhuid_item = this.state.value_of_unhuid_item;
    const position_of_unhid_item = this.state.position_of_unhid_item;
    const squares = this.state.squares;
    const _number_of_clicks = this.state.number_of_clicks;
    let _tiles_left = this.state.tiles_left;
    let _disabled_for_delay = this.state.disabled_for_delay;

    //console.log(squares);

    if (_disabled_for_delay || _visible[row][col]) {
      //ignore click when clicked during delay period or clicked on a revealed tile
      return;
    }
    let unhid_item;
    let new_position_of_unhid_item = null;
    let visible = _visible.slice();
    visible[row][col] = true; //Clicking on a tile should expose it’s associated letter.
    //console.log("=" + value_of_unhuid_item);
    if (value_of_unhuid_item) {
      //second item revealed
      if (squares[row][col] === value_of_unhuid_item) {
        //second item IS equal to first item, valid pair
        unhid_item = null;
        new_position_of_unhid_item = [];
        _tiles_left = _tiles_left - 2;
      } else {
        //second item revealed did not match.
        //hide after timeout
        new_position_of_unhid_item = position_of_unhid_item.concat([row, col]);
        unhid_item = this.state.unhid_item;
        _disabled_for_delay = !_disabled_for_delay;
        //If the two tiles don’t match, the values should be hidden again after a delay
        setTimeout(() => {
          const _visible = this.state.visible;
          const _value_of_unhuid_item = this.state.value_of_unhuid_item;
          const _position_of_unhid_item = this.state.position_of_unhid_item;

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
            position_of_unhid_item: [],
            disabled_for_delay: false
          });
        }, 1000);
      }
    } else {
      //first item revealed
      unhid_item = squares[row][col];
      new_position_of_unhid_item = [];
      new_position_of_unhid_item.push(row);
      new_position_of_unhid_item.push(col);
      //console.log(new_position_of_unhid_item);
      //console.log(unhid_item);
    }

    this.setState({
      visible: visible,
      squares: squares,
      value_of_unhuid_item: unhid_item,
      position_of_unhid_item: new_position_of_unhid_item,
      number_of_clicks: _number_of_clicks + 1,
      disabled_for_delay: _disabled_for_delay,
      tiles_left: _tiles_left
    });
    */
  }

  render() {
    console.log("render()");
    const tiles_left = this.state.tiles_left;
    const status_number_of_clicks =
      "Attempts made so far: " + this.state.number_of_clicks;
    let status = tiles_left == 0 ? "Game completed" : "Game in progress";
    const _reset_key = "reset";
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
          <div className="clear"></div>
          <br></br>
          <div className="game-board">
            <Board
              squares={this.state._squares}
              visible={this.state.visible}
              onClick={i => this.handleClick(i)}
            />
            <ReactButton onClick={i => this.reset(i)} />
          </div>
        </div>
      </div>
    );
  }
}

export default function game_init(root, channel) {
  //The state of the game should be a single value in the root React component.
  ReactDOM.render(<MemoryGame channel={channel} />, root);
}
