import React, { useEffect, useState } from 'react';
import Visualizer from './Visualizer';

const AdvancedMotorFunction = ({ motor, lelo }) => {
  const [mainSpeed, setMainSpeed] = useState(0);
  const [vibeSpeed, setVibeSpeed] = useState(0);
  const [mainMotorAdv, setMainMotorAdv] = useState([0,0,1,0])
  const [vibeMotorAdv, setVibeMotorAdv] = useState([0,0,1,0])
  const [togglePlay, setTogglePlay] = useState(false)
  const [operationInProgress, setOperationInProgress] = useState(false); // GATT operation flag

  // const setMotorSpeed = async (main, vibe) => {
  //   if (!main) main = 0;
  //   if (!vibe) vibe = 0;

  //   // Prevent overlapping GATT operations
  //   if (operationInProgress) {
  //     console.log('GATT operation already in progress.');
  //     return;
  //   }

  //   if (main < 0x65 && vibe < 0x65) {
  //     try {
  //       setOperationInProgress(true); // Lock GATT operations
  //       const data = new Uint8Array([0x01, main, vibe]);
  //       const characteristic = await lelo.find(
  //         (char) => char.uuid === '0000fff1-0000-1000-8000-00805f9b34fb'
  //       );
  //       await characteristic.writeValue(data); // Ensure you wait for the operation to complete
  //     } catch (error) {
  //       console.log(error);
  //     } finally {
  //       setOperationInProgress(false); // Unlock GATT operations when done
  //     }
  //   }
  //   setMainSpeed(main);
  //   setVibeSpeed(vibe);
  // };

  useEffect(() => {
    // console.log(vibeMotorAdv)
  }, [vibeMotorAdv])

  useEffect(() => {
    // console.log(mainMotorAdv)
  }, [mainMotorAdv])

  return (
    <div className='adv-motor-wrapper'>
      <div className='visualizer-wrapper'>
        <Visualizer vibeMotorAdv={vibeMotorAdv} mainMotorAdv={mainMotorAdv} togglePlay={togglePlay} color={'white'}/>
        <Visualizer mainMotorAdv={vibeMotorAdv} togglePlay={togglePlay} color={'white'}/>
      </div>
<section className="patterns">
    <div>
      <button onClick={() => setTogglePlay(prev => prev === true ? false : true)}>{togglePlay? 'Pause' : 'Play'}</button>
      <h4>Patterns Main</h4>
      <span><h5>High</h5><input type="range" min="0" max="100" value={mainMotorAdv[0]} step="1" id="patternOnSpeed" onChange={(e) => setMainMotorAdv(prev => ([parseInt(e.target.value), prev[1], prev[2], prev[3]]))}/><p id="patternOnSpeedLabel">{mainMotorAdv[0]}</p></span>
      <span><h5>Low</h5><input type="range" min="0" max="100" value={mainMotorAdv[1]} step="1" id="patternOffSpeed" onChange={(e) => setMainMotorAdv(prev => ([prev[0], parseInt(e.target.value), prev[2], prev[3]]))}/><p id="patternOffSpeedLabel">{mainMotorAdv[1]}</p></span>
      <span><h5>Ramp time</h5><input type="range" min="1" max="50" value={mainMotorAdv[2]} step="0.1" id="seconds" onChange={(e) => setMainMotorAdv(prev => ([prev[0], prev[1], parseInt(e.target.value), prev[3]]))}/><p id="secondsLabel">{mainMotorAdv[2]}</p></span>
      <span><h5>Hold time</h5><input type="range" min="0" max="1000" value={mainMotorAdv[3]} step="50" id="pulseHold" onChange={(e) => setMainMotorAdv(prev => ([prev[0], prev[1], prev[2], parseInt(e.target.value)]))}/><p id="pulseHoldLabel">{mainMotorAdv[3]}</p></span>
      {/* <span><h5>Repeat</h5><input type="range" min="1" max="100" value="1" step="1" id="repeatTime"/><p id="repeatLabel">1</p></span> */}
      {/* <button className="patternStart">Start</button><button className="patternStop">Stop</button><button className="addFrame">Add</button><button className="save">Save Seq.</button> */}
    </div>
    <div>
      <h4>Patterns Main</h4>
      <span><h5>High</h5><input type="range" min="0" max="100" value={vibeMotorAdv[0]} step="1" id="patternOnSpeed" onChange={(e) => setVibeMotorAdv(prev => ([parseInt(e.target.value), prev[1], prev[2], prev[3]]))}/><p id="patternOnSpeedLabel">{vibeMotorAdv[0]}</p></span>
      <span><h5>Low</h5><input type="range" min="0" max="100" value={vibeMotorAdv[1]} step="1" id="patternOffSpeed" onChange={(e) => setVibeMotorAdv(prev => ([prev[0], parseInt(e.target.value), prev[2], prev[3]]))}/><p id="patternOffSpeedLabel">{vibeMotorAdv[1]}</p></span>
      <span><h5>Ramp time</h5><input type="range" min="1" max="50" value={vibeMotorAdv[2]} step="0.1" id="seconds" onChange={(e) => setVibeMotorAdv(prev => ([prev[0], prev[1], parseInt(e.target.value), prev[3]]))}/><p id="secondsLabel">{vibeMotorAdv[2]}</p></span>
      <span><h5>Hold time</h5><input type="range" min="0" max="1000" value={vibeMotorAdv[3]} step="50" id="pulseHold" onChange={(e) => setVibeMotorAdv(prev => ([prev[0], prev[1], prev[2], parseInt(e.target.value)]))}/><p id="pulseHoldLabel">{vibeMotorAdv[3]}</p></span>
      {/* <span><h5>Repeat</h5><input type="range" min="1" max="100" value="1" step="1" id="repeatTime"/><p id="repeatLabel">1</p></span> */}
      {/* <button className="patternStart">Start</button><button className="patternStop">Stop</button><button className="addFrame">Add</button><button className="save">Save Seq.</button> */}
    </div>
    </section>
    </div>
  );
};

export default AdvancedMotorFunction;
