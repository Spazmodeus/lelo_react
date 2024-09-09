import React, {useEffect, useState} from 'react'
import BasicMotorFunction from './BasicMotorFunction'
import AdvancedMotorFunction from './AdvancedMotorFunction'

const Home = ({lelo, motor}) => {
  const [toggleMotor, setToggleMotor] = useState('advanced')




  return (
      <>
        <AdvancedMotorFunction lelo={lelo} motor={motor} />
      </>
  )
}

export default Home
