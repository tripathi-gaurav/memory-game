defmodule MemoryWeb.GamesChannel do
  use MemoryWeb, :channel

  
#code obtained from Professor's notes/resources/scratch notes
  def join("game", payload, socket) do
    if authorized?(payload) do
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

#TODO : dont understand the different game channel joining
  def join("games:" <> name, payload, socket) do
    if authorized?(payload) do
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  

  

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
