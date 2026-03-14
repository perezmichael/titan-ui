import svgPaths from "./svg-1v8ta0aqds";

interface TitanLogoProps {
  className?: string;
  collapsed?: boolean;
}

export function TitanLogo({ className = "h-4", collapsed = false }: TitanLogoProps) {
  return (
    <svg 
      className={className} 
      fill="none" 
      viewBox={collapsed ? "0 0 106 106" : "0 0 401 106"}
      style={{ aspectRatio: collapsed ? '1/1' : '401/106' }}
    >
      <g>
        <path d={svgPaths.p2eb22880} fill="#FF6E3C" />
        {!collapsed && (
          <g>
            <path d={svgPaths.p2c94f200} fill="black" />
            <path d={svgPaths.p1b3e9200} fill="black" />
            <path d={svgPaths.p22e4500} fill="black" />
            <path d={svgPaths.p78f7a80} fill="black" />
            <path d={svgPaths.p31e91800} fill="black" />
            <path d={svgPaths.p1c9f8ac0} fill="black" />
          </g>
        )}
      </g>
    </svg>
  );
}
