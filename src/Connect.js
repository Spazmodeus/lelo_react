import React, { useState, useEffect } from 'react';

const Connect = ({ leloF1SdkDeviceDefinitions, leloF1SdkConstants, setConnected, setBatt, setMot, setLeloChar, startConnection, setDevTel }) => {

    const [device, setDevice] = useState()
    
    const [msgArray, setMsgArray] = useState([])
    const [server, setServer] = useState()
    const [leloService, setLeloService] = useState()
    const [batteryService, setBatteryService] = useState()
    const [informationService, setInformationService] = useState()
    
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
    const [userMessage, setUserMessage] = useState('')
    const [lelocharacteristic, setLelocharacteristic] = useState()

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
        setUserMessage('starting notifications')
        let array = ["ACCELEROMETER", "ADVANCED_MOTOR_CONTROL", "BUTTON", "CHIP_ID", "HALL", "LENGTH", "MAC_ADDRESS", "MOTOR_CONTROL", "PRESSURE", "SECURITY_ACCESS", "SERIAL_NUMBER", "USER_RECORD"]
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
        setUserMessage('User authorized....Stopping motors')
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
            setUserMessage('Confirming security access...', secHexString, securityValue);
            await securitycharacteristic.writeValue(securityValue)
            setUserMessage('Security access confirmed.', secHexString);
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
            setUserMessage('cant read security value')
        }
    }

    const startNotifications = async () => {
        try{
            setUserMessage('starting button notifications')
            await buttoncharacteristic.startNotifications()
            setButtonNotifications(true)
        } catch (error) {
            setUserMessage('cant start button notifications')
        }
    }

    const updateButton = async () => {
        setUserMessage('Checking Button characteristic...');
        try {
            const buttonChar = await lelocharacteristic.find((char) => char.uuid === '00000aa4-0000-1000-8000-00805f9b34fb')
            setButtoncharacteristic(buttonChar)
            setUserMessage('Listening for button press...')
        } catch (error) {
            setUserMessage('cant find button char')
        }
    }

    const getSecurity = async () => {
        setUserMessage('Checking Security Access characteristic...');
        try{
            const securityChar = await lelocharacteristic.find((char) => char.uuid === '00000a10-0000-1000-8000-00805f9b34fb')
            await setSecuritycharacteristic(securityChar)

        } catch (error) {
            setUserMessage('cant find sec char')
        }
        setUserMessage('DONE')
    }

    const getChar = async () => {
        setUserMessage('getting lelo char')
        let leloChar = await leloService.getCharacteristics()
        await setLelocharacteristic(leloChar)
        setUserMessage('DONE')
        setUserMessage('getting batt char')
        let battChar = await batteryService.getCharacteristics()
        await setBatterycharacteristic(battChar)
        setUserMessage('DONE')
        setUserMessage('getting info char')
        let infoChar = await informationService.getCharacteristics()
        await setInformationcharacteristic(infoChar)
        setUserMessage('DONE')
    }

    const getServices = async () => {
        setUserMessage('getting lelo svc')
        const leloSvc = await server.getPrimaryService(leloF1SdkDeviceDefinitions.LELO_SERVICE);
        await setLeloService(leloSvc)
        setUserMessage('DONE')
        setUserMessage('getting batt svc')
        const battSvc = await server.getPrimaryService(leloF1SdkDeviceDefinitions.BATTERY_SERVICE);
        await setBatteryService(battSvc)
        setUserMessage('DONE')
        setUserMessage('getting info svc')
        const infSvc = await server.getPrimaryService(leloF1SdkDeviceDefinitions.DEVICE_INFORMATION_SERVICE);
        await setInformationService(infSvc)
        setUserMessage('DONE')
    }

    const connectGATT = async () => {
        setUserMessage('Connecting to GATT Server...')
        const GATT = await device.gatt.connect()
        setServer(GATT)
    }

    const reqDev = async () => {
        setUserMessage('requesting device')
        const getDevice = await navigator.bluetooth.requestDevice({
            filters: leloF1SdkConstants.COMPATIBLE_DEVICE_NAMES.map(name => ({ name })),
            optionalServices: [leloF1SdkDeviceDefinitions.LELO_SERVICE, ...leloF1SdkConstants.OPTIONAL_SERVICES]
        })

        setDevice(getDevice)
    }

    useEffect(() => {
        if(userMessage){
            console.log(userMessage)
            setMsgArray(prev => [
                ...prev,
                <p>{userMessage}</p>
            ]);
        }
    }, [userMessage])

    useEffect(() => {
        if(startConnection){reqDev()}
    }, [startConnection])

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
                setUserMessage('Button press detected, re-checking security...');
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
            setUserMessage('checking hex')
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
            setUserMessage('Motors stopped successfully');
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
            setConnected(true)
            setBatt(batteryLevel)
        }
        
    }, [batteryLevel])

    useEffect(() => {
        setDevTel(telemetry)
    }, [telemetry])

    return (
        <>
            <p className='msg-array'>{msgArray}</p>
        </>
    )
};

export default Connect;
