const reducer = (messages, incomingMsg) => {
  switch (incomingMsg.status) {
    case 'ADD_CHAT_MSG':
      return { ...messages, messages: [...messages.messages, incomingMsg.message] }
    case 'SET_CHAT_ID':
      return { ...messages, chat_id: incomingMsg.chat_id }
    default:
      return messages
  }
}

export default reducer