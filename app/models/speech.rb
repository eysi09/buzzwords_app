class Speech < ActiveRecord::Base

	attr_accessible :date, :member_of_parliament, :general_assembly, :party, :content, :url
	belongs_to :member_of_parliament
	belongs_to :general_assembly

end