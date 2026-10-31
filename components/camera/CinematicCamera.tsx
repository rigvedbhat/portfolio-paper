"use client";

import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useCallback, useEffect, useRef } from "react";
import * as THREE from "three";

import { cameraWaypoints, idleDrift } from "@/lib/camera-paths";
import type { DestinationId } from "@/lib/types";

interface CinematicCameraProps {
  destination: DestinationId;
  isTransitioning: boolean;
  onTransitionComplete: () => void;
}

export function CinematicCamera({
  destination,
  isTransitioning,
  onTransitionComplete,
}: CinematicCameraProps) {
  const { camera } = useThree();
  const targetLookAt = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3());
  const tweenRef = useRef<gsap.core.Timeline | null>(null);
  const elapsedRef = useRef(0);
  const prevDestRef = useRef<DestinationId>("origin");

  // Initialize camera to origin position
  useEffect(() => {
    const wp = cameraWaypoints.origin;
    camera.position.set(...wp.position);
    targetLookAt.current.set(...wp.target);
    currentLookAt.current.set(...wp.target);
    camera.lookAt(currentLookAt.current);
  }, [camera]);

  // Navigate to new destination
  const navigateTo = useCallback(
    (dest: DestinationId) => {
      if (tweenRef.current) {
        tweenRef.current.kill();
      }

      const wp = cameraWaypoints[dest];
      const posObj = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
      };
      const lookObj = {
        x: currentLookAt.current.x,
        y: currentLookAt.current.y,
        z: currentLookAt.current.z,
      };

      const tl = gsap.timeline({
        onComplete: () => {
          prevDestRef.current = dest;
          onTransitionComplete();
        },
      });

      tl.to(
        posObj,
        {
          x: wp.position[0],
          y: wp.position[1],
          z: wp.position[2],
          duration: wp.travelDuration,
          ease: "power3.inOut",
          onUpdate: () => {
            camera.position.set(posObj.x, posObj.y, posObj.z);
          },
        },
        0
      );

      tl.to(
        lookObj,
        {
          x: wp.target[0],
          y: wp.target[1],
          z: wp.target[2],
          duration: wp.travelDuration,
          ease: "power2.inOut",
          onUpdate: () => {
            currentLookAt.current.set(lookObj.x, lookObj.y, lookObj.z);
            targetLookAt.current.set(lookObj.x, lookObj.y, lookObj.z);
          },
        },
        0
      );

      tweenRef.current = tl;
    },
    [camera, onTransitionComplete]
  );

  // React to destination changes
  useEffect(() => {
    if (destination !== prevDestRef.current) {
      navigateTo(destination);
    }
  }, [destination, navigateTo]);

  // Idle drift + smooth look-at
  useFrame((_, delta) => {
    elapsedRef.current += delta;

    // Gentle idle drift when not transitioning
    if (!isTransitioning) {
      const t = elapsedRef.current * idleDrift.speed;
      const driftX = Math.sin(t) * idleDrift.amplitudeX;
      const driftY = Math.sin(t * 0.7 + 1.3) * idleDrift.amplitudeY;

      const wp = cameraWaypoints[destination];
      const baseX = wp.position[0];
      const baseY = wp.position[1];

      camera.position.x = baseX + driftX;
      camera.position.y = baseY + driftY;
    }

    // Smooth look-at
    currentLookAt.current.lerp(targetLookAt.current, delta * 2.5);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
