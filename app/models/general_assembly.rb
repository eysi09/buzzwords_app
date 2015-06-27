class GeneralAssembly < ActiveRecord::Base

  attr_accessible :year_from, :year_to, :id
  has_many :speeches
  has_and_belongs_to_many :mps, :join_table => :mps_x_general_assemblies

end