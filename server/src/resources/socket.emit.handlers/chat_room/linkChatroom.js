import Community from '../../communities/communities.model';

const LINK_CHATROOM = (io, socket) => async (data) => {
  try {
    const communityDoc = await Community.findById(data.chat_id).lean().exec();
    const userSocket = socket;
    userSocket.user_id = data.user_id;
    userSocket.chat_id = data.chat_id;
    userSocket.username = data.username;
    userSocket.avatar = data.avatar;
    if (!communityDoc) {
      return socket.emit('SOCKET_ERROR', { message: 'Error linking to chatroom.' });
    }
    await io.to(`${communityDoc._id}`).emit('EMIT_CHAT_MSG', { message: `${socket.username} has entered...` });
    await userSocket.join(`${communityDoc._id}`);
    const usersInRoomIO = await io.in(`${communityDoc._id}`).fetchSockets();
    const userdata = await usersInRoomIO.map((socket) => ({
      id: socket.user_id,
      username: socket.username,
      avatar: socket.avatar,
    }));
    await userSocket.emit('JOINED', { chat_id: communityDoc._id });
    return await io.in(`${communityDoc._id}`).emit('RECEIVE_USERLIST', userdata);
  } catch (err) {
    return socket.emit('SOCKET_ERROR', { message: 'Error linking to chatroom.' });
  }
};

export default LINK_CHATROOM;
