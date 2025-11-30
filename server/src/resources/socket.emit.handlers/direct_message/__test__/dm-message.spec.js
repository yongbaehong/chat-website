import { createServer } from 'http'
import socketio from 'socket.io-client';
import Server from 'socket.io'
import '../../../../server';
import mongoose from 'mongoose';
import DirectMsg from '../../../direct_msg/direct_msg.model'
import onConnection from '../../onConnection';


describe("Test socket handlers", () => {
  let io, clientSocket, sockets = [];
  let dm;
  let id1 = mongoose.Types.ObjectId();
  let id2 = mongoose.Types.ObjectId();
  const httpServer = createServer();

  beforeAll(async () => {
    io = Server(httpServer);
    clientSocket = makeSocket()
    return httpServer.listen(9003, () => {
      io.on("connection", (socket) => onConnection(io, socket))
    })

  })

  afterAll(async () => {
    await io.close();
    await httpServer.close()
    await sockets.forEach(e => e.disconnect())
    await mongoose.disconnect();
    return
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
  test("Create a `messages` document with LINK_DM handler.", (done) => {
    // Client links to a direct message with another user id
    clientSocket.emit('LINK_DM', {
      dm: [id2, id1],
      username: 'Pete',
      user_id: id1
    })
    // Client receives another emit with Direct Message Doc's `_id`
    clientSocket.on('DM_ID', async (dmInfo) => {
      dm = await DirectMsg.findOne({ dm_users: [id2, id1] }).lean().exec()
      expect(dm.dm_users).toEqual([id2, id1]);
      // get first socket in room
      let [pete] = await io.in(dm._id.toString()).fetchSockets()
      expect(pete.username).toEqual('Pete')
      done();
    });

  });
  // end

  // start
  test('Send a message with MESSAGE handler', (done) => {
    // create second 
    let johnny = makeSocket()
    // link socket 
    johnny.emit('LINK_DM', {
      dm: [id2, id1],
      username: 'Johnny',
      user_id: id2
    })

    // receive direct message info
    johnny.on('DM_ID', async (dmInfo) => {
      expect(dm.dm_users).toEqual([id2, id1]);
      let twoSocketsInDm = await io.in(dm._id.toString()).fetchSockets()
      expect(twoSocketsInDm.length).toEqual(2)
      expect(dmInfo.dm_id).toEqual(dm._id.toString());
    });

    johnny.emit('MESSAGE', {
      dm_id: dm._id,
      socketId: johnny.id,
      roomId: [id2, id1],
      message: 'second message',
    })

    clientSocket.on('EMIT_MSG', async (data) => {
      expect(data.message).toEqual('second message')
    })

    johnny.on('EMIT_MSG', async (data) => {
      expect(data.message).toEqual('second message')
      done()
    })

  })
  // end

});




