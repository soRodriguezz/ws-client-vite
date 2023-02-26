import { Manager, Socket } from "socket.io-client";

export const connectToServer = () => {
  const manager = new Manager("http://localhost:3000/socket.io/socket.io.js");

  const socket = manager.socket("/"); // namespace a conectar, esta en el socket del server

  addListeners(socket);
};

const addListeners = (socket: Socket) => {
  const serverStatusLabel = document.querySelector("#server-status");
  const clientsUl = document.querySelector("#clients-ul");
  const messagesUl = document.querySelector("#clients-ul");
  const messageForm = document.querySelector<HTMLFormElement>("#message-form");
  const messageInput =
    document.querySelector<HTMLInputElement>("#message-input");

  socket.on("connect", () => {
    serverStatusLabel!.innerHTML = "connected";
  });

  socket.on("disconnect", () => {
    serverStatusLabel!.innerHTML = "disconnected";
  });

  socket.on("clients-updated", (clients: string[]) => {
    let clientsHtml = "";
    clients.forEach((clientId) => {
      clientsHtml += `
        <li>${clientId}</li>
      `;
    });
    clientsUl!.innerHTML = clientsHtml;
  });

  messageForm!.addEventListener("submit", (event) => {
    event.preventDefault();
    if (messageInput!.value.trim().length <= 0) return;

    socket.emit("message-from-client", {
      id: "yo",
      message: messageInput!.value,
    });

    messageInput!.value = "";
  });

  socket.on(
    "message-from-server",
    (payload: { fullName: string; message: string }) => {
      console.log(payload);
    }
  );
};
