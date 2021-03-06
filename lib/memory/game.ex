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