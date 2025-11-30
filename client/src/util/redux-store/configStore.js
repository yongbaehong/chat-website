import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'
import userReducer from '../../pages/User/reducers/index'
import communeReducer from '../../pages/Commune/reducers/index'

const rootReducer = combineReducers({
  ...userReducer,
  ...communeReducer
})

const logger = store => next => action => {
  next(action)
}


export default function configStore() {
  return applyMiddleware(thunkMiddleware, logger)(createStore)(
    rootReducer
  )
}
