import { LOGGED_IN_STATUS, RECEIVE_USER_INFO } from '../actions/actions';

const loggedIn = (state = false, action) => {
  switch (action.type) {
    case LOGGED_IN_STATUS:
    case RECEIVE_USER_INFO:
      return true;
    default:
      return state;
  }
}

export default loggedIn;
