import React, { useEffect, useState, useRef } from 'react';
import CircularSlider from '@fseehawer/react-circular-slider';
import Visualizer from './Visualizer'

const numberTo2Bytes = (num) => new Uint8Array([(num >> 8) & 0xff, num & 0xff]);

const AdvancedMotorFunction = ({ lelo }) => {
  const [mainMotorAdv, setMainMotorAdv] = useState([0, 0, 0, 0, '0x02']);
  const [vibeMotorAdv, setVibeMotorAdv] = useState([0, 0, 0, 0, '0x02']);
  const [togglePlay, setTogglePlay] = useState(false);
  const [operationInProgress, setOperationInProgress] = useState(false);
  const [deviceConnected, setDeviceConnected] = useState(true);
  const [bypassGATT, setBypassGATT] = useState(true);
  const vibeOptions = useRef()
  const mainOptions = useRef()

  const logGattOperation = (operationName, promise) => {

    promise
      .then(() => {
      })
      .catch((error) => {
        console.error(`${operationName} failed:`, error);
      });
  };

  const writeMotorPatternToGatt = async (motorType, motorPattern) => {
    if (bypassGATT) {
      // console.log('Bypass mode enabled, skipping GATT operation.');
      return; 
    }

    if (!deviceConnected) {
      // console.log('Device is not connected. Cannot perform GATT operation.');
      return;
    }

    if (operationInProgress) {
      // console.log('GATT operation already in progress.');
      return;
    }

    try {
      setOperationInProgress(true);

      const [Pmax, Pmin, T1, T2, pattern] = motorPattern;
      const T1Bytes = numberTo2Bytes(T1);
      const T2Bytes = numberTo2Bytes(T2);

      const data = new Uint8Array([
        0x04, 0x05, motorType, parseInt(pattern), T1Bytes[0], T1Bytes[1], T2Bytes[0], T2Bytes[1], Pmax, Pmin,
      ]);

      const characteristic = await lelo.find(
        (char) => char.uuid === '00000a1a-0000-1000-8000-00805f9b34fb'
      );

      if (!characteristic) {
        console.error('Characteristic not found!');
        return;
      }

      const writePromise = characteristic.writeValue(data);
      logGattOperation(`Write Motor ${motorType === 1 ? 'Main' : 'Vibe'}`, writePromise);

      await writePromise;

    } catch (error) {
      console.error('Error writing motor pattern:', error);
    } finally {
      setOperationInProgress(false);
    }
  };

  const handleMotorOperations = async () => {
    await writeMotorPatternToGatt(0x01, mainMotorAdv);
    await writeMotorPatternToGatt(0x02, vibeMotorAdv);
  };

  const handlePauseMotors = async () => {
    await writeMotorPatternToGatt(0x01, [0, 0, 0, 0, mainMotorAdv[4]]);
    await writeMotorPatternToGatt(0x02, [0, 0, 0, 0, vibeMotorAdv[4]]);
  };

  useEffect(() => {
    if (togglePlay && deviceConnected) {
      handleMotorOperations();
    } else if (!togglePlay) {
      // console.log('Motor paused');
      handlePauseMotors();
    }
  }, [togglePlay, mainMotorAdv, vibeMotorAdv, deviceConnected]);

  const disconnectDevice = () => {
    if (lelo && lelo.gatt.connected) {
      lelo.gatt.disconnect();
      setDeviceConnected(false);
      console.log('Device disconnected');
    } else {
      console.log('Device is already disconnected');
    }
  };

  return (
    <div className='adv-motor-wrapper'>
     <Visualizer motors={[mainMotorAdv, vibeMotorAdv]} playPause={togglePlay}/>
    <section className="patterns">
      <div className='button-wrapper'>
        <button onClick={() => setTogglePlay((prev) => !prev)} disabled={operationInProgress}>
          {togglePlay ? 'Pause' : 'Play'}
        </button>
        </div>
        <section className='controls-wrapper'>
        <div className='input-wrapper'>
        <i onClick={() => setMainMotorAdv([0,0,0,0,0])}class="fi fi-br-power"></i>
          <h4>Upper Control</h4>
          <span>
            <div ref={mainOptions}>
              <i class="fi fi-sr-angle-circle-down"></i>
              <div className='pattern-options'>
                
                <div className='option' value='0x02'>
                  <img className='fi-option' src={'/wave-square.png'}/>
                  <img className='fi-option' src={'/wave-square.png'}/>              
                </div>

                <div className='option' value='0x03'>
                  <img className='fi-option' src={'/wave-square-rev.png'}/>
                  <img className='fi-option' src={'/wave-square-rev.png'}/>              
                </div>

                <div className='option' value='0x04'>
                  <img className='fi-option' src={'/sine.png'}/>
                  <img className='fi-option' src={'/sine.png'}/>              
                </div>

                <div className='option' value='0x05'>
                  <img className='fi-option' src={'/sine-rev.png'}/>
                  <img className='fi-option' src={'/sine-rev.png'}/>              
                </div>

              </div>
            </div>
          <select
        onChange={(e) => {
          const newPattern = e.target.value;
          setMainMotorAdv((prev) => [...prev.slice(0, 4), newPattern]);
        }}
        >
              <option value='0x02'>---___---___</option>
              <option value='0x03'>___---___---</option>
              <option value='0x04'>/\/\/\/\/\/\</option>
              <option value='0x05'>\/\/\/\/\/\/</option>
              <option value='0x06'>\\\\\\\\\\\\</option>
              <option value='0x07'>////////////</option>
            </select>
            <h5>High Speed (Pmax)</h5>
            <CircularSlider
                disabled={operationInProgress}
                min={0}
                max={100}
                width={85}
                label={'Pmax'}
                progressColorFrom='red'
                progressColorTo='green'
                trackSize={3}
                valueFontSize='30px'
                labelFontSize='0px'
                knobColor='silver'
                dataIndex={mainMotorAdv[0]}
                onChange={ value => { 
                  setMainMotorAdv((prev) => [
                    parseInt(value),
                    prev[1],
                    prev[2],
                    prev[3],
                    prev[4]
                  ])}}
                  />
          </span>
          <span>
            <h5>Low Speed (Pmin)</h5>
            <CircularSlider
                disabled={operationInProgress}
                min={0}
                max={100}
                width={85}
                label={'Pmin'}
                progressColorFrom='red'
                progressColorTo='green'
                trackSize={3}
                valueFontSize='30px'
                labelFontSize='0px'
                knobColor='silver'
                dataIndex={mainMotorAdv[1]}
                onChange={ value => { 
                  setMainMotorAdv((prev) => [
                    prev[0],
                    parseInt(value),
                    prev[2],
                    prev[3],
                    prev[4]
                  ])}}
                  />

          </span>
          <span>
            <h5>Hold at High (T1)</h5>
            <CircularSlider
                disabled={operationInProgress}
                min={1}
                max={1000}
                width={85}
                label={'T1'}
                progressColorFrom='red'
                progressColorTo='green'
                trackSize={3}
                valueFontSize='30px'
                labelFontSize='0px'
                knobColor='silver'
                initialValue={mainMotorAdv[2]}
                onChange={ value => { 
                  setMainMotorAdv((prev) => [
                    prev[0],
                    prev[1],
                    parseInt(value),
                    prev[3],
                    prev[4]
                  ])}}
                  />
          </span>
          <span>
            <h5>Hold at Low (T2)</h5>
          <CircularSlider
              disabled={operationInProgress}
              min={1}
              max={1000}
              width={85}
              label={'T2'}
              progressColorFrom='red'
              progressColorTo='green'
              trackSize={3}
              valueFontSize='30px'
              labelFontSize='0px'
              knobColor='silver'
              initialValue={mainMotorAdv[3]}
            onChange={ value => {
              if (parseInt(value) !== mainMotorAdv[3]) {
              setMainMotorAdv((prev) => [
              prev[0],
              prev[1],
              prev[2],
              parseInt(value),
              prev[4]
              ]);
              }
            }}
          />
          </span>
        </div>

        <div className='input-wrapper'>
          <i onClick={()=> setVibeMotorAdv(mainMotorAdv)} class="fi fi-arrow fi-bs-arrow-right"></i>
        </div>

        <div className='input-wrapper'>
          <i onClick={()=> setMainMotorAdv(vibeMotorAdv)} class="fi fi-arrow fi-bs-arrow-left"></i>
        </div>

        <div className='input-wrapper'>
        <i onClick={() => setVibeMotorAdv([0,0,0,0,0])}class="fi fi-br-power"></i>
          <h4>Lower Control</h4>
          <span>
          <select
        onChange={(e) => {
          const newPattern = e.target.value;
          setVibeMotorAdv((prev) => [...prev.slice(0, 4), newPattern]); // Update pattern in vibe motor
        }}
        >
              <option value='0x02'>
                <img src='/wave-square.png'/>
              </option>
              <option value='0x03'>___---___---</option>
              <option value='0x04'>/\/\/\/\/\/\</option>
              <option value='0x05'>\/\/\/\/\/\/</option>
              <option value='0x06'>\\\\\\\\\\\\</option>
              <option value='0x07'>////////////</option>
            </select>
            <div ref={vibeOptions}>
            </div>
            <h5>High Speed (Pmax)</h5>
            <CircularSlider
                disabled={operationInProgress}
                min={0}
                max={100}
                width={85}
                label={'Pmax'}
                progressColorFrom='red'
                progressColorTo='green'
                trackSize={3}
                valueFontSize='30px'
                labelFontSize='0px'
                knobColor='silver'
                dataIndex={vibeMotorAdv[0]}
                onChange={ value => { 
                  setVibeMotorAdv((prev) => [
                    parseInt(value),
                    prev[1],
                    prev[2],
                    prev[3],
                    prev[4]
                  ])}}
                  />
          </span>
          <span>
            <h5>Low Speed (Pmin)</h5>
            <CircularSlider
                disabled={operationInProgress}
                min={0}
                max={100}
                width={85}
                label={'Pmin'}
                progressColorFrom='red'
                progressColorTo='green'
                trackSize={3}
                valueFontSize='30px'
                labelFontSize='0px'
                knobColor='silver'
                dataIndex={vibeMotorAdv[1]}
                onChange={ value => { 
                  setVibeMotorAdv((prev) => [
                    prev[0],
                    parseInt(value),
                    prev[2],
                    prev[3],
                    prev[4]
                  ])}}
                  />

          </span>
          <span>
            <h5>Hold at High (T1)</h5>
            <CircularSlider
                disabled={operationInProgress}
                min={1}
                max={1000}
                width={85}
                label={'T1'}
                progressColorFrom='red'
                progressColorTo='green'
                trackSize={3}
                valueFontSize='30px'
                labelFontSize='0px'
                knobColor='silver'
                initialValue={vibeMotorAdv[2]}
                onChange={ value => { 
                  setVibeMotorAdv((prev) => [
                    prev[0],
                    prev[1],
                    parseInt(value),
                    prev[3],
                    prev[4]
                  ])}}
                  />
          </span>
          <span>
            <h5>Hold at Low (T2)</h5>
            <CircularSlider
                disabled={operationInProgress}
                min={1}
                max={1000}
                width={85}
                label={'T2'}
                progressColorFrom='red'
                progressColorTo='green'
                trackSize={3}
                valueFontSize='30px'
                labelFontSize='0px'
                knobColor='silver'
                initialValue={vibeMotorAdv[3]}
                onChange={ value => { 
                  setVibeMotorAdv((prev) => [
                    prev[0],
                    prev[1],
                    prev[2],
                    parseInt(value),
                    prev[4]
                  ])}}
                  />
          </span>
        </div>
        </section>
      </section>

      <div>
        <label>
          <input
            type="checkbox"
            checked={bypassGATT}
            onChange={(e) => setBypassGATT(e.target.checked)}
          />
          Bypass GATT Operations
        </label>
      </div>

      <button onClick={disconnectDevice}>Disconnect</button>
    </div>
  );
};

export default AdvancedMotorFunction;
