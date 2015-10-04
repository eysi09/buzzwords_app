module QueryUtils

  def self.get_speeches(opts)
    self.start_logging
    q = self.build_query(opts)
    if opts[:chart_kind] == 'timeseries'
      speeches = self.timeseries_data_from_query(q, opts)
    else
      speeches = self.barchart_data_from_query(q, opts)
    end
    self.end_logging
    speeches
  end

  private

  def self.build_query(opts)
    words = opts[:words]
    q = DB[:speeches].where(Sequel.lit(self.where_words(words)))

    q = self.maybe_filter_on_general_assembly q, opts
    q = self.maybe_filter_on_party            q, opts
    q = self.maybe_filter_on_mps              q, opts
    q = self.maybe_filter_on_date_from        q, opts
    q = self.maybe_filter_on_date_to          q, opts

    q.select(Sequel.lit(self.select_word_freq(words)))
  end

  def self.timeseries_data_from_query(q, opts)
    date_expr = "date_trunc('#{opts[:date_gran]}', date)"
    if (group = opts[:group_by]) == :word # Only group by date_expr
      q = q.group(Sequel.lit(date_expr))
        .select_append{[Sequel.lit(date_expr + " as date")]}
    else # Group by date_expr and group (i.e. party, mp_id, general_assembly_id)
      q = q.group(Sequel.lit(date_expr), group)
        .select_append{[group, Sequel.lit(date_expr + " as date")]}
    end
    q.order(Sequel.lit(date_expr)).all
  end

  def self.barchart_data_from_query(q, opts)
    order_expr = ''
    unless (group = opts[:group_by]) == :word
      q = q.group(group)
        .select_append(group)
    end
    q.order(nil).all
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

  def self.where_words(words)
    expr = %Q{word_freq ?| array['#{words.join("', '")}']}
  end

  def self.select_word_freq(words)
    w = words[0]
    expr = %Q{sum((word_freq #>> '{"#{w}"}')::int) as wf_#{w}}
    words[1..words.length].each{|w| expr += %Q{, sum((word_freq #>> '{"#{w}"}')::numeric) as wf_#{w}}}
    expr
  end

  # Do all processing_in one iteration for performance sake
  def self.process_results(speeches, query_string, parse_content = false)
    speeches.each do |speech|
      speech[:word_freq] = JSON.parse(speech[:word_freq]).select{|k,v| k == query_string}
      if speech[:word_freq].blank? && parse_content
        speech[:word_freq] = {query_string => speech[:content].scan(query_string).count}
      end
      speech.delete(:content)
    end
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
    unless (mpids = o[:mpids]).blank?
      q = q.where(speeches__mp_id: mpids)
    end
    q
  end

  def self.maybe_filter_on_date_from(q, o)
    unless (date_from = o[:date_from]).blank?
      date_str = Date.parse(date_from, '%Y-%m-%d').to_s
      q = q.where('speeches.date > ?', date_str)
    end
    q
  end


  def self.maybe_filter_on_date_to(q, o)
    unless (date_to = o[:date_to]).blank?
      date_str = (Date.parse(date_to, '%Y-%m-%d') + 1).to_s # Include last day in range
      q = q.where('speeches.date < ?', date_str)
    end
    q
  end

end