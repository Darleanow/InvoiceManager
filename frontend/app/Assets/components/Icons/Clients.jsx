"use client";

import { useState } from "react";

export default function BrokenClientsIcon({ size, color, hover_color, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1.918vw"
      height="1.918vw"
      viewBox="0 0 24 24"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <g fill="none" stroke={isHovered ? hover_color : color} strokeWidth={1.5}>
        <circle cx={12} cy={6} r={4}></circle>
        <path
          strokeLinecap="round"
          d="M19.998 18q.002-.246.002-.5c0-2.485-3.582-4.5-8-4.5s-8 2.015-8 4.5S4 22 12 22c2.231 0 3.84-.157 5-.437"
        ></path>
      </g>
    </svg>
  );
}
