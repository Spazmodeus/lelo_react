import logo from './logo.svg';
import './App.css';
import { useState, useEffect, useRef } from 'react';
import Connect from './Connect';
import { leloF1SdkConstants, leloF1SdkDeviceDefinitions, leloF1SdkConverters } from './scripts';
import Home from './Home';
import battery from './battery-100.svg'
import BatteryMonitor from './BatteryMonitor';
import Telemetry from './Telemetry';
import CircularSlider from '@fseehawer/react-circular-slider';

const BluetoothDevice = require('web-bluetooth');

function App() {

  const [connected, setConnected] = useState(true)
  const [batt, setBatt] = useState(50)
  const [motor, setMotor] = useState()
  const [lelo, setLelo] = useState()
  const [connectColor, setConnectColor] = useState()
  const [connectText, setConnectText] = useState()
  const [startConnection, setStartConnection] = useState(false)
  const [devTel, setDevTel] = useState()
  const [batteryIcon] = useState(<i class="fi fi-sr-battery-bolt">{batt}</i>)
  const [batteryPos, setBatteryPos] = useState()
  const [toggleMenu, setToggleMenu] = useState()
  const batteryGauge = useRef()

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

  useEffect(() => {
    if(batteryGauge.current){
      setBatteryPos(batteryGauge.current.getBoundingClientRect())
    }
  }, [batteryGauge])

  return (
    <div className="App">
      <header className="App-header">
        <div className='bluetooth-connect'>
          <div className='sub-header'>
            <i 
            className="fi fi-brands-bluetooth" 
            onMouseOver={() => handleBTHover()} 
            onMouseOut={() => setConnectText('')} 
            onClick={() => handleBTClick()}
            style={styles.connect}>
              <p style={styles.connectionText}>{connectText}</p>
            </i>
          </div>
          <div  ref={batteryGauge} className='sub-header'>
              <CircularSlider
                      min={0}
                      max={100}
                      width={60}
                      trackColor='#ffffff00'
                      progressColorFrom='red'
                      progressColorTo='green'
                      trackSize={5}
                      valueFontSize='0px'
                      labelColor='white'
                      labelFontSize='0px'
                      hideKnob={true}
                      appendToValue={batteryIcon}
                      value={batt}
                      dataIndex={batt}
                      />
                    {batteryPos && <label style={{x: batteryPos.x, y: batteryPos.y, position: 'absolute', zIndex: 1000, textShadow: '4px 2px 2px #4a4848'}}>{batteryIcon}</label>}
            </div>
        </div>
        <div className='menu-wrapper'>
          {!toggleMenu && <i onClick={() => setToggleMenu(true)} class="fi fi-sr-angle-circle-right"></i>}
          {toggleMenu && <i onClick={() => setToggleMenu(false)} class="fi fi-sr-angle-circle-down"></i>}
          {toggleMenu && <div className='telemetry-menu'>
            {connected && <Telemetry lelo={lelo} connected={connected}/>}
          </div>}
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
