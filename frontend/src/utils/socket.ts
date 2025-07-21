
import { io } from "socket.io-client";
const socket = io("https://duncan-apply-collar-proof.trycloudflare.com", {
// const socket = io("http://localhost:3000", {
// const socket = io("https://fuistetuback.onrender.com", {
    transports: ['websocket'], // forzar WebSocket
  withCredentials: true,
}); // o tu backend
export default socket;
