import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ItemService } from '../item.service';
import { Item, InventoryItem } from '../item.model';
import { AuthService } from '../auth.service';

// Defines the InventoryComponent with its metadata
@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
})
export class InventoryComponent implements OnInit {
  itemList: Item[] = []; // List of all items
  inventory: InventoryItem[] = []; // User's inventory items
  isDataLoaded: boolean = false; // Flag to check if data is loaded

  // Constructor for the dependencies of the InventoryComponent
  constructor(
    private itemService: ItemService,
    private authService: AuthService,
    private router: Router
  ) {}

  // Lifecycle hook called when the component initializes
  ngOnInit() {
    this.loadItems(); // Load all items
    this.loadInventory(); // Load user's inventory
  }

  // Calculates the total number of items in the inventory
  getCountedAmount() {
    let num = 0;

    this.inventory.forEach((item) => {
      num += 1;
    });

    return num;
  }

  // Loads all items from the ItemService
  loadItems() {
    this.itemService.getItems().subscribe((data) => {
      this.itemList = data;
      this.checkDataLoadStatus(); // Check if all data is loaded
    });
  }

  // Loads the user's inventory from the ItemService
  loadInventory() {
    let userId = this.authService.getUserId();

    if (!userId) {
      return;
    }

    this.itemService.getInventory(userId).subscribe(
      (data) => {
        if (Array.isArray(data)) {
          this.inventory = data;
        } else {
          console.error('Invalid inventory data format:', data);
        }
        this.checkDataLoadStatus(); // Check if all data is loaded
      },
      (error) => {
        console.error('Failed to load inventory:', error);
        this.checkDataLoadStatus(); // Check if all data is loaded
      }
    );
  }

  // Checks if both items and inventory data are loaded
  checkDataLoadStatus() {
    if (this.itemList.length > 0 && this.inventory.length > 0) {
      this.isDataLoaded = true;
    }
  }

  // Gets the details of an item by its ID
  getItemDetails(itemId: number): Item | undefined {
    return this.itemList.find((item) => item.id === itemId);
  }

  // Returns the image URL for an item by its ID
  getItemImage(itemId: number): string {
    const item = this.getItemDetails(itemId);
    return item ? `assets/images/items/${item.name}.png` : '';
  }

  // Handles the event when an item is clicked
  onItemClicked(item: any): void {
    const itemName = this.getItemDetails(item.itemId);
    this.itemService.setSelectedItem(itemName); // Set the selected item
    this.itemService.setSelectedItemRarity(item.rarity); // Set the item rarity
    this.router.navigate(['/itemview']); // Navigate to the item view page
  }

  // Sorting function to sort items by their rarity
  sortItemsByRarity() {
    this.inventory.sort((a, b) => {
      return a.rarity - b.rarity;
    });
  }

  // Sorting function to sort items by their quantity
  sortItemsByQuantity() {
    this.inventory.sort((a, b) => {
      return b.quantity - a.quantity;
    });
  }

  // Function to randomize items in the inventory
  randomizeItems() {
    for (let i = this.inventory.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.inventory[i], this.inventory[j]] = [
        this.inventory[j],
        this.inventory[i],
      ];
    }
  }
}