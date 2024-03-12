/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import splitterConfig from 'config/splitterConfig';
import BudgetConfig from 'models/BudgetConfig';
import formatPrice from 'util/formatPrice';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { API, PostTransactionsWrapper, PutTransactionWrapper } from 'ynab';

const { apiKey, dryRun, verbose } = await yargs(hideBin(process.argv))
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
  .option('verbose', {
    alias: 'v',
    description: 'Run with verbose logging',
    type: 'boolean',
    default: false,
  })
  .demandOption('apiKey').argv;

const ynab = new API(apiKey);

if (dryRun) {
  console.log('Dry run: no changes will be made');
}

const duplicateTransactions = async (fromBudget: BudgetConfig, toBudget: BudgetConfig) => {
  const transactionsResponse = await ynab.transactions.getTransactions(fromBudget.id);
  const flaggedTransactions = transactionsResponse.data.transactions.filter(
    (transaction) => transaction.flag_color === fromBudget.flagBeforeSplit && transaction.subtransactions.length === 0, // Don't accidentally split a transaction that has already been split
  );

  if (verbose) {
    console.log(`Found ${flaggedTransactions.length} transactions to split in budget ${fromBudget.id} and move to budget ${toBudget.id}`);
  }

  for (const transaction of flaggedTransactions) {
    const updatedTransaction: PutTransactionWrapper = {
      transaction: {
        flag_color: fromBudget.flagAfterSplit,
        subtransactions: [
          {
            category_id: transaction.category_id,
            amount: transaction.amount / 2,
          },
          {
            category_id: fromBudget.splitCategoryId,
            amount: transaction.amount / 2,
          },
        ],
      },
    };

    // Duplicate that transaction in the other budget that is for half the amount
    const duplicatedTransaction: PostTransactionsWrapper = {
      transaction: {
        account_id: toBudget.sharedAccountId,
        date: transaction.date,
        amount: transaction.amount / 2,
        memo: transaction.memo,
        cleared: 'cleared',
        payee_name: transaction.payee_name,
        flag_color: toBudget.importedFlag,
      },
    };

    if (verbose) {
      console.log(
        `Splitting ${formatPrice(transaction.amount)} transaction to ${transaction.payee_name} into two ${formatPrice(transaction.amount / 2)} transactions`,
      );
    }

    if (dryRun) {
      console.log('Dry run: would update transaction', updatedTransaction);
      console.log('Dry run: would create transaction', duplicatedTransaction);
    } else {
      if (verbose) {
        console.log(`Updating transaction in budget ${toBudget.id}`, JSON.stringify(updatedTransaction));
      }
      await ynab.transactions.updateTransaction(fromBudget.id, transaction.id, updatedTransaction);
      if (verbose) {
        console.log(`Creating transaction in budget ${toBudget.id}`, JSON.stringify(duplicatedTransaction));
      }
      await ynab.transactions.createTransaction(toBudget.id, duplicatedTransaction);
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

await splitTransactions(splitterConfig[0], splitterConfig[1]);
