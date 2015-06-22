class SearchController < ApplicationController

  layout 'application'

  def init_data
    ga_data_hash = DB[:general_assemblies]
      .left_join(
        DB[:members_of_parliament_x_general_assemblies]
          .left_join(:members_of_parliament,
          'members_of_parliament.id = members_of_parliament_x_general_assemblies.member_of_parliament_id'),
        'general_assemblies.ordinal = mps.general_assembly_id',
        :table_alias => :mps)
      .group_by(:general_assemblies__ordinal,
        :general_assemblies__year_from,
        :general_assemblies__year_to)
      .order_by(Sequel.desc(:general_assemblies__ordinal))
      .select{[:general_assemblies__ordinal,
        :general_assemblies__year_from,
        :general_assemblies__year_to,
        Sequel.as(array_agg(Sequel.lit('distinct mps.name order by mps.name')), :mp_names),
        Sequel.as(array_agg(Sequel.lit('mps.id order by name')), :mp_ids),
        Sequel.as(array_agg(Sequel.lit('distinct mps.party order by mps.party')), :parties)]}
      .all
      .inject({}) do |hash, data|
        data[:mp_ids] = data[:mp_ids].uniq # Needs fixing, select distinct up front!
        hash[data[:ordinal]] = data.except(:ordinal)
        hash
      end

    parties_mps_hash = DB[:members_of_parliament_x_general_assemblies]
      .left_join(:members_of_parliament,
        'members_of_parliament.id = members_of_parliament_x_general_assemblies.member_of_parliament_id')
      .group_by(:party)
      .select{[:party,
        Sequel.as(array_agg(Sequel.lit('distinct members_of_parliament.name order by members_of_parliament.name')), :mp_names),
        Sequel.as(array_agg(Sequel.lit('members_of_parliament.id order by members_of_parliament.name')), :mp_ids)]}
      .order_by(:party)
      .all
      .inject({}) do |hash, data|
        data[:mp_ids] = data[:mp_ids].uniq # Needs fixing, select distinct up front!
        hash[data[:party]] = data[:mp_ids]
        #hash[data[:party]] = data.except(:party)
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

