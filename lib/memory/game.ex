defmodule MemoryWeb.Game do

  def new do
      internal_squares = [['a', 'b', 'c', 'd'], ['e', 'f', 'g', 'h'], ['a', 'b', 'c', 'd'], ['e', 'f', 'g', 'h']]
      internal_squares = shuffle_tiles( internal_squares )
      internal_squares = Enum.shuffle( internal_squares )
      %{
        squares: [['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', '']],
        _squares: [['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', '']],
        internal_squares: internal_squares,
        visible: [[false,false,false,false,],[false,false,false,false], [false,false,false,false], [false,false,false,false]],
        
      }
  end

  # init() {
  #   let _squares = [[]];
  #   let squares = [[]];
  #   let visible = [[]];
  #   let M = 4;
  #   let N = 4;
  #   for (let i = 0; i < M; i++) {
  #     _squares[i] = new Array();
  #     squares[i] = new Array();
  #     visible[i] = new Array();
  #     for (let j = 0; j < N; j++) {
  #       _squares[i].push("");
  #       squares[i].push(" ");
  #       visible[i].push(false);
  #     }
  #   }

  #   let characters = [];
  #   let first_character = 97;
  #   for (let i = 0; i < M + N; i++) {
  #     characters.push(String.fromCharCode(first_character));
  #     characters.push(String.fromCharCode(first_character++));
  #   }
  #   for (let i = 0; i < _squares.length; i++) {
  #     for (let j = 0; j < _squares[i].length; j++) {
  #       let my_char = characters.splice(getRandomInt(characters.length), 1);
  #       _squares[i][j] = my_char[0];
  #     }
  #   }
  #   let _tiles = M * N;

  #   this.state = {
  #     squares: _squares,
  #     _squares: _squares,
  #     visible: visible,
  #     value_of_unhuid_item: null,
  #     position_of_unhid_item: [],
  #     number_of_clicks: 0,
  #     tiles_left: _tiles,
  #     disabled_for_delay: false
  #   };
  # }

  def client_view(game) do
    #ws = String.graphemes(game.word)
    #;gs = game.guesses
    squares = game.squares
      my_visible = game.visible
      m = 4
      n = 4
      
    %{
     #skel: skeleton(ws, gs),
      #goods: Enum.filter(gs, &(Enum.member?(ws, &1))),
      #bads: Enum.filter(gs, &(!Enum.member?(ws, &1))),
      #max: max_guesses(),
      
      state: %{
        squares: squares,
       _squares: squares,
      visible: my_visible,
      value_of_unhuid_item: nil,
      position_of_unhid_item: [],
      number_of_clicks: 0,
      tiles_left: 16,
      disabled_for_delay: false}
    }
  end

  #def populate_squares( squares, M, N ) when M = 0, do: squares
  #def populate_squares( squares, M, N ) when M > 0 do
  def shuffle_tiles( squares ) when length(squares) == 1, do: [ Enum.shuffle( squares )]
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