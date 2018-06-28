import React, { Component } from 'react';
import Quagga  from 'quagga';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  stopScanning() {
  }

  startScanning () {
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Tjene Barcode Scanner</h1>
        </header>
        <p className="App-intro">
        </p>
        <button onClick={this.startScanning}>Start</button>
        <button onClick={this.stopScanning}>Stop</button>
      </div>
    );
  }
}

export default App;
