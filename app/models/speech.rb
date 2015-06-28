class Speech < ActiveRecord::Base

  attr_accessible :date, :mp, :general_assembly, :party, :content, :url, :word_freq
  belongs_to :member_of_parliament
  belongs_to :general_assembly
  serialize :word_freq, JSON

end