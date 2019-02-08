import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';
import {connect } from 'react-redux';

// STYLES
import './landing.scss';

export class Landing extends Component {
  
// REDIRECT LOGGED IN USER TO DASHBOARD
  componentDidMount() {
    if(this.props.auth.isAuthenticated) {
      this.props.history.push('./dashboard');
    }
  };
  
  render() {
    return (
      <div className="landing">
        <div className="dark-overlay landing-inner text-light">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h1 className="display-3 mb-4">Connect</h1>
                <p className="lead">
                  {' '}
                  Create an account, share posts and interact with other users
                </p>
                <hr />
                <Link to="/register" className="btn btn-lg btn-info mr-2">
                  Sign Up
                </Link>
                <Link to="/login" className="btn btn-lg btn-light">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Landing.propTypes = {
  auth: propTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps)(Landing);
