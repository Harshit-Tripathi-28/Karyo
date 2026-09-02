import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  OrbitControls,
  Sparkles,
  Stars,
} from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";

const NODE_COUNT = 95;
const CONNECTION_DISTANCE = 2.05;

interface NeuralNode {
  position: [number, number, number];
  size: number;
}

function Core() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    groupRef.current.rotation.y += delta * 0.08;
    groupRef.current.rotation.x += delta * 0.025;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <icosahedronGeometry args={[1.45, 4]} />
        <meshBasicMaterial
          color="#7c3aed"
          wireframe
          transparent
          opacity={0.22}
        />
      </mesh>

      <mesh>
        <icosahedronGeometry args={[1.12, 3]} />
        <meshBasicMaterial
          color="#22d3ee"
          wireframe
          transparent
          opacity={0.13}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.72, 48, 48]} />
        <meshBasicMaterial
          color="#22d3ee"
          transparent
          opacity={0.07}
        />
      </mesh>

      <pointLight
        color="#22d3ee"
        intensity={8}
        distance={7}
        decay={2}
      />
    </group>
  );
}

function NeuralNetwork() {
  const nodes = useMemo<NeuralNode[]>(() => {
    return Array.from({ length: NODE_COUNT }, (_, index) => {
      const angle = (index / NODE_COUNT) * Math.PI * 2;

      const radius =
        2.8 +
        Math.sin(index * 1.7) * 1.2 +
        Math.random() * 2.5;

      return {
        position: [
          Math.cos(angle) * radius +
            (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 5.5,
          Math.sin(angle) * radius +
            (Math.random() - 0.5) * 2,
        ],
        size: 0.018 + Math.random() * 0.045,
      };
    });
  }, []);

  const connections = useMemo(() => {
    const result: Array<[THREE.Vector3, THREE.Vector3]> = [];

    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const start = new THREE.Vector3(...nodes[i].position);
        const end = new THREE.Vector3(...nodes[j].position);

        if (start.distanceTo(end) < CONNECTION_DISTANCE) {
          result.push([start, end]);
        }
      }
    }

    return result;
  }, [nodes]);

  return (
    <group>
      {connections.map(([start, end], index) => {
        const direction = new THREE.Vector3().subVectors(end, start);
        const midpoint = new THREE.Vector3()
          .addVectors(start, end)
          .multiplyScalar(0.5);

        const quaternion = new THREE.Quaternion();

        quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          direction.clone().normalize()
        );

        return (
          <mesh
            key={`line-${index}`}
            position={midpoint}
            quaternion={quaternion}
          >
            <cylinderGeometry
              args={[
                0.006,
                0.006,
                direction.length(),
                5,
              ]}
            />

            <meshBasicMaterial
              color="#22d3ee"
              transparent
              opacity={0.16}
            />
          </mesh>
        );
      })}

      {nodes.map((node, index) => (
        <Float
          key={`node-${index}`}
          speed={0.35 + (index % 5) * 0.12}
          rotationIntensity={0.15}
          floatIntensity={0.25}
        >
          <mesh position={node.position}>
            <sphereGeometry args={[node.size, 10, 10]} />

            <meshBasicMaterial
              color={index % 5 === 0 ? "#a78bfa" : "#67e8f9"}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function NeuralWorld() {
  const worldRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!worldRef.current) return;

    worldRef.current.rotation.y += delta * 0.018;
  });

  return (
    <group ref={worldRef}>
      <NeuralNetwork />

      <Core />

      <Sparkles
        count={130}
        scale={[15, 8, 10]}
        size={1.1}
        speed={0.25}
        opacity={0.35}
        color="#67e8f9"
      />
    </group>
  );
}

export function NeuralScene() {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{
          position: [0, 0, 12],
          fov: 48,
        }}
        dpr={[1, 1.8]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <color attach="background" args={["#020307"]} />

        <ambientLight intensity={0.08} />

        <Stars
          radius={80}
          depth={50}
          count={1000}
          factor={1.2}
          saturation={0}
          fade
          speed={0.2}
        />

        <Environment preset="night" />

        <NeuralWorld />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate
          autoRotate
          autoRotateSpeed={0.12}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.65}
        />

        <EffectComposer>
          <Bloom
            intensity={1.35}
            luminanceThreshold={0.18}
            luminanceSmoothing={0.85}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}