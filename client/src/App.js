import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setkAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';

// COMPONENTS
import Footer from './components/layout/footer/Footer';
import Landing from './components/layout/landing/Landing';
import Login from './components/auth/login/Login';
import Navbar from './components/layout/navbar/Navbar';
import Register from './components/auth/register/Register';

// STYLES
import './App.scss';

// CHECK FOR TOKEN
if (localStorage.jwtToken) {
  // SET AUTH TOKEN HEADER AUTh
  setAuthToken(localStorage.jwtToken);

  // DECODE TOKEN AND GET USER INFO AND EXPIRATION
  const decoded = jwt_decode(localStorage.jwtToken);

  // SET CURRENT USER AND ISAUTHENTICATED
  store.dispatch(setCurrentUser(decoded));

  // CHECK FOR EXPIRED TOKEN
  const currentTime = Date.now() / 1000;
  if(decoded.exp < currentTime) {
    // LOGOUT USER
    store.dispatch(logoutUser());

    // TODO: CLEAR CURRENT PROFILE
    
    // REDIRECT TO LOGIN
    window.location.href = '/login';
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <div className="container">
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
