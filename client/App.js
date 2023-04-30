import React from 'react';

import Navbar from './components/Navbar';
import Routes from './Routes';
import { TimerContextProvider } from '../context/TimerContext';

const App = () => {
  return (
    <div>
      <Navbar />
      <TimerContextProvider>
        <Routes />
      </TimerContextProvider>
    </div>
  );
};

export default App;
