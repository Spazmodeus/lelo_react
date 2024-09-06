import React, {useState, useEffect} from 'react';
import { XYPlot, LineSeries, XAxis, YAxis } from 'react-vis';

const SineWaveChart = ({ dataPoints, minSpeed, maxSpeed, color }) => {
    const [xDom, setXDom] = useState([0,100])


    useEffect(() => {
        if(dataPoints.length){
            // console.log(dataPoints[0].x, dataPoints[dataPoints.length-1].x)
        }
    }, [dataPoints])
    return (
        <XYPlot height={100} width={500} xType="linear" yDomain={[0, 100]}>
            {/* <XAxis /> */}
            {/* <YAxis /> */}
            <LineSeries data={dataPoints} curve="curveMonotoneX" style={{ stroke: color, fill: 'none', strokeWidth: 3 }} />
        </XYPlot>
    );
};

export default SineWaveChart;
