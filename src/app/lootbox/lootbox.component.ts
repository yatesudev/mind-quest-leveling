import { Component, ElementRef, OnInit, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-lootbox',
  templateUrl: './lootbox.component.html',
  styleUrls: ['./lootbox.component.css']
})
export class LootboxComponent  implements OnInit, AfterViewInit {
  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;

  ngOnInit() {}

  ngAfterViewInit() {
    this.initThreeJS();
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
    this.camera.position.z = 5;

    // Add an object (Cube)
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);

    // Handle window resize
    window.addEventListener('resize', this.onWindowResize.bind(this), false);
  }

  private setRendererSize() {
    this.renderer.setSize(this.rendererContainer.nativeElement.clientWidth, this.rendererContainer.nativeElement.clientHeight);
  }

  private animate() {
    requestAnimationFrame(() => this.animate());

    // Rotation for demo purposes
    this.scene.children[0].rotation.x += 0.01;
    this.scene.children[0].rotation.y += 0.01;

    this.renderer.render(this.scene, this.camera);
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.camera.aspect = this.rendererContainer.nativeElement.clientWidth / this.rendererContainer.nativeElement.clientHeight;
    this.camera.updateProjectionMatrix();
    this.setRendererSize();
  }
}
