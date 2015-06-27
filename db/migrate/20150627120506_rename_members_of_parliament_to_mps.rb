class RenameMembersOfParliamentToMps < ActiveRecord::Migration
  def up
  	rename_table :members_of_parliament, :mps
  	rename_table :members_of_parliament_x_general_assemblies, :mps_x_general_assemblies
  	rename_column :mps_x_general_assemblies, :member_of_parliament_id, :mp_id
  	rename_column :speeches, :member_of_parliament_id, :mp_id
  	rename_column :general_assemblies, :ordinal, :id
  end

  def down
  	rename_column :speeches, :mp_id, :member_of_parliament_id
  	rename_column :mps_x_general_assemblies, :mp_id, :member_of_parliament_id
  	rename_table :mps_x_general_assemblies, :members_of_parliament_x_general_assemblies
  	rename_table :mps, :members_of_parliament
  	rename_column :general_assemblies, :id, :ordinal
  end
end
