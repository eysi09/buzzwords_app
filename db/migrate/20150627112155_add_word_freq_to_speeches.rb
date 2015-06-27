class AddWordFreqToSpeeches < ActiveRecord::Migration
  def up
  	add_column :speeches, :word_freq, :text
  end

  def down
  	remove_column :speeches, :word_freq, :text
  end
end
