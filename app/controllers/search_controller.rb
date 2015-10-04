class SearchController < ApplicationController

  layout 'application'

  def init_data
    ga_data_hash = DB[:general_assemblies]
      .left_join(:mps_x_general_assemblies,
        'general_assemblies.id = mps_x_general_assemblies.general_assembly_id')
      .group_by(:general_assemblies__id,
        :general_assemblies__year_from,
        :general_assemblies__year_to)
      .order_by(Sequel.asc(:general_assemblies__id))
      .select{[:general_assemblies__id,
        :general_assemblies__year_from,
        :general_assemblies__year_to,
        Sequel.as(array_agg(distinct(:mps_x_general_assemblies__mp_id)), :mp_ids),
        Sequel.as(array_agg(distinct(:mps_x_general_assemblies__party)), :parties)]}
      .all
      .inject({}) do |hash, data|
        hash[data[:id]] = data.except(:id)
        hash
      end

    parties_mps_hash = DB[:mps_x_general_assemblies]
      .group_by(:party)
      .select{[:party,
        Sequel.as(array_agg(distinct(:mps_x_general_assemblies__mp_id)), :mp_ids)]}
      .order_by(:party)
      .all
      .inject({}) do |hash, data|
        hash[data[:party]] = data[:mp_ids]
        hash
      end

    mps_name_hash = DB[:mps].select_hash(:id, :name)

    render :json => {
      ga_data_hash: ga_data_hash,
      parties_mps_hash: parties_mps_hash,
      mps_name_hash: mps_name_hash
    }
  end

  def query_server
    start_logging
    speeches = QueryUtils.get_speeches(make_query_params)
    end_logging
    render :json => {
      results: speeches
    }
  end

  def start_logging
    @t1 = Time.now
    Rails.logger.info '*******'
    Rails.logger.info 'Load starts...'
    Rails.logger.info '*******'
  end

  def end_logging
    t2 = Time.now
    Rails.logger.info '*******'
    Rails.logger.info 'Load ends...'
    Rails.logger.info "Time elapsed #{(t2-@t1).round(2)} sec"
    Rails.logger.info '*******'
  end

  def make_query_params
    {
     words:       params[:queryWords],
     gaids:       params[:gaids],
     partyids:    params[:partyids],
     mpids:       params[:mpids],
     chart_kind:  params[:chartKind],
     group_by:    params[:groupBy].to_sym,
     date_gran:   params[:dateGran] # nil for barchart
    }
  end

end

