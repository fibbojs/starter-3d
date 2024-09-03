import * as THREE from 'three'
import RAPIER from '@dimforge/rapier3d'
import { FComponentEmpty, FCuboid, FGameCamera, FScene } from '@fibbojs/3d'
import { FKeyboard } from '@fibbojs/event'
import { fDebug } from '@fibbojs/devtools'
import './style.css'
import Character from './classes/Character'

(async () => {
  // Initialize the scene
  const scene = new FScene()
  scene.init()
  await scene.initPhysics()
  // Debug the scene
  if (import.meta.env.DEV)
    fDebug(scene)

  // Add ambient light
  const light = new THREE.AmbientLight(0xFFFFFF)
  scene.scene.add(light)

  // Create a death zone
  const deathZone = new FComponentEmpty(scene, {
    position: { x: 0, y: -20, z: 0 },
    scale: { x: 100, y: 1, z: 100 },
  })
  deathZone.initCollider()
  scene.addComponent(deathZone)

  // Create a ground
  const ground = new FCuboid(scene, {
    position: { x: 0, y: -0.1, z: 0 },
    scale: { x: 15, y: 0.1, z: 15 },
  })
  ground.initRigidBody({
    rigidBodyType: RAPIER.RigidBodyType.Fixed,
  })
  ground.setColor(0x348C31)
  scene.addComponent(ground)

  // Create a character
  const character = new Character(scene)
  scene.addComponent(character)

  // Attach a camera to the character
  scene.camera = new FGameCamera({ target: character })

  // Add collision events
  character.onCollisionWith(deathZone, () => {
    console.log('Character fell into the death zone!')
    character.setPosition({ x: 0, y: 10, z: 0 })
  })

  // Create keyboard
  const keyboard = new FKeyboard(scene)
  keyboard.onKeyDown('p', () => {
    character.setPosition({ x: 0, y: 5, z: 0 })
  })
})()
