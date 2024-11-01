# Ynab::Splitter 

## What does it do?
Share expenses across two budgets by splitting any transactions according to option 2 in https://support.ynab.com/en_us/splitwise-and-ynab-a-guide-H1GwOyuCq

Limitations (pull requests welcome!):
- Budgets must be accessible by one account
- This will not handle doing the math of who owes how much
- Cannot handle any transactions that have already been split

## Setup
TODO

## Installation

setup

```bash
npm ci
```

run tests

```bash
npm run test
```

## Usage
To run without actually changing any budgets:
`npm run splitter:dry`

To run and split transactions:
`npm run splitter`

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/taurheim/ynab-splitter.

## License

The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
