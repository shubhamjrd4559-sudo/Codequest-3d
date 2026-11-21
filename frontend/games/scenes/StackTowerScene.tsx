"use client";

import { Html, Sparkles } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";

export interface StackBlock {
  id: number;
  value: number;
  color: string;
}

function TowerBlock({ block, index, isTop, exiting = false }: { block: StackBlock; index: number; isTop: boolean; exiting?: boolean }) {
  const mesh = useRef<Mesh>(null);
  const glow = useRef<Mesh>(null);
  const material = useRef<import('three').MeshStandardMaterial>(null);
  const targetY = 0.48 + index * 0.78;

  useFrame((_, delta) => {
    if (!mesh.current) return;
    const meshObj = mesh.current;
    const ease = 1 - Math.exp(-delta * 7);
    meshObj.position.y += ((exiting ? targetY + 1.5 : targetY) - meshObj.position.y) * ease;
    meshObj.position.x += ((exiting ? 3.5 : 0) - meshObj.position.x) * ease;
    meshObj.position.z += (0 - meshObj.position.z) * ease;
    meshObj.rotation.x *= Math.exp(-delta * 5);
    meshObj.rotation.z *= Math.exp(-delta * 5);
    if (exiting) {
      meshObj.rotation.y += delta * 2.5;
      meshObj.scale.multiplyScalar(Math.exp(-delta * 0.55));
      if (material.current) material.current.opacity = Math.max(0, material.current.opacity - delta * 1.6);
    }
    if (glow.current) {
      glow.current.position.y = targetY + 0.42;
      glow.current.rotation.y += delta * 0.7;
    }
  });

  return (
    <group>
      <mesh ref={mesh} position={exiting ? [0, targetY, 0] : [0, targetY + 3.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.32, 0.72, 1.32]} />
        <meshStandardMaterial ref={material} transparent={exiting} color={block.color} roughness={0.28} metalness={0.12} emissive={block.color} emissiveIntensity={0.13} />
      </mesh>
      {isTop && (
        <>
          <mesh ref={glow} position={[0, targetY + 0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.78, 0.9, 48]} />
            <meshBasicMaterial color="#fef08a" transparent opacity={0.95} />
          </mesh>
          <Html position={[0, targetY + 0.8, 0]} center distanceFactor={9}>
            <div className="whitespace-nowrap rounded-full border border-amber-200/70 bg-slate-950/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-amber-100 shadow-[0_0_18px_rgba(250,204,21,0.65)]">
              Top · {block.value}
            </div>
          </Html>
          <Sparkles count={12} scale={1.7} size={2.5} speed={0.35} color="#fde68a" position={[0, targetY + 0.4, 0]} />
        </>
      )}
      <Html position={[0, targetY, 0.68]} center distanceFactor={10}>
        <span className="select-none text-[9px] font-black text-white/90 drop-shadow">{block.value}</span>
      </Html>
    </group>
  );
}

export default function StackTowerScene({ blocks, exiting }: { blocks: StackBlock[]; exiting?: { block: StackBlock; index: number } | null }) {
  return (
    <group>
      <mesh position={[0, -0.42, 0]} receiveShadow>
        <cylinderGeometry args={[1.8, 2.05, 0.46, 64]} />
        <meshStandardMaterial color="#312e81" metalness={0.35} roughness={0.38} />
      </mesh>
      <mesh position={[0, -0.16, 0]}>
        <cylinderGeometry args={[1.58, 1.75, 0.08, 64]} />
        <meshStandardMaterial color="#22d3ee" emissive="#0891b2" emissiveIntensity={0.35} metalness={0.5} roughness={0.25} />
      </mesh>
      <mesh position={[0, -0.72, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#0b1028" roughness={0.95} />
      </mesh>
      {blocks.map((block, index) => (
        <TowerBlock key={block.id} block={block} index={index} isTop={index === blocks.length - 1} />
      ))}
      {exiting && <TowerBlock key={`exit-${exiting.block.id}`} block={exiting.block} index={exiting.index} isTop={false} exiting />}
      {blocks.length === 0 && (
        <Html position={[0, 0.9, 0]} center>
          <div className="whitespace-nowrap rounded-full border border-cyan-200/30 bg-slate-950/80 px-4 py-2 text-xs font-bold text-cyan-100 backdrop-blur">Push a block to begin</div>
        </Html>
      )}
    </group>
  );
}
