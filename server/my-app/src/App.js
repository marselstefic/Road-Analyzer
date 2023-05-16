import React from 'react';

function App() {
  const handleButtonClick = () => {
    alert('Button pressed!');
  };

  return (
    <div>
      <button onClick={handleButtonClick}>PRESS ME</button>
    </div>
  );
}

export default App;