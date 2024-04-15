import express from 'express';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {}
});

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});
app.get('/chat', (req, res) => {
  res.sendFile(join(__dirname, 'chat.html'));
});
io.on('connection', (socket) => {
  socket.on('joinRoom', (room) => {
    socket.join(room);
    io.to(room).emit('joinRoom', 'Room Joined');
  });

  socket.on('chat message', (room, user,msg) => { 
    io.to(room).emit('chat message',user , msg);
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
