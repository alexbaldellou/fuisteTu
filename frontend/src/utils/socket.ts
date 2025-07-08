
import { io } from "socket.io-client";
const socket = io("https://fuiste-tu-b8o4.vercel.app:3000", {
    transports: ['websocket'], // forzar WebSocket
  withCredentials: true,
}); // o tu backend
export default socket;
