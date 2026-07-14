import * as React from "react";

function SvgKanban(props: React.SVGProps<SVGSVGElement>) {
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
      {/* Column 1 */}
      <rect x={3} y={4} width={4} height={6} rx={1} />
      <rect x={3} y={13} width={4} height={5} rx={1} />
      {/* Column 2 */}
      <rect x={10} y={5} width={4} height={5} rx={1} />
      <rect x={10} y={13} width={4} height={6} rx={1} />
      {/* Column 3 */}
      <rect x={17} y={4} width={4} height={5} rx={1} />
      <rect x={17} y={12} width={4} height={6} rx={1} />
    </svg>
  );
}

export default SvgKanban;
