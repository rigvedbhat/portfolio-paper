"use client";

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleSystemProps {
  windStrength?: number;
}

export function ParticleSystem({ windStrength = 1.0 }: ParticleSystemProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const PARTICLE_COUNT = 800;

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const phases = new Float32Array(PARTICLE_COUNT);
    const speeds = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;

      phases[i] = Math.random() * Math.PI * 2;
      speeds[i] = 0.4 + Math.random() * 0.6;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
    geo.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));

    return geo;
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uWindStrength: { value: windStrength }
  }), [windStrength]);

  const vertexShader = `
    uniform float uTime;
    uniform float uWindStrength;
    
    attribute float phase;
    attribute float speed;
    
    varying float vAlpha;
    
    void main() {
      vec3 pos = position;
      
      float t = uTime * speed * 0.4;
      pos.y += t * 0.6;
      pos.y = mod(pos.y + 5.0, 10.0) - 5.0;
      
      float drift = uTime * 0.15 * uWindStrength;
      pos.x += drift + sin(t * 1.5 + phase) * 0.25;
      pos.x = mod(pos.x + 7.5, 15.0) - 7.5;
      
      vAlpha = smoothstep(0.0, 0.3, 1.0 - abs(pos.y) / 5.0);
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = (18.0 + sin(phase + uTime) * 6.0) * (1.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    varying float vAlpha;
    
    void main() {
      vec2 coord = gl_PointCoord - vec2(0.5);
      float dist = length(coord);
      
      if (dist > 0.5) discard;
      
      float alpha = (0.5 - dist) * 2.0;
      alpha *= vAlpha * 0.75;
      
      // Warm golden ember color palette
      vec3 emberColor = vec3(1.0, 0.82, 0.42); // Golden amber glow
      
      gl_FragColor = vec4(emberColor, alpha);
    }
  `;

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <points ref={pointsRef} args={[geometry]}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
