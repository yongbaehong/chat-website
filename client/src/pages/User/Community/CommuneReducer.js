import {
  RECEIVE_COMMUNES_INFO,
  REQUEST_COMMUNES_INFO,
  UPDATE_COMMUNES_INFO,
  ERROR_COMMUNES_INFO,
  ALERT_ERROR_DISMISS
} from './actions'

const communes = (state = { all: [], errMsg: "", err: false, isLoading: false }, action) => {

  switch (action.type) {
    case REQUEST_COMMUNES_INFO:
      return { ...state, isLoading: true }

    case RECEIVE_COMMUNES_INFO:
      return { all: [...action.data.communes], err: false, isLoading: false }

    case UPDATE_COMMUNES_INFO:
      return { all: [action.data, ...state.all], err: false, isLoading: false }

    case ERROR_COMMUNES_INFO:
      return { ...state, errMsg: action.err.message, err: true, isLoading: false }

    case ALERT_ERROR_DISMISS:
      return { ...state, errMsg: '', err: false, isLoading: false }

    default:
      return state
  }

}

export default communes;
