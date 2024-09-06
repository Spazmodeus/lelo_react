import React, { useEffect, useState } from 'react';
import SineWaveChart from './SineWaveChart';

const Visualizer = ({ mainMotorAdv, togglePlay, color}) => {
    const [currentMain, setCurrentMain] = useState(mainMotorAdv[1]); // Start at the min speed
    const [increasing, setIncreasing] = useState(true);
    const [holding, setHolding] = useState(false);
    const [dataPoints, setDataPoints] = useState([]); // Track motor speed data points
    const [time, setTime] = useState(0); // To track the x-axis over time

    const addDataPoint = (newPoint) => {
        setDataPoints((prevPoints) => {
            const updatedPoints = [...prevPoints, newPoint];
            if (updatedPoints.length > 2000) { // Keep a fixed number of points to simulate scrolling
                updatedPoints.shift(); // Remove the oldest point
            }
            return updatedPoints;
        });
    };

    useEffect(() => {
        let intervalId;

        if (togglePlay && !holding) {
            intervalId = setInterval(() => {
                setCurrentMain(prev => {
                    let newMain = prev;

                    // Ramp up logic
                    if (increasing && prev >= mainMotorAdv[0]) {
                        setHolding(true); // Start holding at max
                        const holdInterval = setInterval(() => {
                            // Continue adding the max speed but progress the time
                            setTime(prevTime => prevTime + mainMotorAdv[2] / 1000); // Increment time
                            addDataPoint({ x: time, y: mainMotorAdv[0] }); // Hold max speed
                        }, mainMotorAdv[2]); // Continue adding points during the hold time
                        
                        setTimeout(() => {
                            setHolding(false); // Stop holding after the specified hold time
                            clearInterval(holdInterval); // Clear the hold interval
                        }, mainMotorAdv[3]); // Hold for the specified time at max

                        setIncreasing(false); // After hold, reverse direction
                        return prev; // Keep motor speed at max during hold
                    } 
                    // Ramp down logic
                    else if (!increasing && prev <= mainMotorAdv[1]) {
                        setIncreasing(true);
                        newMain = prev; // Stay at min
                    } 
                    // Continue ramping up or down
                    else {
                        newMain = increasing ? prev + 1 : prev - 1;
                    }

                    // Increment time to simulate continuous flow
                    setTime(prevTime => prevTime + mainMotorAdv[2] / 1000); // Increment time by interval (in seconds)

                    // Directly add motor speed as data points
                    addDataPoint({ x: time, y: newMain }); // Add the motor speed point

                    return newMain;
                });
            }, mainMotorAdv[2]); // Control the interval speed using the ramp time
        }

        return () => clearInterval(intervalId);
    }, [togglePlay, holding, increasing, mainMotorAdv, time]);

    return (
        <div>
            {/* Pass motor speed data directly to SineWaveChart */}
            <SineWaveChart dataPoints={dataPoints} minSpeed={mainMotorAdv[1]} maxSpeed={mainMotorAdv[0]} color={color}/>

            <span className='motor-slider'>
                <h5>Motor Speed</h5>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={currentMain}
                    step="1"
                    id="motorSpeed"
                />
                <p>Current Speed: {currentMain}</p>
            </span>
        </div>
    );
};

export default Visualizer;
