import express from 'express'
import http from 'http'
import { Server as SocketServer } from 'socket.io'
import cors from 'cors';
const app = express()
const server = http.createServer(app)
const io = new SocketServer(server)


app.use(cors({
  origin: "https://fuiste-tu.vercel.app/", // o tu frontend en producción
  methods: ["GET", "POST"],
//   credentials: true,
}));

app.get("/", (req, res) => {
  res.send("Servidor Socket.IO funcionando 🚀");
});

const rooms = {};
let nPreguntas = 0;

io.on('connection', socket =>{
    console.log('client connected', socket.id)

    socket.on('register', ( player ) => {
      const partida = player.id;
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
        io.to(partida).emit('playersInRoom', Object.values(rooms[partida].players))
    });

    socket.on('playersList', ( info ) => {
        if (info && rooms[info.partida]) {
          io.to(info.partida).emit('getPlayersList', Object.values(rooms[info.partida].players));
        }
    });

    socket.on('startGame', ( info ) => {
        if (info.status) {
          io.to(info.id).emit('isStartGame', info.status);
        }
        console.log(`Empieza la partida en la sala: ${info.id}`);
    });

    socket.on('nameRandom', ( info ) => {
        if (info) {
          io.to(info.partida).emit('getNameRandom', info.numRandom);
        }
    });

    socket.on('setNumberQuestion', ( info ) => {
        if (info) {
          nPreguntas = info.nPreguntas;
        }
    });

    socket.on('getNQuestion', ( info ) => {
        if (info) {
          io.to(info.partida).emit('getNumberQuestion', nPreguntas);
        }
    });

    socket.on('questionsList', ( info ) => {
        if (info) {
          io.to(info.partida).emit('getQuestionsList', info.list);
        }
    });

    socket.on('questionChoose', ( info ) => {
        if (info) {
          rooms[info.partida] = {...rooms[info.partida], currentQuestionIndex: info.numRandom};
          io.to(info.partida).emit('questionStart', info.numRandom);
        }
    });

    socket.on('questionChoosed', ( info ) => {
        if (info) {
          io.to(info.partida).emit('getQuestionChoosed', rooms[info.partida].currentQuestionIndex);
        }
    });

    // socket.on('saveResp', ( info ) => {
    //     if (info) {
    //       rooms[info.partida].players[socket.id] = {...rooms[info.partida].players[socket.id], respuestas: info.respuesta};
    //     }
    // });

    socket.on('saveResp', (info) => {
      if (info) {
        const partida = info.partida;
        const preguntaId = info.respuesta.preguntaId;

        rooms[partida].players[socket.id] = {
          ...rooms[partida].players[socket.id],
          respuestas: info.respuesta,
        };
    
        if (!rooms[partida].answers) rooms[partida].answers = {};
        if (!rooms[partida].answers[preguntaId]) rooms[partida].answers[preguntaId] = new Set();
    
        rooms[partida].answers[preguntaId].add(socket.id);
    
        const totalPlayers = Object.keys(rooms[partida].players).length;
        const answeredPlayers = rooms[partida].answers[preguntaId].size;
    
        if (answeredPlayers === totalPlayers) {
          const result = Object.values(rooms[partida].players);
          const count = nPreguntas;
          io.to(partida).emit('allPlayersAnswered', { result, count });

          // const resp = rooms[info.partida].players[socket.id].ultimaRespuesta;
          // io.to(info.partida).emit('getLastResp', resp);

          io.to(info.partida).emit('getIdPlayer', socket.id);

          rooms[partida].answers[preguntaId].clear();
        }
      }
    });

    socket.on('saveLastResp', ( info ) => {
        if (info) {
          rooms[info.partida].players[socket.id] = {...rooms[info.partida].players[socket.id], ultimaRespuesta: info.respuesta.respuesta};
        }
    });

    socket.on('getLastResp', ( info ) => {
        if (info) {
          // io.to(info.partida).emit('getLastResp', rooms[info.partida].players[socket.id].ultimaRespuesta);
          const resp = rooms[info.partida].players[socket.id].ultimaRespuesta;
          io.to(info.partida).emit('getLastResp', resp);
        }
    });

    socket.on('resultQuestion', ( info ) => {
        if (info) {
          const result = Object.values(rooms[info.partida].players);
          io.to(info.partida).emit('getResultQuestion', result);
        }
    });

    socket.on('playerWinner', ( info ) => {
        if (info) {
          const player = rooms[info.partida].players[socket.id]
          rooms[info.partida].players[socket.id] = {...player, puntos: player.puntos + 100};
        }
    });

    socket.on('getGame', ( info ) => {
        if (info) {
          io.to(info.partida).emit('getGameData', rooms[info.partida]);
        }
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