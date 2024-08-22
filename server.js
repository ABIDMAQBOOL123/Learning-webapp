const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: 'config.env' });
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const notificationService = require('./services/notificationService');
const morgan = require('morgan')

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for testing purposes
    methods: ['GET', 'POST'],
  },
});

app.use(express.json());
app.use(morgan('dev'))
app.use(cors());
app.use(cookieParser());

app.use((req, res, next) => {
  req.io = io;
  next();
});


app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/courses', require('./routes/api/courses'));
app.use('/api/enrollments', require('./routes/api/enrollment'));
app.use('/api/lessons', require('./routes/api/lessons'));
app.use('/api/instructors', require('./routes/api/Instructor'));
app.use('/api/quizzes', require('./routes/api/quizzes'));
app.use('/api/takeQuiz', require('./routes/api/takeQuiz'));
app.use('/api/questions', require('./routes/api/question'));
app.use('/api/videos', require('./routes/api/video'));

app.use('/api/reviews', require('./routes/api/reviews'));
app.use('/api/notifications', require('./routes/api/notifications'));
app.use('/api/payment', require('./routes/api/payment'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('authenticate', (data) => {
    const { userId } = data;
    console.log(`User authenticated with ID: ${userId}`);

    // Associate socket with the user ID
    socket.join(userId);
    console.log(`User ${userId} joined room ${userId}`);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

notificationService.initSocket(io);

const PORT = process.env.PORT || 5051;
connectDB();
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
