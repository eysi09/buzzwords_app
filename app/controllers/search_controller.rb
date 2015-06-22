class SearchController < ApplicationController

  layout 'application'

  def init_data
    ga_data_hash = DB[:general_assemblies]
      .left_join(:members_of_parliament_x_general_assemblies,
        'general_assemblies.ordinal = members_of_parliament_x_general_assemblies.general_assembly_id')
      .group_by(:general_assemblies__ordinal,
        :general_assemblies__year_from,
        :general_assemblies__year_to)
      .order_by(Sequel.asc(:general_assemblies__ordinal))
      .select{[:general_assemblies__ordinal,
        :general_assemblies__year_from,
        :general_assemblies__year_to,
        Sequel.as(array_agg(distinct(:members_of_parliament_x_general_assemblies__member_of_parliament_id)), :mp_ids),
        Sequel.as(array_agg(distinct(:members_of_parliament_x_general_assemblies__party)), :parties)]}
      .all
      .inject({}) do |hash, data|
        hash[data[:ordinal]] = data.except(:ordinal)
        hash
      end

    parties_mps_hash = DB[:members_of_parliament_x_general_assemblies]
      .group_by(:party)
      .select{[:party,
        Sequel.as(array_agg(distinct(:members_of_parliament_x_general_assemblies__member_of_parliament_id)), :mp_ids)]}
      .order_by(:party)
      .all
      .inject({}) do |hash, data|
        hash[data[:party]] = data[:mp_ids]
        hash
      end

    mps_name_hash = DB[:members_of_parliament].select_hash(:id, :name)

    render :json => {
      ga_data_hash: ga_data_hash,
      parties_mps_hash: parties_mps_hash,
      mps_name_hash: mps_name_hash
    }
  end

  def query_server
    render :json => {
      results: WordCountUtils.who_said(params[:search_string])
    }
  end

end

