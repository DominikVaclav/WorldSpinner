import * as THREE from "three"
import './style.css'
import gsap from "gsap"
import { OrbitControls } from '/node_modules/three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';


//Scena
const scene = new THREE.Scene()

//Textura
const textureLoader = new THREE.TextureLoader()
//const earthTexture = textureLoader.load("stone_tiles.jpg")


//Objekt
/*const geometry = new THREE.SphereGeometry( 3, 64, 64 ); 
const material = new THREE.MeshStandardMaterial( { 
  color: "#00ff83",
  roughness: 0.5,
  //map:earthTexture
 } ); 
const mesh = new THREE.Mesh( geometry, material ); scene.add( mesh );
*/
const tl = gsap.timeline({ defaults: { duration:5 }})
const t2 = gsap.timeline({ defaults: { duration:2 }})


const loader = new FBXLoader();
let earth;
let sun;
loader.load( './public/earth.fbx', function ( object ) {

  earth = object;
  earth.scale.set(0.02, 0.02, 0.02)
  scene.add(earth)

  tl.fromTo(earth.scale, {x:0, y:0, z:0}, {x:0.02, y:0.02, z:0.02}, 1)
  t2.fromTo("nav", { y: "-100" }, { y:"0%" })
  t2.fromTo("h1", { opacity: 0 }, { opacity : 1 })

});
loader.load( './public/sun.fbx', function ( fbx ) {

  sun = fbx;
  sun.scale.set(0.01, 0.01, 0.01)
  sun.position.set(10, 5, 0)
  scene.add(sun)
  tl.fromTo(sun.scale, {x:0, y:0, z:0}, {x:0.005, y:0.005, z:0.005}, 2)
} 
);

//Velkost okna
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

//Svetlo
const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
light.position.set(0, 10, 10)
scene.add(light)

//Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width/sizes.height, 0.1, 100)
camera.position.z = 25
scene.add(camera)

//Renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGL1Renderer({canvas})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(2)
renderer.render(scene, camera)

//Controls
const controls = new OrbitControls (camera, canvas)
controls.enableDamping = true
controls.enablePan = true
controls.enableZoom = true
controls.autoRotate = true
controls.autoRotateSpeed = -5

//Resize
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
})

const loop = () =>{
  renderer.render(scene, camera)
  window.requestAnimationFrame(loop)
  controls.update()
}
loop()

//Colors
let mouseDown = false
let rgb = [12,23,55]
window.addEventListener('mousedown', () => (mouseDown = true))
window.addEventListener('mouseup', () => (mouseDown = false))

window.addEventListener("mousemove", (e) =>{
  if (mouseDown){
    rgb = [
      Math.round((e.pageX / sizes.width) *255),
      Math.round((e.pageX / sizes.height) *255),
      150,
    ]
    //let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
    //gsap.to(mesh.material.color, {r: newColor.r, g: newColor.g, b: newColor.b})
  }
})

