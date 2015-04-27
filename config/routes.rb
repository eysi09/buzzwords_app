BuzzwordsApp::Application.routes.draw do

  # Search
  get '/search/init_data' => 'search#init_data'
  get '/search/query_server' => 'search#query_server'

  root to: 'search#index'
end
