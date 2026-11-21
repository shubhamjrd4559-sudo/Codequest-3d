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

function TowerBlock({ block, index, isTop, exiting = false, locked = false }: { block: StackBlock; index: number; isTop: boolean; exiting?: boolean; locked?: boolean }) {
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
      {locked && <Html position={[0, targetY, 0.7]} center distanceFactor={10}><span className="rounded-full border border-red-300/50 bg-red-950/90 px-2 py-1 text-[8px] font-black text-red-100">🔒 LOCKED</span></Html>}
      <Html position={[0, targetY, 0.68]} center distanceFactor={10}>
        <span className="select-none text-[9px] font-black text-white/90 drop-shadow">{block.value}</span>
      </Html>
    </group>
  );
}

export type StackMode = 1 | 2 | 3 | 4;

export default function StackTowerScene({ blocks, exiting, mode = 1, onDragPlace, platformX = 0, fallingX = 0, fallingY = 3, bomb = false, rescue = false }: {
  blocks: StackBlock[];
  exiting?: { block: StackBlock; index: number } | null;
  mode?: StackMode;
  onDragPlace?: () => void;
  platformX?: number;
  fallingX?: number;
  fallingY?: number;
  bomb?: boolean;
  rescue?: boolean;
}) {
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
      {mode !== 3 && blocks.map((block, index) => (
        <TowerBlock key={block.id} block={block} index={index} isTop={index === blocks.length - 1} locked={mode === 4 && block.color === "#ef4444" && index < blocks.length - 1} />
      ))}
      {mode === 3 && blocks.map((block, index) => <mesh key={block.id} position={[platformX, 0.17 + index * 0.42, 0]} castShadow><boxGeometry args={[0.68, 0.38, 0.68]} /><meshStandardMaterial color={block.color} emissive={block.color} emissiveIntensity={0.2} /></mesh>)}
      {exiting && <TowerBlock key={`exit-${exiting.block.id}`} block={exiting.block} index={exiting.index} isTop={false} exiting />}
      {mode === 1 && <>
        <mesh position={[0, -0.1, 0]}><boxGeometry args={[2.2, 0.18, 2.2]} /><meshStandardMaterial color="#155e75" emissive="#0891b2" emissiveIntensity={0.28} /></mesh>
        <Html position={[-2.4, 0.65, 0]} center distanceFactor={7}>
          <div draggable onDragStart={(event) => { event.dataTransfer.setData("text/plain", "stack-block"); event.dataTransfer.effectAllowed = "move"; }} className="cursor-grab select-none rounded-lg border-2 border-cyan-200 bg-gradient-to-br from-pink-400 to-fuchsia-600 px-3 py-2 text-center text-[10px] font-black text-white shadow-[0_0_24px_rgba(217,70,239,0.55)] active:cursor-grabbing">
            <span className="block text-lg leading-5">▦</span>DRAG BLOCK
          </div>
        </Html>
        <Html position={[0, 0.24, 0]} center distanceFactor={7}>
          <div onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = "move"; }} onDrop={(event) => { event.preventDefault(); if (event.dataTransfer.getData("text/plain") === "stack-block") onDragPlace?.(); }} className="grid h-14 w-28 place-items-center rounded-xl border-2 border-dashed border-cyan-100/80 bg-cyan-400/15 text-center text-[10px] font-black leading-tight text-cyan-50 shadow-[0_0_22px_rgba(34,211,238,0.42)]">
            DROP HERE<br />STACK {blocks.length}/5
          </div>
        </Html>
      </>}
      {mode === 3 && <>
        <mesh position={[platformX, -0.03, 0]}><boxGeometry args={[1.65, 0.22, 1.4]} /><meshStandardMaterial color="#22d3ee" emissive="#0891b2" emissiveIntensity={0.5} /></mesh>
        <mesh position={[fallingX, fallingY, 0]}><boxGeometry args={[0.65, 0.65, 0.65]} /><meshStandardMaterial color={bomb ? "#ef4444" : "#facc15"} emissive={bomb ? "#dc2626" : "#ca8a04"} emissiveIntensity={0.7} /></mesh>
        <Html position={[0, 2.5, 0]} center><span className="rounded-full border border-cyan-200/40 bg-slate-950/90 px-3 py-1 text-[10px] font-black text-cyan-100">{bomb ? "BOMB! POP NOW" : "CATCH THE BLOCK"}</span></Html>
      </>}
      {mode === 4 && rescue && <Html position={[0, -0.2, 0]} center distanceFactor={8}><div className="rounded-xl border border-cyan-200/40 bg-slate-950/90 px-3 py-2 text-2xl">🤖<p className="text-[9px] font-black text-cyan-100">RESCUE BOT</p></div></Html>}
      {blocks.length === 0 && mode !== 1 && (
        <Html position={[0, 0.9, 0]} center>
          <div className="whitespace-nowrap rounded-full border border-cyan-200/30 bg-slate-950/80 px-4 py-2 text-xs font-bold text-cyan-100 backdrop-blur">Push a block to begin</div>
        </Html>
      )}
    </group>
  );
}
