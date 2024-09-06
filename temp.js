import React, { useState, useEffect } from 'react';

const Connect = ({ leloF1SdkDeviceDefinitions, leloF1SdkConstants, setConnected }) => {
    const [lelo, setLelo] = useState(null);
    const [button, setButton] = useState(null);
    const [server, setServer] = useState(null);
    const [leloService, setLeloService] = useState(null);
    const [batteryService, setBatteryService] = useState(null);
    const [informationService, setInformationService] = useState(null);
    const [leloChar, setLeloChar] = useState(null);
    const [battChar, setBattChar] = useState(null);
    const [infoChar, setInfoChar] = useState(null);
    const [secKey, setSecKey] = useState();
    const [ready, setReady] = useState(false);
    const [securityChar, setSecurityChar] = useState();
    const [securityValue, setSecurityValue] = useState();
    const [bytes, setBytes] = useState();
    const [hexString, setHexString] = useState();

    // Initiating the connection process
    useEffect(() => {
        const connectDevice = async () => {
            try {
                console.log('Requesting Bluetooth Device...');
                const device = await navigator.bluetooth.requestDevice({
                    filters: leloF1SdkConstants.COMPATIBLE_DEVICE_NAMES.map(name => ({ name })),
                    optionalServices: [leloF1SdkDeviceDefinitions.LELO_SERVICE, ...leloF1SdkConstants.OPTIONAL_SERVICES],
                });

                console.log('Connecting to GATT Server...');
                const gattServer = await device.gatt.connect();
                setServer(gattServer); // Set the server after connection
                setReady(true);
            } catch (error) {
                console.error('Error connecting to Bluetooth device:', error);
            }
        };

        connectDevice();
    }, []);

    // Get LELO Service
    useEffect(() => {
        if (server && ready) {
            const getLeloService = async () => {
                try {
                    console.log('Getting LELO Service...');
                    const service = await server.getPrimaryService(leloF1SdkDeviceDefinitions.LELO_SERVICE);
                    setLeloService(service);
                } catch (error) {
                    console.error('Error getting LELO service:', error);
                }
            };

            getLeloService();
        }
    }, [server, ready]);

    // Get Battery Service after LELO Service
    useEffect(() => {
        if (leloService && ready) {
            const getBatteryService = async () => {
                try {
                    console.log('Getting Battery Service...');
                    const service = await server.getPrimaryService(leloF1SdkDeviceDefinitions.BATTERY_SERVICE);
                    setBatteryService(service);
                } catch (error) {
                    console.error('Error getting Battery service:', error);
                }
            };

            getBatteryService();
        }
    }, [leloService, ready]);

    // Get Information Service after Battery Service
    useEffect(() => {
        if (batteryService && ready) {
            const getInformationService = async () => {
                try {
                    console.log('Getting Information Service...');
                    const service = await server.getPrimaryService(leloF1SdkDeviceDefinitions.DEVICE_INFORMATION_SERVICE);
                    setInformationService(service);
                } catch (error) {
                    console.error('Error getting Information service:', error);
                }
            };

            getInformationService();
        }
    }, [batteryService, ready]);

    // Set LELO object with all services after Information Service is obtained
    useEffect(() => {
        if (informationService && ready) {
            const initializeLelo = () => {
                console.log('Setting LELO with all services...');
                setLelo({
                    server,
                    services: {
                        lelo: leloService,
                        battery: batteryService,
                        information: informationService,
                    },
                    characteristics: {},
                });
            };

            initializeLelo();
        }
    }, [informationService, ready]);

    // Get all characteristics after setting LELO
    useEffect(() => {
        if (lelo && ready) {
            const getAllCharacteristics = async (service, characteristicsStore) => {
                try {
                    const characteristics = await service.getCharacteristics();
                    characteristics.forEach((char) => {
                        characteristicsStore[char.uuid] = char;
                    });
                } catch (error) {
                    console.error('Error getting all characteristics:', error);
                }
            };

            const fetchAllCharacteristics = async () => {
                try {
                    console.log('Getting LELO Characteristics...');
                    await getAllCharacteristics(lelo.services.lelo, lelo.characteristics);
                    setLeloChar(lelo.characteristics);

                    console.log('Getting Battery Characteristics...');
                    await getAllCharacteristics(lelo.services.battery, lelo.characteristics);
                    setBattChar(lelo.characteristics);

                    console.log('Getting Information Characteristics...');
                    await getAllCharacteristics(lelo.services.information, lelo.characteristics);
                    setInfoChar(lelo.characteristics);
                } catch (error) {
                    console.error('Error fetching characteristics:', error);
                }
            };

            fetchAllCharacteristics();
        }
    }, [lelo, ready]);

    // Setup security characteristic after fetching characteristics
    useEffect(() => {
        if (lelo && leloChar && battChar && infoChar) {
            const setSecurityCharAndStart = async () => {
                try {
                    console.log('Getting Security Characteristic...');
                    const securityChar = lelo.characteristics['00000a10-0000-1000-8000-00805f9b34fb'];
                    setSecurityChar(securityChar);

                    console.log('Reading Security Value...');
                    const value = await securityChar.readValue();
                    setSecurityValue(value);

                    console.log('Setting Security Key...');
                    const bytes = new Uint8Array(value.buffer);
                    const hexString = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
                    setHexString(hexString);
                    setSecKey(hexString);

                    if (hexString === '0100000000000000') {
                        console.log('Security check passed!');
                        setConnected(true);
                    } else {
                        console.log('Security check failed, retrying...');
                    }
                } catch (error) {
                    console.error('Error handling security:', error);
                }
            };

            setSecurityCharAndStart();
        }
    }, [leloChar, battChar, infoChar, lelo]);

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
            <ellipse onClick={() => connectDevice()} id="topButton" cx="50" cy="9" rx="17" ry="4" style={{fill: '#666666'}} filter="url(#whiteShadow)" />
            

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
