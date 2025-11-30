import { RECEIVE_USER_INFO, REQUEST_USER_INFO, UPDATE_USER_INFO } from '../actions/actions'

const user = (state = {}, action) => {

  switch (action.type) {
    case REQUEST_USER_INFO:
      return action.type
    case RECEIVE_USER_INFO:
      return { ...action.data.user }
    case UPDATE_USER_INFO:
      const { user } = action.updateInfo
      const newState = { ...state, ...user }
      return newState
    default:
      /**
       * `State can be set from previous actions (i.e., SETTINGS_PROFILE)`
       * `so "default" will be SETTINGS_DASHBOARD`
       */
      return state
  }

}

export default user