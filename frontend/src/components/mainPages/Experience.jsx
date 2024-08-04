import { Environment, OrbitControls } from "@react-three/drei";
import { Avatar } from "../Avatar";
export const Experience = () => {
  return (
    <>
      <OrbitControls />
      <Avatar position={[0,-3,0]} scale={2}/>
      <Environment preset="./sunset"/>
    </>
  );
};
