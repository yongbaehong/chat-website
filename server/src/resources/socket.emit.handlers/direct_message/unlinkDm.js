const UNLINK_DM = (socket) => async () => {
  try {
    await socket.leave(socket.dm_id);
    delete socket.dm_id;
    delete socket.dmUsers;
    await socket.emit('LEAVE');
    return;
  } catch (err) {
    return socket.emit('SOCKET_ERROR', { message: 'Error unlinking.' });
  }
};

export default UNLINK_DM;
