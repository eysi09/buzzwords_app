class AddWordFreqToSpeeches < ActiveRecord::Migration
  def up
  	add_column :speeches, :word_freq, :jsonb
  end

  def down
  	remove_column :speeches, :word_freq, :jsonb
  end
end
