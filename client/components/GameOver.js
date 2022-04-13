import React from 'react';

export default function (props) {
  const { grid } = props.data;
  const { size } = props;
  return (
    <div className="game-over">
      <svg
        style={{ width: size, height: size }}
        width="166"
        height="166"
        viewBox="0 0 166 166"
        className="game-over-puzzle"
      >
        <rect fill="black" x="0" y="0" height="166" width="166"></rect>
        {grid.map((cell, i) => {
          if (cell !== '.') {
            return (
              <g>
                <rect
                  fill="white"
                  width="10"
                  height="10"
                  x={(i % 15) * 11 + 1}
                  y={Math.floor(i / 15) * 11 + 1}
                ></rect>
                {props.showAnswers ? (
                  <text
                    x={(i % 15) * 11 + 3}
                    y={Math.floor(i / 15) * 11 + 10}
                    fontSize="9"
                  >
                    {cell}
                  </text>
                ) : (
                  ''
                )}
              </g>
            );
          }
        })}
      </svg>
    </div>
  );
}
