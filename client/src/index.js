import React from 'react';
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import configStore from './util/redux-store/configStore'
import Main from './pages/Main/Main';
import SignupLogin from './pages/SignupLogin/SignupLogin'
import User from './pages/User/User'
import Commune from './pages/Commune/Commune'
import Error404 from './pages/Error/Error'

const store = configStore()

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/signup" element={<SignupLogin />} />
          <Route path="/login" element={<SignupLogin />} />
          <Route path="/" element={<Main />} />
          <Route path="/user/:subcomponent" element={<User history={history} />} />
          <Route path="/commune/:id" element={<Commune />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </Router>
    </Provider>
  )
}

let root = createRoot(document.getElementById('root'));
root.render(<App />);
