defmodule PruebaVerdegris_00.RoomChannel do
  use PruebaVerdegris_00.Web, :channel

  def join("game_data:lobby", payload, socket) do
    if authorized?(payload) do
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  intercept ["figura-for-response"]
  def handle_in("figura-for-response", payload, socket) do
    regreso = %{"figura-emitida-response" => "senial recibida"}
    {:reply, {:ok, regreso}, socket}
  end

  intercept ["figura-to-communicate"]
  def handle_in("figura-to-communicate", payload, socket) do
    broadcast socket, "figura-data", payload
    {:noreply, socket}
  end

  intercept ["ping"]
  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  intercept ["shout"]
  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (game_data:lobby).
  def handle_in("shout", payload, socket) do
    broadcast socket, "shout", payload
    {:noreply, socket}
  end

  # This is invoked every time a notification is being broadcast
  # to the client. The default implementation is just to push it
  # downstream but one could filter or change the event.
  def handle_out(event, payload, socket) do
    push socket, event, payload
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
