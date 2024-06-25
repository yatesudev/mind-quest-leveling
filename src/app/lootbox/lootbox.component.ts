import { Component, ElementRef, OnInit, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { switchMap } from 'rxjs/operators';
import { ItemService } from '../item.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CharacterService } from '../character.service';
import { Item } from '../item.model';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

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

  private itemList: Item[] = [];
  lootboxes: number = 0;

  private randomItemId: any;
  private randomRarity: any;

  constructor(
    private itemService: ItemService,
    private authService: AuthService,
    private router: Router,
    private characterService: CharacterService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.itemService.getItems().subscribe((data) => {
      this.itemList = data;
      console.log('Item list:', this.itemList);
    });

    this.checkLootboxes();
  }

  ngAfterViewInit() {
    this.initThreeJS();
    this.loadGLBModel();
    this.animate();
  }

  private checkLootboxes() {
    const userId = this.authService.getUserId();

    if (!userId) {
      return;
    }

    this.characterService.getUserLootboxes(userId).subscribe(
      (response) => {
        this.lootboxes = response.lootboxes;
      },
      (error) => {
        console.error('Failed to fetch lootboxes', error);
        this.lootboxes = 0; // Default to 0 if there's an error
      }
    );
  }

  private initThreeJS() {
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.setRendererSize();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, this.rendererContainer.nativeElement.clientWidth / this.rendererContainer.nativeElement.clientHeight, 0.1, 1000);
    this.camera.position.z = 5;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableRotate = true;
    this.controls.enableZoom = false;
    this.controls.enablePan = false;
    this.controls.rotateSpeed = 0.5;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
    directionalLight.position.set(5, 5, 5).normalize();
    this.scene.add(directionalLight);

    window.addEventListener('resize', this.onWindowResize.bind(this), false);
  }

  private setRendererSize() {
    this.renderer.setSize(this.rendererContainer.nativeElement.clientWidth, this.rendererContainer.nativeElement.clientHeight);
  }

  private loadGLBModel() {
    const loader = new GLTFLoader();

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
    if (this.mixer && this.model && this.model['animations']) {
      this.mixer.stopAllAction();

      const action = this.mixer.clipAction(this.model['animations'][1]);
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;

      this.controls.enabled = false;

      action.play();

      this.mixer.addEventListener('finished', () => {
        this.controls.enabled = true;
        this.openLootbox();
      });
    } else {
      console.error('Cannot play animation: No animations found or mixer not initialized.');
    }
  }

  public openLootbox() {
    this.randomItemId = this.itemService.getRandomItemId();
    this.randomRarity = this.itemService.getRandomRarity();

    const userId = this.authService.getUserId();

    if (!userId) {
      return;
    }

    this.characterService.removeLootbox(userId).pipe(
      switchMap(() => {
        return this.itemService.addItemToInventory(userId, this.randomItemId, this.randomRarity);
      })
    ).subscribe(
      () => {
        this.itemService.setSelectedItem(this.itemList[this.randomItemId]);
        this.itemService.setSelectedItemRarity(this.randomRarity);
        this.router.navigate(['/itemview']);
      },
      (error: any) => {
        console.error('Failed to remove lootbox or add item to inventory', error);
        this.toastr.error('Failed to change class. Please try again.');
        // Handle error scenarios here
      }
    );
    
  }

  private animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();

    if (this.mixer) {
      this.mixer.update(delta);
    }

    this.controls.update();

    this.renderer.render(this.scene, this.camera);
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.camera.aspect = this.rendererContainer.nativeElement.clientWidth / this.rendererContainer.nativeElement.clientHeight;
    this.camera.updateProjectionMatrix();
    this.setRendererSize();
  }
}
