
/**
 * Helper functions for FlowCard component
 * This file provides utility functions that might be needed by FlowCard.tsx
 */

// Helper class that might be used in FlowCard.tsx
export class CardUtility {
  private value: any;

  constructor(initialValue?: any) {
    // Make constructor parameter optional to allow calling without arguments
    this.value = initialValue ?? null;
  }

  // Add methods that might be used in FlowCard.tsx
  getValue() {
    return this.value;
  }

  setValue(newValue: any) {
    this.value = newValue;
    return this;
  }
}

// Helper function to safely create instances
export function createCardUtility(initialValue?: any) {
  return new CardUtility(initialValue);
}

// This provides a function that doesn't need 'new' keyword
export function createDefaultCard(type: string, title: string = '') {
  return {
    type,
    title,
    content: '',
    description: '',
    // Add other default properties as needed
  };
}
