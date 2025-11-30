import { status, responseParser } from '../../../util/fetchHandler'
export const REQUEST_COMMUNES_INFO = 'REQUEST_COMMUNES_INFO';
export const RECEIVE_COMMUNES_INFO = 'RECEIVE_COMMUNES_INFO';
export const UPDATE_COMMUNES_INFO = 'UPDATE_COMMUNES_INFO';
export const ERROR_COMMUNES_INFO = 'ERROR_COMMUNES_INFO';
export const ALERT_ERROR_DISMISS = 'ALERT_ERROR_DISMISS';

function requestCommuneInfo(url) {
  return {
    type: REQUEST_COMMUNES_INFO,
    url
  }
}

export function receiveCommuneInfo(data) {
  return {
    type: RECEIVE_COMMUNES_INFO,
    data,
    receivedAt: Date.now()
  }
}

export function fetchCommunes(url) {
  return dispatch => {
    dispatch(requestCommuneInfo(url))
    return fetch(url)
      .then(status)
      .then(responseParser)
      .then((data) => {
        return dispatch(receiveCommuneInfo(data))
      }, (err) => {
        return dispatch(errorUpdatingCommune(err))
      })
  }
}
// Update Communes Array
function updateCommunesArray(data) {
  return {
    type: UPDATE_COMMUNES_INFO,
    data,
    receivedAt: Date.now()
  }
}
function errorUpdatingCommune(err) {
  return {
    type: ERROR_COMMUNES_INFO,
    err,
    receivedAt: Date.now()
  }
}
export function dismissAlert() {
  return {
    type: ALERT_ERROR_DISMISS,
    err: false,
  }
}

export const createCommune = (url, data) => {
  return (dispatch) => {
    dispatch(requestCommuneInfo(url))
    return setTimeout(() => {
      fetch(url, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(status)
        .then(responseParser)
        .then((data) => {
          return dispatch(updateCommunesArray(data))
        }, (err) => {
          return dispatch(errorUpdatingCommune(err))
        })
    }, 1500)
  }
}

export const searchBar = (url) => {
  return (dispatch) => {
    return fetch(url)
      .then(status)
      .then(responseParser)
      .then((data) => {
        return dispatch(receiveCommuneInfo({ communes: data }))
      }, (err) => {
        return dispatch(errorUpdatingCommune(err))
      })
  }
}

