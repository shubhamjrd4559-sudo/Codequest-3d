"use client";

import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

export interface NumberTile { id: number; value: number }

const bookColors = ["#f97316", "#06b6d4", "#8b5cf6", "#22c55e", "#ef4444"];
const potionColors = ["#fb7185", "#22d3ee", "#a78bfa", "#34d399", "#facc15"];
const rocketColors = ["#fb7185", "#38bdf8", "#facc15", "#a78bfa", "#34d399"];
const gemColors = ["#22d3ee", "#a78bfa", "#f472b6", "#facc15", "#60a5fa"];

function Shelf() {
  return <group>
    <mesh position={[0, -0.05, 0]} receiveShadow><boxGeometry args={[8, 0.3, 2]} /><meshStandardMaterial color="#713f12" roughness={0.62} /></mesh>
    <mesh position={[0, -0.23, 0]}><boxGeometry args={[8.2, 0.12, 2.2]} /><meshStandardMaterial color="#422006" roughness={0.5} /></mesh>
    {[-3.4, 3.4].map((x) => <mesh key={x} position={[x, -0.48, -0.45]}><boxGeometry args={[0.22, 0.65, 0.3]} /><meshStandardMaterial color="#78350f" roughness={0.6} /></mesh>)}
  </group>;
}

function PotionTable() {
  return <group>
    <mesh position={[0, -0.16, 0]} receiveShadow><cylinderGeometry args={[3.95, 3.85, 0.35, 48]} /><meshStandardMaterial color="#312e81" metalness={0.35} roughness={0.32} /></mesh>
    <mesh position={[0, 0.035, 0]}><cylinderGeometry args={[3.82, 3.82, 0.08, 48]} /><meshStandardMaterial color="#6d28d9" emissive="#7c3aed" emissiveIntensity={0.4} metalness={0.35} roughness={0.3} /></mesh>
    {[[-3.1, -0.3], [3.1, -0.3], [0, -0.85]].map(([x, z]) => <mesh key={`${x}-${z}`} position={[x, 0.04, z]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.55, 0.035, 8, 32]} /><meshStandardMaterial color="#c4b5fd" emissive="#a78bfa" emissiveIntensity={0.6} /></mesh>)}
  </group>;
}

function Launchpad() {
  return <group>
    <mesh position={[0, -0.15, 0]} receiveShadow><boxGeometry args={[8, 0.35, 2.2]} /><meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.34} /></mesh>
    <mesh position={[0, 0.04, 0]}><boxGeometry args={[8.1, 0.05, 2.3]} /><meshStandardMaterial color="#334155" emissive="#0ea5e9" emissiveIntensity={0.2} metalness={0.55} /></mesh>
    {[-3.35, -1.65, 0, 1.65, 3.35].map((x) => <group key={x} position={[x, 0.09, 0]}><mesh rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.43, 0.48, 32]} /><meshBasicMaterial color="#38bdf8" /></mesh><mesh position={[0, 0.01, -0.6]}><boxGeometry args={[0.8, 0.025, 0.05]} /><meshBasicMaterial color="#f97316" /></mesh></group>)}
  </group>;
}

function VaultFloor() {
  return <group>
    <mesh position={[0, -0.15, 0]} receiveShadow><cylinderGeometry args={[4.1, 4.1, 0.35, 48]} /><meshStandardMaterial color="#0f172a" metalness={0.75} roughness={0.26} /></mesh>
    <mesh position={[0, 0.04, 0]}><cylinderGeometry args={[3.95, 3.95, 0.06, 48]} /><meshBasicMaterial color="#263750" /></mesh>
    {[0, 1, 2, 3, 4].map((index) => <mesh key={index} position={[(index - 2) * 1.35, 0.08, -0.76]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.48, 0.035, 8, 32]} /><meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.4} metalness={0.85} /></mesh>)}
  </group>;
}

