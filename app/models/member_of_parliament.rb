class MemberOfParliament < ActiveRecord::Base

	attr_accessible :name
	has_many :speeches

end