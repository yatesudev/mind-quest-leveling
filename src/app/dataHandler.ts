export interface Character {
    stats: { [key: string]: string }; // Object of strings for stats
    class: string;
    level: number;
  }
  
let characterData: Character | null = null;

export function setCharacterData(character: Character): void {
  characterData = character;
}

export function getCharacterData(): Character | null {
  return characterData;
}

export function updateCharacterData(updatedCharacter: Partial<Character>): void {
  if (characterData) {
    characterData = { ...characterData, ...updatedCharacter };
  }
}
  