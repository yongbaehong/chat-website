import { INITIALIZE, INC_MSGS_NUM, SOCKET_ERROR, DISMISS_SOCKET_ERROR } from './action'

const navigation = (state = { msg_num: 0, errorMsg: '', showError: false }, action) => {

  switch (action.type) {
    case INITIALIZE:
      return { ...state, msg_num: action.num }

    case INC_MSGS_NUM:
      return { ...state, msg_num: state.msg_num += action.num }

    case SOCKET_ERROR:
      return { ...state, errorMsg: action.errorMsg, showError: true }

    case DISMISS_SOCKET_ERROR:
      return { ...state, errorMsg: '', showError: false }

    default:
      return state
  }

}

export default navigation