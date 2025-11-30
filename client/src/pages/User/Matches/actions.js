import { responseParser, status } from "../../../util/fetchHandler";

export const REQUEST_MATCHES = 'REQUEST_MATCHES';
export const RECEIVE_MATCHES = 'RECIEVE_MATCHES';
export const ERROR_FETCHING_MATCHES = 'ERROR_FETCHING_MATCHES';
export const DISMISS_ERROR = 'DISMISS_ERROR';
export const UPDATE_MATCHES = 'UPDATE_MATCHES';
export const UPDATE_UNSEEN = 'UPDATE_UNSEEN';
export const CHANGE_PROFILE = 'CHANGE_PROFILE';
export const PROFILE = 'PROFILE';
export const FILTER_MATCHED_MSGS = 'FILTER_MATCHED_MSGS'
export const SHOW_PREFERENCES_MODAL = 'SHOW_PREFERENCES_MODAL'

function requestMatches(url) {
  return {
    type: REQUEST_MATCHES,
    url
  }
}

export function receiveMatches(url, data) {
  return {
    type: RECEIVE_MATCHES,
    url,
    data,
    receivedAt: Date.now()
  }
}

export function fetchMatches(url) {
  return dispatch => {
    dispatch(requestMatches(url))

    return setTimeout(() => {
      fetch(url)
        .then(status)
        .then(responseParser)
        .then((data) => {
          return dispatch(receiveMatches(url, data))
        }, (err) => {
          return dispatch(errorMatch(err))
        })
    }, 470)
  }

}

export function errorMatch(err) {
  return {
    type: ERROR_FETCHING_MATCHES,
    err,
    receivedAt: Date.now()
  }
}

export function dismissMatchError() {
  return {
    type: DISMISS_ERROR,
    err: false
  }
}

// update list of matches
export function updateMatch(update) {
  return {
    type: update.type,
    user_id: update.user_id,
    data: update.data,
    dm: update.dm,
  }
}

export function changeProfile(person) {
  return {
    type: PROFILE,
    person: person.profile
  }
}

// Preferences modal
export function showPreferenceModal(show) {
  return {
    type: SHOW_PREFERENCES_MODAL,
    show
  }
}

// Fetch Preference Filter
export function prefFilter(url, pref) {
  return dispatch => {
    dispatch(requestMatches(url))

    return setTimeout(() => {
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pref)
      })
        .then(status)
        .then(responseParser)
        .then((data) => {
          return dispatch(receiveMatches(url, data))
        }, (err) => {
          return dispatch(errorMatch(err))
        })
    }, 270)
  }
}
