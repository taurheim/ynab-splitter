# frozen_string_literal: true

require_relative "splitter/version"
require "optparse"

options = {}
OptionParser.new do |opts|
  opts.banner = "Usage: example.rb [options]"

  opts.on("-v", "--[no-]verbose", "Run verbosely") do |v|
    options[:verbose] = v
  end

  opts.on("-kKEY", "--key=KEY", "YNAB API Key") do |k|
    options[:key] = k
  end
end.parse!

puts "Hello World!"

if options[:verbose]
  puts "Running with verbose command line param"
  puts "YNAB API Key: #{options[:key]}"
end


module Ynab
  module Splitter
    class Error < StandardError; end
    def split
      true
    end
  end
end

