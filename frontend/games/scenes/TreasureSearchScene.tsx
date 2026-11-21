"use client";

import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

export interface TreasureChest {
  id: number;
  number?: number;
  opened: boolean;
  treasure: boolean;
  hint?: "hot" | "cold" | "higher" | "lower" | null;
}

function Chest({ chest, index, mode, columns, rows, onOpen }: { chest: TreasureChest; index: number; mode: number; columns: number; rows: number; onOpen: (id: number) => void }) {
  const group = useRef<Group>(null);
  const lid = useRef<Group>(null);
  const row = Math.floor(index / columns);
  const column = index % columns;
  const x = (column - (columns - 1) / 2) * 1.32;
  const z = (row - (rows - 1) / 2) * 1.2;
  const fogged = mode === 4 && !chest.opened;
  const chestColor = mode === 2 ? "#7c3aed" : mode === 3 ? "#b45309" : mode === 4 ? (chest.opened ? "#334155" : "#111827") : "#92400e";
  const trimColor = mode === 2 ? "#c4b5fd" : mode === 3 ? "#fbbf24" : mode === 4 ? "#22d3ee" : "#facc15";
  useFrame((_, delta) => {
    if (group.current) {
      const targetY = chest.opened && chest.treasure ? 0.2 : 0;
      group.current.position.y += (targetY - group.current.position.y) * (1 - Math.exp(-delta * 7));
    }
    if (lid.current) {
      const target = chest.opened ? -1.25 : 0;
      lid.current.rotation.x += (target - lid.current.rotation.x) * (1 - Math.exp(-delta * 8));
    }
  });

  return <group ref={group} position={[x, 0, z]} onClick={(event) => { event.stopPropagation(); onOpen(chest.id); }} onPointerOver={() => { document.body.style.cursor = chest.opened ? "default" : "pointer"; }} onPointerOut={() => { document.body.style.cursor = "auto"; }}>
    {!fogged && chest.number !== undefined && <Text position={[0, 1.22, 0]} fontSize={0.22} color="#f8fafc" outlineWidth={0.025} outlineColor="#020617">{String(chest.number)}</Text>}
    {chest.opened && chest.treasure ? <>
      <pointLight position={[0, 0.95, 0]} intensity={2.8} distance={2.7} color="#facc15" />
      <mesh position={[0, 0.98, 0]} rotation={[0.2, Math.PI / 4, 0]}><octahedronGeometry args={[0.38, 0]} /><meshStandardMaterial color="#fde047" emissive="#f59e0b" emissiveIntensity={1.4} metalness={0.35} roughness={0.12} /></mesh>
      <Text position={[0, 1.53, 0]} fontSize={0.16} color="#fef08a" outlineWidth={0.025} outlineColor="#422006">TREASURE!</Text>
    </> : chest.opened ? <>
      <mesh position={[0, 0.57, 0.04]}><sphereGeometry args={[0.15, 14, 12]} /><meshStandardMaterial color={mode === 4 ? "#67e8f9" : "#cbd5e1"} emissive={mode === 4 ? "#0891b2" : "#64748b"} emissiveIntensity={0.5} /></mesh>
      {mode === 4 && chest.hint && <Text position={[0, 1.16, 0]} fontSize={0.19} color={chest.hint === "hot" ? "#fb7185" : "#7dd3fc"} outlineWidth={0.025} outlineColor="#020617">{chest.hint.toUpperCase()}</Text>}
      {mode === 2 && chest.hint && <Text position={[0, 1.16, 0]} fontSize={0.15} color="#ddd6fe" outlineWidth={0.025} outlineColor="#020617">{chest.hint.toUpperCase()}</Text>}
    </> : null}
    <mesh position={[0, 0.29, 0]} castShadow receiveShadow><boxGeometry args={[0.82, 0.52, 0.72]} /><meshStandardMaterial color={chestColor} emissive={fogged ? "#020617" : mode === 2 ? "#4c1d95" : "#000000"} emissiveIntensity={0.25} metalness={0.2} roughness={0.42} /></mesh>
    <mesh position={[0, 0.3, 0.38]}><boxGeometry args={[0.74, 0.1, 0.035]} /><meshStandardMaterial color={fogged ? "#334155" : trimColor} metalness={0.65} roughness={0.24} /></mesh>
    <mesh position={[0, 0.3, 0.415]}><boxGeometry args={[0.11, 0.18, 0.045]} /><meshStandardMaterial color={fogged ? "#475569" : trimColor} metalness={0.75} roughness={0.2} /></mesh>
    <group ref={lid} position={[0, 0.54, -0.3]}>
      <mesh position={[0, 0, 0.3]} castShadow><boxGeometry args={[0.86, 0.16, 0.78]} /><meshStandardMaterial color={chestColor} emissive={fogged ? "#020617" : "#000000"} metalness={0.2} roughness={0.38} /></mesh>
      <mesh position={[0, -0.06, 0.3]}><boxGeometry args={[0.76, 0.035, 0.05]} /><meshStandardMaterial color={fogged ? "#334155" : trimColor} metalness={0.75} roughness={0.2} /></mesh>
    </group>
    {[[-0.29, -0.2], [0.29, -0.2], [-0.29, 0.2], [0.29, 0.2]].map(([px, pz]) => <mesh key={`${px}-${pz}`} position={[px, 0.04, pz]}><boxGeometry args={[0.13, 0.12, 0.13]} /><meshStandardMaterial color={fogged ? "#1e293b" : "#78350f"} /></mesh>)}
    {mode === 4 && !chest.opened && <mesh position={[0, 0.38, 0.43]}><boxGeometry args={[0.05, 0.05, 0.025]} /><meshBasicMaterial color="#0f172a" /></mesh>}
  </group>;
}

