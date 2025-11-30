import { createServer } from 'http';
import socketio from 'socket.io-client';
import Server from 'socket.io';
import '../../../../server';
import Communities from '../../../communities/communities.model';
import onConnection from '../../onConnection'
import mongoose from 'mongoose';

describe('cr-un-link.spec.js'.rainbow, () => {
  let io, sockets = [], chatroom, socket1, socket2;
  const httpServer = createServer();
  beforeAll(async () => {
    chatroom = await Communities.create({
      owner: mongoose.Types.ObjectId(),
      name: 'Chatroom-test3',
      address: {
        street: '1234 Test St.',
        city: 'London',
        stateAbbr: 'England',
        zipCode: '99999',
      }
    });
    socket1 = makeSocket();
    socket2 = makeSocket();
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
  test('LINK first socket to a chatroom.', (done) => {
    socket1.emit('LINK_CHATROOM', {
      chat_id: chatroom._id,
      username: 'socket1',
      user_id: mongoose.Types.ObjectId(),
      avatar: 'default_avatar.png'
    })
    socket1.on('JOINED', async (data) => {
      expect(data.chat_id).toEqual(chatroom._id.toString())
    });
    socket1.on('RECEIVE_USERLIST', async (userlist) => {
      let socketInChatroom = await io.in(chatroom._id.toString()).fetchSockets();
      expect(userlist.length).toEqual(socketInChatroom.length)
      done();
    })

  });
  // end

  // start
  test('LINK second socket to a chatroom and send a message.', (done) => {
    const user2_id = mongoose.Types.ObjectId()

    socket2.emit('LINK_CHATROOM', {
      chat_id: chatroom._id,
      username: 'socket2',
      user_id: user2_id,
      avatar: 'default_avatar.png'
    })
    socket2.on('JOINED', async (data) => {
      expect(data.chat_id).toEqual(chatroom._id.toString())
    });
    socket2.on('RECEIVE_USERLIST', async (userlist) => {
      let socketInChatroom = await io.in(chatroom._id.toString()).fetchSockets();
      expect(userlist.length).toEqual(socketInChatroom.length)
      socket2.emit('CHAT_MSG', {
        chat_id: chatroom._id.toString(),
        message: 'Testing Chat msg handler.'
      })
    })
    socket2.on('EMIT_CHAT_MSG', async (chatMsg) => {
      expect(chatMsg.message).toEqual('Testing Chat msg handler.')
      done();
    })


  });
  // end

  // start
  test('UNLINK socket2 from the Chatroom', (done) => {
    socket2.emit('UNLINK_CHATROOM', {
      chat_id: chatroom._id.toString(),
    })

    socket1.on('EMIT_CHAT_MSG', async (chatMsg) => {
      expect(chatMsg.message).toEqual('socket2 has left...')
    })

    socket1.on('RECEIVE_USERLIST', async (userlist) => {
      const socketsInChatRoom = await io.in(chatroom._id.toString()).fetchSockets()
      expect(socketsInChatRoom[0].username).toEqual(userlist[0].username)
      await done()
    })
  })
  // end
});