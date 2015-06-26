module QueryUtils

  def self.get_speeches(opts)
    query_string = opts[:query_string]
    q = DB[:speeches].where(Sequel.ilike(:content, /#{query_string}.*/))

    q = self.maybe_filter_on_general_assembly q, opts
    q = self.maybe_filter_on_party            q, opts
    q = self.maybe_filter_on_mps              q, opts
    q = self.maybe_filter_on_date_from        q, opts
    q = self.maybe_filter_on_date_to          q, opts

    q.all
  end

  def self.get_piechart_data
  end

  def self.maybe_filter_on_general_assembly(q, o)
    unless (gaids = o[:gaids]).blank?
      q = q.where(speeches__general_assembly_id: gaids)
    end
  end

  def self.maybe_filter_on_party(q, o)
    unless (parties = o[:partyids]).blank?
      q = q.where(speeches__party: parties)
    end
    q
  end

  def self.maybe_filter_on_mps(q, o)
    unless (ids = o['mpids']).blank?
      q = q.where(speeches__member_of_parliament_id: ids)
    end
    q
  end

  def self.maybe_filter_on_date_from(q, o)
    unless (date_from = o['date_from']).blank?
      date_str = Date.parse(date_from, '%Y-%m-%d').to_s
      q = q.where('speeches.date > ?', date_str)
    end
    q
  end


  def self.maybe_filter_on_date_to(q, o)
    unless (date_to = o['date_to']).blank?
      date_str = (Date.parse(date_to, '%Y-%m-%d') + 1).to_s # Include last day in range
      q = q.where('speeches.date < ?', date_str)
    end
    q
  end

  def self.maybe_group_by(q, o)
    if (o[:group_by] == 'parties')
    elsif
      (o[:group_by] == 'mps')
    end
    q
  end

end