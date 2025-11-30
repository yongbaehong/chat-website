import { status, responseParser } from '../../../util/fetchHandler'
import SOCKET_URL from '../../../util/socket/config'
import socketio from 'socket.io-client'
import { errorMatch } from '../Matches/actions'
// CONSTANTS
export const REQUEST_USER_INFO = 'REQUEST_USER_INFO';
export const RECEIVE_USER_INFO = 'RECEIVE_USER_INFO';
export const UPDATE_USER_INFO = 'UPDATE_USER_INFO';
export const LOGGED_IN_STATUS = 'LOGGED_IN_STATUS';
export const Client = socketio;
// ACTIONS

export function loggedInStatus(loggedIn) {
  return {
    type: LOGGED_IN_STATUS,
    loggedIn
  }
}

function requestUserInfo(url) {
  return {
    type: REQUEST_USER_INFO,
    url
  }
}
export function receiveUserInfo(url, data) {
  return {
    type: RECEIVE_USER_INFO,
    url,
    data,
    receivedAt: Date.now()
  }
}

export function fetchUser(url) {
  return dispatch => {
    dispatch(requestUserInfo(url))
    return fetch(url)
      .then(status)
      .then(responseParser)
      .then((data) => {
        dispatch(receiveUserInfo(url, { ...connectSocketIO(data) }))
      }, (err) => {
        console.log('User not logged in.', err)
      })
  }
}

export function updateUser(updateInfo) {
  return {
    type: UPDATE_USER_INFO,
    updateInfo
  }
}

export function addRemoveFriend(url) {
  return dispatch => {
    return fetch(url, { method: 'PUT' })
      .then(status)
      .then(responseParser)
      .then((data) => {
        dispatch(updateUser(data))
      },
        () => {
          dispatch(errorMatch(new Error('Could not complete your request at this time. Please try again later.')))
        })
  }
}

function connectSocketIO(data) {
  data.user.socket = socketio.connect(SOCKET_URL)
  return data
}
