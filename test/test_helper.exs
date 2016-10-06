ExUnit.start

Mix.Task.run "ecto.create", ~w(-r PruebaVerdegris_00.Repo --quiet)
Mix.Task.run "ecto.migrate", ~w(-r PruebaVerdegris_00.Repo --quiet)
Ecto.Adapters.SQL.begin_test_transaction(PruebaVerdegris_00.Repo)

