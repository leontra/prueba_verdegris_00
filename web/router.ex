defmodule PruebaVerdegris_00.Router do
  use PruebaVerdegris_00.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", PruebaVerdegris_00 do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
    get "/canvas", CanvasController, :index
    get "/figura", FiguraController, :index
  end

  # Other scopes may use custom stacks.
  # scope "/api", PruebaVerdegris_00 do
  #   pipe_through :api
  # end
end
