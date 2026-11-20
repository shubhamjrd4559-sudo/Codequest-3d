"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";

export default function TestScene() {
  const boxRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (boxRef.current) {
      boxRef.current.rotation.y += delta * 0.45;
      boxRef.current.rotation.x += delta * 0.18;
    }
  });

  return (
    <group>
      <mesh position={[0, -0.8, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#172554" roughness={0.92} />
      </mesh>
      <mesh ref={boxRef} position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial color="#67e8f9" metalness={0.18} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.25, 1.4, 64]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}
