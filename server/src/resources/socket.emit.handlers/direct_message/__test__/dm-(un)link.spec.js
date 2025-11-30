import { createServer } from 'http'
import socketio from 'socket.io-client';
import Server from 'socket.io'
import '../../../../server';
import mongoose from 'mongoose';
import DirectMsg from '../../../direct_msg/direct_msg.model'
import onConnection from '../../onConnection';


describe("Test LINK_DM & UNLINK_DM handlers", () => {
  let io, clientSocket, sockets = [];
  let dm;
  let id1 = mongoose.Types.ObjectId();
  let id2 = mongoose.Types.ObjectId();
  const httpServer = createServer();

  const makeSocket = () => {
    const socket = socketio.connect('http://localhost:9003', {
      "reconnection delay": 0,
      "reopen delay": 0,
      "force new connection": true,
    });
    sockets.push(socket);
    return socket;
  }

  beforeAll(async () => {
    io = Server(httpServer);
    return httpServer.listen(9003, () => {
      io.on("connection", (socket) => onConnection(io, socket))
    })
  })

  afterAll(async () => {
    await sockets.forEach(el => el.disconnect())
    await io.close();
    await httpServer.close();
    await clientSocket.close();
    await mongoose.disconnect();
  });


  // start
  test("Link to Create Direct Message room and Unlink from room.", (done) => {
    // Client links to a direct message with another user id

    clientSocket = makeSocket();
    clientSocket.emit('LINK_DM', {
      dm: [id2, id1],
      username: 'Pete',
      user_id: id1
    })

    clientSocket.on('DM_ID', async (dmInfo) => {
      dm = await DirectMsg.findOne({ dm_users: [id2, id1] }).lean().exec()
      expect(dm.dm_users).toEqual([id2, id1]);
      let socketInDM = await io.in(dm._id.toString()).fetchSockets();
      let [currentSocket] = socketInDM;
      expect(socketInDM.length).toEqual(1)
      expect(dmInfo.dm_id).toEqual(currentSocket.dm_id)
      await clientSocket.emit('UNLINK_DM')
    })

    clientSocket.on('LEAVE', async () => {
      let dmSockets = await io.in(dm._id.toString()).fetchSockets();
      expect(dmSockets.length).toEqual(0);
      done()
    })

  });
  // end

});




