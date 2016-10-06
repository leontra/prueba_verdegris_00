defmodule PruebaVerdegris_00.CanvasControllerTest do
  use PruebaVerdegris_00.ConnCase

  test "GET /Canvas", %{conn: conn} do
    conn = get conn, "/canvas"
    assert html_response(conn, 200) =~ "Verde con Gris"
  end
end
