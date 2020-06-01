import React, { Component } from 'react';
import Load from '../assets/static/Ripple.svg';

export default class Loader extends Component {
  render() {
    return (
      <img src={Load} alt='loader' />
    );
  }
}
