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

ActiveRecord::Schema.define(:version => 0) do

  create_table "general_assemblies", :id => false, :force => true do |t|
    t.integer "ordinal",                :null => false
    t.string  "year_from", :limit => 4, :null => false
    t.string  "year_to",   :limit => 4
  end

  create_table "members_of_parliament", :force => true do |t|
    t.string "name", :null => false
  end

  add_index "members_of_parliament", ["name"], :name => "members_of_parliament_name_key", :unique => true

  create_table "members_of_parliament_x_general_assemblies", :id => false, :force => true do |t|
    t.integer "member_of_parliament_id", :null => false
    t.integer "general_assembly_id",     :null => false
    t.string  "party"
    t.string  "details"
  end

  create_table "speeches", :force => true do |t|
    t.datetime "date",                    :null => false
    t.integer  "member_of_parliament_id", :null => false
    t.integer  "general_assembly_id",     :null => false
    t.string   "party"
    t.text     "content"
    t.string   "url"
  end

end
