// left side of the screen

// Attribution: Hand model downloaded from https://sketchfab.com/3d-models/hand-anatomy-ada8498be9754e9f90b2eecc1b4ef8c5

import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth/2/window.innerHeight, 0.1, 1000);

camera.position.set(450 * 1.4, 250 * 1.4, 500 * 1.4);
camera.lookAt(0, 0, 0); 

let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth/2, window.innerHeight);
document.getElementById("container-left").appendChild(renderer.domElement);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

// add light

scene.add(new THREE.AmbientLight(0x443333, 1));

const dirLight1 = new THREE.DirectionalLight( 0xffddcc, 2);
dirLight1.position.set( 1, 0.75, 0.5);
dirLight1.castShadow = true;
dirLight1.shadowDarkness = 0.5;
//Set up shadow properties for the light
dirLight1.shadow.mapSize.width = 512; // default
dirLight1.shadow.mapSize.height = 512; // default
dirLight1.shadow.camera.near = 0.5; // default
dirLight1.shadow.camera.far = 500; // default
scene.add( dirLight1 );

const dirLight2 = new THREE.DirectionalLight( 0xffddcc, 2);
dirLight2.position.set(-1, -0.75, -0.5);
dirLight2.castShadow = true;
//Set up shadow properties for the light
dirLight2.shadow.mapSize.width = 512; // default
dirLight2.shadow.mapSize.height = 512; // default
dirLight2.shadow.camera.near = 0.5; // default
dirLight2.shadow.camera.far = 500; // default
scene.add( dirLight2 );



// add orbit control
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.enablePan = false;
controls.enableZoom = false;

let material = new THREE.MeshPhongMaterial({color: "red"});
let materialBall = new THREE.MeshBasicMaterial({color: "black"});

// a test ball
let ball = new THREE.SphereGeometry(100, 64, 32);
let materialTest = new THREE.MeshPhongMaterial({color: 0x24bd70});
let ballMesh = new THREE.Mesh(ball, materialTest);
ballMesh.castShadow = true;
ballMesh.position.set(100, 150, 100);
// scene.add(ballMesh);



// make a plane
let plane = new THREE.BoxGeometry(3000, 2, 3000);
let planeMesh = new THREE.Mesh(plane, material);
planeMesh.receiveShadow = true;
scene.add(planeMesh);
planeMesh.position.set(0, 0, 0);

for (let i = 0; i < 40; i++){
  for (let j = 0; j < 40; j++){
    let radius = Math.random() * 4 + 4;
    let x = 40 * i - 600;
    let z = 40 * j - 600;
    let y = radius;
    let ball = new THREE.SphereGeometry(radius, 36, 18);
    let ballMesh = new THREE.Mesh(ball, materialBall);
    ballMesh.receiveShadow = true;
    ballMesh.position.set(x, y, z);
    scene.add(ballMesh);
  }
}



// load hand model

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( 'jsm/libs/draco/gltf/' );

const loader = new GLTFLoader();
loader.setDRACOLoader( dracoLoader );
loader.load( 'assets/hand_with_texture.glb', function (gltf) {

  const model = gltf.scene;
  model.position.set(50, 230, 0);
  model.rotateX(Math.PI / 2);
  model.rotateZ(-Math.PI / 4);
  model.scale.set(25, 25, 25);
  model.castShadow = true;
  model.traverse( function ( object ) {
    if ( object.isMesh ){
      console.log("is casting shadow")
      object.castShadow = true;
    }
  } );
  scene.add(model);
}, undefined, function (e) {
  console.error(e);
} );



function loop(){

  // render the scene
  renderer.render(scene, camera);

  // rinse and repeat
  window.requestAnimationFrame(loop);
}
loop();