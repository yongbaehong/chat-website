import path from 'path';
import { createServer } from 'http'
import socketio from 'socket.io-client';
import Server from 'socket.io'
import '../../../../server';
import mongoose from 'mongoose';
import fs from 'fs';
import DirectMsg from '../../../direct_msg/direct_msg.model'
import onConnection from '../../onConnection';


describe("Test socket handlers", () => {
  let io, sockets;
  let id1 = mongoose.Types.ObjectId();
  let id2 = mongoose.Types.ObjectId();
  const httpServer = createServer();

  beforeAll(async () => {
    sockets = [];
    io = Server(httpServer);
    return httpServer.listen(9003, () => {
      io.on("connection", socket => onConnection(io, socket))
    })
  });

  afterAll(async () => {
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

  test('should echo a message to a client', (done) => {
    let dm;
    const socket = makeSocket();
    socket.emit('LINK_DM', {
      dm: [id2, id1],
      username: 'Imagineer',
      user_id: id1
    })
    socket.on('DM_ID', async (dmInfo) => {
      dm = await DirectMsg.findById(dmInfo.dm_id)
      expect(dm._id.toString()).toEqual(dmInfo.dm_id)
      await fs.readFile(path.join(__dirname, '../../../../../public/David.jpeg'), 'binary', async (err, data) => {
        if (err) throw err
        socket.emit('POST_IMG', {
          dm_id: dm._id.toString(),
          socketId: socket.id,
          roomId: [id2, id1],
          name: 'David.jpeg',
          image: data
        })

      })
    })

    socket.on('EMIT_MSG', async (data) => {
      let fileLocation = path.join(__dirname, `../../../../public/dm_photos/${dm._id.toString()}/${data.message}`)
      let fileExists = await fs.existsSync(fileLocation);
      expect(data.type).toEqual('img')
      expect(fileExists).toEqual(true)
      done()
    })

  })
})