/**
 * API response contract
 * (must match frontend IWord)
 */
export interface WordDTO {
  word: string;
  diacritic: string;
  meaning: string;
  explanation: string;
  example: string;
  category: string;
  rarity: number;
}

/**
 * Internal backend entity
 */
export interface WordEntity extends WordDTO {
  isApproved: boolean;
  createdBy?: string;
}
