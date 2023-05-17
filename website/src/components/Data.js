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
      if (response.data) {
        setData(response.data); // assuming the data returned is an array
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  return (
    <div>
      {data.map((item, index) => (
        <div key={index}>
          <p>GyroX: {item.gyroX}</p>
          <p>GyroY: {item.gyroY}</p>
          <p>GyroZ: {item.gyroZ}</p>
          <p>AccelerometerX: {item.accelerometerX}</p>
          <p>AccelerometerY: {item.accelerometerY}</p>
          <p>AccelerometerZ: {item.accelerometerZ}</p>
          <p>Longitude: {item.longitude}</p>
          <p>Latitude: {item.latitude}</p>
          <p>Timestamp: {item.timestamp}</p>
        </div>
      ))}
    </div>
  );
};

export default Data;
