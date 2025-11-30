// CONSTANTS
export const INITIALIZE = 'INITIALIZE'
export const INC_MSGS_NUM = 'INC_MSGS_NUM'
export const SOCKET_ERROR = 'SOCKET_ERROR'
export const DISMISS_SOCKET_ERROR = 'DISMISS_SOCKET_ERROR'

/** 
 * `ACTIONS` 
 */

// Initialize navigation
export function updateMsgNum(num) {
  return {
    type: INITIALIZE,
    num
  }
}

// Increment unseen msgs number
export function incrementMsgsNum(num) {
  return {
    type: INC_MSGS_NUM,
    num
  }
}

// Socket error handlers
export function socketError(errorMsg) {
  return {
    type: SOCKET_ERROR,
    errorMsg,
  }
}

// Dismiss socket error
export function dismissSocketError() {
  return {
    type: DISMISS_SOCKET_ERROR,
  }
}

