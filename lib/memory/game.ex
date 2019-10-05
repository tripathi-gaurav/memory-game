defmodule MemoryWeb.Game do

  def new do
      internal_squares = [["a", "b", "c", "d"], ["e", "f", "g", "h"], ["a", "b", "c", "d"], ["e", "f", "g", "h"]]
      internal_squares = shuffle_tiles( internal_squares )
      internal_squares = Enum.shuffle( internal_squares )
      squares = [["", "", "", ""], ["", "", "", ""], ["", "", "", ""], ["", "", "", ""]]
      visible = [[false,false,false,false,],[false,false,false,false], [false,false,false,false], [false,false,false,false]]
      %{
        squares: squares,
        _squares: squares,
        internal_squares: internal_squares,
        visible: visible,
        value_of_unhuid_item: nil,
        position_of_unhid_item: [],
        number_of_clicks: 0,
        tiles_left: 16,
        disabled_for_delay: false
      }
  end

  def update_at(squares, row, col, curr_row, curr_col, val) when curr_row < row, do: [(hd(squares))] ++ update_at(tl(squares), row, col, curr_row+1, curr_col, val )
  def update_at(squares, row, col, curr_row, curr_col, val) when curr_row == row, do: [List.update_at( hd(squares), col, &( &1 = val ) )] ++ tl(squares)


  # const _visible = this.state.visible;
  #   const value_of_unhuid_item = this.state.value_of_unhuid_item;
  #   const position_of_unhid_item = this.state.position_of_unhid_item;
  #   const squares = this.state.squares;
  #   const _number_of_clicks = this.state.number_of_clicks;
  #   let _tiles_left = this.state.tiles_left;
  #   let _disabled_for_delay = this.state.disabled_for_delay;

  #   //console.log(squares);

  #   if (_disabled_for_delay || _visible[row][col]) {
  #     //ignore click when clicked during delay period or clicked on a revealed tile
  #     return;
  #   }
  #   let unhid_item;
  #   let new_position_of_unhid_item = null;
  #   let visible = _visible.slice();
  #   visible[row][col] = true; //Clicking on a tile should expose it’s associated letter.
  #   //console.log("=" + value_of_unhuid_item);
  #   if (value_of_unhuid_item) {
  #     //second item revealed
  #     if (squares[row][col] === value_of_unhuid_item) {
  #       //second item IS equal to first item, valid pair
  #       unhid_item = null;
  #       new_position_of_unhid_item = [];
  #       _tiles_left = _tiles_left - 2;
  #     } else {
  #       //second item revealed did not match.
  #       //hide after timeout
  #       new_position_of_unhid_item = position_of_unhid_item.concat([row, col]);
  #       unhid_item = this.state.unhid_item;
  #       _disabled_for_delay = !_disabled_for_delay;
  #       //If the two tiles don’t match, the values should be hidden again after a delay
  #       setTimeout(() => {
  #         const _visible = this.state.visible;
  #         const _value_of_unhuid_item = this.state.value_of_unhuid_item;
  #         const _position_of_unhid_item = this.state.position_of_unhid_item;

  #         let r1 = _position_of_unhid_item[0];
  #         let c1 = _position_of_unhid_item[1];
  #         let r2 = _position_of_unhid_item[2];
  #         let c2 = _position_of_unhid_item[3];
  #         let visible = _visible.slice();
  #         visible[r1][c1] = false;
  #         visible[r2][c2] = false;

  #         this.setState({
  #           visible: visible,
  #           value_of_unhuid_item: null,
  #           position_of_unhid_item: [],
  #           disabled_for_delay: false
  #         });
  #       }, 1000);
  #     }
  #   } else {
  #     //first item revealed
  #     unhid_item = squares[row][col];
  #     new_position_of_unhid_item = [];
  #     new_position_of_unhid_item.push(row);
  #     new_position_of_unhid_item.push(col);
  #     //console.log(new_position_of_unhid_item);
  #     //console.log(unhid_item);
  #   }

  #   this.setState({
  #     visible: visible,
  #     squares: squares,
  #     value_of_unhuid_item: unhid_item,
  #     position_of_unhid_item: new_position_of_unhid_item,
  #     number_of_clicks: _number_of_clicks + 1,
  #     disabled_for_delay: _disabled_for_delay,
  #     tiles_left: _tiles_left
  #   });

  def parse_float(text) do
  IO.puts text
    {num, _} = Integer.parse(text)
    num 
  end 

  def guess(game, row, col) do
    
    visible = game.visible
    value_of_unhuid_item = game.value_of_unhuid_item
    position_of_unhid_item = game.position_of_unhid_item
    internal_squares = game.internal_squares
    squares = game.squares
    IO.puts "reached-1"
    
    number_of_clicks = game.number_of_clicks
    disabled_for_delay= game.disabled_for_delay
    tiles_left = game.tiles_left

    unhid_item = game.value_of_unhuid_item
    new_position_of_unhid_item = nil
    #visible[row][col] = true
    row = parse_float(row)
    col = parse_float(col)
  
    IO.puts "row= #{row}"
    IO.puts "col= #{col}"

    internal_val = Enum.at( Enum.at( internal_squares, row), col )
    squares = update_at( squares, row, col,0, 0, internal_val)
    visible = update_at( visible, row, col, 0, 0, true)
    

    number_of_clicks = number_of_clicks + 1
    
    
    {value_of_unhuid_item,disabled_for_delay, position_of_unhid_item} = cond do
      value_of_unhuid_item != nil and  Enum.at( Enum.at( squares, row), col ) == value_of_unhuid_item ->
        unhid_item = nil
        value_of_unhuid_item = nil
        new_position_of_unhid_item = []
        tiles_left = tiles_left - 2
        {value_of_unhuid_item, disabled_for_delay, new_position_of_unhid_item}
      value_of_unhuid_item != nil &&  Enum.at( Enum.at( squares, row), col ) != value_of_unhuid_item ->
        new_position_of_unhid_item = position_of_unhid_item ++ [row, col]
        unhid_item = unhid_item
        value_of_unhuid_item = nil
        disabled_for_delay = !disabled_for_delay
        {value_of_unhuid_item, disabled_for_delay, new_position_of_unhid_item}
      value_of_unhuid_item == nil ->
        unhid_item = Enum.at( Enum.at( squares, row), col )
        new_position_of_unhid_item = [];
        new_position_of_unhid_item = [ col ] ++ new_position_of_unhid_item
        new_position_of_unhid_item = [ row ] ++ new_position_of_unhid_item
        IO.inspect unhid_item
        value_of_unhuid_item = Enum.at( Enum.at( squares, row), col )
        {value_of_unhuid_item, disabled_for_delay, new_position_of_unhid_item}
        
      end

    %{
        squares: squares,
        _squares: squares,
        visible: visible,
        internal_squares: internal_squares,
        value_of_unhuid_item: value_of_unhuid_item,
        position_of_unhid_item: position_of_unhid_item,
        number_of_clicks: number_of_clicks,
        tiles_left: tiles_left,
        disabled_for_delay: disabled_for_delay
      }
    
  end


  def hideTiles(game, r1,c1,r2,c2) do

    # r1 = parse_float(r1)
    # c1 = parse_float(c1)
    # r2 = parse_float(r2)
    # c3 = parse_float(c2)

    visible = game.visible
    value_of_unhuid_item = game.value_of_unhuid_item
    position_of_unhid_item = game.position_of_unhid_item
    internal_squares = game.internal_squares
    squares = game.squares
    IO.puts "hiding-1"
    
    number_of_clicks = game.number_of_clicks
    disabled_for_delay= game.disabled_for_delay
    tiles_left = game.tiles_left

    unhid_item = nil #game.value_of_unhuid_item
    new_position_of_unhid_item = nil

    visible = update_at( visible, r1, c1, 0, 0, false)
    visible = update_at( visible, r2, c2, 0, 0, false)
    squares = update_at( squares, r1, c1, 0, 0, "")
    squares = update_at( squares, r2, c2, 0, 0, "")

    %{
        squares: squares,
        _squares: squares,
        visible: visible,
        internal_squares: internal_squares,
        value_of_unhuid_item: unhid_item,
        position_of_unhid_item: new_position_of_unhid_item,
        number_of_clicks: number_of_clicks,
        tiles_left: tiles_left,
        disabled_for_delay: false
      }
    
  end

  

  def client_view(game) do
   
    squares = game.squares
    my_visible = game.visible
      
    %{
     
      
      state: %{
        squares: game.squares,
       _squares: game.squares,
      visible: game.visible,
      value_of_unhuid_item: game.value_of_unhuid_item,
      position_of_unhid_item: game.position_of_unhid_item,
      number_of_clicks: game.number_of_clicks,
      tiles_left: game.number_of_clicks,
      disabled_for_delay: game.disabled_for_delay}
    }
  end

  #def populate_squares( squares, M, N ) when M = 0, do: squares
  #def populate_squares( squares, M, N ) when M > 0 do
  def shuffle_tiles( squares ) when length(squares) == 1, do:  Enum.shuffle( squares )
  def shuffle_tiles( [hd | tl ] ) do
    [ Enum.shuffle( hd ) ] ++ shuffle_tiles( tl ) 
  end

  def skeleton(word, guesses) do
    Enum.map word, fn cc ->
      if Enum.member?(guesses, cc) do
        cc
      else
        "_"
      end
    end
  end

end