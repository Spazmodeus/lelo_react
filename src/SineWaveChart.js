import React from 'react';
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis } from 'victory';

const SineWaveChart = ({ dataPoints, minSpeed, maxSpeed, color }) => {
    // Set a fallback color if none is provided
    const lineColor = color || "#c43a31";

    return (
        <div className='chart-wrapper'>
            <VictoryChart
                domain={{
                    x: [dataPoints.length ? dataPoints[0].x : 0, dataPoints.length ? dataPoints[dataPoints.length - 1].x : 100],
                    y: [minSpeed || 0, maxSpeed || 100]
                }}
                height={200}
                theme={VictoryTheme.material}
            >
                {/* Hide axis tick labels */}
                <VictoryAxis tickFormat={() => ''} />
                <VictoryAxis dependentAxis tickFormat={() => ''} />

                <VictoryLine
                    interpolation="monotoneX"
                    data={dataPoints} // The data to plot
                    style={{
                        labels: { opacity: 0 }, // Hide labels
                        data: { stroke: lineColor } // Customize line color dynamically
                    }}
                />
            </VictoryChart>
        </div>
    );
};

export default SineWaveChart;
