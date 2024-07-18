/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.4.1 public/models/669774bdaefec8673fd48836.glb -o src/components/Avatar.jsx -r public 
*/

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useAnimations, useFBX, useGLTF } from '@react-three/drei'
import {useControls} from "leva"
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from "three";

const corresponding={
  A:"viseme_PP",
  B: "viseme_kk",
  C: "viseme_I",
  D: "viseme_AA",
  E: "viseme_O",
  F: "viseme_U",
  G: "viseme_FF",
  H: "viseme_TH",
  X:"viseme_PP"
}

export function Avatar(props) {



  const {playAudio, script} = useControls({
    playAudio:false,
    script:{
      value : "theQuestion",
      options:["theQuestion","describing"],
    },
  });

  const audio = useMemo(()=> new Audio('/audio/'+script+'.wav'),[script]);
  const jsonFile = useLoader(THREE.FileLoader,'audio/'+ script + '.json');
  const lipsync =JSON.parse(jsonFile);

  useFrame(()=>{
    const currentAudioTime = audio.currentTime;
    if(audio.paused || audio.ended){
      setAnimation("Idle")
    }
    Object.values(corresponding).forEach((value)=>{
      nodes.Wolf3D_Head.morphTargetInfluences[nodes.Wolf3D_Head.morphTargetDictionary[value]]=0;
      nodes.Wolf3D_Teeth.morphTargetInfluences[nodes.Wolf3D_Teeth.morphTargetDictionary[value]]=0;
    })

    for(let i=0; i< lipsync.mouthCues.length; i++){
        const mouthCue = lipsync.mouthCues[i];
        if(currentAudioTime >= mouthCue.start && 
          currentAudioTime <= mouthCue.end){
          console.log(mouthCue.value)
          nodes.Wolf3D_Head.morphTargetInfluences[nodes.Wolf3D_Head.morphTargetDictionary[corresponding[mouthCue.value]]]=1;
      nodes.Wolf3D_Teeth.morphTargetInfluences[nodes.Wolf3D_Teeth.morphTargetDictionary[corresponding[mouthCue.value]]]=1;
      break;
        }
    }
  })
  useEffect(()=>{
    if(playAudio){
      audio.play();
      if(script === "theQuestion"){
        setAnimation("StandingGreeting")
      }else{
        setAnimation("Talking");
      }
    }else{
      setAnimation("Idle")
      audio.pause();
    }
  },[playAudio,script]);

  useEffect(()=>{

  })

  const { nodes, materials } =  useGLTF('/models/669774bdaefec8673fd48836.glb')
  const {animations : IdlenAimations} = useFBX("/animations/Idle.fbx");
  const {animations : TalkingAimations} = useFBX("/animations/Talking.fbx");
  const {animations : StandingGreetingAimations} = useFBX("/animations/StandingGreeting.fbx");
  
  IdlenAimations[0].name = "Idle";
  TalkingAimations[0].name = "Talking";
  StandingGreetingAimations[0].name = "StandingGreeting"

  const [animations, setAnimation] = useState("Idle");

  const group = useRef();
  const{actions}= useAnimations([IdlenAimations[0],TalkingAimations[0],StandingGreetingAimations[0]],group);

  useEffect(()=>{
    actions[animations].reset().fadeIn(0.5).play();
    return()=>actions[animations].fadeOut(0.5);
  },[animations])

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
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Bottom.geometry} material={materials.Wolf3D_Outfit_Bottom} skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Footwear.geometry} material={materials.Wolf3D_Outfit_Footwear} skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Top.geometry} material={materials.Wolf3D_Outfit_Top} skeleton={nodes.Wolf3D_Outfit_Top.skeleton} />
      <skinnedMesh name="EyeLeft" geometry={nodes.EyeLeft.geometry} material={materials.Wolf3D_Eye} skeleton={nodes.EyeLeft.skeleton} morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary} morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences} />
      <skinnedMesh name="EyeRight" geometry={nodes.EyeRight.geometry} material={materials.Wolf3D_Eye} skeleton={nodes.EyeRight.skeleton} morphTargetDictionary={nodes.EyeRight.morphTargetDictionary} morphTargetInfluences={nodes.EyeRight.morphTargetInfluences} />
      <skinnedMesh name="Wolf3D_Head" geometry={nodes.Wolf3D_Head.geometry} material={materials.Wolf3D_Skin} skeleton={nodes.Wolf3D_Head.skeleton} morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences} />
      <skinnedMesh name="Wolf3D_Teeth" geometry={nodes.Wolf3D_Teeth.geometry} material={materials.Wolf3D_Teeth} skeleton={nodes.Wolf3D_Teeth.skeleton} morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences} />
    </group>
  )
}

useGLTF.preload('/models/669774bdaefec8673fd48836.glb')
