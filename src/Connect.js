import React, { useState, useEffect } from 'react';

const Connect = ({ leloF1SdkDeviceDefinitions, leloF1SdkConstants, setConnected, setBatt, setMot, setLeloChar }) => {

    const [startConn, setStartConn] = useState()
    const [device, setDevice] = useState()
    const [server, setServer] = useState()
    const [leloService, setLeloService] = useState()
    const [batteryService, setBatteryService] = useState()
    const [informationService, setInformationService] = useState()
    const [lelocharacteristic, setLelocharacteristic] = useState()
    const [batterycharacteristic, setBatterycharacteristic] = useState()
    const [informationcharacteristic, setInformationcharacteristic] = useState()
    const [securitycharacteristic, setSecuritycharacteristic] = useState()
    const [buttoncharacteristic, setButtoncharacteristic] = useState()
    const [buttonNotifications, setButtonNotifications] = useState(false)
    const [securityValue, setSecurityValue] = useState()
    const [bytes, setBytes] = useState()
    const [hexString, setHexString] = useState()
    const [secAuth, setSecAuth] = useState(false)
    const [motorCharateristic, setMotorCharacteristic] = useState()
    const [batteryLevelCharacteristic, setBatteryLevelCharacteristic] = useState()
    const [batteryLevel, setBatteryLevel] = useState()
    const [telemetry, setTelemetry] = useState()
    const [staticValues, setStaticValues] = useState()

    // async function getAllCharacteristics(service) {
    //     const characteristics = await service.getCharacteristics();
    //     characteristics.forEach(char => {
    //         characteristicsStore[char.uuid] = char;
    //     });
    // }

    const readBatteryLevel = async () => {
        try {
            const value = await batteryLevelCharacteristic.readValue();
            const battLevel = value.getUint8(0);
            setBatteryLevel(battLevel)
        } catch (error) {
            console.error('Error reading battery level:', error);
        }
    }

    const startReadingBatteryLevel = async () => {
        
        try {
            const battlvl = await batteryService.getCharacteristic(leloF1SdkDeviceDefinitions.BATTERY_LEVEL)
            setBatteryLevelCharacteristic(battlvl)
        } catch (error) {
            console.error('Error reading battery level:', error);
        }
    }

    const setNotifications = async () => {
        console.log('starting notifications')
        let array = ["ACCELEROMETER", "ADVANCED_MOTOR_CONTROL", "BUTTON", "CHIP_ID", "HALL", "LENGTH", "MAC_ADDRESS", "MOTOR_CONTROL", "PRESSURE", "SECURITY_ACCESS", "SERIAL_NUMBER", "USER_RECORD"]
        for (const val of array) {
            
            const char = Object.entries(leloF1SdkDeviceDefinitions).find((def) => def[0] === val)[1]
            const foundChar = lelocharacteristic.find((ch) => ch.uuid === char)
            console.log(foundChar)
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
        startReadingBatteryLevel()
    }

    const stopMotors = async () => {
        try {
            const motorControlCharacteristic = await lelocharacteristic['0000fff1-0000-1000-8000-00805f9b34fb'];
            setMotorCharacteristic(motorControlCharacteristic)
        } catch (error) {
            console.error('Error stopping motors:', error);
        }
        setNotifications()
    }

    const securityAuthorized = async () => {
        console.log('User authorized....Stopping motors')
        setSecAuth(true)
    }

    const  checkSecurityAccess = async (char, hex, val) => {
        if(hex === '0100000000000000'){
            securityAuthorized()
        } else {
            await securitycharacteristic.writeValue(val);
            await securitycharacteristic.readValue(val)
            .then(response => {
            const newBytes = new Uint8Array(response.buffer);
            const newHex = Array.from(newBytes).map(b => b.toString(16).padStart(2, '0')).join('')
            setTimeout(() => {
                checkSecurityAccess(val, newHex, val)
        }, 1000)})
    
        }
    }

    const setSecurityAccess = async () => {
        try {
            const secBytes = new Uint8Array(securityValue.buffer);
            const secHexString = Array.from(secBytes).map(b => b.toString(16).padStart(2, '0')).join('');
            console.log('Confirming security access...', secHexString, securityValue);
            await securitycharacteristic.writeValue(securityValue)
            console.log('Security access confirmed.', secHexString);
            checkSecurityAccess(securitycharacteristic, secHexString, securityValue)
        } catch (error) {
            console.error('Error writing security access:', error);
        }
    }

    const getHexString = async () => {
        const bytesTemp = await bytes
        const hex = await Array.from(bytesTemp).map(b => b.toString(16).padStart(2, '0')).join('')
        setHexString(hex)
    }

    const getBytes = async () => {
        const enc = await securityValue.buffer
        setBytes(new Uint8Array(enc))
    }

    const getSecurityValue = async () => {
        try {
            const value = await securitycharacteristic.readValue()
            setSecurityValue(value)
        } catch (error) {
            console.log('cant read security value')
        }
    }

    const startNotifications = async () => {
        try{
            console.log('starting button notifications')
            await buttoncharacteristic.startNotifications()
            setButtonNotifications(true)
        } catch (error) {
            console.log('cant start button notifications')
        }
    }

    const updateButton = async () => {
        console.log('Checking Button characteristic...');
        try {
            const buttonChar = await lelocharacteristic.find((char) => char.uuid === '00000aa4-0000-1000-8000-00805f9b34fb')
            setButtoncharacteristic(buttonChar)
            console.log('Listening for button press...')
        } catch (error) {
            console.log('cant find button char')
        }
    }

    const getSecurity = async () => {
        console.log('Checking Security Access characteristic...');
        try{
            const securityChar = await lelocharacteristic.find((char) => char.uuid === '00000a10-0000-1000-8000-00805f9b34fb')
            await setSecuritycharacteristic(securityChar)

        } catch (error) {
            console.log('cant find sec char')
        }
        console.log('DONE')
    }

    const getChar = async () => {
        console.log('getting lelo char')
        let leloChar = await leloService.getCharacteristics()
        await setLelocharacteristic(leloChar)
        console.log('DONE')
        console.log('getting batt char')
        let battChar = await batteryService.getCharacteristics()
        await setBatterycharacteristic(battChar)
        console.log('DONE')
        console.log('getting info char')
        let infoChar = await informationService.getCharacteristics()
        await setInformationcharacteristic(infoChar)
        console.log('DONE')
    }

    const getServices = async () => {
        console.log('getting lelo svc')
        const leloSvc = await server.getPrimaryService(leloF1SdkDeviceDefinitions.LELO_SERVICE);
        await setLeloService(leloSvc)
        console.log('DONE')
        console.log('getting batt svc')
        const battSvc = await server.getPrimaryService(leloF1SdkDeviceDefinitions.BATTERY_SERVICE);
        await setBatteryService(battSvc)
        console.log('DONE')
        console.log('getting info svc')
        const infSvc = await server.getPrimaryService(leloF1SdkDeviceDefinitions.DEVICE_INFORMATION_SERVICE);
        await setInformationService(infSvc)
        console.log('DONE')
    }

    const connectGATT = async () => {
        console.log('Connecting to GATT Server...')
        const GATT = await device.gatt.connect()
        setServer(GATT)
    }

    const reqDev = async () => {
        console.log('requesting device')
        const getDevice = await navigator.bluetooth.requestDevice({
            filters: leloF1SdkConstants.COMPATIBLE_DEVICE_NAMES.map(name => ({ name })),
            optionalServices: [leloF1SdkDeviceDefinitions.LELO_SERVICE, ...leloF1SdkConstants.OPTIONAL_SERVICES]
        })

        setDevice(getDevice)
    }

    useEffect(() => {
        if(startConn){reqDev()}
    }, [startConn])

    useEffect(() => {
        if(device){connectGATT()}
    }, [device])

    useEffect(() => {
        if(server){getServices()}
    }, [server])

    useEffect(() => {
        if(leloService && batteryService && informationService){getChar()}
    }, [leloService, batteryService, informationService])

    useEffect(() => {
        if(lelocharacteristic && batterycharacteristic && informationcharacteristic){
            getSecurity()
            setLeloChar(lelocharacteristic)
        }
    }, [lelocharacteristic, batterycharacteristic, informationcharacteristic])

    useEffect(() => {
        if(securitycharacteristic){updateButton()}
    }, [securitycharacteristic])

    useEffect(() => {
        if(buttoncharacteristic){startNotifications()}
    }, [buttoncharacteristic])

    useEffect(() => {
        if(buttonNotifications){
            const onButtonPressed = async () => {
                console.log('Button press detected, re-checking security...');
                buttoncharacteristic.removeEventListener('characteristicvaluechanged', onButtonPressed);
                setTimeout(() => {
                    buttoncharacteristic.addEventListener('characteristicvaluechanged', onButtonPressed);
                }, 1000);
                await getSecurityValue();
            };
            onButtonPressed()
        }
    }, [buttonNotifications])
    
    useEffect(() => {
        if(securityValue){getBytes()}
    }, [securityValue])

    useEffect(() => {
        if(bytes){getHexString()}
    }, [bytes])

    useEffect(() => {
        if(hexString){
            console.log('checking hex',hexString)
            if(hexString === '0f94793001d9f090'){
                setSecurityAccess()
            }
        }
    }, [hexString])

    useEffect(() => {
        if(secAuth){stopMotors()}
    }, [secAuth])

    useEffect(() => {
        const stop = async () => {
            const stopCommand = new Uint8Array([0x01, 0xFF, 0x00]);
            await motorCharateristic.writeValue(stopCommand);
            console.log('Motors stopped successfully');
        }
        if(motorCharateristic){
            stop()
            setMot(motorCharateristic)
        }
    }, [motorCharateristic])

    useEffect(() => {
        if(batteryLevelCharacteristic){
            readBatteryLevel();
            setInterval(readBatteryLevel, 5000);
        }
    }, [batteryLevelCharacteristic])

    useEffect(() => {
        if(batteryLevel){
            console.log(batteryLevel)
            setConnected(true)
            setBatt(batteryLevel)
        }
        
    }, [batteryLevel])

    useEffect(() => {
        // console.log(telemetry)
    }, [telemetry])

    return (
        <div className="pageOverlay">
        <div className="arrow"><p>Click here</p></div>
        <div className="cylinder">
          <svg className="display" width="100" height="200" xmlns="http://www.w3.org/2000/svg">

            <ellipse cx="50" cy="190" rx="50" ry="10" style={{fill: '#666'}} />
            <ellipse cx="50" cy="186" rx="50" ry="9" style={{fill: '#464646'}} />
            

            <rect x="0" y="10" width="100" height="45" style={{fill: 'url(#grad1)'}} />
            <rect x="36" y="35" width="30" height="12" style={{fill: '#595959;" filter="url(#redShadow)'}} />
            <rect x="0" y="55" width="100" height="90" style={{fill: 'url(#grad2)'}} />
            <rect x="0" y="145" width="100" height="45" style={{fill: 'url(#grad1)'}} />
            <rect x="36" y="160" width="30" height="12" style={{fill: '#595959'}} filter="url(#redShadow)" />
            

            <ellipse cx="50" cy="10" rx="50" ry="10" style={{fill: '#2d2626'}} />
            <ellipse cx="50" cy="13" rx="50" ry="10" style={{fill: '#2d2626'}}/>
            <ellipse id="topRing" cx="50" cy="9" rx="46" ry="9" style={{fill: '#666666'}} filter="url(#whiteShadow)" />
            <ellipse cx="50" cy="9" rx="42" ry="6" style={{fill: '#2d2626'}} />
            <ellipse onClick={() => setStartConn(true)} id="topButton" cx="50" cy="9" rx="17" ry="4" style={{fill: '#666666'}} filter="url(#whiteShadow)" />
            

            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="10%" style={{stopColor: '#666', stopOpacity: 1}} />
                <stop offset="30%" style={{stopColor: '#a4a4a4', stopOpacity: 1}} />
                <stop offset="70%" style={{stopColor: '#a4a4a4', stopOpacity: 1}} />
                <stop offset="90%" style={{stopColor: '#666', stopOpacity: 1}} />
              </linearGradient>
              <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="10%" style={{stopColor: '#232323', stopOpacity: 1}} />
                <stop offset="30%" style={{stopColor: '#a4a4a4', stopOpacity: 1}} />
                <stop offset="70%" style={{stopColor: '#a4a4a4', stopOpacity: 1}} />
                <stop offset="90%" style={{stopColor: '#232323', stopOpacity: 1}} />
              </linearGradient>
              <filter id="redShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"/>
                <feOffset in="blur" dx="0" dy="0" result="offsetBlur"/>
                <feFlood id="redShadowColor" floodColor="red" result="color"/>
                <feComposite in="color" in2="offsetBlur" operator="in" result="redShadow"/>
                <feMerge>
                  <feMergeNode in="redShadow"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <filter id="whiteShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"/>
                <feOffset in="blur" dx="0" dy="0" result="offsetBlur"/>
                <feFlood id="whiteShadowColor" floodColor="white" result="color"/>
                <feComposite in="color" in2="offsetBlur" operator="in" result="whiteShadow"/>
                <feMerge>
                  <feMergeNode in="whiteShadow"/>
                  <feMergeNode in="SourceGraphic"/> 
                </feMerge>
              </filter>
            </defs>
          </svg>
          <h6 className="status"></h6>
        </div>
        </div>
    );
};

export default Connect;
