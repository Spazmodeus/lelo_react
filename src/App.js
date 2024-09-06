import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import Connect from './Connect';
import { leloF1SdkConstants, leloF1SdkDeviceDefinitions, leloF1SdkConverters } from './scripts';
import Home from './Home';


const BluetoothDevice = require('web-bluetooth');

function App() {

  const [connected, setConnected] = useState(true)
  const [batt, setBatt] = useState()
  const [motor, setMotor] = useState()
  const [lelo, setLelo] = useState()

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <p>
            {batt}
          </p>
        </div>
      </header>
    {!connected &&
      <Connect setLeloChar={setLelo} setMot={setMotor} setConnected={setConnected} leloF1SdkConstants={leloF1SdkConstants} leloF1SdkDeviceDefinitions={leloF1SdkDeviceDefinitions} leloF1SdkConverters={leloF1SdkConverters} setBatt={setBatt}/>
    }
    {connected && 
      <Home motor={motor} lelo={lelo}/>
    }
    </div>
  );
}

export default App;