function SortingObject({ tile, index, count, mode, selected, compare, onSelect }: { tile: NumberTile; index: number; count: number; mode: number; selected: boolean; compare: boolean; onSelect: (id: number) => void }) {
  const group = useRef<Group>(null);
  const x = (index - (count - 1) / 2) * 1.35;
  const color = mode === 1 ? bookColors[(tile.id - 1) % bookColors.length] : mode === 2 ? potionColors[(tile.id - 1) % potionColors.length] : mode === 3 ? rocketColors[(tile.id - 1) % rocketColors.length] : gemColors[(tile.id - 1) % gemColors.length];
  const min = Math.min(...(mode === 1 ? [1, 2, 3, 4] : mode === 3 ? [18, 32, 47, 64, 85] : tilesValuesFallback(count)));
  const max = Math.max(...(mode === 1 ? [1, 2, 3, 4] : mode === 3 ? [18, 32, 47, 64, 85] : tilesValuesFallback(count)));
  const fraction = Math.max(0, Math.min(1, (tile.value - min) / Math.max(1, max - min)));
  useFrame((_, delta) => {
    if (!group.current) return;
    const ease = 1 - Math.exp(-delta * 8);
    group.current.position.x += (x - group.current.position.x) * ease;
    group.current.position.y += (((selected || compare && mode === 2) ? 0.28 : 0) - group.current.position.y) * ease;
    if (mode === 2 && compare) group.current.scale.y = 1 + Math.sin(performance.now() / 120) * 0.08;
    else group.current.scale.y += (1 - group.current.scale.y) * ease;
    if (mode === 4) group.current.rotation.y = Math.sin(performance.now() / 900 + index) * 0.06;
  });

  return <group ref={group} position={[x, 0, 0]} onClick={(event) => { event.stopPropagation(); onSelect(tile.id); }} onPointerOver={() => { document.body.style.cursor = "pointer"; }} onPointerOut={() => { document.body.style.cursor = "auto"; }}>
    {selected && <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.58, 0.68, 36]} /><meshBasicMaterial color="#fde047" /></mesh>}
    {mode === 1 && <>
      <mesh position={[0, (0.55 + fraction * 0.78) / 2, 0]} castShadow><boxGeometry args={[0.86, 0.55 + fraction * 0.78, 0.62]} /><meshStandardMaterial color={color} roughness={0.4} metalness={0.16} /></mesh>
      <mesh position={[-0.32, (0.55 + fraction * 0.78) / 2, 0.33]}><boxGeometry args={[0.16, 0.52 + fraction * 0.73, 0.08]} /><meshStandardMaterial color="#fef3c7" roughness={0.28} /></mesh>
      <Text position={[0.08, 0.32 + fraction * 0.55, 0.34]} fontSize={0.27} color="#fff7ed" outlineWidth={0.018} outlineColor="#431407">{String(tile.value)}</Text>
      <Text position={[0, -0.02, 0.7]} fontSize={0.12} color="#fde68a">BOOK {tile.id}</Text>
    </>}
    {mode === 2 && <>
      <mesh position={[0, 0.42, 0]} castShadow><sphereGeometry args={[0.4, 24, 20]} /><meshPhysicalMaterial color="#e0e7ff" transparent opacity={0.24} roughness={0.08} metalness={0.15} /></mesh>
      <mesh position={[0, 0.36, 0]}><sphereGeometry args={[0.31, 22, 18]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={compare ? 1.1 : 0.55} transparent opacity={0.94} roughness={0.24} /></mesh>
      <mesh position={[0, 0.86, 0]}><cylinderGeometry args={[0.14, 0.2, 0.28, 16]} /><meshPhysicalMaterial color="#c4b5fd" transparent opacity={0.38} roughness={0.12} /></mesh>
      <mesh position={[0, 1.03, 0]}><cylinderGeometry args={[0.17, 0.17, 0.1, 12]} /><meshStandardMaterial color="#92400e" roughness={0.7} /></mesh>
      <mesh position={[0.12, 0.3, 0.22]}><sphereGeometry args={[0.045, 10, 10]} /><meshBasicMaterial color="#ffffff" /></mesh>
      <Text position={[0, 0.35, 0.38]} fontSize={0.22} color="#ffffff" outlineWidth={0.018} outlineColor="#1e1b4b">{String(tile.value)}</Text>
      {compare && <mesh position={[0, 1.25 + Math.sin(performance.now() / 200) * 0.05, 0]}><sphereGeometry args={[0.07, 10, 10]} /><meshBasicMaterial color="#c4b5fd" /></mesh>}
    </>}
    {mode === 3 && <>
      <mesh position={[0, 0.56, 0]} castShadow><cylinderGeometry args={[0.23, 0.28, 0.94, 18]} /><meshStandardMaterial color="#e2e8f0" metalness={0.68} roughness={0.23} /></mesh>
      <mesh position={[0, 1.12, 0]}><coneGeometry args={[0.23, 0.34, 18]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.45} metalness={0.3} /></mesh>
      {[0, 1, 2].map((fin) => <mesh key={fin} position={[0, 0.18, 0]} rotation={[0, (fin * Math.PI * 2) / 3, 0]}><coneGeometry args={[0.2, 0.38, 3]} /><meshStandardMaterial color={color} metalness={0.45} /></mesh>)}
      <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.12, 0.18, 0.28, 16]} /><meshBasicMaterial color="#fb923c" /></mesh>
      <Text position={[0, 0.53, 0.3]} fontSize={0.18} color="#0f172a" outlineWidth={0.018} outlineColor="#f8fafc">{`${tile.value}%`}</Text>
      <Text position={[0, -0.03, 0.66]} fontSize={0.11} color="#bae6fd">FUEL</Text>
    </>}
    {mode === 4 && <>
      <mesh position={[0, 0.52, 0]} rotation={[0.15, Math.PI / 4, 0]} castShadow><octahedronGeometry args={[0.55, 0]} /><meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={selected ? 1.25 : compare ? 0.9 : 0.58} metalness={0.32} roughness={0.12} transmission={0.15} clearcoat={1} /></mesh>
      <mesh position={[0, 0.52, 0]}><octahedronGeometry args={[0.2, 0]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.46} /></mesh>
      <Text position={[0, 1.2, 0.72]} fontSize={0.18} color="#fef3c7" outlineWidth={0.018} outlineColor="#020617">{`${tile.value} kg`}</Text>
      {compare && <pointLight position={[0, 0.7, 0.8]} intensity={4} distance={2} color={color} />}
    </>}
  </group>;
}

