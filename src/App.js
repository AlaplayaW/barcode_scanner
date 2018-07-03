// @flow

import React, { Component } from 'react';
import Quagga  from 'quagga';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

import BarcodeListItem from './components/barcode_list_item.js'

import logo from './logo.svg';
import './App.css';

library.add(faSearch)

type State = {
  codes: Array<String>,
  scannerActive: boolean,
  canvas: {},
  search_value: string
};

class App extends Component<State> {

  constructor() {
    super()

    // state contains references to as yet un-instantiated HTML elements, as well as arrays to store codes and urls
    this.state = {
      codes: [],
      labels: [],
      scannerActive: false,
      canvas: {},
      context: {},
      video: {},
      imageUrls: [],
      search_value: ''
    }

    // react component class bindings for methods, for scope access.
    this.onDetectedHandler = this.onDetectedHandler.bind(this)
    this.startScanning = this.startScanning.bind(this)
    this.stopScanning = this.stopScanning.bind(this)
    this.captureImage = this.captureImage.bind(this)
    this.saveNewLabel = this.saveNewLabel.bind(this)
    this.setSearchValue = this.setSearchValue.bind(this)
  }

  componentDidMount() {
    this.startScanning();
  }

  // callback for after Quagga barcode scanner has initialized
  quaggaInitCallback(err) {

      if (err) {
          console.log(err);
          return
      }

      // assign handler for barcode detection event
      Quagga.onDetected(this.onDetectedHandler)

      console.log("Initialization finished. Ready to start");

      Quagga.start()

      // once Quagga barcode scanner has instantiated, barcode scanner HTML elements are present and ready to be attached to state.
      this.setState({
        canvas: document.querySelector('.input-stream canvas'),
      })

      this.setState({
        context: this.state.canvas.getContext('2d'),
        video: document.querySelector('.input-stream video'),
      })
  }

  // display alert if a barcode is scanned a second time.
  displayDuplicateAlert() {
    window.alert('You have already scanned this barcode.')
  }

  // destructure argument into the information we need, to avoid imperative variable declarations with all the usual verbose validity checks.
  onDetectedHandler({codeResult}) {
    Quagga.offDetected()

    // check if the code is already in state, and alert if it is, or add to state and capture if not.
    this.state.codes.includes(codeResult.code)
      ? this.displayDuplicateAlert()
      : (() => {
        this.captureImage()
        this.addDetectedCode(codeResult.code)
    })()

    /* re-assign handler to event listener with delay, because it was removed after successful barcode detection, 
    to prevent a stream of barcode detection events from being triggered and created a mess of multiple images.
    The delay gives the  user time to physically move the code away from the camera */
    setTimeout(() => {
      Quagga.onDetected(this.onDetectedHandler)
    }, 2000)

  }

  // save the image as a blob in local state
  captureImage() {
    // draw the image into an html canvas element from the video stream
    this.state.context.drawImage(this.state.video, 0, 0, this.state.canvas.width, this.state.canvas.height)
    // export blob from canvas element
    this.state.canvas.toBlob(blob => {
      // give blob a url
      const url = URL.createObjectURL(blob)
      // add blob url to state for access by the image list element
      this.setState({
        imageUrls: [...this.state.imageUrls, url]
      })
      // clear the canvas to be ready for the next scan
      this.state.context.clearRect(0, 0, this.state.canvas.width, this.state.canvas.height);
    })
  }

  // add new detected barcode to state
  addDetectedCode(code) {
    this.setState({
      codes: [...this.state.codes, code],
      labels: [...this.state.labels, code]
    })
  }

  // remove the scanner instance
  stopScanning() {
    Quagga.stop()
  }

  // initialize the scanner instance
  startScanning () {

    this.setState({
        scannerActive: true
    })

    Quagga.init({
      inputStream : {
        name : "Barcode Scanner",
        type : "LiveStream",
        target: document.querySelector('.input-stream'),
        constraints: {
          width: 640,
          height: 240,
        },
      },
      frequency: 2,
      decoder : {
        readers : ["code_128_reader"],
        multiple : false,
      },
      locate : true,
    },
    this.quaggaInitCallback.bind(this));
  }

  saveNewLabel(value, identifier) {
    this.setState({
      labels: this.state.labels.map((v, i) => {
        return i === identifier ? value : v
      })
    })
  }

  setSearchValue(e) {
    this.setState({search_value: e.target.value});
  }

  // filter list of barcodes using search value against labels, unless search value is empty. not case sensitive.
  searchFilter(index) {
    return (this.state.labels.findIndex(value => this.state.search_value.toLowerCase() === value.toLowerCase()) === index)
      || (this.state.search_value === '')
  }

  render() {
    return (
      <div className="App">
        <div className="AppContainer">
          <header className="App-header">
            <h1 className="App-title"> Barcode Scanner</h1>
            <img src={logo} className="App-logo" alt="logo" />
          </header>
          <div className="input-stream"></div>
          <div className="barcodeImageContainer">
            <div className="barcodeImagesHeader">
              <div className="barcodeImagesTitle">Barcode Images</div>
              <div className="barcodeImagesSearch">
                <FontAwesomeIcon icon="search" />
                <input type="text" onChange={this.setSearchValue}></input>
              </div>
            </div>
            <ul className="barcodeImages">
              {this.state.imageUrls.map((v, i) => {
                if (this.searchFilter(i)) {
                  return (<BarcodeListItem label={this.state.labels[i]} code={this.state.codes[i]} saveNewLabel={this.saveNewLabel} identifier={i} value={v} key={i.toString()} />)
                } else {
                  return null
                }
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default App
