"use client";

import { Html, Sparkles } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, Mesh } from "three";

export type LogicCommand = "forward" | "left" | "right";
export type LogicState = { x: number; z: number; direction: number };
export const logicPath = new Set(["0,0", "1,0", "2,0", "2,1", "2,2"]);

function FloorTile({ x, z, active, goal, start }: { x: number; z: number; active: boolean; goal: boolean; start: boolean }) {
  const gem = useRef<Mesh>(null);
  useFrame((_, delta) => { if (gem.current) { gem.current.rotation.y += delta * 0.9; gem.current.position.y = 0.35 + Math.sin(performance.now() / 350) * 0.08; } });
  return (
    <group position={[x - 1, 0, z - 1]}>
      <mesh receiveShadow position={[0, -0.12, 0]}>
        <boxGeometry args={[0.94, 0.22, 0.94]} />
        <meshStandardMaterial color={active ? "#155e75" : "#1e293b"} emissive={active ? "#0891b2" : "#0f172a"} emissiveIntensity={active ? 0.35 : 0.08} roughness={0.5} />
      </mesh>
      {start && <Html position={[0, 0.08, 0]} center distanceFactor={9}><span className="rounded-full bg-cyan-300/15 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-cyan-100">Start</span></Html>}
      {goal && <>
        <mesh ref={gem} position={[0, 0.42, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
          <octahedronGeometry args={[0.34, 0]} />
          <meshStandardMaterial color="#f0abfc" emissive="#d946ef" emissiveIntensity={1.2} metalness={0.4} roughness={0.2} />
        </mesh>
        <Sparkles count={18} scale={1.2} size={3} speed={0.6} color="#f0abfc" position={[0, 0.5, 0]} />
        <Html position={[0, 0.95, 0]} center distanceFactor={9}><span className="rounded-full border border-fuchsia-200/60 bg-slate-950/85 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-fuchsia-100">Goal</span></Html>
      </>}
    </group>
  );
}

function Robot({ state }: { state: LogicState }) {
  const robot = useRef<Group>(null);
  useFrame((_, delta) => {
    if (!robot.current) return;
    const targetX = state.x - 1;
    const targetZ = state.z - 1;
    const ease = 1 - Math.exp(-delta * 8);
    robot.current.position.x += (targetX - robot.current.position.x) * ease;
    robot.current.position.z += (targetZ - robot.current.position.z) * ease;
    // The robot mesh faces local +Z. Logical direction 0 points east (+X),
    // so compensate for the model's default facing when applying grid turns.
    const targetHeading = (1 - state.direction) * Math.PI / 2;
    robot.current.rotation.y += (targetHeading - robot.current.rotation.y) * ease;
  });
  return <group ref={robot} position={[-1, 0.08, -1]}>
    <mesh position={[0, 0.32, 0]} castShadow><boxGeometry args={[0.46, 0.5, 0.4]} /><meshStandardMaterial color="#22d3ee" metalness={0.4} roughness={0.28} emissive="#0891b2" emissiveIntensity={0.25} /></mesh>
    <mesh position={[0, 0.67, 0]} castShadow><boxGeometry args={[0.4, 0.3, 0.36]} /><meshStandardMaterial color="#e0f2fe" metalness={0.2} roughness={0.3} /></mesh>
    <mesh position={[0, 0.68, 0.19]}><boxGeometry args={[0.25, 0.1, 0.035]} /><meshBasicMaterial color="#7c3aed" /></mesh>
    <mesh position={[0, 0.88, 0]}><cylinderGeometry args={[0.025, 0.025, 0.16, 8]} /><meshStandardMaterial color="#facc15" /></mesh>
  </group>;
}

export default function LogicBuilderScene({ state, goal = { x: 2, z: 2 } }: { state: LogicState; goal?: { x: number; z: number } }) {
  return <group>
    <ambientLight intensity={0.5} />
    <pointLight position={[0, 4, 0]} intensity={32} color="#22d3ee" distance={8} />
    <pointLight position={[-5, 1, -4]} intensity={18} color="#7c3aed" distance={12} />
    <fog attach="fog" args={["#080d35", 10, 28]} />
    {/* Deep-space backdrop: scattered stars and distant neon-lit platforms. */}
    {Array.from({ length: 46 }, (_, index) => {
      const x = Math.sin(index * 127.1) * 8.5;
      const y = Math.cos(index * 53.7) * 3.8 + 1.2;
      const z = -3.5 - (index % 7) * 0.9;
      const cyan = index % 3 !== 0;
      return <mesh key={`star-${index}`} position={[x, y, z]}>
        <sphereGeometry args={[index % 9 === 0 ? 0.035 : 0.018, 8, 8]} />
        <meshBasicMaterial color={cyan ? "#22d3ee" : "#c084fc"} />
      </mesh>;
    })}
    <mesh position={[0, 0.2, -8]}>
      <planeGeometry args={[26, 18]} />
      <meshBasicMaterial color="#09133e" transparent opacity={0.36} />
    </mesh>
    {[
      [-4.1, 0.05, -1.3, 1.35], [4.25, -0.15, -1.9, 1.45],
      [-3.4, 0.2, -4.4, 0.95], [3.55, 0.3, -5, 1.05],
    ].map(([x, y, z, size], index) => <group key={`island-${index}`} position={[x, y, z]}>
      <mesh castShadow>
        <boxGeometry args={[size, 0.28, size]} />
        <meshStandardMaterial color="#123b79" metalness={0.45} roughness={0.3} emissive="#075985" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, -0.26, 0]}>
        <coneGeometry args={[size * 0.53, 0.8, 5]} />
        <meshStandardMaterial color="#111b59" flatShading roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[size * 0.94, 0.035, size * 0.94]} />
        <meshBasicMaterial color={index % 2 ? "#8b5cf6" : "#06b6d4"} />
      </mesh>
    </group>)}
    {[
      [-5.2, -0.6, -0.3], [-4.7, -0.35, 0.5], [5.2, -0.6, -0.1], [4.8, -0.4, 0.7],
    ].map(([x, y, z], index) => <mesh key={`rock-${index}`} position={[x, y, z]} rotation={[0.2, index, 0.35]}>
      <dodecahedronGeometry args={[0.72, 0]} />
      <meshStandardMaterial color="#151d69" flatShading roughness={0.9} emissive="#312e81" emissiveIntensity={0.18} />
    </mesh>)}
    {Array.from({ length: 3 }, (_, x) => Array.from({ length: 3 }, (_, z) => {
      const key = `${x},${z}`;
      return <FloorTile key={key} x={x} z={z} active={logicPath.has(key)} goal={x === goal.x && z === goal.z} start={x === 0 && z === 0} />;
    }))}
    <Robot state={state} />
    <mesh position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[3, 48]} /><meshStandardMaterial color="#0b1028" roughness={0.95} /></mesh>
  </group>;
}
