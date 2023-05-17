import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Data = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/data');
      console.log(response.data); 
      setData([response.data]);
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <div>

      {data.map((data) => (
        <div key={data._id}>
          <p>GyroX: {data.gyroX}</p>
          <p>GyroY: {data.gyroY}</p>
          <p>GyroZ: {data.gyroZ}</p>
          <p>AccelerometerX: {data.accelerometerX}</p>
          <p>AccelerometerY: {data.accelerometerY}</p>
          <p>AccelerometerZ: {data.accelerometerZ}</p>
          <p>Longitude: {data.longitude}</p>
          <p>Latitude: {data.latitude}</p>
          <p>Timestamp: {data.timestamp}</p>
        </div>
      ))}
    </div>
  );
};

export default Data;
