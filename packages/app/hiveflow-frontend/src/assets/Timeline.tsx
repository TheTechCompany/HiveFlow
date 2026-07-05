import * as React from "react";

function SvgTimeline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Lane 1 — long bar */}
      <line x1={3} y1={6} x2={21} y2={6} />
      {/* Lane 2 — medium bar */}
      <line x1={3} y1={12} x2={16} y2={12} />
      {/* Lane 3 — short bar */}
      <line x1={3} y1={18} x2={11} y2={18} />
    </svg>
  );
}

export default SvgTimeline;
