defmodule PruebaVerdegris_00.PageControllerTest do
  use PruebaVerdegris_00.ConnCase

  test "GET /", %{conn: conn} do
    conn = get conn, "/"
    assert html_response(conn, 200) =~ "Welcome to Phoenix!"
  end
end
