import * as React from "react";

function SvgList(props: React.SVGProps<SVGSVGElement>) {
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
      {/* Row 1 */}
      <circle cx={5} cy={6} r={1.5} />
      <line x1={9} y1={6} x2={20} y2={6} />
      {/* Row 2 */}
      <circle cx={5} cy={12} r={1.5} />
      <line x1={9} y1={12} x2={17} y2={12} />
      {/* Row 3 */}
      <circle cx={5} cy={18} r={1.5} />
      <line x1={9} y1={18} x2={19} y2={18} />
    </svg>
  );
}

export default SvgList;
