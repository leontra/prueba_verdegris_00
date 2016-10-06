defmodule PruebaVerdegris_00.CanvasController do
  use PruebaVerdegris_00.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
