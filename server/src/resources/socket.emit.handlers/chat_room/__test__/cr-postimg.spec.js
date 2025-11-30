import { createServer } from 'http';
import fs from 'fs'
import path from 'path'
import socketio from 'socket.io-client';
import Server from 'socket.io';
import '../../../../server';
import Communities from '../../../communities/communities.model';
import onConnection from '../../onConnection'
import mongoose from 'mongoose';

describe('cr-postimg.spec.js'.rainbow, () => {
  let io, sockets = [], chatroom, socket3;
  const httpServer = createServer();
  beforeAll(async () => {
    chatroom = await Communities.create({
      owner: mongoose.Types.ObjectId(),
      name: 'Chatroom-test4',
      address: {
        street: '1234 Test St.',
        city: 'London',
        stateAbbr: 'England',
        zipCode: '99999',
      }
    });
    socket3 = makeSocket();
    io = Server(httpServer);
    return httpServer.listen(9003, () => {
      io.on("connection", (socket) => onConnection(io, socket));
    });
  });

  afterAll(async () => {
    // remove test community
    await Communities.findByIdAndDelete(chatroom._id)
    await sockets.forEach(e => e.disconnect())
    await io.close();
    await httpServer.close();
    await mongoose.disconnect();
  });

  const makeSocket = () => {
    const socket = socketio.connect('http://localhost:9003', {
      "reconnection delay": 0,
      "reopen delay": 0,
      "force new connection": true,
    });
    sockets.push(socket);
    return socket;
  }
  // start
  test('LINK_CHATROOM socket and POST_CHAT_PIC to chatroom.', (done) => {

    socket3.emit('LINK_CHATROOM', {
      chat_id: chatroom._id,
      username: 'socket3',
      user_id: mongoose.Types.ObjectId(),
      avatar: 'default_avatar.png'
    })
    socket3.on('JOINED', async (data) => {
      expect(data.chat_id).toEqual(chatroom._id.toString())
    });
    socket3.on('RECEIVE_USERLIST', async (userlist) => {
      let socketInChatroom = await io.in(chatroom._id.toString()).fetchSockets();
      expect(userlist.length).toEqual(socketInChatroom.length)
      fs.readFile(path.join(__dirname, '../../../../../public/Jennifer.jpeg'), 'base64', async (err, data) => {
        if (err) throw err
        let user_id = await mongoose.Types.ObjectId()
        socket3.emit('POST_CHAT_PIC', {
          user_id,
          chat_id: chatroom._id.toString(),
          image: data,
        })
      });
    })

    socket3.on('EMIT_CHAT_MSG', async (data) => {
      expect(typeof data.image).toEqual('string')
      expect(data.user_id).toEqual(null)
      done()
    })

  });
  // end

});