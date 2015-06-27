class Mp < ActiveRecord::Base

  attr_accessible :name
  has_many :speeches
  has_and_belongs_to_many :general_assemblies, :join_table => :mps_x_general_assemblies

end