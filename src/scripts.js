const BluetoothDevice = require('web-bluetooth');

export const leloF1SdkDeviceDefinitions = {
    LELO_SERVICE: '0000fff0-0000-1000-8000-00805f9b34fb',
    DEVICE_INFORMATION_SERVICE: '0000180a-0000-1000-8000-00805f9b34fb',
    GENERIC_ACCESS_PROFILE: '00001800-0000-1000-8000-00805f9b34fb',
    GENERIC_ATTRIBUTE_PROFILE: '00001801-0000-1000-8000-00805f9b34fb',
    BATTERY_SERVICE: '0000180f-0000-1000-8000-00805f9b34fb',

    MOTOR_CONTROL: '0000fff1-0000-1000-8000-00805f9b34fb',
    KEY_STATE: '00000a0f-0000-1000-8000-00805f9b34fb',
    USER_RECORD: '00000a04-0000-1000-8000-00805f9b34fb',
    BUTTON: '00000aa4-0000-1000-8000-00805f9b34fb',
    PRESSURE: '00000a0a-0000-1000-8000-00805f9b34fb',
    ACCELEROMETER: '00000a0c-0000-1000-8000-00805f9b34fb',
    LENGTH: '00000a0b-0000-1000-8000-00805f9b34fb',
    HALL: '00000aa3-0000-1000-8000-00805f9b34fb',
    WAKE_UP: '00000aa1-0000-1000-8000-00805f9b34fb',
    MOTOR_WORK_ON_TOUCH: '00000aa4-0000-1000-8000-00805f9b34fb',
    VIBRATOR_SETTING: '00000a0d-0000-1000-8000-00805f9b34fb',

    MANUFACTURER_NAME: '00002a29-0000-1000-8000-00805f9b34fb',
    MODEL_NUMBER: '00002a24-0000-1000-8000-00805f9b34fb',
    HARDWARE_REVISION: '00002a27-0000-1000-8000-00805f9b34fb',
    FIRMWARE_REVISION: '00002a26-0000-1000-8000-00805f9b34fb',
    SOFTWARE_REVISION: '00002a28-0000-1000-8000-00805f9b34fb',

    BATTERY_LEVEL: '00002a19-0000-1000-8000-00805f9b34fb',
    CHIP_ID: '00000a07-0000-1000-8000-00805f9b34fb',
    MAC_ADDRESS: '00000a06-0000-1000-8000-00805f9b34fb',
    SERIAL_NUMBER: '00000a05-0000-1000-8000-00805f9b34fb',

    ADVANCED_MOTOR_CONTROL: '00000a1a-0000-1000-8000-00805f9b34fb',
    SECURITY_ACCESS: '00000a10-0000-1000-8000-00805f9b34fb',

    SECURITY_ACCESS_INIT_VALUE: [0, 0, 0, 0, 0, 0, 0, 0],
    SECURITY_ACCESS_CONFIRMED_VALUE: [1, 0, 0, 0, 0, 0, 0, 0],
};

