import express from 'express'
import http from 'http'
import { Server as SocketServer } from 'socket.io'

const app = express()
const server = http.createServer(app)
const io = new SocketServer(server)

const rooms = {};

io.on('connection', socket =>{
    console.log('client connected', socket.id)
    
    socket.on('getPlayersInRoom', (roomId) => {
    const players = rooms[roomId]?.players || {};
    socket.emit('playersInRoom', Object.values(players));
    });

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


server.listen(3000)
console.log(`server port 3000`)