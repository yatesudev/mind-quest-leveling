import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ItemService } from '../item.service';
import { Item, InventoryItem } from '../item.model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
})
export class InventoryComponent implements OnInit {
  itemList: Item[] = [];
  inventory: InventoryItem[] = [];
  isDataLoaded: boolean = false; // Flag to track if both items and inventory are loaded

  constructor(private itemService: ItemService, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loadItems();
    this.loadInventory();
  }

  loadItems() {
    this.itemService.getItems().subscribe((data) => {
      this.itemList = data;
      this.checkDataLoadStatus();
    });
  }

  loadInventory() {
    let userId = this.authService.getUserId();

    if (!userId) {
      return;
    }

    this.itemService.getInventory(userId).subscribe(
      (data) => {
        if (Array.isArray(data)) {
          this.inventory = data; // Assuming 'inventory' is an array of InventoryItem
          console.log('Inventory:', this.inventory);
        } else {
          console.error('Invalid inventory data format:', data);
        }
        this.checkDataLoadStatus();
      },
      (error) => {
        console.error('Failed to load inventory:', error);
        // Optionally handle error display or retry logic here
        this.checkDataLoadStatus(); // Ensure data load status is checked even on error
      }
    );
  }

  checkDataLoadStatus() {
    if (this.itemList.length > 0 && this.inventory.length > 0) {
      console.log('Data loaded successfully');
      this.isDataLoaded = true;
    }
  }

  getItemDetails(itemId: number): Item | undefined {
    return this.itemList.find(item => item.id === itemId);
  }

  getItemImage(itemId: number): string {
    const item = this.getItemDetails(itemId);
    return item ? `assets/images/items/${item.name}.png` : '';
  }

  onItemClicked(item: any): void {
    const itemName = this.getItemDetails(item.itemId);
    this.itemService.setSelectedItem(itemName);
    this.router.navigate(['/itemview']);
  }
}
