source 'https://rubygems.org'

gem 'rails', '3.2.19'
# Couldn't install the pg gem on windows
if RbConfig::CONFIG['target_os'] == 'mswin32'
gem 'jdbc-postgres'
  gem 'activerecord-jdbc-adapter'
else
  gem 'pg'
end
#gem 'jquery-rails'
gem 'sequel'
#gem 'react-rails'
gem 'normalize-rails'
gem 'bootstrap-sass', '~> 3.3.4'
gem 'autoprefixer-rails'
gem 'sass-rails', '>= 3.2'
gem 'unicode'

# Gems used only for assets and not required
# in production environments by default.
group :assets do
  gem 'uglifier', '>= 1.0.3'
end


group :development, :test do
  gem 'awesome_print'
  gem 'interactive_editor'
  gem 'rspec'
  gem 'rspec-rails'
  gem 'pry-rails'
end
