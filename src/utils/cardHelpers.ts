
// Utility class for card operations
export class CardUtility {
  private initialValue: any;

  constructor(initialValue?: any) {
    this.initialValue = initialValue;
  }

  // Add utility methods here as needed
  getValue() {
    return this.initialValue;
  }
}

// Export utility functions
export const createCardUtility = (initialValue?: any) => {
  return new CardUtility(initialValue);
};
