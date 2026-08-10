"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Grid, RoundedBox, Sparkles } from "@react-three/drei";
import { Suspense, useRef, type RefObject } from "react";
import * as THREE from "three";

// Geometry of the drafting compass, derived from the 2D CompassMark motif
// (hinge circle, two splayed legs, a foot bar, coral tip) — extruded into 3D
// primitives instead of an imported model, so the hero has zero asset weight.
const HINGE_Y = 1.05;
const LEG_LEN = 2.05;
const SPLAY = THREE.MathUtils.degToRad(15);
const legOffsetX = Math.sin(SPLAY) * (LEG_LEN / 2);
const legOffsetY = Math.cos(SPLAY) * (LEG_LEN / 2);
const tipOffsetX = Math.sin(SPLAY) * LEG_LEN;
const tipOffsetY = Math.cos(SPLAY) * LEG_LEN;

const BRASS = { color: "#caa46e", metalness: 0.85, roughness: 0.28 } as const;

function easeOutBack(t: number) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function CompassRig({ scrollRef }: { scrollRef: RefObject<number> }) {
  const rig = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);
  const mountTime = useRef<number | null>(null);

  useFrame((state) => {
    if (!rig.current || !tilt.current) return;
    if (mountTime.current === null) mountTime.current = state.clock.elapsedTime;

    const t = Math.min(1, (state.clock.elapsedTime - mountTime.current) / 1.15);
    rig.current.scale.setScalar(Math.max(0, easeOutBack(t)));

    const scrollP = scrollRef.current ?? 0;
    const targetRotY =
      state.pointer.x * 0.32 + state.clock.elapsedTime * 0.1 + scrollP * 1.1;
    const targetRotX = -state.pointer.y * 0.16 + scrollP * 0.22;
    tilt.current.rotation.y += (targetRotY - tilt.current.rotation.y) * 0.06;
    tilt.current.rotation.x += (targetRotX - tilt.current.rotation.x) * 0.06;
    rig.current.position.y = -scrollP * 0.6;

    state.camera.position.z = 6.2 + scrollP * 2.2;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={rig}>
      <group ref={tilt}>
        <mesh position={[0, HINGE_Y, 0]}>
          <sphereGeometry args={[0.16, 24, 24]} />
          <meshStandardMaterial {...BRASS} />
        </mesh>

        <mesh
          position={[-legOffsetX, HINGE_Y - legOffsetY, 0]}
          rotation={[0, 0, SPLAY]}
        >
          <cylinderGeometry args={[0.045, 0.06, LEG_LEN, 12]} />
          <meshStandardMaterial {...BRASS} />
        </mesh>
        <mesh
          position={[legOffsetX, HINGE_Y - legOffsetY, 0]}
          rotation={[0, 0, -SPLAY]}
        >
          <cylinderGeometry args={[0.045, 0.06, LEG_LEN, 12]} />
          <meshStandardMaterial {...BRASS} />
        </mesh>

        <mesh
          position={[-tipOffsetX * 0.82, HINGE_Y - tipOffsetY * 0.82, 0]}
          rotation={[0, 0, SPLAY]}
        >
          <boxGeometry args={[0.32, 0.05, 0.05]} />
          <meshStandardMaterial {...BRASS} />
        </mesh>

        <mesh position={[tipOffsetX, HINGE_Y - tipOffsetY, 0]}>
          <coneGeometry args={[0.07, 0.22, 16]} />
          <meshStandardMaterial
            color="#e17a44"
            emissive="#e17a44"
            emissiveIntensity={1.4}
            roughness={0.3}
          />
        </mesh>
        <pointLight
          position={[tipOffsetX, HINGE_Y - tipOffsetY, 0.3]}
          intensity={1.4}
          distance={2.5}
          color="#e17a44"
        />
      </group>
    </group>
  );
}

const CARDS = [
  { pos: [-2.3, 0.6, -1.2], rot: [0.3, 0.5, 0.1], color: "#dfe9f0", scale: 0.55, speed: 1.2 },
  { pos: [2.5, -0.3, -1.6], rot: [-0.2, -0.4, 0.15], color: "#f2ede2", scale: 0.65, speed: 1.5 },
  { pos: [1.6, 1.3, -2.2], rot: [0.15, 0.8, -0.1], color: "#e3b79e", scale: 0.4, speed: 1.8 },
] as const;

function PatternCards() {
  return (
    <>
      {CARDS.map((c, i) => (
        <Float key={i} speed={c.speed} rotationIntensity={0.4} floatIntensity={0.8}>
          <RoundedBox
            args={[1, 1.3, 0.06]}
            radius={0.08}
            smoothness={4}
            position={c.pos as unknown as [number, number, number]}
            rotation={c.rot as unknown as [number, number, number]}
            scale={c.scale}
          >
            <meshStandardMaterial color={c.color} transparent opacity={0.82} roughness={0.55} />
          </RoundedBox>
        </Float>
      ))}
    </>
  );
}

export function AboutHeroCanvas({ scrollRef }: { scrollRef: RefObject<number> }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.3, 6.2], fov: 38 }}
    >
      <color attach="background" args={["#0b1f33"]} />
      <fog attach="fog" args={["#0b1f33", 5.5, 13]} />
      <ambientLight intensity={0.3} color="#3a5c78" />
      <hemisphereLight args={["#3a6f96", "#050d16", 0.5]} />
      <pointLight position={[1.8, 2.2, 2.4]} intensity={2.4} color="#e17a44" distance={9} decay={2} />
      <directionalLight position={[-4, 2.5, -2]} intensity={0.7} color="#6fa3c4" />

      <Suspense fallback={null}>
        <CompassRig scrollRef={scrollRef} />
        <PatternCards />
        <Sparkles count={70} scale={[7, 4.5, 6]} size={2.2} speed={0.25} color="#e17a44" opacity={0.5} />
        <Sparkles count={50} scale={[8, 5, 7]} size={1.6} speed={0.15} color="#6fa3c4" opacity={0.35} />
        <Grid
          position={[0, -1.7, 0]}
          args={[1, 1]}
          cellSize={0.5}
          cellColor="#1c3a55"
          sectionSize={2.5}
          sectionColor="#2f5677"
          fadeDistance={11}
          fadeStrength={1.2}
          infiniteGrid
        />
      </Suspense>
    </Canvas>
  );
}
