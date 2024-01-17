# frozen_string_literal: true

# !/usr/bin/env ruby

require_relative "splitter/version"
require_relative "user"
require "optparse"
require "date"
require "ynab"
require "pry"

access_token = "nice try"
ynab_client = YNAB::API.new(access_token)

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

api_key = options[:key]
transaction_date = DateTime.now.prev_day.strftime("%Y-%m-%d")

puts "Splitting transactions for #{transaction_date}"

if options[:verbose]
  puts "Running with verbose command line param"
  puts "Transaction Date: #{transaction_date}"
end

puts "Running with --dry command line param. No new transactions will be created" if options[:dry]

# TODO: Store these in config somewhere
first_budget = {
  id: "225d1ff4-ab34-418c-992d-280d40edacce",
  newTransactionFlagColor: "purple",
  parsedTransactionFlagColor: "green"
}

second_budget = {
  id: "secondbudgetid",
  newTransactionFlagColor: "purple",
  parsedTransactionFlagColor: "green"
}

puts "First budget id: #{first_budget[:id]}"

#maybe this should actually be a budget wrapper, not sure yet. calling it user for now tho
user_a = Ynab::User.new(budget_id: first_budget[:id], ynab_client: ynab_client)
binding.pry
transactions_to_process = user_a.transactions

user_a.create_inflow_transactions(transactions_to_process)
