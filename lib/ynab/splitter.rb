# frozen_string_literal: true

require_relative "splitter/version"

module Ynab
  module Splitter
    class Error < StandardError; end
    
    def split
      true
    end
  end
end
