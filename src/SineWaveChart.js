import React, {useState, useEffect} from 'react';
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis } from 'victory';

const SineWaveChart = ({ dataPoints, minSpeed, maxSpeed, color }) => {
    return (
        <div className='chart-wrapper'>
            <VictoryChart
                domain={{x: [dataPoints.length ? dataPoints[0].x : 0, dataPoints.length ? dataPoints[dataPoints.length - 1].x : 100], y: [0, 100]}}
                height={200}
                
            >
                                <VictoryAxis tickFormat={() => ''} />
                                <VictoryAxis dependentAxis tickFormat={() => ''} />
                <VictoryLine
                    interpolation={'monotoneX'}
                    data={dataPoints} // The data to plot
                    style={{
                        labels: {opacity: 0},
                        data: { stroke: "#c43a31" } // Customize line color
                    }}
                />
            </VictoryChart>
        </div>
    );
};

export default SineWaveChart;
