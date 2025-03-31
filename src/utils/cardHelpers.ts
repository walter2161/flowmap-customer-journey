
/**
 * Helper functions for FlowCard component
 * This file provides utility functions that might be needed by FlowCard.tsx
 */

// Helper class that might be used in FlowCard.tsx
export class CardUtility {
  constructor(initialValue: any = null) {
    // Ensure constructor can be called with or without arguments
    this.value = initialValue;
  }

  private value: any;

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
