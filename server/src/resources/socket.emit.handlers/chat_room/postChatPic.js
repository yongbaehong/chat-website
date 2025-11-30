import User from '../../user/user.model';

const POST_CHAT_PIC = (io) => async (data) => {
  try {
    const userDoc = await User.findById(data.user_id).select('_id username avatar').lean().exec();
    await io.to(`${data.chat_id}`).emit('EMIT_CHAT_MSG', {
      image: data.image, message: 'IMAGE', user_id: userDoc, createdAt: new Date().toISOString(),
    });
    return;
  } catch (err) {
    return socket.emit('SOCKET_ERROR', { message: 'Error sending your image.' });
  }
};

export default POST_CHAT_PIC;
