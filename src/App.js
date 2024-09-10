import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import Connect from './Connect';
import { leloF1SdkConstants, leloF1SdkDeviceDefinitions, leloF1SdkConverters } from './scripts';
import Home from './Home';
import battery from './battery-100.svg'
import BatteryMonitor from './BatteryMonitor';
import Telemetry from './Telemetry';

const BluetoothDevice = require('web-bluetooth');

function App() {

  const [connected, setConnected] = useState(false)
  const [batt, setBatt] = useState(0)
  const [motor, setMotor] = useState()
  const [lelo, setLelo] = useState()
  const [connectColor, setConnectColor] = useState()
  const [connectText, setConnectText] = useState()
  const [startConnection, setStartConnection] = useState(false)
  const [devTel, setDevTel] = useState()

  window.lelo = lelo

  const styles = {
    connect: {
      color: connectColor,
    },
    connectionText: {
      fontSize: 10,
      marginTop: 0
    }
  }



  const disconnect = async () => {
    if(connected){

      const data = new Uint8Array([0x01, 0x01FA, 0x01FA])
      const characteristic = await lelo.find(
        (char) => char.uuid === '0000fff1-0000-1000-8000-00805f9b34fb'
      );
      await characteristic.writeValue(data)
    }
  }

  const handleBTClick = () => {
    if(connected){
      disconnect()
      setStartConnection(false)
      setConnected(false)
    } else {
      setStartConnection(true)
    }
  }

  const handleBTHover = () => {
    console.log(connected)
    connected ? setConnectText('') : setConnectText('Connect Device')
  }

  useEffect(() => {
    console.log(connected)
    connected ? setConnectColor('green') : setConnectColor('red')
  }, [connected])

  return (
    <div className="App">
      <header className="App-header">
        <div className='bluetooth-connect'>
          <i 
            className="fi fi-brands-bluetooth" 
            onMouseOver={() => handleBTHover()} 
            onMouseOut={() => setConnectText('')} 
            onClick={() => handleBTClick()}
            style={styles.connect}>
              <p style={styles.connectionText}>{connectText}</p>
          </i>
        </div>
        <div className='batt-monitor'>
            <BatteryMonitor level={batt}/>
        </div>
        <div className='telemetry-menu'>
          {connected && <Telemetry lelo={lelo} connected={connected}/>}
        </div>
      </header>
    {!connected &&
      <Connect startConnection={startConnection} setLeloChar={setLelo} setMot={setMotor} setConnected={setConnected} leloF1SdkConstants={leloF1SdkConstants} leloF1SdkDeviceDefinitions={leloF1SdkDeviceDefinitions} leloF1SdkConverters={leloF1SdkConverters} setBatt={setBatt} setDevTel={setDevTel}/>
    }
    {connected && 
    <>
      <Home motor={motor} lelo={lelo}/>
      
    </>
    }
    </div>
  );
}

export default App;
