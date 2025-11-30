import fs from 'fs';
import path from 'path';
import moment from 'moment';
import DirectMsg from '../../direct_msg/direct_msg.model';

const POST_IMG = (io, socket) => async (data) => {
  try {
    const dmDir = path.resolve(__dirname, '../../../public/', 'dm_photos');
    const photoDir = path.resolve(dmDir, data.dm_id);
    // if 'dm_photos/' does not exist, create directory
    if (!fs.existsSync(dmDir)) fs.mkdirSync(dmDir);
    // if Direct Msg '_id' dir does not exist, create directory
    if (!fs.existsSync(photoDir)) fs.mkdirSync(photoDir);
    const timeStampImgName = `${moment().valueOf()}-${data.name}`;
    await fs.writeFile(`${photoDir}/` + `${timeStampImgName}`, data.image, 'Binary', (err, written, buff) => {
      if (err) {
        socket.emit('SOCKET_ERROR', { message: 'Error sending your image.' });
      }
    });

    const sendingId = data.roomId[1];
    const receivingId = data.roomId[0];
    const allSocketInDm = await io.in(data.dm_id).fetchSockets();

    const dm = await DirectMsg.findByIdAndUpdate(
      data.dm_id,
      {
        $push: {
          messages: {
            type: 'img',
            user_id: sendingId,
            message: timeStampImgName,
            wasSeen: false,
          },
        },
      },
      { new: true },
    )
      .populate('messages.user_id')
      .select('messages _id')
      .select('-messages.user_id.password')
      .lean()
      .exec();

    if (!dm) {
      socket.emit('SOCKET_ERROR', { message: 'Error sending your image.' });
    }
    // if there is only 1 in dm send receiving socket updates
    if (allSocketInDm.length === 1) {
      await socket.emit('EMIT_MSG', dm.messages[dm.messages.length - 1]);
      const otherSocket = await io.fetchSockets();
      const [receivingSocket] = otherSocket.filter((currSocket) => (currSocket.user_id === receivingId));
      if (!receivingSocket) return;
      await receivingSocket.emit('NAVMATCHES_MSGS_ADD', { data: 1 });
      return receivingSocket.emit('UPDATE_UNSEEN_MSGS', { user_id: socket.user_id, data: 1, dm });
    }
    // both are in dm set all messages.wasSeen to `true` and send all messages
    if (allSocketInDm.length === 2) {
      await DirectMsg.findByIdAndUpdate(data.dm_id, { 'messages.$[].wasSeen': true }).exec();
      return io.to(dm._id.toString()).emit('EMIT_MSG', dm.messages[dm.messages.length - 1]);
    }
  } catch (err) {
    return socket.emit('SOCKET_ERROR', { message: 'Error sending your image.' });
  }
};

export default POST_IMG;
