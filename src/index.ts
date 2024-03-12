/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import splitterConfig from 'config/splitterConfig';
import BudgetConfig from 'models/BudgetConfig';
import formatPrice from 'util/formatPrice';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { API, PostTransactionsWrapper, PutTransactionWrapper } from 'ynab';

const { apiKey, dryRun } = await yargs(hideBin(process.argv))
  .option('dry-run', {
    alias: 'd',
    description: 'Dry run, do not actually make any changes',
    type: 'boolean',
    default: false,
  })
  .option('apiKey', {
    alias: 'k',
    description: 'YNAB API key',
    type: 'string',
  })
  .demandOption('apiKey').argv;

const ynab = new API(apiKey);

if (dryRun) {
  console.log('Dry run: no changes will be made');
}

const duplicateTransactions = async (fromBudget: BudgetConfig, toBudgetId: BudgetConfig) => {
  const transactionsResponse = await ynab.transactions.getTransactions(fromBudget.id);
  const flaggedTransactions = transactionsResponse.data.transactions.filter((transaction) => transaction.flag_color === fromBudget.flagBeforeSplit);

  console.log(`Found ${flaggedTransactions.length} transactions to split in budget ${fromBudget.id} and move to budget ${toBudgetId.id}`);

  for (const transaction of flaggedTransactions) {
    // Modify the original transaction to be half as well
    const updatedTransaction: PutTransactionWrapper = {
      transaction: {
        amount: transaction.amount / 2,
        flag_color: fromBudget.flagAfterSplit,
      },
    };

    // Duplicate that transaction in the other budget that is for half the amount
    const duplicatedTransaction: PostTransactionsWrapper = {
      transaction: {
        date: transaction.date,
        amount: transaction.amount / 2,
        memo: transaction.memo,
        cleared: 'cleared',
        payee_name: transaction.payee_name,
        flag_color: toBudgetId.importedFlag,
      },
    };

    console.log(
      `Splitting ${formatPrice(transaction.amount)} transaction to ${transaction.payee_name} into two ${formatPrice(transaction.amount / 2)} transactions`,
    );

    if (dryRun) {
      console.log('Dry run: would update transaction', updatedTransaction);
      console.log('Dry run: would create transaction', duplicatedTransaction);
    } else {
      await ynab.transactions.updateTransaction(fromBudget.id, transaction.id, updatedTransaction);
      await ynab.transactions.createTransaction(toBudgetId.id, duplicatedTransaction);
    }
  }
};

const splitTransactions = async (budget1: BudgetConfig, budget2: BudgetConfig) => {
  try {
    await duplicateTransactions(budget1, budget2);
    await duplicateTransactions(budget2, budget1);
  } catch (e) {
    console.error(e);
  }
};

splitTransactions(splitterConfig[0], splitterConfig[1]);
