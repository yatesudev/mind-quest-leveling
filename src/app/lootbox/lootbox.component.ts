import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { FBXLoader } from '../../../node_modules/three/examples/jsm/loaders/FBXLoader.js';

@Component({
  selector: 'app-lootbox',
  templateUrl: './lootbox.component.html',
  styleUrls: ['./lootbox.component.css']
})
export class LootboxComponent implements AfterViewInit {
  @ViewChild('canvasBox', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  constructor() {}

  ngAfterViewInit(): void {
    this.createScene();
  }

  createScene(): void {
    const canvas = this.canvasRef.nativeElement;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 5);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const fbxLoader = new FBXLoader();
    fbxLoader.load('/assets/models/lootbox.fbx', (object) => {
      scene.add(object);
    }, undefined, (error) => {
      console.error('An error happened while loading the FBX model.', error);
    });

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();
  }
}
