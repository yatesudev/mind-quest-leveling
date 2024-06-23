import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  HostListener,
  AfterViewInit,
} from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-lootbox',
  templateUrl: './lootbox.component.html',
  styleUrls: ['./lootbox.component.css'],
})
export class LootboxComponent implements OnInit, AfterViewInit {
  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private mixer!: THREE.AnimationMixer;
  private clock: THREE.Clock = new THREE.Clock();
  private controls!: OrbitControls;
  private model!: THREE.Group;

  ngOnInit() {}

  ngAfterViewInit() {
    this.initThreeJS();
    this.loadGLBModel();
    this.animate();
  }

  private initThreeJS() {
    // Renderer
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.setRendererSize();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(75, this.rendererContainer.nativeElement.clientWidth / this.rendererContainer.nativeElement.clientHeight, 0.1, 1000);
    this.camera.position.z = 5; // Adjust camera position if needed

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableRotate = true;
    this.controls.enableZoom = false; 
    this.controls.enablePan = false;

    this.controls.rotateSpeed = 0.5;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
    directionalLight.position.set(5, 5, 5).normalize();
    this.scene.add(directionalLight);

    // Handle window resize
    window.addEventListener('resize', this.onWindowResize.bind(this), false);
  }

  private setRendererSize() {
    this.renderer.setSize(this.rendererContainer.nativeElement.clientWidth, this.rendererContainer.nativeElement.clientHeight);
  }

  private loadGLBModel() {
    const loader = new GLTFLoader();
    const textureLoader = new THREE.TextureLoader();

    loader.load('assets/models/lootbox.glb', (gltf) => {
      const object = gltf.scene;
      this.adjustModelScale(object);
      object.position.y = -0.5;

      object.traverse((child: any) => {
        if (child.isMesh) {
          console.log('Mesh material', child.material);
        }
      });

      this.scene.add(object);
      this.model = object;

      // Set up animation mixer if animations are present
      if (gltf.animations && gltf.animations.length > 0) {
        this.mixer = new THREE.AnimationMixer(object);
        this.model['animations'] = gltf.animations;
      }
    }, (xhr) => {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    }, (error) => {
      console.error('An error happened', error);
    });
  }

  private adjustModelScale(object: THREE.Group) {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      object.scale.set(0.4, 0.4, 0.4);
    } else {
      object.scale.set(0.5, 0.5, 0.5);
    }
  }

  playAnimation() {
    console.log('playAnimation called');

    if (this.mixer && this.model && this.model['animations']) {
      console.log("play animation");

      this.mixer.stopAllAction();

      const action = this.mixer.clipAction(this.model['animations'][1]);
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;

      // Disable controls when animation starts
      this.controls.enabled = false;

      action.play();

      // Add event listener to re-enable controls when animation finishes
      this.mixer.addEventListener('finished', () => {
        this.controls.enabled = true;
      });
    } else {
      console.error('Cannot play animation: No animations found or mixer not initialized.');
    }
  }

  private animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();

    // Update animation mixer
    if (this.mixer) {
      this.mixer.update(delta);
    }

    // Update controls
    this.controls.update();

    // Render the scene
    this.renderer.render(this.scene, this.camera);
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.camera.aspect = this.rendererContainer.nativeElement.clientWidth / this.rendererContainer.nativeElement.clientHeight;
    this.camera.updateProjectionMatrix();
    this.setRendererSize();
  }
}
