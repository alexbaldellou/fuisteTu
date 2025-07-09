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
      const partida = player.id;
      console.log('player', player)
        if (!rooms[partida]) {
        rooms[partida] = {
            players: {},
            currentQuestionIndex: 0,
            answers: {},
        };
        }
        

        socket.join(partida);

        rooms[partida].players[socket.id] = {...player.jugador, id: socket.id} ;
        console.log(`${player.jugador.nombre} se unió a la sala ${partida}`);

        // Avisar a todos en la sala
        io.to(partida).emit('playersInRoom', Object.values(rooms[partida].players));

    });

    socket.on('startGame', ( info ) => {
      console.log('info',info)
        if (info.status) {
          io.to(info.id).emit('isStartGame', info.status);
        }
        console.log(`Empieza la partida en la sala: ${info.id}`);
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