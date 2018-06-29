import React, { Component } from 'react';
import Quagga  from 'quagga';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor() {
    super()

    this.state = {
      codes: [],
      scannerActive: false,
      canvas: {},
      context: {},
      video: {},
      imageUrls: [],
    }

    this.onProcessed = this.onProcessed.bind(this)
    this.onDetected = this.onDetected.bind(this)
    this.startScanning = this.startScanning.bind(this)
    this.stopScanning = this.stopScanning.bind(this)
    this.captureImage = this.captureImage.bind(this)
  }

  quaggaInitCallback(err) {

      if (err) {
          console.log(err);
          return
      }

      console.log("Initialization finished. Ready to start");

      this.onProcessed();
      this.onDetected();

      Quagga.start()

      this.setState({
        canvas: document.querySelector('.input-stream canvas'),
      })

      this.setState({
        context: this.state.canvas.getContext('2d'),
        video: document.querySelector('.input-stream video'),
      })
  }

  displayDuplicateAlert() {
    window.alert('You have already scanned this barcode.')
  }

  onDetected() {
    Quagga.onDetected(v => {
      this.captureImage()
      this.stopScanning()
      this.state.codes.includes(v.codeResult.code)
        ? this.displayDuplicateAlert()
        : (() => {
          this.addDetectedCode(v.codeResult.code)
        })()
    })
  }

  captureImage() {
    this.state.context.drawImage(this.state.video, 0, 0, this.state.canvas.width, this.state.canvas.height)
    this.state.canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob)
      console.log('url: ', url)
      this.setState({
        imageUrls: [...this.state.imageUrls, url]
      })
    })
  }

  addDetectedCode(code) {
    this.setState({
      codes: [...this.state.codes, code]
    })
  }

  stopScanning() {
    Quagga.stop()
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
        <button onClick={this.startScanning}>Scan</button>
        <div className="input-stream"></div>
        <button onClick={this.stopScanning}>Cancel</button>
      </div>
    );
  }
}

export default App
