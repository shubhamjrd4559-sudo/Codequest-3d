"use client";

import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { Vector3 } from "three";

export interface ListNode { id: number; value: number }
export interface ListLink { from: number; to: number }

function FloatingLabel({ children, position, color = "#e0f2fe" }: { children: string; position: [number, number, number]; color?: string }) {
  return <Text position={position} fontSize={0.2} color={color} anchorX="center" anchorY="middle" outlineWidth={0.018} outlineColor="#07111f">{children}</Text>;
}

function SphereNode({ node, index, selected, mode, onClick }: { node: ListNode; index: number; selected: boolean; mode: number; onClick: (id: number) => void }) {
  const group = useRef<Group>(null);
  const x = mode === 2 ? index * 1.65 - 2.2 : (index - 1.5) * 1.65;
  useFrame(() => { if (group.current) group.current.position.y = 0.28 + Math.sin(performance.now() / 600 + index) * 0.07; });
  const isNewLink = mode === 3 && node.id === 5;
  const snakeColor = ["#22d3ee", "#2dd4bf", "#34d399", "#a3e635"][index % 4];
  return <group ref={group} position={[x, isNewLink ? 0.82 : 0.26, 0]} onClick={(event) => { event.stopPropagation(); onClick(node.id); }}>
    {mode === 3 ? <>
      <mesh rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[0.38, 0.13, 12, 28]} /><meshStandardMaterial color={isNewLink ? "#fbbf24" : "#94a3b8"} emissive={isNewLink ? "#d97706" : "#334155"} emissiveIntensity={isNewLink ? 0.8 : 0.24} metalness={0.9} roughness={0.2} /></mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[0.2, 0.075, 10, 20]} /><meshStandardMaterial color={isNewLink ? "#fde68a" : "#cbd5e1"} metalness={0.95} roughness={0.18} /></mesh>
      <FloatingLabel position={[0, -0.62, 0]} color={isNewLink ? "#fde68a" : "#e2e8f0"}>{isNewLink ? "GOLD LINK" : String(node.value)}</FloatingLabel>
    </> : mode === 4 ? <>
      <mesh><sphereGeometry args={[0.4, 24, 20]} /><meshStandardMaterial color={snakeColor} emissive={snakeColor} emissiveIntensity={selected ? 1.2 : 0.75} metalness={0.3} roughness={0.22} /></mesh>
      <mesh position={[0.28, 0.12, 0.22]}><sphereGeometry args={[0.07, 12, 12]} /><meshBasicMaterial color="#f8fafc" /></mesh>
      <mesh position={[0.31, 0.12, 0.27]}><sphereGeometry args={[0.03, 8, 8]} /><meshBasicMaterial color="#020617" /></mesh>
      <FloatingLabel position={[0, -0.6, 0]} color="#bbf7d0">{node.id === 1 ? "TAIL" : node.id === 4 ? "HEAD" : `SEG ${node.id}`}</FloatingLabel>
    </> : <>
      {mode === 2 ? <>
        <mesh><boxGeometry args={[1.06, 0.55, 0.55]} /><meshStandardMaterial color={selected ? "#fbbf24" : "#38bdf8"} emissive={selected ? "#d97706" : "#0369a1"} emissiveIntensity={0.55} metalness={0.45} roughness={0.24} /></mesh>
        <mesh position={[0, 0.4, 0]}><boxGeometry args={[0.48, 0.3, 0.46]} /><meshStandardMaterial color="#e0f2fe" metalness={0.25} roughness={0.25} /></mesh>
        {[-0.32, 0.32].map((wheel) => <mesh key={wheel} position={[wheel, -0.32, 0.29]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.12, 0.12, 0.08, 16]} /><meshStandardMaterial color="#172033" metalness={0.7} /></mesh>)}
        <FloatingLabel position={[0, 0.75, 0]}>{`COACH ${node.id}`}</FloatingLabel>
      </> : <>
        <mesh><sphereGeometry args={[0.48, 28, 24]} /><meshStandardMaterial color={selected ? "#facc15" : "#22d3ee"} emissive={selected ? "#eab308" : "#0891b2"} emissiveIntensity={selected ? 0.9 : 0.48} metalness={0.3} roughness={0.22} /></mesh>
        <FloatingLabel position={[0, -0.68, 0]} color="#cffafe">{String(node.value)}</FloatingLabel>
      </>}
      {selected && <mesh position={[0, 0.82, 0]}><sphereGeometry args={[0.09, 12, 12]} /><meshBasicMaterial color="#fde047" /></mesh>}
    </>}
  </group>;
}

function TrainEngine() {
  return <group position={[-4.0, 0.32, 0]}>
    <mesh><boxGeometry args={[0.9, 0.7, 0.72]} /><meshStandardMaterial color="#f97316" emissive="#9a3412" emissiveIntensity={0.55} metalness={0.35} roughness={0.25} /></mesh>
    <mesh position={[0.05, 0.5, 0]}><cylinderGeometry args={[0.2, 0.2, 0.35, 20]} /><meshStandardMaterial color="#fcd34d" metalness={0.35} /></mesh>
    <mesh position={[0, 0.15, 0.4]}><boxGeometry args={[0.48, 0.18, 0.08]} /><meshBasicMaterial color="#fde68a" /></mesh>
    {[-0.27, 0.27].map((wheel) => <mesh key={wheel} position={[wheel, -0.4, 0.38]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.16, 0.16, 0.1, 18]} /><meshStandardMaterial color="#111827" metalness={0.7} /></mesh>)}
    <FloatingLabel position={[0, 0.95, 0]} color="#fdba74">ENGINE · HEAD</FloatingLabel>
  </group>;
}

