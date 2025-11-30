import {
  RECEIVE_ONE_COMMUNE, REQUEST_ONE_COMMUNE,
  UPDATE_USERLIST, UNLINK_COMMUNE, ERROR_COMMUNES,
  DISMISS_COMMUNE_ERROR
} from '../actions/action'

const commune = (state = { userlist: [], isRequesting: false, err: false, errMsg: '' }, action) => {

  switch (action.type) {
    case REQUEST_ONE_COMMUNE:
      return { ...state, isRequesting: true }

    case RECEIVE_ONE_COMMUNE:
      return { ...state, ...action.data, isRequesting: false }

    case UPDATE_USERLIST:
      return { ...state, ...action.data }

    case UNLINK_COMMUNE:
      return { ...state, isRequesting: false, userlist: state.userlist, }

    case ERROR_COMMUNES:
      return { ...state, errMsg: action.err.message, err: true }

    case DISMISS_COMMUNE_ERROR:
      return { ...state, errMsg: '', err: false }

    default:
      return state
  }

}

export default commune
