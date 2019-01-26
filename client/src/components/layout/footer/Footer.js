import React, { Component } from 'react';

export class Footer extends Component {
  render() {
    return (
      <footer class="bg-dark text-white mt-5 p-4 text-center">
        Copyright &copy; {new Date().getFullYear()} Connect
      </footer>
    );
  }
}

export default Footer;
