export const reducer = (messages, incomingMsg) => {
  switch (incomingMsg.status) {
    case 'INITIAL':
      return { dm_id: incomingMsg.dm_id, messages: incomingMsg.initialMsgs }
    case 'ADD_MESSAGE':
      return { ...messages, messages: [...messages.messages, incomingMsg.message] }
    case 'RESET':
      return { dm_id: '', messages: [] }
    case 'SET_DM_ID':
      return {...messages, dm_id: incomingMsg.dm_id}
    default:
      return messages
  }
}
