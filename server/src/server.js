import http from 'http';
import path from 'path';
import SocketIO from 'socket.io';
import express, { json, urlencoded } from 'express';
import logger from 'morgan';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { passportAuth } from './auth/passport';
import connectDatabase from './util/db';
import userRouter from './resources/user/user.route';
import communitiesRouter from './resources/communities/communities.route';
import dmRouter from './resources/direct_msg/direct_msg.route';
import onConnection from './resources/socket.emit.handlers/onConnection';

const app = express();
app.disable('x-powered-by');
const PORT = 9003;
export const socketServer = http.createServer(app);
export const io = SocketIO(socketServer, { cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] } });

// middleware
app
  .use(logger('dev'))
  .use(cors())
  .use(urlencoded({ extended: true }))
  .use(json())
  .use(session({
    secret: 'grad-project',
    resave: false,
    saveUninitialized: false,
  }))
  .use(passport.initialize())
  .use(passport.session())
  .use(express.static(path.join(__dirname, '/public')))
  .use(express.static(path.join(__dirname, '../public')));

passportAuth();

app.get('/', (req, res) => res.status(200).send('Root, grading running.'));

// ROUTES
app.use('/', userRouter);
app.use('/api/communities', communitiesRouter);
app.use('/api/dm', dmRouter);

// 404
app.use('*', (req, res) => res.status(400).send('404. This was a bad request to the server.'));

// 500
app.use((err, req, res, next) => {
  res.status(500).json(err);
  next();
});

export const startServer = async () => {
  try {
    await connectDatabase();
    socketServer.listen(PORT, () => {
      console.log('Server and socket connected✅');
      io.on('connection', (socket) => onConnection(io, socket));
    });
    return {
      close: () => socketServer.close(() => console.log('[server] closed')),
    };
  } catch (err) {
    console.log('startSocketServer Error ❌');
  }
};
