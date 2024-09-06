import React from 'react'
import BasicMotorFunction from './BasicMotorFunction'
import AdvancedMotorFunction from './AdvancedMotorFunction'

const Home = ({lelo, motor}) => {

  return (
    <>
      <BasicMotorFunction lelo={lelo} motor={motor} />
      <AdvancedMotorFunction lelo={lelo} motor={motor} />
    {/* <section>
    <div className="battery">
      <div className="left">Battery</div>
      <div className="battLevel"></div>
      <div className="gradient"></div>
      <div className="right"></div>
    </div>
  </section>

  <section className="patterns">
    <div>
      <h4>Patterns High</h4>
      <span><h5>High</h5><input type="range" min="0" max="100" value="0" step="1" id="patternOnSpeed"/><p id="patternOnSpeedLabel">0</p></span>
      <span><h5>Low</h5><input type="range" min="0" max="100" value="0" step="1" id="patternOffSpeed"/><p id="patternOffSpeedLabel">0</p></span>
      <span><h5>Pulse time</h5><input type="range" min="200" max="1000" value="200" step="50" id="seconds"/><p id="secondsLabel">200</p></span>
      <span><h5>Hold time</h5><input type="range" min="200" max="1000" value="200" step="50" id="pulseHold"/><p id="pulseHoldLabel">200</p></span>
      <span><h5>Repeat</h5><input type="range" min="1" max="100" value="1" step="1" id="repeatTime"/><p id="repeatLabel">1</p></span>
      <button className="patternStart">Start</button><button className="patternStop">Stop</button><button className="addFrame">Add</button><button className="save">Save Seq.</button>
    </div>
    <div className="patternDisplay">
      <div className="patternVisual">
      </div>
    </div>
    </section> */}
    </>
  )
}

export default Home
