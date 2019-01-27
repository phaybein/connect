import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';

// COMPONENTS
import Footer from './components/layout/footer/Footer';
import Landing from './components/layout/landing/Landing';
import Login from './components/auth/login/Login';
import Navbar from './components/layout/navbar/Navbar';
import Register from './components/auth/register/Register';

// STYLES
import './App.scss';

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
