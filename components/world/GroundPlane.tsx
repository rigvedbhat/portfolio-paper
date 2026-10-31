"use client";

import React, { useMemo } from 'react';

export function GroundPlane() {
  const uniforms = useMemo(() => ({}), []);

  const vertexShader = `
    varying vec3 vWorldPosition;
    
    void main() {
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `;

  const fragmentShader = `
    varying vec3 vWorldPosition;
    
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
        u.y
      );
    }

    void main() {
      // Tsushima earthy terrain shade matching pampas base
      vec3 baseColor = vec3(0.12, 0.17, 0.14);
      vec3 fogColor  = vec3(0.08, 0.13, 0.15);
      
      float n = noise(vWorldPosition.xz * 0.3) * 0.5 + 0.5;
      vec3 color = baseColor * (0.85 + n * 0.3);
      
      float dist = length(vWorldPosition.xz);
      float fogFactor = smoothstep(6.0, 35.0, dist);
      
      color = mix(color, fogColor, fogFactor);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  return (
    <mesh position={[0, -0.9, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[100, 100, 16, 16]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}
