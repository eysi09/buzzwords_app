module WordCountUtils

  # Methods except mp and ga to be Active Record models and party to be string
  # e.g. mp = MemberOfParliament.where(id: 2).first
  # e.g. ga = GeneralAssembly.where(ordinal: 143).first
  # e.g. party = 'Vg'

  def self.get_word_freq_by_mp(mp, opts = {})
    conds = opts[:general_assembly] ? {general_assembly_id: opts[:general_assembly].id} : {}
    conds.merge!(member_of_parliament_id: mp.id)
    self.get_word_freq(conds)
  end

  def self.get_word_freq_by_party(party, opts = {})
    conds = opts[:general_assembly] ? {general_assembly_id: opts[:general_assembly].id} : {}
    conds.merge!(party: party)
    self.get_word_freq(conds)
  end

  def self.get_word_freq_by_general_assembly(ga)
    self.get_word_freq({general_assembly_id: ga.id})
  end

  private

  def self.get_word_freq(conds)
    speeches = self.get_speeches(conds)
    words = speeches.flat_map{|s| s.split(' ')}
    word_freq = Hash.new(0)
    words.each{ |word| word_freq[self.clean_str(word)] += 1 }
    word_freq.sort_by{ |x,y| y }.reverse
  end

  def self.clean_str(word)
    word.downcase
  end

  def self.get_speeches(conds)
    DB[:speeches].where(conds).map{|s| s[:content]}
  end
end