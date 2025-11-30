import { responseParser, status } from "../../../util/fetchHandler";

export const REQUEST_ONE_COMMUNE = 'REQUEST_ONE_COMMUNE';
export const RECEIVE_ONE_COMMUNE = 'RECEIVE_ONE_COMMUNE';
export const UPDATE_USERLIST = 'UPDATE_USERLIST';
export const UNLINK_COMMUNE = 'UNLINK_COMMUNE';
export const ERROR_COMMUNES = 'ERROR_COMMUNES'
export const DISMISS_COMMUNE_ERROR = 'DISMISS_COMMUNE_ERROR'

function requestOneCommune(url) {
  return {
    type: REQUEST_ONE_COMMUNE,
    url
  }
}

export function receiveOneCommune(url, data) {
  return {
    type: RECEIVE_ONE_COMMUNE,
    url,
    data,
    receivedAt: Date.now()
  }
}

export function fetchOneCommune(id) {
  const url = `/api/communities/${id}`
  return dispatch => {
    dispatch(requestOneCommune(url))

    return fetch(url)
      .then(status)
      .then(responseParser)
      .then((data) => {
        return dispatch(receiveOneCommune(url, data.data))
      }, (err) => {
        return dispatch(errorCommune(err))
      })
  }
}

export function updateCommune(data) {
  return {
    type: data.type,
    data
  }
}

export function errorCommune(err) {
  return {
    type: ERROR_COMMUNES,
    err,
    receivedAt: Date.now(),
  }
}

export function dismissCommuneError() {
  return {
    type: DISMISS_COMMUNE_ERROR,
    err: false
  }
}