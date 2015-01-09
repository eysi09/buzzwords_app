class GeneralAssembly < ActiveRecord::Base

	attr_accessible :year_from, :year_to
	has_many :speeches

end