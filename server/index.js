import express from 'express'
import http from 'http'
import { Server as SocketServer } from 'socket.io'
import cors from 'cors';
const app = express()
const server = http.createServer(app)
const io = new SocketServer(server)


app.use(cors({
  origin: "*", // o tu frontend en producción
  methods: ["GET", "POST"],
//   credentials: true,
}));

app.get("/", (req, res) => {
  res.send("Servidor Socket.IO funcionando 🚀");
});

const rooms = {};

io.on('connection', socket =>{
    console.log('client connected', socket.id)
    
    // socket.on('getPlayersInRoom', (roomId) => {
    //   const players = rooms[roomId]?.players || {};
    //   socket.emit('playersInRoom', Object.values(players));
    // });

    socket.on('register', ( player ) => {

        if (!rooms[player.partidaId]) {
        rooms[player.partidaId] = {
            players: {},
            currentQuestionIndex: 0,
            answers: {},
        };
        }
        

        socket.join(player.partidaId);

        rooms[player.partidaId].players[socket.id] = {...player.jugador, id: socket.id} ;
        console.log(`${player.jugador.nombre} se unió a la sala ${player.partidaId}`);

        // Avisar a todos en la sala
        io.to(player.partidaId).emit('playersInRoom', Object.values(rooms[player.partidaId].players));

    });

    socket.on('startGame', ( partida, isStart ) => {
        if (isStart) {
          io.to(partida).emit('isStartGame', isStart);
        }
        console.log(`Empieza la partida en la sala: ${partida}`);
    });


    socket.on('disconnect', () => {
        for (const roomId in rooms) {
            const room = rooms[roomId];
            if (room.players[socket.id]) {
            delete room.players[socket.id];
            delete room.answers[socket.id];

            io.to(roomId).emit('playersInRoom', Object.values(room.players));
            }
        }
    });
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
})