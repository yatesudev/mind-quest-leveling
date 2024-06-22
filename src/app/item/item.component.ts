// three-scene.component.ts
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrl: './item.component.css'
})
export class ItemComponent implements AfterViewInit  {
  @ViewChild('canvas') private canvasRef!: ElementRef;

  // Three.js variables
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private mesh!: THREE.Mesh;
  private controls!: OrbitControls;

  public itemName: string = this.itemService.getSelectedItem().name;

  constructor(private itemService: ItemService) {}

  ngAfterViewInit(): void {
    this.initThreeJS();
  }

   private initThreeJS(): void {

    console.log("item rarity ", this.itemService.getSelectedItem().rarityType);

    // Create the scene
    this.scene = new THREE.Scene();

    // Set up the camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;

    // Set up the renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.canvasRef.nativeElement.appendChild(this.renderer.domElement);

    // Set the background color of the scene
    const backgroundColor = 0x0f1d4b; // The color used in your materials

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
    //console.log("texture to load: ", `assets/images/items/${this.itemService.getSelectedItem().name}.png`);
    textureLoader.load(
      `assets/img/items/${this.itemService.getSelectedItem().name}.png`,
      (texture) => {
        const geometry = new THREE.BoxGeometry(2, 1, 0.1);

          // Create a canvas to draw the background color and the texture
          const canvas = document.createElement('canvas');
          canvas.width = texture.image.width;
          canvas.height = texture.image.height;

          const context = canvas.getContext('2d');
          if (context) {
            // Fill the canvas with the background color
            context.fillStyle = `#${backgroundColor.toString(16)}`;
            context.fillRect(0, 0, canvas.width, canvas.height);
  
            // Draw the texture on top of the background color
            context.drawImage(texture.image, 0, 0);
          }
  
          // Create a new texture from the canvas
          const combinedTexture = new THREE.CanvasTexture(canvas);
  
          const materials = [
            new THREE.MeshBasicMaterial({ color: backgroundColor }), // Right side
            new THREE.MeshBasicMaterial({ color: backgroundColor }), // Left side
            new THREE.MeshBasicMaterial({ color: backgroundColor }), // Top side
            new THREE.MeshBasicMaterial({ color: backgroundColor }), // Bottom side
            new THREE.MeshBasicMaterial({ map: combinedTexture }),   // Front side
            new THREE.MeshBasicMaterial({ map: combinedTexture })    // Back side
          ];

        this.mesh = new THREE.Mesh(geometry, materials);
        this.scene.add(this.mesh);

        this.scene.position.y = 1;

        this.scene.scale.set(0.6, 1.2, 1.2);

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

    // if (this.mesh) {
    //   // Rotate the mesh slowly around the Y-axis
    //   this.mesh.rotation.y += 0.01; // Adjust this value for desired speed
    // }

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
