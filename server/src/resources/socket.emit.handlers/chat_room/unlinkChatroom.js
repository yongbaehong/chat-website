const UNLINK_CHATROOM = (io, socket) => async (data) => {
  try {
    await socket.leave(`${data.chat_id}`);
    const usersInRoomIO = await io.in(`${data.chat_id}`).fetchSockets();
    const userdata = await usersInRoomIO.map((socket) => ({
      id: socket.user_id,
      username: socket.username,
      avatar: socket.avatar,
    }));
    await delete socket.chat_id;
    await io.in(data.chat_id).emit('EMIT_CHAT_MSG', { message: `${socket.username} has left...` });
    await io.in(data.chat_id).emit('RECEIVE_USERLIST', userdata);
    return;
  } catch (err) {
    return socket.emit('SOCKET_ERROR', { message: 'Error unlinking to chatroom.' });
  }
};

export default UNLINK_CHATROOM;
