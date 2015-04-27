class SearchController < ApplicationController

  layout 'application'

  def init_data
    render :json => {
      general_assemblies: ['a', 'b'],
      parties: ['1','2'],
      mps: ['doddi', 'eysi']
    }
  end

  def query_server
    render :json => {
      results: WordCountUtils.who_said(params[:search_string])
    }
  end

end

