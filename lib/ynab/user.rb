# frozen_string_literal: true

module Ynab
  class User
    attr_accessor :budget_id

    def initialize(budget_id:, ynab_client:)
      @budget_id = budget_id
      @ynab_client = ynab_client
    end

    def transactions
      transaction_response = @ynab_client.transactions.get_transactions(@budget_id)

      @transactions = transaction_response.data.transactions.select{|t| t.flag_color == "purple" } #&& t.date == Date.strptime(Date.today.to_s, '%Y-%m-%d') }
    end

    def create_inflow_transactions(transactions)

      transactions.each do |t| 
        data = {
          transaction: {
            date: Date.today,
            payee_name: 'A Test',
            memo: 'I was created through the API',
            cleared: 'Cleared',
            approved: false,
            flag_color: 'Blue',
            amount: 1
          }
        }

        begin
          binding.pry
          response = ynab.transactions.create_transaction(budget_id, data)
        rescue YNAB::ApiError => e
          puts "ERROR: id=#{e.id}; name=#{e.name}; detail: #{e.detail}"
        end
      end
    end
  end
end
