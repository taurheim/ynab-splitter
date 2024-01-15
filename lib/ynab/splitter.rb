# frozen_string_literal: true

require_relative "splitter/version"
require "optparse"
require "date"

options = {}
OptionParser.new do |opts|
  opts.banner = "Usage: example.rb [options]"

  opts.on("-v", "--[no-]verbose", "Run verbosely") do |v|
    options[:verbose] = v
  end

  opts.on("-kKEY", "--key=KEY", "YNAB API Key") do |k|
    options[:key] = k
  end

  opts.on("-d", "--dry", "Dry run / don't create any transactions") do |d|
    options[:dry] = d
  end
end.parse!

ApiKey = options[:key]
TransactionDate = DateTime.now.prev_day.strftime("%Y-%m-%d")

puts "Splitting transactions for #{TransactionDate}"

if options[:verbose]
  puts "Running with verbose command line param"
  puts "Transaction Date: #{TransactionDate}"
end

if options[:dry]
  puts "Running with --dry command line param. No new transactions will be created"
end

# TODO: Store these in config somewhere
FirstBudget = {
  id: 'firstbudgetid',
  newTransactionFlagColor: 'purple',
  parsedTransactionFlagColor: 'green',
}

SecondBudget = {
  id: 'secondbudgetid',
  newTransactionFlagColor: 'purple',
  parsedTransactionFlagColor: 'green',
}

puts "First budget id: #{FirstBudget[:id]}"

module Ynab
  module Splitter
    class Error < StandardError; end
    def split
      true
    end
  end
end

