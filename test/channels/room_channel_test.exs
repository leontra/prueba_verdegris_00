defmodule PruebaVerdegris_00.RoomChannelTest do
  use PruebaVerdegris_00.ChannelCase

  alias PruebaVerdegris_00.RoomChannel

  setup do
    {:ok, _, socket} =
      socket("user_id", %{some: :assign})
      |> subscribe_and_join(RoomChannel, "game_data:lobby")

    {:ok, socket: socket}
  end

  test "ping replies with status ok", %{socket: socket} do
    ref = push socket, "ping", %{"hello" => "there"}
    assert_reply ref, :ok, %{"hello" => "there"}
  end

  test "shout broadcasts to game_data:lobby", %{socket: socket} do
    push socket, "shout", %{"hello" => "all"}
    assert_broadcast "shout", %{"hello" => "all"}
  end

  test "broadcasts are pushed to the client", %{socket: socket} do
    broadcast_from! socket, "broadcast", %{"some" => "data"}
    assert_push "broadcast", %{"some" => "data"}
  end

  test "mandar figura terminada, recibir senial ok", %{socket: socket} do
    ref = push socket, "figura-for-response", %{"figura" => "senial emitida"}
    assert_reply ref, :ok, %{"figura-emitida-response" => "senial recibida"}
  end

  test "mandar figura terminada, hacer un broadcast local con JSON", %{socket: socket} do
    push socket, "figura-to-communicate", %{x_uno: 21, y_uno: 34, x_dos: 10, y_dos: 9}
    assert_broadcast "figura-data", %{x_uno: 21, y_uno: 34, x_dos: 10, y_dos: 9}
  end

  #test "verificar que haya lugar en el cuarto", %{socket: socket} do
  #  push socket, "session-available", %{status: 1, message: "cuarto disponible", numDeConectados: 0}
  #  assert_broadcast ""
  #end

end
