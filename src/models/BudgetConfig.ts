import { TransactionFlagColor } from 'ynab';

type BudgetConfig = {
  /**
   * Budget id can be found in the ynab url when you open the budget in the browser
   */
  id: string;

  /**
   * This is the id of the "credit card" account used for imported transactions.
   * This is visible in the url when you open it in the browser.
   */
  sharedAccountId: string;

  /**
   * Id of the category which half the expense is assigned to.
   * Easiest way to pull this id is with the API: https://api.ynab.com/v1#/Categories/getCategories
   */
  splitCategoryId: string;

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
