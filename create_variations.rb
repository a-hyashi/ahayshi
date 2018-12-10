require 'json'

groups = {
  "_1000_frameOuter": {
    frame: [],
    frameWithHCaptionNumIcon: [],
    frameWithHCaption: [],
    serviceSet: [],
    bannerTriplexRow: [],
    articleDecoration: []
  }
}.freeze

text = File.open('./devStuff/docs/bPlacer.md').read

groups.each do |group, classes|
  classes.each_key do |cls|
    variations = text.scan(/.*(#{cls})\|(.?|\#\{.*\})\|/)
    next if variations.size.zero?
    variations.each do |class_name, variation|
      groups[group][class_name.to_sym] << variation
    end
  end
end

File.open('variations.json',"w").puts(JSON.pretty_generate(groups))

max_variation = {}
groups.each do |group, classes|
  max_variation[group.to_s.split("_").last] = 0
  classes.each do |cls, variations|
    max_variation[group.to_s.split("_").last] += variations.size
  end
end

File.open('max_variation.json',"w").puts(JSON.pretty_generate(max_variation))
