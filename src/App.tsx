// Tetris start
import {
  Canvas,
  Object3DNode,
  ThreeElements,
  useLoader,
  useThree,
} from "@react-three/fiber";

import React, { useLayoutEffect, useRef } from "react";
import THREE, {
  DoubleSide,
  Layers,
  LinearMipMapLinearFilter,
  TextureLoader,
} from "three";

import stars from "./assets/milky_way.jpeg";
import gameBox from "./assets/tgamearea.png";
import logo from "./assets/tlogo-gameplay.png";
import statusBox from "./assets/tstatus.png";

import { GradientTexture } from "@react-three/drei";

import { extend } from "@react-three/fiber";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

import { Layer, gameLayers } from "./settings/setup";
import fonts from "./settings/fonts";
import { Box, Flex } from "@react-three/flex";

extend({ TextGeometry });

declare module "@react-three/fiber" {
  interface ThreeElements {
    textGeometry: Object3DNode<TextGeometry, typeof TextGeometry>;
  }
}

function App() {
  // refs
  const canvasRef = React.useRef<HTMLCanvasElement>(null!);
  const mesh = useRef<THREE.Mesh>(null!);

  React.useEffect(() => {
    const canvas = canvasRef.current;
  }, []);

  useLayoutEffect(() => {
    gameLayers.enable(Layer.LOGO);
    gameLayers.enable(Layer.STARS);
    gameLayers.enable(Layer.TOP);
    gameLayers.enable(Layer.TEST);
    gameLayers.enable(Layer.GAME);
  }, [mesh, gameLayers]);

  const LogoMain = (props?: ThreeElements["mesh"]): React.ReactNode => {
    const loadedLogo = useLoader(TextureLoader, logo);

    loadedLogo.minFilter = LinearMipMapLinearFilter;
    const { viewport } = useThree();
    const initialLogoWidth = 7.0;
    const initialLogoHeight = 3.2;
    const responsiveSize = viewport.width / 100;

    return (
      <mesh
        ref={mesh}
        layers={Layer.LOGO}
        renderOrder={3}
        {...props}
        scale={0.5 + responsiveSize}
      >
        <pointLight position={[5, 5, 5]} />
        <planeGeometry
          attach='geometry'
          args={[initialLogoWidth, initialLogoHeight]}
        />
        <meshBasicMaterial
          transparent
          map={loadedLogo}
          depthTest={true}
          side={DoubleSide}
        />
      </mesh>
    );
  };

  const TopSection = (props: ThreeElements["mesh"]) => {
    const { size, viewport } = useThree();

    return (
      <>
        <PlayStartText text='PRESS P TO PLAY' />
        <mesh layers={Layer.LOGO} {...props} renderOrder={3}>
          <LogoMain position={[-1, -0.35, 0]} />
          <meshStandardMaterial />
        </mesh>
        <mesh layers={Layer.TOP} {...props} ref={mesh} renderOrder={2}>
          <planeGeometry args={[size.width, 1.13, 1]} />
          <meshStandardMaterial transparent opacity={0.8} />
        </mesh>
      </>
    );
  };

  const GameSection = (props: ThreeElements["mesh"]) => {
    const initialGameWidth = 3.96;
    const initialGameHeight = 4;
    const mesh = useRef<THREE.Mesh>(null!);
    const loadedGameBox = useLoader(TextureLoader, gameBox);
    return (
      <mesh {...props} ref={mesh} renderOrder={3}>
        <planeGeometry args={[initialGameHeight, initialGameWidth]} />
        <meshBasicMaterial transparent map={loadedGameBox} />
      </mesh>
    );
  };

  const GamePlaySection = (props: ThreeElements["mesh"]) => {
    const mesh = useRef<THREE.Mesh>(null!);
    const { size } = useThree();
    const initialScale = 0.6;
    return (
      <mesh layers={Layer.GAME} {...props} ref={mesh} renderOrder={3}>
        <directionalLight castShadow />

        <GameSection
          scale={[initialScale, 1, 1]}
          position={[-1.64, -initialScale + 0.02, 1]}
        />
        <StatusSection
          scale={[initialScale, 1, 0]}
          position={[0.8 - size.width, -initialScale, 1]}
        />
        <planeGeometry args={[size.width, 8, 1]} />
        <meshBasicMaterial transparent={true} opacity={0.9}>
          <pointLight position={[5, 5, 5]} />
          <GradientTexture stops={[0, 1]} colors={["#4904A2", "black"]} />
        </meshBasicMaterial>
      </mesh>
    );
  };

  const RenderText = (props: {
    mesh?: ThreeElements["mesh"];
    font: {
      type: string;
      data: string;
      generateShapes: (text: string, size: number) => THREE.Shape[];
    };
    size: number;
    height: number;
    text: string;
  }) => {
    return (
      <mesh {...props.mesh} ref={mesh}>
        <textGeometry
          args={[
            props.text,
            {
              font: props.font,
              size: props.size,
              height: props.height,
            },
          ]}
        />
        <meshBasicMaterial attach='material' color='white' />
      </mesh>
    );
  };

  const StatusSection = (props: ThreeElements["mesh"]) => {
    const initialStatusWidth = 3.2;
    const initialStatusHeight = 4;

    const loadedStatusBox = useLoader(TextureLoader, statusBox);

    return (
      <mesh {...props} ref={mesh} renderOrder={3}>
        <planeGeometry args={[initialStatusWidth, initialStatusHeight]} />
        <meshBasicMaterial transparent map={loadedStatusBox} />
      </mesh>
    );
  };

  const RenderStars = (props: ThreeElements["mesh"]) => {
    const { viewport } = useThree();
    const loadedStars = useLoader(TextureLoader, stars);
    return (
      <mesh renderOrder={1}>
        <planeGeometry args={[viewport.width, viewport.height, 1]} />
        <meshBasicMaterial
          transparent={true}
          opacity={0.9}
          map={loadedStars}
          depthTest={true}
          side={DoubleSide}
        />
      </mesh>
    );
  };

  const PlayStartText = ({ text }: { text: string }) => {
    return (
      <RenderText
        mesh={{
          position: [-0.9, 1.96, -0.095],
          scale: [0.8, 0.8, 1],
        }}
        text={text}
        height={0.1}
        size={0.1}
        font={fonts.pressStart}
      />
    );
  };

  return (
    <div
      style={{
        backgroundColor: "#000",
        width: "100vw",
        height: "100vh",
      }}
    >
      <Canvas
        flat
        linear
        camera={{ position: [0, 0, 5], layers: gameLayers }}
        dpr={[1, 2]}
        shadows
        gl={{ antialias: false }}
      >
        <RenderStars />
        <TopSection scale={[1, 1, 1]} position={[1, 2.48, 1.03]} />
        <Flex justifyContent='center' alignItems='center'>
          <Box centerAnchor>
            <GamePlaySection />
          </Box>
        </Flex>
      </Canvas>
    </div>
  );
}

export default App;
