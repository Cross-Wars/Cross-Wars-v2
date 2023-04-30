import React, { useState, createContext } from 'react';

// Create Context Object
export const TimerContext = createContext();

// Create a provider for components to consume and subscribe to changes
export const TimerContextProvider = (props) => {
  const [time, setTime] = useState(600);
  return (
    <TimerContext.Provider value={[time, setTime]}>
      {props.children}
    </TimerContext.Provider>
  );
};
