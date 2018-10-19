require 'json'

groups = {
  A: {
    frame: [],
    frameWithHCaptionNumIcon: [],
    frameWithHCaption: [],
    serviceSet: [],
    bannerTriplexRow: [],
    articleDecoration: []
  },
  B: {
    article2Image: [],
    flow2LeftToRight: []
  },
  C: {
    article3Image: [],
    layoutSplitter: [],
    flow3LeftToRight: []
  },
  D: {
    flow4LeftToRight: []
  },
  E: {
    flow5LeftToRight: []
  },
  F: {
    flow6LeftToRight: []
  },
  G: {
    flow7LeftToRight: []
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