function TrainCoupler() {
  return <mesh position={[-2.75, 0.28, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.055, 0.055, 0.55, 12]} /><meshStandardMaterial color="#fdba74" metalness={0.72} roughness={0.22} /></mesh>;
}

function Pointer({ link, index, nodes, mode, onClick }: { link: ListLink; index: number; nodes: ListNode[]; mode: number; onClick: (index: number) => void }) {
  const fromIndex = nodes.findIndex((node) => node.id === link.from);
  const toIndex = nodes.findIndex((node) => node.id === link.to);
  if (fromIndex < 0 || toIndex < 0) return null;
  const x = (index: number) => mode === 2 ? index * 1.65 - 2.2 : (index - 1.5) * 1.65;
  const from = new Vector3(x(fromIndex), 0.28, 0);
  const to = new Vector3(x(toIndex), 0.28, 0);
  const length = Math.max(0.32, from.distanceTo(to) - (mode === 2 ? 0.95 : mode === 3 ? 0.6 : 0.8));
  const midpoint = from.clone().add(to).multiplyScalar(0.5);
  const reversed = link.from > link.to;
  const color = mode === 2 ? "#fb923c" : mode === 3 ? "#cbd5e1" : mode === 4 ? "#4ade80" : "#22d3ee";
  return <group position={midpoint.toArray()} rotation={[0, reversed ? Math.PI : 0, Math.PI / 2]} onClick={(event) => { event.stopPropagation(); onClick(index); }}>
    <mesh><cylinderGeometry args={[mode === 3 ? 0.075 : 0.045, mode === 3 ? 0.075 : 0.045, length, 12]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={mode === 3 ? 0.35 : 0.8} metalness={mode === 3 ? 0.8 : 0.25} /></mesh>
    <mesh position={[0, length / 2, 0]} rotation={[Math.PI / 2, 0, 0]}><coneGeometry args={[0.13, 0.26, 12]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} /></mesh>
    <mesh><sphereGeometry args={[0.32, 12, 12]} /><meshBasicMaterial transparent opacity={0.01} /></mesh>
  </group>;
}

export default function LinkedListScene({ nodes, links, selectedId, mode = 1, trainAttached = false, onNodeClick, onLinkClick }: { nodes: ListNode[]; links: ListLink[]; selectedId: number | null; mode?: number; trainAttached?: boolean; onNodeClick: (id: number) => void; onLinkClick: (index: number) => void }) {
  return <group>
    <ambientLight intensity={0.65} />
    <pointLight position={[0, 4, 3]} intensity={30} color={mode === 2 ? "#fb923c" : mode === 3 ? "#fbbf24" : mode === 4 ? "#4ade80" : "#22d3ee"} distance={12} />
    <pointLight position={[0, 2, -4]} intensity={18} color="#a855f7" distance={10} />
    <mesh position={[0, -0.35, 0]} receiveShadow><boxGeometry args={[9.4, 0.35, 2.4]} /><meshStandardMaterial color={mode === 2 ? "#431407" : mode === 3 ? "#1e293b" : mode === 4 ? "#052e26" : "#172554"} metalness={0.45} roughness={0.38} /></mesh>
    <mesh position={[0, -0.15, 0]}><boxGeometry args={[9.3, 0.04, 2.3]} /><meshStandardMaterial color={mode === 2 ? "#f97316" : mode === 3 ? "#94a3b8" : mode === 4 ? "#22c55e" : "#0891b2"} emissive={mode === 2 ? "#ea580c" : mode === 3 ? "#64748b" : mode === 4 ? "#16a34a" : "#06b6d4"} emissiveIntensity={0.4} /></mesh>
    {mode === 2 && <TrainEngine />}
    {mode === 2 && trainAttached && <TrainCoupler />}
    {links.map((link, index) => <Pointer key={`${link.from}-${link.to}-${index}`} link={link} index={index} nodes={nodes} mode={mode} onClick={onLinkClick} />)}
    {nodes.map((node, index) => <SphereNode key={node.id} node={node} index={index} selected={node.id === selectedId} mode={mode} onClick={onNodeClick} />)}
    {mode === 1 && <FloatingLabel position={[-3.4, 1.05, 0]} color="#67e8f9">HEAD</FloatingLabel>}
    {mode === 4 && <FloatingLabel position={[-3.4, 1.05, 0]} color="#86efac">TAIL LEADS · REVERSE THE POINTERS</FloatingLabel>}
    {mode === 3 && <FloatingLabel position={[3.35, 1.25, 0]} color="#fcd34d">INSERT GOLD LINK</FloatingLabel>}
  </group>;
}