export default function TreasureSearchScene({ chests, mode, onOpen }: { chests: TreasureChest[]; mode: number; onOpen: (id: number) => void }) {
  const columns = mode === 1 ? 3 : mode === 2 ? 5 : 5;
  const rows = Math.ceil(chests.length / columns);
  const width = columns * 1.32 + 0.6;
  const depth = rows * 1.2 + 0.55;
  const accent = mode === 1 ? "#f59e0b" : mode === 2 ? "#a78bfa" : mode === 3 ? "#fb923c" : "#22d3ee";
  const platformColor = mode === 1 ? "#78350f" : mode === 2 ? "#5b21b6" : mode === 3 ? "#9a3412" : "#0f172a";
  return <group>
    <ambientLight intensity={mode === 4 ? 0.38 : 0.64} />
    <pointLight position={[0, 5, 3]} intensity={mode === 4 ? 12 : 25} color={accent} distance={14} />
    <pointLight position={[0, 2, -4]} intensity={mode === 2 ? 20 : 12} color={mode === 4 ? "#1d4ed8" : "#7c3aed"} distance={12} />
    <mesh position={[0, -0.36, 0]} receiveShadow><boxGeometry args={[width + 0.7, 0.38, depth + 0.65]} /><meshStandardMaterial color={mode === 1 ? "#451a03" : mode === 2 ? "#312e81" : mode === 3 ? "#431407" : "#020617"} metalness={mode === 4 ? 0.6 : 0.28} roughness={0.42} /></mesh>
    <mesh position={[0, -0.15, 0]}><boxGeometry args={[width + 0.58, 0.06, depth + 0.55]} /><meshStandardMaterial color={platformColor} emissive={accent} emissiveIntensity={mode === 4 ? 0.1 : 0.22} metalness={0.25} /></mesh>
    {mode === 4 && <mesh position={[0, 1.7, 0]}><boxGeometry args={[width + 0.8, 3.5, depth + 0.8]} /><meshBasicMaterial color="#020617" transparent opacity={0.13} depthWrite={false} side={2} /></mesh>}
    {chests.map((chest, index) => <Chest key={chest.id} chest={chest} index={index} mode={mode} columns={columns} rows={rows} onOpen={onOpen} />)}
  </group>;
}
