require 'json'

groups = {
  "_1001_frame1colD": {
    frame: [],
    frameWithHCaptionNumIcon: [],
    frameWithHCaption: [],
    serviceSet: [],
    bannerTriplexRow: [],
    articleDecoration: []
  },
  "_1002_frame2colD": {
    article2Image: [],
    flow2LeftToRight: []
  },
  "_1003_frame3colD": {
    article3Image: [],
    layoutSplitter: [],
    flow3LeftToRight: []
  },
  "_1004_frame4col": {
    flow4LeftToRight: []
  },
  "_1005_frame5col": {
    flow5LeftToRight: []
  },
  "_1006_frame6col": {
    flow6LeftToRight: []
  },
  "_1007_frame7col": {
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

max_variation = {}
groups.each do |group, classes|
  max_variation[group.to_s.split("_").last] = 0
  classes.each do |cls, variations|
    max_variation[group.to_s.split("_").last] += variations.size
  end
end

File.open('max_variation.json',"w").puts(JSON.pretty_generate(max_variation))
