BuzzwordsApp::Application.routes.draw do

  # Search
  get '/search/query_server' => 'search#query_server'

  root to: 'search#index'
end
