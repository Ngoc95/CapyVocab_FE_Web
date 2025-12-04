import { create } from 'zustand';
import { CartItem, UserProgress, ReviewItem } from '../types';
import { mockReviewItems } from './mockData';

interface AppStore {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (folderId: string) => void;
  clearCart: () => void;
  
  userProgress: UserProgress[];
  updateProgress: (progress: UserProgress) => void;
  
  reviewItems: ReviewItem[];
  updateReviewItem: (item: ReviewItem) => void;
  getItemsDueForReview: () => ReviewItem[];
  
  purchasedFolders: string[];
  purchaseFolder: (folderId: string) => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  cart: [],
  addToCart: (item) => set((state) => {
    const existingItem = state.cart.find((i) => i.folder.id === item.folder.id);
    if (existingItem) {
      return {
        cart: state.cart.map((i) =>
          i.folder.id === item.folder.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    }
    return { cart: [...state.cart, item] };
  }),
  removeFromCart: (folderId) => set((state) => ({
    cart: state.cart.filter((item) => item.folder.id !== folderId),
  })),
  clearCart: () => set({ cart: [] }),
  
  userProgress: [],
  updateProgress: (progress) => set((state) => {
    const existingIndex = state.userProgress.findIndex((p) => p.folderId === progress.folderId);
    if (existingIndex >= 0) {
      const updated = [...state.userProgress];
      updated[existingIndex] = progress;
      return { userProgress: updated };
    }
    return { userProgress: [...state.userProgress, progress] };
  }),
  
  reviewItems: mockReviewItems,
  updateReviewItem: (item) => set((state) => ({
    reviewItems: state.reviewItems.map((i) =>
      i.flashcardId === item.flashcardId && i.folderId === item.folderId ? item : i
    ),
  })),
  getItemsDueForReview: () => {
    const now = new Date();
    return get().reviewItems.filter((item) => item.nextReview <= now);
  },
  
  purchasedFolders: ['f1', 'f2'], // Free folders
  purchaseFolder: (folderId) => set((state) => ({
    purchasedFolders: [...state.purchasedFolders, folderId],
  })),
}));
