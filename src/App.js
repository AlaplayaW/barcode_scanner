import React, { Component } from 'react';
import Quagga  from 'quagga';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor() {
    super()
    this.startScanning = this.startScanning.bind(this);
    this.stopScanning = this.stopScanning.bind(this);
  }

  quaggaInitCallback(err) {
      if (err) {
          console.log(err);
          return
      }
      console.log("Initialization finished. Ready to start");
      Quagga.start();
  }

  stopScanning() {
  }

  startScanning () {
     Quagga.init({
      inputStream : {
        name : "Tjene Barcode Scanner",
        type : "LiveStream",
        target: document.querySelector('.input-stream')    // Or '#yourElement' (optional)
      },
      decoder : {
        readers : ["code_128_reader"]
      },
      debug: {
        drawBoundingBox: true,
        showFrequency: false,
        drawScanline: true,
        showPattern: true
      }
    },
    this.quaggaInitCallback.bind(this));
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
        <div className="input-stream"></div>
        <button onClick={this.stopScanning}>Stop</button>
      </div>
    );
  }
}

export default App;
