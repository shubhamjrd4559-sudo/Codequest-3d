"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, Mesh } from "three";
import { Vector3 } from "three";

export interface ListNode { id: number; value: number }
export interface ListLink { from: number; to: number }

function NodeVisual({ node, index, selected, head, onClick }: { node: ListNode; index: number; selected: boolean; head: boolean; onClick: (id: number) => void }) {
  const group = useRef<Group>(null);
  useFrame((_, delta) => { if (group.current) group.current.position.y = 0.2 + Math.sin(performance.now() / 600 + index) * 0.09; });
  return <group ref={group} position={[(index - 1.5) * 1.65, 0.2, 0]} onClick={(event) => { event.stopPropagation(); onClick(node.id); }}>
    <mesh castShadow><sphereGeometry args={[0.52, 28, 24]} /><meshStandardMaterial color={selected ? "#facc15" : "#22d3ee"} emissive={selected ? "#eab308" : "#0891b2"} emissiveIntensity={selected ? 0.75 : 0.4} metalness={0.28} roughness={0.25} /></mesh>
    {selected && <mesh position={[0, 0.82, 0]}><sphereGeometry args={[0.09, 12, 12]} /><meshBasicMaterial color="#fde047" /></mesh>}
  </group>;
}

function Pointer({ link, index, reverse, fromIndex, toIndex, onClick }: { link: ListLink; index: number; reverse: boolean; fromIndex: number; toIndex: number; onClick: (index: number) => void }) {
  const from = new Vector3((fromIndex - 1.5) * 1.65, 0.2, 0);
  const to = new Vector3((toIndex - 1.5) * 1.65, 0.2, 0);
  const length = from.distanceTo(to) - 0.8;
  const midpoint = from.clone().add(to).multiplyScalar(0.5);
  const ref = useRef<Mesh>(null);
  return <group position={midpoint.toArray()} rotation={[0, reverse ? Math.PI : 0, Math.PI / 2]} onClick={(event) => { event.stopPropagation(); onClick(index); }}>
    <mesh ref={ref} position={[0, 0, 0]}>
      <cylinderGeometry args={[0.045, 0.045, length, 10]} /><meshStandardMaterial color="#a78bfa" emissive="#7c3aed" emissiveIntensity={0.8} />
    </mesh>
    <mesh position={[0, length / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <coneGeometry args={[0.14, 0.28, 12]} /><meshStandardMaterial color="#e879f9" emissive="#c026d3" emissiveIntensity={0.75} />
    </mesh>
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[0.32, 12, 12]} /><meshBasicMaterial transparent opacity={0.01} />
    </mesh>
  </group>;
}

export default function LinkedListScene({ nodes, links, selectedId, headId = 1, reversed = false, onNodeClick, onLinkClick }: { nodes: ListNode[]; links: ListLink[]; selectedId: number | null; headId?: number; reversed?: boolean; onNodeClick: (id: number) => void; onLinkClick: (index: number) => void }) {
  return <group>
    <ambientLight intensity={0.62} />
    <pointLight position={[0, 4, 3]} intensity={30} color="#22d3ee" distance={12} />
    <pointLight position={[0, 2, -4]} intensity={18} color="#a855f7" distance={10} />
    <mesh position={[0, -0.35, 0]} receiveShadow><boxGeometry args={[8.8, 0.35, 2.2]} /><meshStandardMaterial color="#172554" metalness={0.3} roughness={0.45} /></mesh>
    <mesh position={[0, -0.15, 0]}><boxGeometry args={[8.7, 0.04, 2.1]} /><meshStandardMaterial color="#0891b2" emissive="#06b6d4" emissiveIntensity={0.35} /></mesh>
    {links.map((link, index) => <Pointer key={`${link.from}-${link.to}-${index}`} link={link} index={index} reverse={link.from > link.to} fromIndex={nodes.findIndex((node) => node.id === link.from)} toIndex={nodes.findIndex((node) => node.id === link.to)} onClick={onLinkClick} />)}
    {nodes.map((node, index) => <NodeVisual key={node.id} node={node} index={index} selected={node.id === selectedId} head={node.id === headId} onClick={onNodeClick} />)}
  </group>;
}
