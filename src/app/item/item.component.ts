import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements AfterViewInit {
  @ViewChild('canvas') private canvasRef!: ElementRef;

  // Three.js variables
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private mesh!: THREE.Mesh;
  private controls!: OrbitControls;

  public itemName: string = this.itemService.getSelectedItem().name;
  public itemRarity: string = this.itemService.rarityTypeIdtoRarityName(this.itemService.getSelectedItemRarity());

  constructor(private itemService: ItemService) {}

  ngAfterViewInit(): void {
    this.initThreeJS();
  }

  private initThreeJS(): void {

    // Create the scene
    this.scene = new THREE.Scene();

    // Set up the camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;

    // Set up the renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.canvasRef.nativeElement.appendChild(this.renderer.domElement);

    // Initialize OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableZoom = false; 
    this.controls.enablePan = false;
    this.controls.enableRotate = true;

    // Restrict rotation to only horizontal (no vertical rotation)
    this.controls.minPolarAngle = Math.PI / 2; // Minimum vertical angle
    this.controls.maxPolarAngle = Math.PI / 2; // Maximum vertical angle

    // Load the texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      `assets/img/items/${this.itemService.getSelectedItem().name}.png`,
      (texture) => {
        const geometry = new THREE.PlaneGeometry(2, 1);

        const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.mesh);

        this.mesh.position.y = 1;
        this.mesh.scale.set(0.6, 1.2, 1.2);

        // Render the scene
        this.animate();
      },
      undefined,
      (error) => {
        console.error('An error occurred loading the texture:', error);
      }
    );
  }

  private animate = () => {
    requestAnimationFrame(this.animate);

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
