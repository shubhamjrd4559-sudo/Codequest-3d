import type { ReactNode } from 'react';

type Artwork = 'chart' | 'math' | 'bits' | 'recursion' | 'array' | 'dots' | 'list' | 'stack' | 'queue' | 'hash' | 'tree' | 'heap' | 'graph' | 'trie' | 'sets' | 'segment' | 'search' | 'sort' | 'pointers' | 'window' | 'prefix' | 'greedy' | 'backtrack' | 'divide' | 'traversal' | 'dp';

const ARTWORK_BY_SLUG: Record<string, Artwork> = {
  'time-and-space-complexity': 'chart',
  'basic-mathematics-number-theory': 'math',
  'bit-manipulation': 'bits',
  recursion: 'recursion',
  arrays: 'array',
  strings: 'dots',
  'linked-lists': 'list',
  stacks: 'stack',
  'queues-deques': 'queue',
  hashing: 'hash',
  trees: 'tree',
  'heaps-priority-queues': 'heap',
  graphs: 'graph',
  tries: 'trie',
  'disjoint-set-union': 'sets',
  'segment-trees': 'segment',
  'searching-algorithms': 'search',
  'sorting-algorithms': 'sort',
  'two-pointers': 'pointers',
  'sliding-window': 'window',
  'prefix-sum': 'prefix',
  'greedy-algorithms': 'greedy',
  backtracking: 'backtrack',
  'divide-and-conquer': 'divide',
  'graph-algorithms-bfs-dfs': 'traversal',
  'dynamic-programming': 'dp',
};

const line = (x1: number, y1: number, x2: number, y2: number, key: string, opacity = 0.52) => (
  <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} opacity={opacity} />
);

const node = (cx: number, cy: number, key: string, radius = 5) => (
  <circle key={key} cx={cx} cy={cy} r={radius} />
);

