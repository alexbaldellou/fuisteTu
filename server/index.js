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
let numQuestion = 0;
let nameRandom = '';
let maxQuestion = 0;
let numRandom = 0;
let questionsList = [];
let questionsListResp = [];

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
          const partida = info.partida;
          nameRandom = info.nameRandom;
          io.to(partida).emit('getNameRandom', nameRandom);
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
          maxQuestion = info.list.length;
          questionsList = info.list;
          // io.to(partida).emit('getQuestionsList', info.list, numRandom);
          numRandom = Math.floor(Math.random() * info.list.length);
        }
    });

    socket.on('getQuestionsList', ( info ) => {
      if (info) {
        // const numRandom = Math.floor(Math.random() * questionsList.length);
        io.to(info.partida).emit('getQuestionsList', {questionsList, numRandom});
      }
    });

    socket.on('getQuestionChoose', ( info ) => {
      if (info) {
        console.log('numRandom', numRandom);
        io.to(info.partida).emit('getIdQuestion', numRandom);
      }
    });

    socket.on('questionChoose', ( info ) => {
        if (info) {
          numQuestion = info.numRandom;
          console.log('numQuestion', numQuestion);
          io.to(info.partida).emit('questionStart', numQuestion);
        }
    });

    socket.on('saveQuestionResp', ( info ) => {
      if (info) {
        const partida = info.partida;

        rooms[partida].players[socket.id] = {
          ...rooms[partida].players[socket.id],
          respuestaSiFuera: info.respuesta,
        };
        io.to(info.partida).emit('getQuestionsListResp', Object.values(rooms[partida].players));
      }
    });

    // socket.on('setMaxQuestion', ( info ) => {
    //   if (info) {
    //     maxQuestion = info.max;
    //     const partida = info.partida;
    //     const numRandom = Math.floor(Math.random() * maxQuestion);
    //     io.to(partida).emit('getQuestionChoose', numRandom);
    //   }
    // });

    // socket.on('getMaxQuestion', ( info ) => {
    //   if (info) {
    //     const partida = info.partida;
    //     const numRandom = Math.floor(Math.random() * maxQuestion);
    //     io.to(partida).emit('getQuestionChoose', numRandom);
    //     // socket.emit('getQuestionChoose', numRandom);

    //     io.to(partida).emit('getMaxQuestion', maxQuestion);
    //   }
    // });


    socket.on('questionChoosed', ( info ) => {
        if (info) {
          io.to(info.partida).emit('getQuestionChoosed', numQuestion);
        }
    });

    socket.on('getNameQuestion', ( info ) => {
        if (info) {
          const partida = info.partida;
          io.to(partida).emit('getTheNameRandom', nameRandom);
        }
    });

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
          io.to(partida).emit('allPlayersAnswered', { result, count, id: socket.id });
          // const resp = rooms[info.partida].players[socket.id].ultimaRespuesta;
          // io.to(info.partida).emit('getLastResp', resp);

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
          console.log('player', player);
          rooms[info.partida].players[socket.id] = {...player, puntos: player.puntos + 100};
        }
    });

    socket.on('getGame', ( info ) => {
        if (info) {
          io.to(info.partida).emit('getGameData', rooms[info.partida]);
        }
    });

    socket.on('getCurrentResult', (info) => {
        if (info) {
            const partida = info.partida;
            const preguntaId = info.preguntaId;
            console.log('preguntaId', preguntaId)
            console.log('rooms[partida]', rooms[partida])
        
            if (
                rooms[partida] &&
                rooms[partida].lastResults &&
                rooms[partida].lastResults[preguntaId]
            ) {
                socket.emit('allPlayersAnswered', rooms[partida].lastResults[preguntaId]);
            } else if (rooms[partida] && rooms[partida].lastResults) {
                // Enviar el último resultado disponible si no se encuentra el exacto
                const allIds = Object.keys(rooms[partida].lastResults);
                if (allIds.length > 0) {
                    const lastId = allIds[allIds.length - 1];
                    socket.emit('allPlayersAnswered', rooms[partida].lastResults[lastId]);
                }
            }
        }
    });

    socket.on('disconnect', () => {
        for (const roomId in rooms) {
            const room = rooms[roomId];
            if (room.players[socket.id]) {
                delete room.players[socket.id];
                if (room.answers) {
                    for (const preguntaId in room.answers) {
                        room.answers[preguntaId].delete(socket.id);
                    }
                }
                io.to(roomId).emit('playersInRoom', Object.values(room.players));
            }
        }
    });
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
})