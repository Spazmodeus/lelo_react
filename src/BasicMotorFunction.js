import React, { useEffect, useState } from 'react';

const BasicMotorFunction = ({ motor, lelo }) => {
  const [mainSpeed, setMainSpeed] = useState(0);
  const [vibeSpeed, setVibeSpeed] = useState(0);
  const [operationInProgress, setOperationInProgress] = useState(false); // GATT operation flag

  const setMotorSpeed = async (main, vibe) => {
    if (!main) main = 0;
    if (!vibe) vibe = 0;

    // Prevent overlapping GATT operations
    if (operationInProgress) {
      console.log('GATT operation already in progress.');
      return;
    }

    if (main < 0x65 && vibe < 0x65) {
      try {
        setOperationInProgress(true); // Lock GATT operations
        const data = new Uint8Array([0x01, main, vibe]);
        const characteristic = await lelo.find(
          (char) => char.uuid === '0000fff1-0000-1000-8000-00805f9b34fb'
        );
        await characteristic.writeValue(data); // Ensure you wait for the operation to complete
      } catch (error) {
        console.log(error);
      } finally {
        setOperationInProgress(false); // Unlock GATT operations when done
      }
    }
    setMainSpeed(main);
    setVibeSpeed(vibe);
  };

  return (
    <div>
      <label>Main Motor</label>
      <input
        type="range" min="0" max="100" step="1" 
        value={mainSpeed}
        onChange={(e) => setMotorSpeed(Number(e.target.value), vibeSpeed)}
      />
      <label>Vibe Motor</label>
      <input
        type="range" min="0" max="100" step="1" 
        value={vibeSpeed}
        onChange={(e) => setMotorSpeed(mainSpeed, Number(e.target.value))}
      />
    </div>
  );
};

export default BasicMotorFunction;
