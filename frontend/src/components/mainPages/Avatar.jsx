import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAnimations, useFBX, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const visemeMapping = {
  A: 'viseme_PP',
  B: 'viseme_kk',
  C: 'viseme_I',
  D: 'viseme_AA',
  E: 'viseme_O',
  F: 'viseme_U',
  G: 'viseme_FF',
  H: 'viseme_TH',
  X: 'viseme_PP'
};

export function Avatar({ audioUrl, lipsync, ...props }) {
  const [animation, setAnimation] = useState('Idle');
  const audio = useMemo(() => (audioUrl ? new Audio(audioUrl) : null), [audioUrl]);
  const { nodes, materials } = useGLTF('./models/669774bdaefec8673fd48836.glb');
  const { animations: idleAnimations } = useFBX('./animations/Idle.fbx');
  const { animations: talkingAnimations } = useFBX('./animations/Talking.fbx');

  idleAnimations[0].name = 'Idle';
  talkingAnimations[0].name = 'Talking';

  const group = useRef();
  const { actions } = useAnimations([idleAnimations[0], talkingAnimations[0]], group);

  useEffect(() => {
    if (audio) {
      const handleAudioPlay = () => setAnimation('Talking');
      const handleAudioPause = () => setAnimation('Idle');
      const handleAudioEnd = () => setAnimation('Idle');

      audio.addEventListener('play', handleAudioPlay);
      audio.addEventListener('pause', handleAudioPause);
      audio.addEventListener('ended', handleAudioEnd);

      audio.play().catch((error) => {
        console.error('Audio playback error:', error);
      });

      return () => {
        audio.removeEventListener('play', handleAudioPlay);
        audio.removeEventListener('pause', handleAudioPause);
        audio.removeEventListener('ended', handleAudioEnd);
        audio.pause();
      };
    } else {
      setAnimation('Idle');
    }
  }, [audio]);

  useEffect(() => {
    if (actions[animation]) {
      actions[animation].reset().fadeIn(0.5).play();
      return () => actions[animation].fadeOut(0.5);
    }
  }, [animation, actions]);

  useFrame(() => {
    if (audio && lipsync && lipsync.mouthCues && Array.isArray(lipsync.mouthCues)) {
      const currentAudioTime = audio.currentTime;

      if (audio.paused || audio.ended) {
        setAnimation('Idle');
      }

      Object.values(visemeMapping).forEach((viseme) => {
        const headIndex = nodes?.Wolf3D_Head?.morphTargetDictionary?.[viseme];
        const teethIndex = nodes?.Wolf3D_Teeth?.morphTargetDictionary?.[viseme];

        if (headIndex !== undefined) {
          nodes.Wolf3D_Head.morphTargetInfluences[headIndex] = 0;
        }
        if (teethIndex !== undefined) {
          nodes.Wolf3D_Teeth.morphTargetInfluences[teethIndex] = 0;
        }
      });

      for (let i = 0; i < lipsync.mouthCues.length; i++) {
        const mouthCue = lipsync.mouthCues[i];
        if (currentAudioTime >= mouthCue.start && currentAudioTime <= mouthCue.end) {
          const viseme = visemeMapping[mouthCue.value];
          const headIndex = nodes?.Wolf3D_Head?.morphTargetDictionary?.[viseme];
          const teethIndex = nodes?.Wolf3D_Teeth?.morphTargetDictionary?.[viseme];

          if (headIndex !== undefined) {
            nodes.Wolf3D_Head.morphTargetInfluences[headIndex] = 1;
          }
          if (teethIndex !== undefined) {
            nodes.Wolf3D_Teeth.morphTargetInfluences[teethIndex] = 1;
          }
          break;
        }
      }
    }
  });

  return (
    <group {...props} dispose={null} ref={group}>
      <primitive object={nodes.Hips} />
      <skinnedMesh
        geometry={nodes.Wolf3D_Hair.geometry}
        material={materials.Wolf3D_Hair}
        skeleton={nodes.Wolf3D_Hair.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Glasses.geometry}
        material={materials.Wolf3D_Glasses}
        skeleton={nodes.Wolf3D_Glasses.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Body.geometry}
        material={materials.Wolf3D_Body}
        skeleton={nodes.Wolf3D_Body.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
        material={materials.Wolf3D_Outfit_Bottom}
        skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
        material={materials.Wolf3D_Outfit_Footwear}
        skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Top.geometry}
        material={materials.Wolf3D_Outfit_Top}
        skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
      />
      <skinnedMesh
        name="EyeLeft"
        geometry={nodes.EyeLeft.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeLeft.skeleton}
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
      />
      <skinnedMesh
        name="EyeRight"
        geometry={nodes.EyeRight.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeRight.skeleton}
        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Head"
        geometry={nodes.Wolf3D_Head.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Teeth"
        geometry={nodes.Wolf3D_Teeth.geometry}
        material={materials.Wolf3D_Teeth}
        skeleton={nodes.Wolf3D_Teeth.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
      />
    </group>
  );
}

useGLTF.preload('./models/669774bdaefec8673fd48836.glb');
