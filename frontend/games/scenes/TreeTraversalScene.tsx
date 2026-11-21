"use client";

import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useRef } from "react";
import type { Group, Mesh } from "three";
import { Quaternion, Vector3 } from "three";

export interface TreeNode { id: number; value: number; x: number; y: number }
export interface TreeEdge { from: number; to: number }

function TreeNodeMesh({ node, index, selected, root, lychee, onSelect }: { node: TreeNode; index: number; selected: boolean; root: boolean; lychee: boolean; onSelect: (id: number) => void }) {
  const group = useRef<Group>(null);
  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.position.y = node.y + Math.sin(performance.now() / 700 + index) * 0.035;
    group.current.rotation.y += delta * (selected ? 0.42 : 0.08);
  });
  const color = selected ? "#34d399" : lychee ? "#fb7185" : "#fbbf24";
  return <group ref={group} position={[node.x, node.y, 0]} onClick={(event) => { event.stopPropagation(); onSelect(node.id); }}>
    {lychee ? <group>
      {[[-0.16, 0, 0], [0.16, 0.02, 0], [0, 0.18, 0.02], [0, -0.17, 0.02]].map(([x, y, z], part) => <mesh key={part} position={[x, y, z]} scale={[0.72, 0.82, 0.72]} castShadow><icosahedronGeometry args={[0.34, 1]} /><meshStandardMaterial color={selected ? "#34d399" : part % 2 ? "#fb7185" : "#f43f5e"} roughness={0.7} emissive="#be123c" emissiveIntensity={0.1} /></mesh>)}
    </group> : <mesh castShadow scale={[0.82, 1.15, 0.82]}><sphereGeometry args={[0.38, 24, 24]} /><meshStandardMaterial color={selected ? "#34d399" : "#fbbf24"} emissive={selected ? "#059669" : "#d97706"} emissiveIntensity={selected ? 0.65 : 0.2} roughness={0.34} /></mesh>}
    <mesh position={[0, lychee ? 0.31 : 0.42, 0]} rotation={[0, 0, -0.35]}><capsuleGeometry args={[0.035, 0.16, 3, 6]} /><meshStandardMaterial color="#854d0e" /></mesh>
    <mesh position={[0.13, lychee ? 0.34 : 0.46, 0]} rotation={[0, 0, 0.55]} scale={[0.8, 0.45, 0.2]}><sphereGeometry args={[0.19, 12, 10]} /><meshStandardMaterial color="#4ade80" roughness={0.55} /></mesh>
    <Text position={[0, 0, 0.47]} fontSize={0.28} color="#ffffff" anchorX="center" anchorY="middle" outlineWidth={0.025} outlineColor="#0f172a" material-toneMapped={false}>{node.value}</Text>
    {root && <Text position={[0, 0.62, 0]} fontSize={0.16} color="#fde68a" anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor="#0f172a" material-toneMapped={false}>ROOT</Text>}
  </group>;
}

function TreeEdgeMesh({ edge, nodes }: { edge: TreeEdge; nodes: TreeNode[] }) {
  const parent = nodes.find((node) => node.id === edge.from);
  const child = nodes.find((node) => node.id === edge.to);
  if (!parent || !child) return null;
  const start = new Vector3(parent.x, parent.y - 0.3, 0);
  const end = new Vector3(child.x, child.y + 0.3, 0);
  const delta = end.clone().sub(start);
  const midpoint = start.clone().add(end).multiplyScalar(0.5);
  const quaternion = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), delta.clone().normalize());
  return <mesh position={midpoint.toArray()} quaternion={quaternion}>
    <cylinderGeometry args={[0.075, 0.12, delta.length(), 8]} />
    <meshStandardMaterial color="#854d27" roughness={0.86} />
  </mesh>;
}

const treeLayouts: Record<number, Array<[number, number]>> = {
  1: [[0, 1.55], [-1.75, 0.45], [1.75, 0.45], [-2.65, -0.65], [-0.9, -0.65], [0.9, -0.65], [2.65, -0.65]],
  2: [[0.25, 1.55], [-2.05, 0.45], [1.45, 0.45], [-2.9, -0.65], [-1.25, -0.65], [0.95, -0.65], [2.75, -0.65]],
  3: [[-0.25, 1.55], [-1.35, 0.45], [2.05, 0.45], [-2.75, -0.65], [-0.15, -0.65], [1.25, -0.65], [3.05, -0.65]],
  4: [[0, 1.55], [-2.05, 0.45], [1.45, 0.45], [-2.85, -0.65], [-0.95, -0.65], [0.95, -0.65], [2.85, -0.65]],
};

export default function TreeTraversalScene({ nodes, edges, selectedId, rootId, mode = 1, onSelect }: { nodes: TreeNode[]; edges: TreeEdge[]; selectedId: number | null; rootId: number; mode?: number; onSelect: (id: number) => void }) {
  const layout = treeLayouts[mode] ?? treeLayouts[1];
  const placedNodes = nodes.map((node, index) => ({ ...node, x: layout[index][0], y: layout[index][1] }));
  return <group>
    <ambientLight intensity={0.65} />
    <pointLight position={[0, 4, 4]} intensity={24} color="#fbbf24" distance={14} />
    <pointLight position={[0, 1, -4]} intensity={12} color="#22c55e" distance={10} />
    <mesh position={[0, -1.5, 0]} rotation={[0, 0, -0.025]} receiveShadow><boxGeometry args={[9, 0.3, 2.4]} /><meshStandardMaterial color="#25451f" metalness={0.05} roughness={0.9} /></mesh>
    <mesh position={[0, -0.55, -0.42]}><cylinderGeometry args={[0.2, 0.42, 1.8, 9]} /><meshStandardMaterial color="#854d27" roughness={0.9} /></mesh>
    {edges.map((edge) => <TreeEdgeMesh key={`${edge.from}-${edge.to}`} edge={edge} nodes={placedNodes} />)}
    {placedNodes.map((node, index) => <TreeNodeMesh key={node.id} node={node} index={index} selected={node.id === selectedId} root={node.id === rootId} lychee={mode === 4} onSelect={onSelect} />)}
  </group>;
}
