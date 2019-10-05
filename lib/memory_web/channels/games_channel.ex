defmodule MemoryWeb.GamesChannel do
  use MemoryWeb, :channel

  
#code obtained from Professor's notes/resources/scratch notes
alias MemoryWeb.Game
alias Memory.BackupAgent

#TODO : dont understand the different game channel joining
  def join("games:" <> name, payload, socket) do
    if authorized?(payload) do
      {:ok, socket}
      game = BackupAgent.get(name) || Game.new()
      socket = socket
      |> assign(:games, game)
      |> assign(:name, name)
      first_state = Game.client_view(game)
      IO.inspect first_state
      BackupAgent.put(name, game)
      {:ok, %{"join" => name, "game" => first_state}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("guess", %{"col" => col, "row" => row }, socket) do
    #IO.inspect socket
    name = socket.assigns[:name]
    game = Game.guess(socket.assigns[:games], row, col)
    socket = assign(socket, :games, game)
    BackupAgent.put(name, game)
    IO.inspect game
    {:reply, {:ok, %{ "game" => Game.client_view(game) }}, socket}
  end

  def handle_in("hideTiles", %{"row1" => r1, "col1" => c1, "row2" => r2, "col2" => c2 }, socket) do
    name = socket.assigns[:name]
    game = Game.hideTiles(socket.assigns[:games], r1, c1, r2, c2)
    socket = assign(socket, :games, game)
    IO.inspect game
    BackupAgent.put(name, game)
    {:reply, {:ok, %{ "game" => Game.client_view(game) }}, socket}
  end

  def handle_in("hideTiles", _, socket) do 
     name = socket.assigns[:name]
     game = socket.assigns[:games]
     socket = assign(socket, :games, game)
     BackupAgent.put(name, game)
     {:reply, {:ok, %{ "game" => Game.client_view(game) }}, socket}
  end

  def handle_in("reset", _, socket) do 
     name = socket.assigns[:name]
     game = Game.new()
     socket = assign(socket, :games, game)
     BackupAgent.put(name, game)
     {:reply, {:ok, %{ "game" => Game.client_view(game) }}, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
