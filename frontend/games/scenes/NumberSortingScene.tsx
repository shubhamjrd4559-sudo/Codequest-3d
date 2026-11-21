"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";

export interface NumberTile { id: number; value: number }

function NumberBlock({ tile, index, selected, compare, onSelect }: { tile: NumberTile; index: number; selected: boolean; compare: boolean; onSelect: (id: number) => void }) {
  const ref = useRef<Mesh>(null);
  const goalX = (index - 2) * 1.35;
  useFrame((_, delta) => {
    if (!ref.current) return;
    const ease = 1 - Math.exp(-delta * 8);
    ref.current.position.x += (goalX - ref.current.position.x) * ease;
    ref.current.position.y += ((selected ? 0.72 : 0.32) - ref.current.position.y) * ease;
    ref.current.rotation.y += delta * (selected ? 0.65 : 0.12);
  });
  const color = selected ? "#facc15" : compare ? "#fb7185" : "#22d3ee";
  return <group>
    <mesh ref={ref} onClick={(event) => { event.stopPropagation(); onSelect(tile.id); }} castShadow>
      <boxGeometry args={[1.05, 0.72, 1.05]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={selected ? 0.6 : 0.22} metalness={0.2} roughness={0.3} />
    </mesh>
    {selected && <mesh position={[goalX, 0.32, 0]}>
      <boxGeometry args={[1.18, 0.84, 1.18]} /><meshBasicMaterial color="#fde047" wireframe />
    </mesh>}
    <Html position={[goalX, 0.34, 0]} center distanceFactor={8}>
      <div className="pointer-events-none grid h-10 w-10 place-items-center text-xl font-black text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">{tile.value}</div>
    </Html>
  </group>;
}

export default function NumberSortingScene({ tiles, selectedId, compareIndices = [], onSelect }: { tiles: NumberTile[]; selectedId: number | null; compareIndices?: number[]; onSelect: (id: number) => void }) {
  return <group>
    <ambientLight intensity={0.65} />
    <pointLight position={[0, 4, 2]} intensity={26} color="#22d3ee" distance={11} />
    <pointLight position={[0, 2, -3]} intensity={14} color="#8b5cf6" distance={9} />
    <mesh position={[0, -0.14, 0]} receiveShadow><boxGeometry args={[7.5, 0.35, 2.2]} /><meshStandardMaterial color="#172554" metalness={0.32} roughness={0.38} emissive="#1d4ed8" emissiveIntensity={0.12} /></mesh>
    <mesh position={[0, -0.32, 0]}><boxGeometry args={[8, 0.12, 2.6]} /><meshStandardMaterial color="#0891b2" emissive="#06b6d4" emissiveIntensity={0.45} /></mesh>
    {tiles.map((tile, index) => <NumberBlock key={tile.id} tile={tile} index={index} selected={tile.id === selectedId} compare={compareIndices.includes(index)} onSelect={onSelect} />)}
    <Html position={[0, 1.75, 0]} center><span className="rounded-full border border-cyan-200/30 bg-slate-950/85 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-cyan-100">{selectedId ? "Choose an adjacent block to swap" : "Select a number block"}</span></Html>
  </group>;
}
