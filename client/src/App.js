import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// STYLES
import './App.scss';

// COMPONENTS
import Footer from './components/layout/footer/Footer';
import Landing from './components/layout/landing/Landing';
import Login from './components/auth/login/Login';
import Navbar from './components/layout/navbar/Navbar';
import Register from './components/auth/register/Register';

class App extends Component {
  render() {
    return (
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
    );
  }
}

export default App;
