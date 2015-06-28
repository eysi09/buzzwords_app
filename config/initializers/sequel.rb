db_config = Rails.configuration.database_configuration[Rails.env]

host = db_config['host'] || 'localhost'
db = db_config['database']
user = db_config['username']
password = db_config['password']

if db_config['which_ruby'] == 'ruby'
  config = "postgres://#{user}:#{password}@#{host}:/#{db}"
else # using jruby, for windows machine
  config = "jdbc:postgresql://#{host}/#{db}?user=#{user}&password=#{password}"
end

DB = Sequel::Model.db = Sequel.connect(config)
Sequel.default_timezone = :utc
DB.logger = Rails.logger
DB.extension :pg_array, :pg_json