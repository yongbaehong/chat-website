import user from './userReducer'
import loggedIn from './loggedIn'
import communes from '../Community/CommuneReducer'
import matches from '../Matches/reducer'
import navigation from '../../../components/Nav/Nav/reducer'

const userReducer = {
  loggedIn,
  user,
  communes,
  matches,
  navigation
}

export default userReducer;
