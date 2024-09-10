import React, {useState, useEffect} from 'react'
import { leloF1SdkDeviceDefinitions } from './scripts'

const Telemetry = ({lelo}) => {

    const [telemetry, setTelemetry] = useState()
    const [staticValues, setStaticValues] = useState()
    const [userMessage, setUserMessage] = useState('')
    const [lelocharacteristic, setLelocharacteristic] = useState()
    const [accelerometer, setAccelerometer] = useState([]);
    const [advancedMotorControl, setAdvancedMotorControl] = useState([]);
    const [button, setButton] = useState([]);
    const [chipId, setChipId] = useState([]);
    const [hall, setHall] = useState([]);
    const [length, setLength] = useState([]);
    const [macAddress, setMacAddress] = useState([]);
    const [motorControl, setMotorControl] = useState([]);
    const [pressure, setPressure] = useState([]);
    const [securityAccess, setSecurityAccess] = useState([]);
    const [serialNumber, setSerialNumber] = useState([]);
    const [userRecord, setUserRecord] = useState([]);
    const [toggleExpand, setToggleExpand] = useState(false)
    const [cruiseControl, setCruiseControl] = useState()



    const setNotifications = async () => {
        setUserMessage('starting notifications')
        let array = ["ACCELEROMETER", "ADVANCED_MOTOR_CONTROL", "BUTTON", "CHIP_ID", "HALL", "LENGTH", "MAC_ADDRESS", "MOTOR_CONTROL", "PRESSURE", "SECURITY_ACCESS", "SERIAL_NUMBER", "USER_RECORD", "MOTOR_WORK_ON_TOUCH"]
        for (const val of array) {
            
            const char = Object.entries(leloF1SdkDeviceDefinitions).find((def) => def[0] === val)[1]
            const foundChar = lelocharacteristic.find((ch) => ch.uuid === char)
            // setUserMessage(foundChar)
            if(foundChar.properties.notify){
      
              const notif = await foundChar.startNotifications();
              function onCharacteristicValueChanged(event) {
                  array = Array.from(new Uint8Array(event.target.value.buffer))
                  setTelemetry([val,array])
                  }
                  notif.addEventListener('characteristicvaluechanged', onCharacteristicValueChanged)
          } else {
    
            setStaticValues(char, val)
          }
      
        }
    }

    function parseAccelerometerData(data) {
        // Combine the bytes for each axis (16-bit values)
        const xAxis = (data[0] << 8) | data[1];  // xxxx
        const yAxis = (data[2] << 8) | data[3];  // yyyy
        const zAxis = (data[4] << 8) | data[5];  // zzzz
    
        // Last byte (ww)
        const ww = data[6];  // Last byte representing orientation and direction
    
        // Extract high 4 bits (orientation)
        const orientation = (ww >> 4) & 0xF;
    
        // Extract low 4 bits (direction)
        const direction = ww & 0xF;
    
        // Interpret direction: Positive or Negative (1 = Positive, 0 = Negative)
        const xDirection = direction & 0x1 ? "+" : "-";
        const yDirection = direction & 0x2 ? "+" : "-";
        const zDirection = direction & 0x4 ? "+" : "-";
    
        // Only interpret orientation if the 1st trigger flag is 1 (assuming based on the description)
        const orientationValid = (direction & 0x8) === 0x8 ? true : false;
    
        return {
            xAxis: xAxis,
            yAxis: yAxis,
            zAxis: zAxis,
            xDirection: xDirection,
            yDirection: yDirection,
            zDirection: zDirection,
            orientation: orientationValid ? orientation : "N/A"
        };
    }

    const updateTelemetry = (telemetry) => {
        switch(telemetry[0]) {
            case "ACCELEROMETER":
                setAccelerometer(parseAccelerometerData(telemetry[1]));
                break;
            case "ADVANCED_MOTOR_CONTROL":
                setAdvancedMotorControl(telemetry[1]);
                break;
            case "BUTTON":
                setButton(telemetry[1]);
                break;
            case "CHIP_ID":
                setChipId(telemetry[1]);
                break;
            case "HALL":
                setHall(telemetry[1]);
                break;
            case "LENGTH":
                setLength(telemetry[1]);
                break;
            case "MAC_ADDRESS":
                setMacAddress(telemetry[1]);
                break;
            case "MOTOR_CONTROL":
                setMotorControl(telemetry[1]);
                break;
            case "PRESSURE":
                setPressure(telemetry[1]);
                break;
            case "SECURITY_ACCESS":
                setSecurityAccess(telemetry[1]);
                break;
            case "SERIAL_NUMBER":
                setSerialNumber(telemetry[1]);
                break;
            case "USER_RECORD":
                setUserRecord(telemetry[1]);
                break;
            case "MOTOR_WORK_ON_TOUCH":
                setCruiseControl(telemetry[1]);
                break;
            default:
                console.warn("Unknown telemetry type:", telemetry[0]);
        }
    };

    useEffect(() => {
        setLelocharacteristic(lelo)
    }, [lelo])

    useEffect(() => {
        if(lelocharacteristic){
            setNotifications()
        }
    }, [lelocharacteristic])

    useEffect(() => {

        if(telemetry){
            updateTelemetry(telemetry)
        }

    }, [staticValues, telemetry])

    useEffect(() => {
        console.log(cruiseControl) 
        //console.log([accelerometer, advancedMotorControl, button, chipId, hall, length, macAddress, motorControl, pressure, securityAccess, serialNumber, userRecord])
    }, [accelerometer, advancedMotorControl, button, chipId, hall, length, macAddress, motorControl, pressure, securityAccess, serialNumber, userRecord, cruiseControl])

  return (
    <div>
        <div>
            <i class="fi fi-sr-smart-home-alt"></i>
            <p>{cruiseControl}</p>
        </div>
        <div>
            <p>ACCELEROMETER</p>
            <span className='tel-span'>
                <label>X Axis</label>
                <p>{`${accelerometer.xDirection} ${accelerometer.xAxis}`}</p>
            </span>
            <span className='tel-span'>
                <label>Y Axis</label>
                <p>{`${accelerometer.yDirection} ${accelerometer.yAxis}`}</p>
            </span>
            <span className='tel-span'>
                <label>Z Axis</label>
                <p>{`${accelerometer.zDirection} ${accelerometer.zAxis}`}</p>
            </span>
            {/* <span>
                <label>Orientation</label>
                <p>{`${accelerometer.orientation}`}</p>
            </span> */}
        </div>
        <div>
            <span className='tel-span'>
                <label>Main Motor Speed</label>
                <p>{hall[0]}</p>
            </span>
            <span className='tel-span'>
                <label>Vibe Motor Speed</label>
                <p>{hall[1]}</p>
            </span>
        </div>
        <div>
            <p>PRESSURE</p>
            <p>{pressure}</p>
        </div>
        <div>
            <p>LENGTH</p>
            <p>{length}</p>
        </div>
        <div 
            className='expandable' 
            style={{height: toggleExpand ? '203px' : '10px'}}
            onClick={() => setToggleExpand(prev => prev === true ? false : true)}
        >
            <div>
                <p>MOTOR_CONTROL</p>
                <p>{motorControl}</p>
            </div>
            <div>
                <p>MAC_ADDRESS</p>
                <p>{macAddress}</p>
            </div>
            <div>
                <p>SECURITY_ACCESS</p>
                <p>{securityAccess}</p>
            </div>
            <div>
                <p>BUTTON</p>
                <p>{button}</p>
            </div>
            <div>
                <p>CHIP_ID</p>
                <p>{chipId}</p>
            </div>
            <div>
                <p>SERIAL_NUMBER</p>
                <p>{serialNumber}</p>
            </div>
            <div>
                <p>USER_RECORD</p>
                <p>{userRecord}</p>
            </div>
            <div>
                <p>ADVANCED_MOTOR_CONTROL</p>
                <p>{advancedMotorControl}</p>
            </div>
        </div>
    </div>
  )
}

export default Telemetry