export const leloF1SdkConstants = {
    DEVICE_NAME: 'F1s',
    COMPATIBLE_DEVICE_NAMES: ['F1s', 'F1S', 'F1SV2A', 'F1SV2X'],
    USED_SERVICES: [{
        name: 'Battery service',
        uuid: leloF1SdkDeviceDefinitions.BATTERY_SERVICE,
        characteristics: [{
            name: 'battery level',
            uuid: leloF1SdkDeviceDefinitions.BATTERY_LEVEL
        }]
    }, {
        name: 'DeviceInformation service',
        uuid: leloF1SdkDeviceDefinitions.DEVICE_INFORMATION_SERVICE,
        characteristics: [{
                name: 'MANUFACTURER NAME',
                uuid: leloF1SdkDeviceDefinitions.MANUFACTURER_NAME
            },
            {
                name: 'MODEL NUMBER',
                uuid: leloF1SdkDeviceDefinitions.MODEL_NUMBER
            },
            {
                name: 'HARDWARE REVISION',
                uuid: leloF1SdkDeviceDefinitions.HARDWARE_REVISION
            },
            {
                name: 'FIRMWARE REVISION',
                uuid: leloF1SdkDeviceDefinitions.FIRMWARE_REVISION
            },
            {
                name: 'SOFTWARE REVISION',
                uuid: leloF1SdkDeviceDefinitions.SOFTWARE_REVISION
            }
        ]
    }, {
        name: 'LELO service',
        uuid: leloF1SdkDeviceDefinitions.LELO_SERVICE,
        characteristics: [{
                name: 'KEY STATE',
                uuid: leloF1SdkDeviceDefinitions.KEY_STATE,
                protocol: [1]
            },
            {
                name: 'SECURITY ACCESS',
                uuid: leloF1SdkDeviceDefinitions.SECURITY_ACCESS,
                protocol: [2]
            },
            {
                name: 'MOTOR CONTROL',
                uuid: leloF1SdkDeviceDefinitions.MOTOR_CONTROL
            },
            {
                name: 'ADVANCED MOTOR CONTROL',
                uuid: leloF1SdkDeviceDefinitions.ADVANCED_MOTOR_CONTROL,
                protocol: [2]
            },
            {
                name: 'USER RECORD',
                uuid: leloF1SdkDeviceDefinitions.USER_RECORD
            },
            {
                name: 'BUTTON',
                uuid: leloF1SdkDeviceDefinitions.BUTTON
            },
            {
                name: 'PRESSURE',
                uuid: leloF1SdkDeviceDefinitions.PRESSURE
            },
            {
                name: 'ACCELEROMETER',
                uuid: leloF1SdkDeviceDefinitions.ACCELEROMETER
            },
            {
                name: 'LENGTH',
                uuid: leloF1SdkDeviceDefinitions.LENGTH
            },
            {
                name: 'HALL',
                uuid: leloF1SdkDeviceDefinitions.HALL
            },
            {
                name: 'WAKE UP',
                uuid: leloF1SdkDeviceDefinitions.WAKE_UP,
                protocol: [1]
            },
            {
                name: 'CRUISE CONTROL',
                uuid: leloF1SdkDeviceDefinitions.MOTOR_WORK_ON_TOUCH,
                protocol: [1]
            },
            {
                name: 'VIBRATOR SETTING',
                uuid: leloF1SdkDeviceDefinitions.VIBRATOR_SETTING,
                protocol: [1]
            }
        ]
    }],
    OPTIONAL_SERVICES: [
        leloF1SdkDeviceDefinitions.BATTERY_SERVICE,
        leloF1SdkDeviceDefinitions.DEVICE_INFORMATION_SERVICE,
        leloF1SdkDeviceDefinitions.LELO_SERVICE
    ],
    EVENTS: {
        CHARACTERISTIC_VALUE_CHANGED: 'characteristicvaluechanged'
    },
    TEXT_DECODER: new TextDecoder('utf-8'),
};

export const leloF1SdkConverters = {
    TO_STRING: value => leloF1SdkConstants.TEXT_DECODER.decode(value),
    TO_BOOLEAN: value => !!(value.getUint8(0)),
    TO_UINT8: value => value.getUint8(0),
    TO_UINT16: value => value.getUint16(0),
    TO_DEPTH_PERCENTAGE: value => value.getUint16(0) * 12.5,
    TO_BUTTONS: value => {
        const v = value.getUint8(0);
        return {
            any: v !== 3,
            minus: v === 2,
            plus: v === 1,
            central: v === 0,
            none: v === 3,
            value: v
        };
    },
    TO_ACCELEROMETER: value => [value.getUint16(0), value.getUint16(2), value.getUint16(4)],
    TO_TEMPERATURE_AND_PRESSURE: value => [
            (value.getUint16(1) + (value.getUint8(0) * 256 * 256)) / 100.0,
            (value.getUint32(4) / 100.0)
        ],
    TO_TEMPERATURE: value  => (value.getUint16(1) + (value.getUint8(0) * 256 * 256)) / 100.0,
    TO_PRESSURE: value => (value.getUint32(4) / 100.0),
    TO_SECURITY_ACCESS: value => [
            value.getUint8(0), value.getUint8(1), value.getUint8(2), value.getUint8(3),
            value.getUint8(4), value.getUint8(5), value.getUint8(6), value.getUint8(7),
        ],
    TO_SECURITY_ACCESS_CONFIRMATION: value => ([
            value.getUint8(0), value.getUint8(1), value.getUint8(2), value.getUint8(3),
            value.getUint8(4), value.getUint8(5), value.getUint8(6), value.getUint8(7),
        ].toString() === leloF1SdkDeviceDefinitions.SECURITY_ACCESS_CONFIRMED_VALUE.toString()),
}

