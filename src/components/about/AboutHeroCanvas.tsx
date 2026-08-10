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

// Matte, not metallic: a cyanotype print is pale line on blue paper, not a
// jewellery render. The 2D CompassMark this extrudes is a plain ink-coloured
// line icon with a single coral dot — the 3D piece should read the same way.
const LINE_MATERIAL = { color: "#dce7ee", metalness: 0, roughness: 1 } as const;

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

    // On narrow (portrait/mobile) canvases the same distance crops the
    // compass into unreadable fragments — pull back further the taller
    // and narrower the frame gets.
    const aspect = state.size.width / state.size.height;
    const portraitPullback = Math.min(2.6, Math.max(0, (1 - aspect) * 3.2));
    state.camera.position.z = 6.8 + portraitPullback + scrollP * 2.2;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={rig}>
      <group ref={tilt}>
        <mesh position={[0, HINGE_Y, 0]}>
          <sphereGeometry args={[0.16, 24, 24]} />
          <meshStandardMaterial {...LINE_MATERIAL} />
        </mesh>

        <mesh
          position={[-legOffsetX, HINGE_Y - legOffsetY, 0]}
          rotation={[0, 0, SPLAY]}
        >
          <cylinderGeometry args={[0.045, 0.06, LEG_LEN, 12]} />
          <meshStandardMaterial {...LINE_MATERIAL} />
        </mesh>
        <mesh
          position={[legOffsetX, HINGE_Y - legOffsetY, 0]}
          rotation={[0, 0, -SPLAY]}
        >
          <cylinderGeometry args={[0.045, 0.06, LEG_LEN, 12]} />
          <meshStandardMaterial {...LINE_MATERIAL} />
        </mesh>

        <mesh
          position={[-tipOffsetX * 0.82, HINGE_Y - tipOffsetY * 0.82, 0]}
          rotation={[0, 0, SPLAY]}
        >
          <boxGeometry args={[0.32, 0.05, 0.05]} />
          <meshStandardMaterial {...LINE_MATERIAL} />
        </mesh>

        <mesh position={[tipOffsetX, HINGE_Y - tipOffsetY, 0]}>
          <coneGeometry args={[0.07, 0.22, 16]} />
          <meshStandardMaterial
            color="#e17a44"
            emissive="#e17a44"
            emissiveIntensity={0.5}
            roughness={0.8}
            metalness={0}
          />
        </mesh>
        <pointLight
          position={[tipOffsetX, HINGE_Y - tipOffsetY, 0.3]}
          intensity={0.5}
          distance={1.6}
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
      camera={{ position: [0, 0.3, 7.5], fov: 38 }}
    >
      <color attach="background" args={["#0b1f33"]} />
      <fog attach="fog" args={["#0b1f33", 5.5, 13]} />
      <ambientLight intensity={0.85} color="#5c86a3" />
      <hemisphereLight args={["#5b93ba", "#0a1c2d", 0.85]} />
      <pointLight position={[1.8, 2.2, 2.4]} intensity={0.9} color="#e17a44" distance={9} decay={2} />
      <directionalLight position={[-4, 2.5, -2]} intensity={0.55} color="#8fbdd8" />

      <Suspense fallback={null}>
        <CompassRig scrollRef={scrollRef} />
        <PatternCards />
        <Sparkles count={60} scale={[7, 4.5, 6]} size={1.1} speed={0.2} color="#e17a44" opacity={0.35} />
        <Sparkles count={45} scale={[8, 5, 7]} size={0.9} speed={0.12} color="#6fa3c4" opacity={0.28} />
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
