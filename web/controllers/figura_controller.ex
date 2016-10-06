defmodule PruebaVerdegris_00.FiguraController do
  use PruebaVerdegris_00.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