function tilesValuesFallback(count: number) { return Array.from({ length: count }, (_, index) => index + 1); }

export default function NumberSortingScene({ tiles, mode = 1, selectedId, compareIndices = [], onSelect }: { tiles: NumberTile[]; mode?: number; selectedId: number | null; compareIndices?: number[]; onSelect: (id: number) => void }) {
  const lighting = ["#fbbf24", "#c084fc", "#38bdf8", "#22d3ee"][mode - 1];
  return <group>
    <ambientLight intensity={0.62} />
    <pointLight position={[0, 5, 3]} intensity={mode === 4 ? 32 : 26} color={lighting} distance={12} />
    <pointLight position={[0, 2, -3]} intensity={18} color={mode === 1 ? "#fb923c" : mode === 2 ? "#a855f7" : mode === 3 ? "#0ea5e9" : "#f472b6"} distance={10} />
    {mode === 1 ? <Shelf /> : mode === 2 ? <PotionTable /> : mode === 3 ? <Launchpad /> : <VaultFloor />}
    {tiles.map((tile, index) => <SortingObject key={tile.id} tile={tile} index={index} count={tiles.length} mode={mode} selected={tile.id === selectedId} compare={compareIndices.includes(index)} onSelect={onSelect} />)}
    <Text position={[0, 2.2, 0]} fontSize={0.22} color={mode === 1 ? "#fde68a" : mode === 2 ? "#ddd6fe" : mode === 3 ? "#bae6fd" : "#fbcfe8"} anchorX="center" anchorY="middle" outlineWidth={0.025} outlineColor="#020617">
      {mode === 1 ? "LIBRARY · SHORTEST → TALLEST" : mode === 2 ? "ALCHEMY LAB · BUBBLE SORT" : mode === 3 ? "ROCKET RANGE · FUEL LEVEL" : "VAULT · SMALLEST WEIGHT FIRST"}
    </Text>
  </group>;
}
