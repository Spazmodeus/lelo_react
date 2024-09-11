import React, { useEffect, useState } from 'react';
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis } from 'victory';

const Visualizer = ({ motors, playPause }) => {
  const [vibeData, setVibeData] = useState([]);
  const [mainData, setMainData] = useState([]);

  // Normalize time to fit within 2000 ms window
  const normalizeTime = (points, totalTime) => {
    const normalizedPoints = points.map(point => ({
      x: (point.x / totalTime) * 2000, // Scale time to 2000 ms
      y: point.y
    }));
    return normalizedPoints;
  };

  // Generate time-series data based on the motor pattern
  const generatePatternData = (motor) => {
    const { max, min, highTime, lowTime, pattern } = motor;
    const points = [];
    let currentTime = 0;

    // Depending on the pattern type, generate data
    switch (pattern) {
      case '0x02': // Simple alternating pattern
        for (let i = 0; i < 50; i++) {
          // High phase
          points.push({ x: currentTime, y: max });
          currentTime += highTime;

          // Low phase (if the duration is greater than 0)
          if (lowTime > 0) {
            points.push({ x: currentTime, y: min });
            currentTime += lowTime;
          }
        }
        break;

      case '0x03': // Example of a different pattern
        for (let i = 0; i < 50; i++) {
          // Start low, then go high
          points.push({ x: currentTime, y: min });
          currentTime += lowTime;

          points.push({ x: currentTime, y: max });
          currentTime += highTime;
        }
        break;

      default: // Default pattern (simple sine wave-like pattern)
        for (let i = 0; i < 50; i++) {
          points.push({ x: currentTime, y: min });
          currentTime += lowTime;

          points.push({ x: currentTime, y: max });
          currentTime += highTime;
        }
        break;
    }

    return { points, totalTime: currentTime }; // Return points and total time for normalization
  };

  // Update the chart data for both motors
  const displayCharts = () => {
    const { points: vibePoints, totalTime: vibeTotalTime } = generatePatternData({
      max: motors[0][0], // vibeMax
      min: motors[0][1], // vibeMin
      highTime: motors[0][2], // vibeHigh (Time at max)
      lowTime: motors[0][3], // vibeLow (Time at min)
      pattern: motors[0][4], // vibePattern
    });

    const { points: mainPoints, totalTime: mainTotalTime } = generatePatternData({
      max: motors[1][0], // mainMax
      min: motors[1][1], // mainMin
      highTime: motors[1][2], // mainHigh (Time at max)
      lowTime: motors[1][3], // mainLow (Time at min)
      pattern: motors[1][4], // mainPattern
    });

    // Normalize the time points to fit within 2000 ms
    const normalizedVibeData = normalizeTime(vibePoints, 2000);
    const normalizedMainData = normalizeTime(mainPoints, 2000);

    // Set the data separately for each chart
    setVibeData(normalizedVibeData);
    setMainData(normalizedMainData);
  };

  useEffect(() => {
    if (motors) {
      displayCharts();
    }
  }, [motors]);

  return (
    <div className='visualizer-wrapper'>
      <div className='chart-wrapper'>
        <VictoryChart height={160} width={1000} theme={VictoryTheme.material}
          domain={{
            x: [0, 2000], // Always display 2000 ms on the x-axis
            y: [0, 100]   // Motor speed range (0-100)
          }}
        >
          <VictoryAxis tickFormat={() => ''} />
          <VictoryAxis dependentAxis tickFormat={() => ''} />
          <VictoryLine
            interpolation="monotoneX"
            data={vibeData} 
            style={{
              labels: { opacity: 0 }, 
              data: { stroke: 'white', strokeWidth: '10px' },
            }}
          />
        </VictoryChart>

        {/* Chart for Main Motor */}
        <VictoryChart height={160} width={1000}  theme={VictoryTheme.material}
          domain={{
            x: [0, 2000], // Always display 2000 ms on the x-axis
            y: [0, 100]   // Motor speed range (0-100)
          }}
        >
          <VictoryAxis tickFormat={() => ''} />
          <VictoryAxis dependentAxis tickFormat={() => ''} />
          <VictoryLine
            interpolation="monotoneX"
            data={mainData} // The data to plot for main motor
            style={{
              labels: { opacity: 0 }, // Hide labels
              data: { stroke: 'white', strokeWidth: '10px' }, // Customize line color for main motor
            }}
          />
        </VictoryChart>
      </div>
    </div>
  );
};

export default Visualizer;
