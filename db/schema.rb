# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20150627124529) do

  create_table "general_assemblies", :id => false, :force => true do |t|
    t.integer "id",                     :null => false
    t.string  "year_from", :limit => 4, :null => false
    t.string  "year_to",   :limit => 4
  end

  add_index "general_assemblies", ["id"], :name => "index_general_assemblies_on_id", :unique => true

  create_table "mps", :force => true do |t|
    t.string "name", :null => false
  end

  add_index "mps", ["name"], :name => "members_of_parliament_name_key", :unique => true

  create_table "mps_x_general_assemblies", :id => false, :force => true do |t|
    t.integer "mp_id",               :null => false
    t.integer "general_assembly_id", :null => false
    t.string  "party"
    t.string  "details"
  end

  add_index "mps_x_general_assemblies", ["general_assembly_id"], :name => "index_mps_x_general_assemblies_on_general_assembly_id"
  add_index "mps_x_general_assemblies", ["mp_id"], :name => "index_mps_x_general_assemblies_on_mp_id"
  add_index "mps_x_general_assemblies", ["party"], :name => "index_mps_x_general_assemblies_on_party"

  create_table "speeches", :force => true do |t|
    t.datetime "date",                :null => false
    t.integer  "mp_id",               :null => false
    t.integer  "general_assembly_id", :null => false
    t.string   "party"
    t.text     "content"
    t.string   "url"
    t.text     "word_freq"
  end

  add_index "speeches", ["date"], :name => "index_speeches_on_date"
  add_index "speeches", ["general_assembly_id"], :name => "index_speeches_on_general_assembly_id"
  add_index "speeches", ["mp_id"], :name => "index_speeches_on_mp_id"
  add_index "speeches", ["party"], :name => "index_speeches_on_party"

end
