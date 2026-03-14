import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float, Environment } from '@react-three/drei';
import { motion } from 'motion/react';
import * as THREE from 'three';

function DiamondModel() {
  // Try to load the model. If it's named .glp or placed differently, this might fail,
  // but Suspense will catch it if we handle errors, or at least show fallback.
  const { scene } = useGLTF('/diamond.glb');
  const modelRef = useRef<THREE.Group>(null);
  
  // Track time for the entry animation
  const timeRef = useRef(0);
  const entryDuration = 2.5; // seconds

  useFrame((state, delta) => {
    if (modelRef.current) {
      timeRef.current += delta;
      
      // Continuous slow rotation
      modelRef.current.rotation.y += delta * 0.5;
      
      // Entry spin animation (extra rotation during the first few seconds)
      if (timeRef.current < entryDuration) {
        const progress = timeRef.current / entryDuration;
        const spinSpeed = (1 - progress) * 10 * delta;
        modelRef.current.rotation.y += spinSpeed;
      }
    }
  });

  return (
    <Float
      speed={2} // Animation speed
      rotationIntensity={0.2} // XYZ rotation intensity
      floatIntensity={1.5} // Up/down float intensity
      floatingRange={[-0.1, 0.1]} // Range of y-axis values
    >
      <primitive ref={modelRef} object={scene} scale={1.5} />
    </Float>
  );
}

export function Diamond3D() {
  return (
    <motion.div 
      className="w-full h-[180px] md:h-[220px] relative z-20 pointer-events-none -mt-4 -mb-4"
      initial={{ opacity: 0, y: 150 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 2.5, 
        ease: "easeOut",
        delay: 0.3
      }}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} />
        <directionalLight position={[-10, -10, -10]} intensity={0.5} />
        <Environment preset="city" />
        <Suspense fallback={null}>
          <DiamondModel />
        </Suspense>
      </Canvas>
    </motion.div>
  );
}
