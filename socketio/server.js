const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // Import cors

// Inisialisasi Express
const app = express();
const server = http.createServer(app);

// Inisialisasi Socket.io
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"]
  }
});

// Middleware untuk parsing JSON request body
app.use(express.json());

// Enable CORS untuk Express API
app.use(cors({
  origin: '*', // Mengizinkan semua origin
  methods: ['GET', 'POST']
}));

// Endpoint untuk mengirim notifikasi
app.post('/send-notifications', (req, res) => {
  const { channel_id, json_data, message } = req.body;

  // Kirimkan pesan ke semua socket yang terhubung ke channel_id tertentu
  io.to(channel_id).emit('notification', { json_data, message });

  console.log({ json_data, message });

  // Respond dengan status sukses
  res.status(200).send({ status: 'Notification sent' });
});

// Endpoint untuk mengakses halaman utama
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Menghubungkan socket
io.on('connection', (socket) => {
  console.log('A user connected');

  // Menunggu koneksi ke channel_id
  socket.on('join', (channel_id) => {
    socket.join(channel_id);
    console.log(`User joined channel: ${channel_id}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Menjalankan server di port 3000
server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
