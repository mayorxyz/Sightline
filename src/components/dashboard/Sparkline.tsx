import React, {useMemo} from 'react';

interface SparklineProps {
  data: number[];
  id: string;
}

export const Sparkline: React.FC<SparklineProps> = React.memo(({data, id}) => {
  const {linePath, areaPath} = useMemo(() => {
    const w = 160;
    const h = 36;
    const padY = 4;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = Math.max(0.0001, max - min);

    const coords = data.map((v, i) => {
      const x = (i / Math.max(1, data.length - 1)) * w;
      const y = h - padY - ((v - min) / range) * (h - padY * 2);
      return {x, y};
    });

    const line = coords
      .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`)
      .join(' ');
    const area = `${line} L ${w} ${h} L 0 ${h} Z`;

    return {linePath: line, areaPath: area};
  }, [data]);

  const gradId = `spark-grad-${id}`;

  return (
    <svg
      viewBox="0 0 160 36"
      preserveAspectRatio="none"
      className="block w-full max-w-full h-7 sm:h-9 overflow-hidden"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D9C4A8" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#D9C4A8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path
        d={linePath}
        fill="none"
        stroke="#D9C4A8"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
});

Sparkline.displayName = 'Sparkline';