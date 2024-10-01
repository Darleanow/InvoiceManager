"use client";
import { useState } from "react";

export default function BrokenParametersIcon({
  size,
  color,
  hover_color,
  onClick,
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <g fill="none" stroke={hovered ? hover_color : color} strokeWidth={1.5}>
        <path
          strokeLinecap="round"
          d="M7.843 20.198C9.872 21.399 10.886 22 12 22s2.128-.6 4.157-1.802l.686-.407c2.029-1.2 3.043-1.802 3.6-2.791c.557-.99.557-2.19.557-4.594M20.815 8a3.6 3.6 0 0 0-.372-1c-.557-.99-1.571-1.59-3.6-2.792l-.686-.406C14.128 2.601 13.114 2 12 2s-2.128.6-4.157 1.802l-.686.406C5.128 5.41 4.114 6.011 3.557 7C3 7.99 3 9.19 3 11.594v.812c0 2.403 0 3.605.557 4.594c.226.402.528.74.943 1.08"
        ></path>
        <circle cx={12} cy={12} r={3}></circle>
      </g>
    </svg>
  );
}
