import React, { Component } from 'react';
import './App.css';

// COMPONENTS
import Footer from './components/layout/footer/Footer';
import Landing from './components/layout/landing/Landing';
import Navbar from './components/layout/navbar/Navbar';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar />
        <Landing />
        <Footer />
      </div>
    );
  }
}

export default App;
