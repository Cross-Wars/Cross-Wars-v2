import React from "react";

export default function Logo() {
  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <g transform="rotate(10 50 100) translate(-9 15)">
        <path
          d="M 40 11 l 1 -10 l 1 10 l 1 -15 l 1 15 l 1 -8 l 1 8 l 1 -17 l 1 17 l 1 -10 l 1 10 l 0 10 l -10 0Z"
          fill="white"
          stroke="black"
          strokeWidth="0.5"
        />
        <text x="40.8" y="19.3" fontSize={10}>
          C
        </text>
        <rect
          width="10"
          height="10"
          x="40"
          y="20"
          style={{ strokeWidth: 0.5, stroke: "black", fill: "white" }}
        ></rect>
        <text x="40.8" y="29.3" fontSize={10}>
          R
        </text>
        <rect
          width="10"
          height="10"
          x="40"
          y="30"
          style={{ strokeWidth: 0.5, stroke: "black", fill: "white" }}
        ></rect>
        <text x="40.8" y="39.3" fontSize={10}>
          O
        </text>
        <rect
          width="10"
          height="10"
          x="40"
          y="40"
          style={{ strokeWidth: 0.5, stroke: "black", fill: "white" }}
        ></rect>
        <text x="40.8" y="49.3" fontSize={10}>
          S
        </text>
        <rect
          width="10"
          height="10"
          x="40"
          y="50"
          style={{ strokeWidth: 0.5, stroke: "black", fill: "white" }}
        ></rect>
        <text x="40.8" y="59.3" fontSize={10}>
          S
        </text>
      </g>
      <g>
        <g>
          <rect
            width="10"
            height="10"
            x="20"
            y="30"
            style={{ strokeWidth: 0.5, stroke: "black", fill: "white" }}
            transform="rotate(-15 15 40)"
          ></rect>
          <text x="18.4" y="39.5" transform="rotate(-15 13.4 30)" fontSize={10}>
            W
          </text>
          <rect
            width="10"
            height="10"
            x="25"
            y="29"
            transform="rotate(20 30 50)"
            style={{ strokeWidth: 0.5, stroke: "black", fill: "white" }}
          ></rect>
          <text x="29" y="35.9" transform="rotate(20 25 39.4)" fontSize={10}>
            A
          </text>
          <rect
            width="10"
            height="10"
            x="55"
            y="31"
            transform="rotate(-15 65 40)"
            style={{ strokeWidth: 0.5, stroke: "black", fill: "white" }}
          ></rect>
          <text x="56" y="40.4" transform="rotate(-15 65 40)" fontSize={10}>
            S
          </text>
        </g>
      </g>
    </svg>
  );
}
