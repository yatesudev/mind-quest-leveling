import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {Item, InventoryItem} from './item.model';
import { environment } from './environment';
import { map } from 'rxjs/operators';




@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private apiUrl = environment.apiUrl;
  private selectedItem: any;

  private itemList = [
    { "id": 0, "name": "Alune", "description": "An angelic furball who creates chaos but is oddly terrified of Max. Who is Max?"},
    { "id": 1, "name": "Jelly", "description": "Wobbles more than your Aunt Sally at a family dance-off" },
    { "id": 2, "name": "Chicken", "description": "Clucks its way into your heart, one peck at a time" },
    { "id": 3, "name": "Burger", "description": "So juicy, even vegans dream about it"},
    { "id": 4, "name": "Pancakes", "description": "Stacked higher than your weekend laundry pile"},
    { "id": 5, "name": "Gummybear", "description": "The bear thats sweeter than your ex ever was"},
    { "id": 6, "name": "Sword", "description": "Sharp enough to slice through your to-do list"},
    { "id": 7, "name": "Bow", "description": "Because sometimes you need to give life a little more string and zing"},
    { "id": 8, "name": "Wood", "description": "The perfect fuel for your campfire stories and marshmallows"},
    { "id": 9, "name": "Dragonslayer", "description": "Because regular swords are for slaying boredom, not dragons"},
    { "id": 10, "name": "Ring", "description": "One ring to rule them all, or at least look fabulous"},
    { "id": 11, "name": "Helm", "description": "For when bad hair days become legendary quests"},
    { "id": 12, "name": "Book", "description": "Contains more secrets than your middle school diary"},
    { "id": 13, "name": "Coin", "description": "Shinier than your last gold star in kindergarten"},
    { "id": 14, "name": "Arrow", "description": "Cupids got nothing on this pointy fellow"},
    { "id": 15, "name": "Fish", "description": "Goes swimmingly with chips, or just a good chat"},
    { "id": 16, "name": "Crystal", "description": "Shinier than a unicorns dream journal"},
    { "id": 17, "name": "Banana", "description": "The only fruit with its own slip-and-slide feature"},
    { "id": 18, "name": "Hat", "description": "Makes you look cool, even when you are definitely not"},
    { "id": 19, "name": "Key", "description": "Unlocks everything except your true potential"},
    { "id": 20, "name": "Skull", "description": "A heads-up that you should probably run"},
    { "id": 21, "name": "Shield", "description": "Protects against more than just harsh criticism"},
    { "id": 22, "name": "Scroll", "description": "Unfurls your destiny, or just a really long grocery list"},
    { "id": 23, "name": "Potion", "description": "Bottled mystery and questionable flavors"},
    { "id": 24, "name": "Necklace", "description": "Adds bling to your life, and neck pain if too heavy"},
    { "id": 25, "name": "Max", "description": "The cat, the myth, the legend, or just a cat on roids"},
  ];

  private rarityList = [
    { "id": 1, "name": "Common", "dropChance": 0.5 },
    { "id": 2, "name": "Uncommon", "dropChance": 0.3 },
    { "id": 3, "name": "Rare", "dropChance": 0.15 },
    { "id": 4, "name": "Epic", "dropChance": 0.04 },
    { "id": 5, "name": "Legendary", "dropChance": 0.01 }
  ];

  constructor(private http: HttpClient) {}

  getItems(): Observable<any[]> {
    return of(this.itemList);
  }

  getRandomItemId(): number {
    return Math.floor(Math.random() * this.itemList.length);
  }

  getRandomRarity(): number {
    const randomChance = Math.random();
    let cumulativeChance = 0;
  
    for (let i = 0; i < this.rarityList.length; i++) {
      cumulativeChance += this.rarityList[i].dropChance;
      if (randomChance <= cumulativeChance) {
        return this.rarityList[i].id;
      }
    }
  
    // Fallback, should never reach here
    return this.rarityList[this.rarityList.length - 1].id;
  }
  

  getInventory(userId: string): Observable<InventoryItem[]> {
    return this.http.get<{ inventory: InventoryItem[] }>(`${this.apiUrl}/inventory/${userId}`)
      .pipe(
        map(response => response.inventory)
      );
  }

  updateInventory(userId: string, inventory: InventoryItem[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/inventory/${userId}`, { inventory });
  }

  //add PlayerItem with rarity
  addItemToInventory(userId: string, itemId: number, rarity: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/inventory/${userId}/add-item`, { itemId, rarity });
  } 
  
  setSelectedItem(item: any): void {
    this.selectedItem = item;
    console.log('Item selected:', this.selectedItem );  
  }

  getSelectedItem(): any {
    return this.selectedItem;
  }
}
