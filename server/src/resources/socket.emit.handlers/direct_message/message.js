import DirectMsg from '../../direct_msg/direct_msg.model';

const MESSAGE = (io, socket) => async (data) => {
  try {
    const sendingId = data.roomId[1];
    const receivingId = data.roomId[0];
    const allSocketInDm = await io.in(data.dm_id).fetchSockets();

    const dm = await DirectMsg.findByIdAndUpdate(
      data.dm_id,
      {
        $push: {
          messages: {
            type: 'msg',
            user_id: sendingId,
            message: data.message,
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
      socket.emit('SOCKET_ERROR', { message: 'Error sending your message.' });
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
    return socket.emit('SOCKET_ERROR', { message: 'Error sending your message.' });
  }
};

export default MESSAGE;
