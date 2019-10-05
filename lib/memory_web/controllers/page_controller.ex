defmodule MemoryWeb.PageController do
  use MemoryWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end

  def game(conn, params = %{"name" => x}) do
    IO.inspect params
    render(conn, "game.html", name: x)
  end
end
