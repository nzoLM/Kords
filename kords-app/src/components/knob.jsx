"use client";
import { useRef } from "react";

const MIN = 20, MAX = 280;
const SIZE = 180;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = 78;
const START_ANGLE = Math.PI * 0.75;
const END_ANGLE = Math.PI * 2.25;

function polarToCartesian(cx, cy, r, angle) {
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

export default function BpmKnob({ bpm, onChange }) {
  const dragRef = useRef({ active: false, startY: 0, startBpm: bpm });

  const norm = (b) => (b - MIN) / (MAX - MIN);
  const activeEnd = START_ANGLE + norm(bpm) * (END_ANGLE - START_ANGLE);

  const onMouseDown = (e) => {
    dragRef.current = { active: true, startY: e.clientY, startBpm: bpm };

    const onMouseMove = (e) => {
      if (!dragRef.current.active) return;
      const dy = dragRef.current.startY - e.clientY;
      const next = Math.round(dragRef.current.startBpm + dy * ((MAX - MIN) / 220));
      onChange(Math.max(MIN, Math.min(MAX, next)));
    };

    const onMouseUp = () => {
      dragRef.current.active = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <svg
      width={SIZE}
      height={SIZE}
      className="cursor-grab active:cursor-grabbing select-none"
      onMouseDown={onMouseDown}
    >
      <circle cx={CX} cy={CY} r={R - 8} fill="white" stroke="#e5e7eb" strokeWidth={1} />

      <path
        d={describeArc(CX, CY, R, START_ANGLE, END_ANGLE)}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={4}
        strokeLinecap="round"
      />

      {norm(bpm) > 0 && (
        <path
          d={describeArc(CX, CY, R, START_ANGLE, activeEnd)}
          fill="none"
          stroke="#534AB7"
          strokeWidth={4}
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
