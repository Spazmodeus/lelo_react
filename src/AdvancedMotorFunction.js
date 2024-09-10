import React, { useEffect, useState } from 'react';
import CircularSlider from '@fseehawer/react-circular-slider';
import Visualizer from './Visualizer'

const numberTo2Bytes = (num) => new Uint8Array([(num >> 8) & 0xff, num & 0xff]);

const AdvancedMotorFunction = ({ lelo }) => {
  const [mainMotorAdv, setMainMotorAdv] = useState([0, 0, 0, 0, '0x02']);
  const [vibeMotorAdv, setVibeMotorAdv] = useState([0, 0, 0, 0, '0x02']);
  const [togglePlay, setTogglePlay] = useState(false);
  const [operationInProgress, setOperationInProgress] = useState(false);
  const [deviceConnected, setDeviceConnected] = useState(true);
  const [bypassGATT, setBypassGATT] = useState(true); // Add bypass state

  // Log GATT operation status
  const logGattOperation = (operationName, promise) => {
    // console.log(`${operationName} started`);
    promise
      .then(() => {
        // console.log(`${operationName} completed`);
      })
      .catch((error) => {
        console.error(`${operationName} failed:`, error);
      });
  };

  // Function to write motor pattern data to the GATT characteristic
  const writeMotorPatternToGatt = async (motorType, motorPattern) => {
    if (bypassGATT) {
      // console.log('Bypass mode enabled, skipping GATT operation.');
      return; // Skip GATT operation if bypass is enabled
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
        (char) => char.uuid === '00000a1a-0000-1000-8000-00805f9b34fb' // Replace with correct UUID
      );

      if (!characteristic) {
        console.error('Characteristic not found!');
        return;
      }

      // Perform the write operation and log it
      const writePromise = characteristic.writeValue(data);
      logGattOperation(`Write Motor ${motorType === 1 ? 'Main' : 'Vibe'}`, writePromise);

      // Await for the operation to complete
      await writePromise;

      // console.log(`Motor pattern written successfully for motor type ${motorType === 1 ? 'main' : 'vibe'}`);
    } catch (error) {
      console.error('Error writing motor pattern:', error);
    } finally {
      setOperationInProgress(false);
    }
  };

  // Sequentially write motor patterns for both main and vibe motors
  const handleMotorOperations = async () => {
    // Write for main motor first
    await writeMotorPatternToGatt(0x01, mainMotorAdv);
    // Write for vibe motor after the main motor completes
    await writeMotorPatternToGatt(0x02, vibeMotorAdv);
  };

  const handlePauseMotors = async () => {
    // Write for main motor first
    await writeMotorPatternToGatt(0x01, [0, 0, 0, 0, mainMotorAdv[4]]);
    // Write for vibe motor after the main motor completes
    await writeMotorPatternToGatt(0x02, [0, 0, 0, 0, vibeMotorAdv[4]]);
  };

  // Effect to trigger GATT operations when play/pause is toggled
  useEffect(() => {
    if (togglePlay && deviceConnected) {
      handleMotorOperations(); // Ensure motor operations are done sequentially
    } else if (!togglePlay) {
      // console.log('Motor paused');
      handlePauseMotors();
    }
  }, [togglePlay, mainMotorAdv, vibeMotorAdv, deviceConnected]);

  // Disconnect the device and stop operations
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
          <button onClick={() => setTogglePlay((prev) => !prev)}>
            {togglePlay ? 'Pause' : 'Play'}
          </button>
        <div className='input-wrapper'>
          <h4>Main Motor Control</h4>
          <span>
          <select
        onChange={(e) => {
          const newPattern = e.target.value;
          setMainMotorAdv((prev) => [...prev.slice(0, 4), newPattern]); // Update pattern in main motor
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
                min={0}
                max={100}
                width={85}
                label={'Pmax'}
                continuous={false}
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
                min={0}
                max={100}
                width={85}
                label={'Pmin'}
                continuous={false}
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
                min={1}
                max={1000}
                width={85}
                label={'T1'}
                continuous={false}
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
                min={1}
                max={1000}
                width={85}
                label={'T2'}
                continuous={false}
                onChange={ value => { 
                  setMainMotorAdv((prev) => [
                    prev[0],
                    prev[1],
                    prev[2],
                    parseInt(value),
                    prev[4]
                  ])}}
              />
          </span>
        </div>

        <div className='input-wrapper'>
          <h4>Vibe Motor Control</h4>
          <span>
          <select
        onChange={(e) => {
          const newPattern = e.target.value;
          setVibeMotorAdv((prev) => [...prev.slice(0, 4), newPattern]); // Update pattern in vibe motor
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
                min={0}
                max={100}
                width={85}
                label={'Pmax'}
                continuous={false}
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
                min={0}
                max={100}
                width={85}
                label={'Pmin'}
                continuous={false}
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
                min={1}
                max={1000}
                width={85}
                label={'T1'}
                continuous={false}
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
                min={1}
                max={1000}
                width={85}
                label={'T2'}
                continuous={false}
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

      <div>
        {/* Bypass Mode Toggle */}
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
