module WordCountUtils

  # Methods expect mp and ga to be Active Record models, party to be a string
  # and opts[:general_assemblies] to be an array of general assembly ids
  # e.g. mp = MemberOfParliament.where(id: 2).first
  # e.g. ga = GeneralAssembly.where(id: 143).first
  # e.g. party = 'Vg'

  def self.get_word_freq_by_mp(mp, opts = {})
    conds = opts[:general_assemblies] ? {general_assembly_id: opts[:general_assemblies]} : {}
    conds.merge!(mp_id: mp.id)
    self.get_word_freq(conds)[0...40]
  end

  def self.get_word_freq_by_party(party, opts = {})
    conds = opts[:general_assemblies] ? {general_assembly_id: opts[:general_assemblies]} : {}
    conds.merge!(party: party)
    self.get_word_freq(conds)[0...40]
  end

  def self.get_word_freq_by_general_assembly(ga)
    self.get_word_freq({general_assembly_id: ga.id})[0...40]
  end

  def self.which_party_said(word, opts = {})
    speeches    = self.get_speeches_by_word(word, :party, opts)
    party_count = Hash.new(0)

    speeches.each do |s|
      word_occurences_in_speech = s[:content].scan(word).count
      party_count[s[:party]] += word_occurences_in_speech
    end
    party_count.sort_by{ |x,y| y }.reverse
  end

  def self.who_said(word, opts = {})
    speeches      = self.get_speeches_by_word(word, :mp_id, opts)
    mp_name_hash  = DB[:mps].select_hash(:id, :name)
    mps_count     = Hash.new(0)

    speeches.each do |s|
      name = mp_name_hash[s[:mp_id]]
      word_occurences_in_speech = s[:content].scan(word).count
      mps_count[name] += 1
    end
    mps_count.sort_by{ |x,y| y }.reverse
  end

  # If query returns results but word freq not found for query string
  # e.g. if query_string === 'hello.' but word_freq contains 'hello'
  # So we count again for those instances
  def self.fix_results(speeches, query_string, needs_a_fixin)
    needs_a_fixin.each do |i|
      speeches[i][:word_freq] = {query_string => speeches[i][:content].scan(query_string).count}
    end
    speeches
  end

  def self.get_timeseries_data(speeches)
  end

  def self.update_speeches_word_count
    t1 = Time.now
    puts 'Started updating speeches count...'
    # Use model cause of issue with foreign chars
    Speech.where(word_freq: nil).each do |speech|
      speech.word_freq = self.get_word_freq_by_content(speech.content)
      speech.save
    end
    t2 = Time.now
    puts 'Finished updating speeches count...'
    puts "Time elapsed #{(t2-t1).round(2)} sec"
  end

  private

  def self.get_word_freq_by_content(content)
    word_freq = Hash.new(0)
    content.split(' ').each{ |word| word_freq[self.clean_str(word)] +=1 }
    word_freq
  end

  def self.get_speeches_by_word(word, selection, opts = {})
    conds    = opts[:general_assemblies] ? {general_assembly_id: opts[:general_assemblies]} : {}
    speeches = DB[:speeches].where(conds)
      .where(Sequel.ilike(:content, /#{word}.*/))
      .select(:id, :content, selection)
      .all
  end

  def self.get_word_freq(conds)
    speeches = self.get_speeches(conds)
    words = speeches.flat_map{|s| s.split(' ')}
    word_freq = Hash.new(0)
    words.each{ |word| word_freq[self.clean_str(word)] += 1 if word.size > 10}
    word_freq.sort_by{ |x,y| y }.reverse
  end

  def self.clean_str(word)
    word.downcase
  end

  def self.get_speeches(conds)
    DB[:speeches].where(conds).map{|s| s[:content]}
  end
end