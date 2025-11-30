const DISCONNECT = (io, socket) => async (data) => {
  try {
    // disconnect from chatroom
    if (socket.chat_id) {
      await socket.leave(`${socket.chat_id}`);
      const usersInRoomIO = await io.in(`${socket.chat_id}`).fetchSockets();
      const userdata = await usersInRoomIO.map((socket) => ({
        id: socket.user_id,
        username: socket.username,
        avatar: socket.avatar,
      }));
      await io.in(socket.chat_id).emit('EMIT_CHAT_MSG', { message: `${socket.username} has left...` });
      await io.in(socket.chat_id).emit('RECEIVE_USERLIST', userdata);
      await delete socket.chat_id;
      return;
    }
  } catch (err) {
    return socket.emit('SOCKET_ERROR', { message: 'Error during disconnection.' });
  }
};

export default DISCONNECT;
