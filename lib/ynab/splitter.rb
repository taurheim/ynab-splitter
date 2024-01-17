# frozen_string_literal: true

module Ynab
  class Splitter
    class Error < StandardError; end

    def split(transaction); end

    def create_transaction(budget, amount, payee); end
  end
end
