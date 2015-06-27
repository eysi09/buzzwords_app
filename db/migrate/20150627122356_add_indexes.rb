class AddIndexes < ActiveRecord::Migration
  def up
  	add_index :general_assemblies, :id, :unique => true
  	add_index :mps_x_general_assemblies, :mp_id
  	add_index :mps_x_general_assemblies, :general_assembly_id
  	add_index :mps_x_general_assemblies, :party
  	add_index :speeches, :date
  	add_index :speeches, :general_assembly_id
  	add_index :speeches, :mp_id
  	add_index :speeches, :party
  end

  def down
  	remove_index :general_assemblies, :name => 'index_id_on_general_assemblies'
  	remove_index :mps_x_general_assemblies, :name => 'index_mps_x_general_assemblies_on_mp_id'
  	remove_index :mps_x_general_assemblies, :name => 'index_mps_x_general_assemblies_on_general_assembly_id'
  	remove_index :mps_x_general_assemblies, :name => 'index_mps_x_general_assemblies_on_party'
  	remove_index :speeches, :name => 'index_speeches_on_date'
  	remove_index :speeches, :name => 'index_speeches_on_general_assembly_id'
  	remove_index :speeches, :name => 'index_speeches_on_mp_id'
  	remove_index :speeches, :name => 'index_speeches_on_party'
  end
end
