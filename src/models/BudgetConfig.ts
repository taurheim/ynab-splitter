import { TransactionFlagColor } from 'ynab';

type BudgetConfig = {
  /**
   * Budget id can be found in the ynab url when you open the budget in the browser
   */
  id: string;

  /**
   * The color of the flag that will be set before the transaction is split.
   * This is what you should set new transactions to if you want them to be split.
   */
  flagBeforeSplit: TransactionFlagColor;

  /**
   * The color of the flag that will be set after the transaction is split.
   */
  flagAfterSplit: TransactionFlagColor;

  /**
   * The flag color of transactions imported from the other budget
   */
  importedFlag: TransactionFlagColor;
};

export default BudgetConfig;