function ArtworkShapes({ artwork }: { artwork: Artwork }): ReactNode {
  switch (artwork) {
    case 'chart':
      return <>{line(18, 78, 145, 78, 'x')}{line(25, 80, 35, 61, 'a')}{line(35, 61, 65, 57, 'b')}{line(65, 57, 91, 34, 'c')}{line(91, 34, 135, 25, 'd')}{line(42, 78, 42, 24, 'g1', .18)}{line(82, 78, 82, 18, 'g2', .18)}{line(122, 78, 122, 13, 'g3', .18)}</>;
    case 'math':
      return <>{[28, 60, 92, 124].map((x, i) => <g key={x} opacity={i === 1 ? .72 : .42}><line x1={x - 6} y1="35" x2={x + 6} y2="35" /><line x1={x} y1="29" x2={x} y2="41" /><line x1={x - 5} y1="70" x2={x + 5} y2="70" /></g>)}{line(20, 85, 140, 85, 'base', .22)}</>;
    case 'bits':
      return <>{Array.from({ length: 24 }, (_, i) => <text key={i} x={22 + (i % 6) * 20} y={26 + Math.floor(i / 6) * 20} fontSize="9" opacity={i % 3 === 0 ? .65 : .28}>{i % 2}</text>)}</>;
    case 'recursion':
      return <>{[0, 1, 2, 3, 4].map((i) => <rect key={i} x={22 + i * 13} y={14 + i * 10} width={108 - i * 20} height={70 - i * 15} rx="2" opacity={.52 - i * .06} />)}</>;
    case 'array':
      return <>{Array.from({ length: 12 }, (_, i) => <rect key={i} x={22 + (i % 4) * 25} y={22 + Math.floor(i / 4) * 20} width="21" height="16" rx="2" opacity={i === 5 ? .85 : .42} />)}</>;
    case 'dots':
      return <>{Array.from({ length: 42 }, (_, i) => <circle key={i} cx={22 + (i % 7) * 17} cy={18 + Math.floor(i / 7) * 12} r={i % 5 === 0 ? 1.5 : 1} opacity={i % 4 === 0 ? .6 : .27} />)}</>;
    case 'list':
      return <>{[28, 66, 104, 142].map((x, i) => <g key={x}>{node(x, 48, `n${i}`, 8)}{i < 3 && <>{line(x + 9, 48, x + 27, 48, `l${i}`)}<path d={`M ${x + 25} 44 L ${x + 30} 48 L ${x + 25} 52`} opacity=".55" /></>}</g>)}</>;
    case 'stack':
      return <>{[0, 1, 2, 3].map((i) => <rect key={i} x={87} y={18 + i * 16} width="42" height="12" rx="2" opacity={.72 - i * .08} />)}{line(108, 10, 108, 4, 'top', .32)}</>;
    case 'queue':
      return <>{[0, 1, 2, 3, 4].map((i) => <rect key={i} x={22 + i * 23} y="34" width="17" height="34" rx="3" opacity={.52 + (i === 0 ? .24 : 0)} />)}{line(28, 79, 132, 79, 'flow', .38)}<path d="M 128 75 L 134 79 L 128 83" opacity=".52" /></>;
    case 'hash':
      return <>{[0, 1, 2, 3].map((i) => <g key={i}><rect x="25" y={20 + i * 16} width="14" height="10" rx="2" opacity=".46" /><line x1="48" y1={25 + i * 16} x2="79" y2={25 + i * 16} opacity=".3" /><rect x="88" y={20 + i * 16} width="45" height="10" rx="2" opacity=".56" /></g>)}</>;
    case 'tree':
    case 'heap':
    case 'trie':
    case 'greedy':
    case 'backtrack':
      return <>{line(88, 22, 58, 48, 'e1')}{line(88, 22, 118, 48, 'e2')}{line(58, 54, 40, 78, 'e3')}{line(58, 54, 76, 78, 'e4')}{line(118, 54, 100, 78, 'e5')}{line(118, 54, 136, 78, 'e6')}{[[88, 18], [58, 51], [118, 51], [40, 82], [76, 82], [100, 82], [136, 82]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5.5" opacity={i === 0 ? .82 : .5} />)}{artwork === 'backtrack' && <>{line(37, 75, 43, 81, 'x1', .9)}{line(43, 75, 37, 81, 'x2', .9)}{line(133, 75, 139, 81, 'x3', .9)}{line(139, 75, 133, 81, 'x4', .9)}</>}</>;
    case 'graph':
    case 'traversal':
      return <>{[[30, 30], [72, 20], [118, 34], [47, 68], [92, 78], [137, 69]].map(([x, y], i) => <g key={i}>{node(x, y, `n${i}`, 4)}{i > 0 && line([[30, 30], [72, 20], [118, 34], [47, 68], [92, 78], [137, 69]][(i + 1) % 6][0], [[30, 30], [72, 20], [118, 34], [47, 68], [92, 78], [137, 69]][(i + 1) % 6][1], x, y, `e${i}`, .35)}</g>)}</>;
    case 'sets':
      return <>{[0, 1].map((group) => <g key={group} opacity=".58">{[0, 1, 2, 3].map((i) => <circle key={i} cx={48 + group * 63 + (i % 2) * 15} cy={37 + Math.floor(i / 2) * 16} r="6" />)}<ellipse cx={55 + group * 63} cy="45" rx="28" ry="30" opacity=".2" /></g>)}{line(75, 45, 91, 45, 'union', .26)}</>;
    case 'segment':
      return <>{line(88, 19, 58, 43, 'a')}{line(88, 19, 118, 43, 'b')}{line(58, 50, 42, 73, 'c')}{line(58, 50, 74, 73, 'd')}{line(118, 50, 102, 73, 'e')}{line(118, 50, 134, 73, 'f')}{[76, 52, 28].map((w, i) => <rect key={i} x={88 - w / 2} y={12 + i * 28} width={w} height="12" rx="2" opacity={.58 - i * .07} />)}</>;
    case 'search':
      return <>{[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={18 + i * 19} y="48" width="16" height="16" rx="2" opacity={i === 3 ? .8 : .36} />)}<circle cx="111" cy="31" r="19" opacity=".62" /><line x1="125" y1="45" x2="143" y2="63" opacity=".75" /></>;
    case 'sort':
      return <>{[18, 32, 49, 62, 76].map((height, i) => <rect key={i} x={27 + i * 23} y={84 - height} width="15" height={height} rx="2" opacity={i === 3 ? .8 : .48} />)}</>;
    case 'pointers':
      return <>{Array.from({ length: 6 }, (_, i) => <rect key={i} x={18 + i * 21} y="50" width="19" height="25" opacity=".43" />)}{line(28, 30, 61, 30, 'l')}{line(135, 30, 102, 30, 'r')}<path d="M 61 26 L 67 30 L 61 34 M 102 26 L 96 30 L 102 34" /></>;
    case 'window':
      return <>{Array.from({ length: 7 }, (_, i) => <rect key={i} x={15 + i * 19} y="51" width="17" height="23" rx="2" opacity={i >= 2 && i <= 4 ? .75 : .32} />)}<rect x="50" y="40" width="62" height="44" rx="4" opacity=".5" />{line(104, 28, 132, 28, 'arrow', .66)}<path d="M 128 24 L 134 28 L 128 32" /></>;
    case 'prefix':
      return <>{[0, 1, 2, 3, 4].map((i) => <rect key={i} x={17 + i * 25} y="56" width="22" height="21" rx="2" opacity={i === 2 ? .78 : .38} />)}{[29, 79, 129].map((x, i) => <path key={i} d={`M ${x} 52 C ${x} ${20 - (i % 2) * 8}, ${x + 25} ${20 - (i % 2) * 8}, ${x + 25} 52`} fill="none" opacity=".56" />)}</>;
    case 'divide':
      return <>{line(89, 20, 55, 48, 'd1')}{line(89, 20, 123, 48, 'd2')}{line(55, 55, 35, 79, 'd3')}{line(55, 55, 75, 79, 'd4')}{line(123, 55, 103, 79, 'd5')}{line(123, 55, 143, 79, 'd6')}{[ [70, 13, 38], [39, 46, 31], [108, 46, 31], [21, 77, 29], [61, 77, 29], [89, 77, 29], [129, 77, 29] ].map(([x, y, w], i) => <rect key={i} x={x} y={y} width={w} height="10" rx="2" opacity=".52" />)}</>;
    case 'dp':
      return <>{Array.from({ length: 16 }, (_, i) => <rect key={i} x={30 + (i % 4) * 21} y={17 + Math.floor(i / 4) * 17} width="17" height="13" rx="1" opacity={i === 10 ? .78 : .35} />)}{[0, 1, 2].map((i) => <path key={i} d={`M ${39 + i * 21} ${35 + i * 17} l 8 7 l 8 -7`} fill="none" opacity=".75" />)}</>;
    default:
      return null;
  }
}

export function QuizCardArtwork({ slug, tint = '#67e8f9' }: { slug: string; tint?: string }) {
  const artwork = ARTWORK_BY_SLUG[slug] ?? 'array';

  return (
    <svg aria-hidden="true" viewBox="0 0 160 100" className="pointer-events-none absolute right-0 top-0 h-28 w-44 text-current opacity-50 sm:h-32 sm:w-48" style={{ color: tint }} fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
      <ArtworkShapes artwork={artwork} />
    </svg>
  );
}
