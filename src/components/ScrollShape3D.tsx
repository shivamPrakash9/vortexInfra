import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const AbstractShape = () => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useFrame(() => {
        if (meshRef.current) {
            // Smooth rotation driven by scroll
            meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, scrollY * 0.002, 0.1);
            meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, scrollY * 0.001, 0.1);
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <mesh ref={meshRef} scale={1.8}>
                {/* High density sphere for smooth organic distortion */}
                <sphereGeometry args={[1, 64, 64]} />

                {/* Material configured for soft, premium aesthetic */}
                <MeshDistortMaterial
                    color="#c29b8c"
                    envMapIntensity={1}
                    clearcoat={0.8}
                    clearcoatRoughness={0.2}
                    metalness={0.5}
                    roughness={0.3}
                    distort={0.6} // High distortion for organic flow
                    speed={0.8}   // Slow, relaxing movement
                />
            </mesh>
        </Float>
    );
};

const ScrollShape3D = () => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
            <Canvas
                dpr={[1, 1.5]}
             camera={{ position: [0, 0, 5], fov: 45 }}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    pointerEvents: 'none'
                }}
             className='absolute inset-0 pointer-events-none'
             >
                <ambientLight intensity={0.6} />
                <directionalLight position={[10, 10, 5]} intensity={1.2} />
                <Environment preset="city" />
                <AbstractShape />
            </Canvas>
        </div>
    );
};

export default ScrollShape3D;