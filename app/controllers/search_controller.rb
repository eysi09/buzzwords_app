class SearchController < ApplicationController

  layout 'application'

  def index
  end

  def query_server
  	render :json => {
  		results: WordCountUtils.who_said(params[:search_string])
  	}
  end

end

