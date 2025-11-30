import {
  REQUEST_MATCHES,
  RECEIVE_MATCHES,
  ERROR_FETCHING_MATCHES,
  DISMISS_ERROR,
  UPDATE_MATCHES,
  UPDATE_UNSEEN,
  CHANGE_PROFILE,
  FILTER_MATCHED_MSGS,
  SHOW_PREFERENCES_MODAL,
  PROFILE,
} from './actions'

const matches = (state = { profile: {}, all: [], errMsg: "", err: false, isLoading: false, showPreferenceModal: false, unseenMsgs: 0 }, action) => {
  switch (action.type) {
    case REQUEST_MATCHES:
      return { ...state, isLoading: true }

    case RECEIVE_MATCHES:
      return { ...state, all: [...action.data], isLoading: false, err: false }

    case ERROR_FETCHING_MATCHES:
      return { ...state, errMsg: action.err.message, err: true, isLoading: false }

    case DISMISS_ERROR:
      return { ...state, errMsg: '', err: false, isLoading: false }

    case UPDATE_MATCHES:
      if (!!action.user_id === false) return state
      let update = state.all.map(person => {
        if (person._id === action.user_id) {
          if (('unseen' in person) === false) {
            person.unseen = action.data
            let { messages } = action.dm
            person.lastMsg = messages[messages.length - 1]
            return person
          }
          let { messages } = action.dm
          person.lastMsg = messages[messages.length - 1]
          person.unseen += (!!action.data) ? action.data : 0
          return person
        }
        return person
      })
      return { ...state, all: update }

    case UPDATE_UNSEEN:
      let updateUnseen = state.all.map(person => {
        if (person._id === action.user_id) {
          ('unseen' in person) ? person.unseen += action.data : person.unseen = action.data
          return person
        }
        return person
      })
      return { ...state, all: updateUnseen }

    case CHANGE_PROFILE:
      let changeProfile = state.all.map(person => {
        if (person._id === action.user_id) {
          delete person.unseen
          return person
        }
        return person
      })
      return { ...state, all: changeProfile }

    case PROFILE:
      return { ...state, profile: action.person }

    case FILTER_MATCHED_MSGS:
      const { all } = state
      const filtered = all.filter((obj) => {
        if (('unseen' in obj) && (obj._id !== action.user_id)) return true
      })
      if (!!filtered.length) {
        return { ...state, all: filtered }
      }
      return state

    case SHOW_PREFERENCES_MODAL:
      return { ...state, showPreferenceModal: action.show }

    case 'UPDATE_NAV_MSGS_NUM':
      return { ...state, unseenMsgs: action.data }

    case 'INCREMENT_UNSEEN_MSGS':
      return { ...state, unseenMsgs: state.unseenMsgs + action.data }
    default:
      return state
  }
}

export default matches