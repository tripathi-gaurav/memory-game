defmodule MemoryWeb.GamesChannel do
  use MemoryWeb, :channel

  
#code obtained from Professor's notes/resources/scratch notes
alias MemoryWeb.Game

#TODO : dont understand the different game channel joining
  def join("games:" <> name, payload, socket) do
    if authorized?(payload) do
      {:ok, socket}
      game = Game.new()
      socket = socket
      |> assign(:games, game)
      |> assign(:name, name)
      first_state = Game.client_view(game)
      IO.inspect first_state
      {:ok, %{"join" => name, "game" => first_state}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("guess", %{"col" => col, "row" => row }, socket) do
    IO.inspect socket
    name = socket.assigns[:name]
    game = Game.guess(socket.assigns[:games], row, col)
    socket = assign(socket, :games, game)
    #BackupAgent.put(name, game)
    IO.inspect game
    {:reply, {:ok, %{ "game" => Game.client_view(game) }}, socket}
  end

  def handle_in("roll", _payload, socket) do
    resp = %{"roll" => :rand.uniform(6)}
    {:reply, {:roll, resp}, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
