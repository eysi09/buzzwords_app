class UpdateSpeechesWordCount < ActiveRecord::Migration
  def up
  	WordCountUtils.update_speeches_word_count
  end

  def down
  end
end
