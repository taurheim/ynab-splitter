# frozen_string_literal: true

RSpec.describe Ynab::Splitter do
  it "has a version number" do
    expect(Ynab::Splitter::VERSION).not_to be nil
  end

  describe "#split" do
    it "returns true" do
      expect(subject.split).to eq(true)
    end
  end
end
