"use client";

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GrassFieldProps {
  windStrength?: number;
}

export function GrassField({ windStrength = 1.0 }: GrassFieldProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const BLADE_COUNT = 24000;
  const RADIUS_X = 18;
  const RADIUS_Z = 12;

  const geometry = useMemo(() => {
    const segments = 5;
    // Create pampas grass blade + fluffy head geometry
    const geo = new THREE.PlaneGeometry(0.08, 1.4, 1, segments);
    
    const positions = geo.attributes.position.array as Float32Array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] += 0.7; // Align base at y=0
    }

    // Shape geometry: narrow base, widening mid-blade, slightly tapering tip
    for (let i = 0; i < positions.length; i += 3) {
      const y = positions[i + 1] / 1.4; 
      const x = positions[i];
      // Fluffy pampas grass head width profile
      let widthFactor = 1.0;
      if (y < 0.3) {
        widthFactor = 0.4 + (y / 0.3) * 0.6; // narrow stem
      } else if (y > 0.7) {
        widthFactor = 1.2 * (1.0 - (y - 0.7) / 0.3); // fluffy head tapering to tip
      } else {
        widthFactor = 1.25; // wide fluffy mid-head
      }
      positions[i] = x * widthFactor;
    }
    
    geo.computeVertexNormals();

    const instancedGeo = new THREE.InstancedBufferGeometry();
    instancedGeo.index = geo.index;
    instancedGeo.setAttribute('position', geo.attributes.position);
    instancedGeo.setAttribute('normal', geo.attributes.normal);
    instancedGeo.setAttribute('uv', geo.attributes.uv);

    const offsets = new Float32Array(BLADE_COUNT * 3);
    const scales = new Float32Array(BLADE_COUNT);
    const rotations = new Float32Array(BLADE_COUNT);
    const phases = new Float32Array(BLADE_COUNT);

    for (let i = 0; i < BLADE_COUNT; i++) {
      // Distribute in a rich hill landscape across the lower field
      const u = (Math.random() - 0.5) * 2;
      const v = (Math.random() - 0.5) * 2;
      
      const x = u * RADIUS_X;
      const z = v * RADIUS_Z - 1.0;
      
      // Gentle hill terrain height curve
      const distFromCenter = Math.sqrt(x * x + z * z);
      const hillHeight = Math.sin(x * 0.2) * 0.25 - (z * 0.12) - (distFromCenter * 0.04);

      offsets[i * 3] = x;
      offsets[i * 3 + 1] = -0.9 + hillHeight;
      offsets[i * 3 + 2] = z;

      // Realistic pampas grass height scale (0.9 to 1.8)
      scales[i] = 0.85 + Math.random() * 0.8;
      rotations[i] = (Math.random() - 0.5) * 0.8; // Slight rotation around Y
      phases[i] = Math.random() * Math.PI * 2;
    }

    instancedGeo.setAttribute('offset', new THREE.InstancedBufferAttribute(offsets, 3));
    instancedGeo.setAttribute('scale', new THREE.InstancedBufferAttribute(scales, 1));
    instancedGeo.setAttribute('rotation', new THREE.InstancedBufferAttribute(rotations, 1));
    instancedGeo.setAttribute('phase', new THREE.InstancedBufferAttribute(phases, 1));
    instancedGeo.instanceCount = BLADE_COUNT;

    return instancedGeo;
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uWindStrength: { value: windStrength }
  }), [windStrength]);

  const vertexShader = `
    uniform float uTime;
    uniform float uWindStrength;
    
    attribute vec3 offset;
    attribute float scale;
    attribute float rotation;
    attribute float phase;
    
    varying float vHeight;
    varying float vPhase;
    varying vec3 vWorldPos;
    
    void main() {
      vHeight = position.y / 1.4;
      vPhase = phase;
      
      float c = cos(rotation);
      float s = sin(rotation);
      mat2 rot = mat2(c, s, -s, c);
      
      vec3 pos = position;
      pos.xz = rot * pos.xz;
      
      pos.y *= scale;
      
      // Dynamic wind waves sweeping across pampas field
      float windFreq = 1.1;
      float windOffset = offset.x * 0.2 + offset.z * 0.15 + uTime * windFreq + phase;
      
      float bendFactor = pow(vHeight, 1.8);
      
      // Wind bending to the right (X direction) with subtle Z wave
      float windForce = (sin(windOffset) * 0.55 + sin(windOffset * 1.5 + 0.6) * 0.3) * uWindStrength;
      
      pos.x += windForce * bendFactor * scale * 0.45;
      pos.z += (sin(windOffset * 0.8) * 0.15) * bendFactor * scale;
      pos.y -= abs(windForce) * bendFactor * scale * 0.12;
      
      pos += offset;
      vWorldPos = pos;
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    varying float vHeight;
    varying float vPhase;
    varying vec3 vWorldPos;
    
    void main() {
      // Tsushima Pampas Grass colors: deep sage base to bright silver-cream tuft
      vec3 baseColor = vec3(0.18, 0.24, 0.20); // Dark sage green-grey base
      vec3 midColor  = vec3(0.65, 0.72, 0.68); // Soft pale green mid
      vec3 tipColor  = vec3(0.92, 0.94, 0.89); // Bright silver-white pampas head
      
      float variation = sin(vPhase * 3.0) * 0.05;
      
      vec3 color = mix(baseColor, midColor, smoothstep(0.0, 0.45, vHeight));
      color = mix(color, tipColor + variation, smoothstep(0.45, 1.0, vHeight));
      
      // Soft rim glow highlight simulating atmospheric top light
      float rim = smoothstep(0.6, 1.0, vHeight);
      color += vec3(0.15, 0.16, 0.14) * rim;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, undefined, BLADE_COUNT]} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
        transparent={false}
      />
    </instancedMesh>
  );
}
