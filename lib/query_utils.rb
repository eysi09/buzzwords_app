module QueryUtils

  def self.get_speeches(opts)
    self.start_logging
    query_string = opts[:query_string]
    q = DB[:speeches].where(Sequel.ilike(:content, /#{query_string}.*/))

    q = self.maybe_filter_on_general_assembly q, opts
    q = self.maybe_filter_on_party            q, opts
    q = self.maybe_filter_on_mps              q, opts
    q = self.maybe_filter_on_date_from        q, opts
    q = self.maybe_filter_on_date_to          q, opts

    speeches = q.all
    self.end_logging
    needs_a_fixin = []
    speeches.each_with_index do |speech, index|
      # Shouldn't need to JSON parse. Needs a fix
      speech[:word_freq] = JSON.parse(speech[:word_freq]).select{|k,v| k == opts[:query_string]}
      needs_a_fixin.push(index) if speech[:word_freq].blank?
    end
    result = {
      speeches: speeches,
      needs_a_fixin: needs_a_fixin
    }
  end

  def self.start_logging
    @t1_q = Time.now
    Rails.logger.info '*******'
    Rails.logger.info 'Query starts...'
    Rails.logger.info '*******'
  end

  def self.end_logging
    t2_q = Time.now
    Rails.logger.info '*******'
    Rails.logger.info 'Query ends...'
    Rails.logger.info "Time elapsed #{(t2_q-@t1_q).round(2)} sec"
    Rails.logger.info '*******'
  end

  def self.maybe_filter_on_general_assembly(q, o)
    unless (gaids = o[:gaids]).blank?
      q = q.where(speeches__general_assembly_id: gaids)
    end
    q
  end

  def self.maybe_filter_on_party(q, o)
    unless (parties = o[:partyids]).blank?
      q = q.where(speeches__party: parties)
    end
    q
  end

  def self.maybe_filter_on_mps(q, o)
    unless (ids = o['mpids']).blank?
      q = q.where(speeches__mp_id: ids)
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

end