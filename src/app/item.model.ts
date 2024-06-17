// item.model.ts
export interface Item {
    id: number;
    name: string;
    description: string;
    quantity: number;
}
  
export interface InventoryItem {
  itemId: number;
  quantity: number;
  rarity: number;
}