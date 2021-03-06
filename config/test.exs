use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :prueba_verdegris_00, PruebaVerdegris_00.Endpoint,
  http: [port: 4001],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

# Configure your database
config :prueba_verdegris_00, PruebaVerdegris_00.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "rosas93",
  database: "prueba_verdegris_00_test",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox
