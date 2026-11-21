"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

export interface QueueCustomer { id: number; color: string; vip?: boolean }

function Customer({ customer, index, frontX }: { customer: QueueCustomer; index: number; frontX: number }) {
  const group = useRef<Group>(null);
  const targetX = frontX + index * 1.15;
  useFrame((_, delta) => {
    if (!group.current) return;
    const ease = 1 - Math.exp(-delta * 5.5);
    group.current.position.x += (targetX - group.current.position.x) * ease;
    group.current.position.y = 0.08 + Math.sin(performance.now() / 350 + index) * 0.025;
  });
  return <group ref={group} position={[targetX + 3, 0.08, 0]}>
    <mesh position={[0, 0.48, 0]} castShadow><capsuleGeometry args={[0.28, 0.42, 6, 12]} /><meshStandardMaterial color={customer.color} emissive={customer.color} emissiveIntensity={customer.vip ? 0.38 : 0.12} roughness={0.35} /></mesh>
    <mesh position={[0, 0.95, 0]} castShadow><sphereGeometry args={[0.27, 18, 18]} /><meshStandardMaterial color={customer.vip ? "#fde68a" : "#f5d0b5"} /></mesh>
    <mesh position={[0.1, 0.98, 0.23]}><sphereGeometry args={[0.035, 8, 8]} /><meshBasicMaterial color="#0f172a" /></mesh>
    {customer.vip && <Html position={[0, 1.42, 0]} center distanceFactor={8}><span className="rounded-full border border-amber-200 bg-amber-300 px-2 py-1 text-[9px] font-black text-amber-950 shadow-[0_0_16px_rgba(251,191,36,.7)]">VIP</span></Html>}
  </group>;
}

export default function QueueCounterScene({ customers, mode, onDropAtFront, onDropAtBack }: { customers: QueueCustomer[]; mode: number; onDropAtFront?: () => void; onDropAtBack?: () => void }) {
  return <group>
    <ambientLight intensity={0.65} />
    <pointLight position={[0, 4, 3]} intensity={28} color="#22d3ee" distance={12} />
    <pointLight position={[-3, 3, -3]} intensity={18} color="#a855f7" distance={10} />
    <mesh position={[0, -0.34, 0]} receiveShadow><boxGeometry args={[12, 0.35, 3]} /><meshStandardMaterial color="#172554" metalness={0.28} roughness={0.48} /></mesh>
    <mesh position={[0, -0.15, 0]}><boxGeometry args={[11.8, 0.04, 2.85]} /><meshStandardMaterial color="#0891b2" emissive="#06b6d4" emissiveIntensity={0.4} /></mesh>
    {/* Ticket counter booth at the dequeue/front end. */}
    <group position={[-4.15, 0, 0]}>
      <mesh position={[0, 0.75, -0.65]} castShadow><boxGeometry args={[1.4, 1.55, 0.42]} /><meshStandardMaterial color="#4338ca" metalness={0.28} roughness={0.35} /></mesh>
      <mesh position={[0, 0.9, -0.39]}><boxGeometry args={[0.9, 0.42, 0.06]} /><meshBasicMaterial color="#22d3ee" /></mesh>
      <mesh position={[0, 0.18, 0]} castShadow><boxGeometry args={[1.8, 0.35, 1.25]} /><meshStandardMaterial color="#7c3aed" emissive="#6d28d9" emissiveIntensity={0.3} /></mesh>
      <Html position={[0, 1.85, -0.45]} center distanceFactor={8}><span className="rounded-full border border-cyan-200/50 bg-slate-950/90 px-3 py-1 text-[10px] font-black text-cyan-100">TICKET COUNTER</span></Html>
    </group>
    {customers.map((customer, index) => <Customer key={customer.id} customer={customer} index={index} frontX={-2.35} />)}
    {mode === 1 && <>
      <Html position={[4.2, 1, 0]} center distanceFactor={7}>
        <div draggable onDragStart={(event) => { event.dataTransfer.setData("text/plain", "customer"); }} className="cursor-grab select-none rounded-2xl border-2 border-fuchsia-200 bg-fuchsia-500/90 px-4 py-3 text-2xl shadow-[0_0_22px_rgba(217,70,239,.5)]">🧑‍🚀<span className="block text-[9px] font-black text-white">DRAG CUSTOMER</span></div>
      </Html>
      <Html position={[-0.2, 0.35, 0]} center distanceFactor={7}>
        <div onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); if (event.dataTransfer.getData("text/plain") === "customer") onDropAtBack?.(); }} className="grid h-12 w-36 place-items-center rounded-xl border-2 border-dashed border-cyan-100/80 bg-cyan-400/15 text-[9px] font-black text-cyan-50">DROP TO JOIN QUEUE</div>
      </Html>
    </>}
    {mode === 3 && <>
      <Html position={[4.2, 1, 0]} center distanceFactor={7}><div draggable onDragStart={(event) => event.dataTransfer.setData("text/plain", "vip")} className="cursor-grab rounded-2xl border-2 border-amber-200 bg-amber-300 px-4 py-3 text-2xl shadow-[0_0_22px_rgba(251,191,36,.55)]">👑<span className="block text-[9px] font-black text-amber-950">DRAG VIP</span></div></Html>
      <Html position={[-2.35, 0.35, 0]} center distanceFactor={7}><div onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); if (event.dataTransfer.getData("text/plain") === "vip") onDropAtFront?.(); }} className="grid h-12 w-28 place-items-center rounded-xl border-2 border-dashed border-amber-200 bg-amber-300/15 text-[9px] font-black text-amber-100">VIP FRONT</div></Html>
    </>}
  </group>;
}
