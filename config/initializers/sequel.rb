db_config = Rails.configuration.database_configuration[Rails.env]

host = db_config['host'] || 'localhost'
db = db_config['database']
user = db_config['username']
password = db_config['password']

config = "jdbc:postgresql://#{host}/#{db}?user=#{user}&password=#{password}"

DB = Sequel::Model.db = Sequel.connect(config)
Sequel.default_timezone = :utc
DB.logger = Rails.logger
