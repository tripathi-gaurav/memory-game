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

  reset(ev) {
    this.channel.push("reset").receive("ok", this.onUpdate.bind(this));
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
        }, 1000);
      }
    }
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
