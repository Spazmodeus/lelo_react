import React, { useRef, useEffect, useState } from 'react';

const BatteryMonitor = ({level}) => {
    const svgRef = useRef();
    const [redLvl, setRedLvl] = useState(0);
    const [yellowLvl, setYellowLvl] = useState(0);
    const [greenLvl, setGreenLvl] = useState(0);
    // const [level, setLevel] = useState(76);

    useEffect(() => {
        let red = 0, yellow = 0, green = 0;
        console.log((level / 100) * 50)
        if (level <= 50) {
            red = (level / 100) * 50; // Scale red percentage based on level
            yellow = 100 - (red / 2) * 0.33; // Yellow fully kicks in after red
            green = 100 - (red / 2) * 0.66; // Green remains fully unfilled
        } else if (level > 50 && level <= 75) {
            red = 0; // Red is 0 after 50%
            yellow = ((level - 50) / 25) * 100; // Scale yellow for the range between 50 and 75
            green = 100; // Green remains unfilled until > 75%
        } else {
            red = 0;
            yellow = 0; // Yellow goes away after 75%
            green = ((level - 75) / 25) * 100; // Scale green after 75%
        }

        setRedLvl(red);
        setYellowLvl(yellow);
        setGreenLvl(green);
    }, [level]);

    return (
        <div>
            <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30">
                <defs>
                    <linearGradient id="myGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="red" />
                        <stop offset={`${redLvl}%`} stopColor="red" />
                        {/* <stop offset={`${redLvl}%`} stopColor="yellow" /> */}
                        <stop offset={`${yellowLvl}%`} stopColor="yellow" />
                        <stop offset={`${yellowLvl}%`} stopColor="green" />
                        <stop offset={`${greenLvl}%`} stopColor="green" />
                    </linearGradient>
                </defs>
                <path
                    fill="url(#myGradient)"
                    d="M5,8h12c.552,0,1,.448,1,1v6c0,.552-.448,1-1,1H5c-.552,0-1-.448-1-1v-6c0-.552,.448-1,1-1Zm19,1v6c0,.552-.448,1-1,1h-1.101c-.465,2.279-2.485,4-4.899,4H5c-2.757,0-5-2.243-5-5v-6c0-2.757,2.243-5,5-5h12c2.414,0,4.435,1.721,4.899,4h1.101c.552,0,1,.448,1,1Zm-4,0c0-1.657-1.343-3-3-3H5c-1.657,0-3,1.343-3,3v6c0,1.657,1.343,3,3,3h12c1.657,0,3-1.343,3-3v-6Z"
                />
            </svg>
            <p style={{ marginTop: '-5px', fontSize: '15px' }}>{level}</p>
        </div>
    );
};

export default BatteryMonitor;
