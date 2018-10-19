require 'json'

# PC, SPのみのscssを返す.
def split_by_device(from_scss, device)
  from_scss.match(/@if\s\$device\s==\s#{device}[\s\S]*?\n}/).to_s
end

groups = JSON.parse(File.open('./variations.json').read)
@max_variation = JSON.parse(File.open('./max_variation.json').read)

# 見出しがないバリエーションの場合、frameWithHCaptionを元に値を作成する.
frameWithHCaption_scss = File.open("./devStuff/src/parts/_003_frameWithHCaption.scss").read
frameWithHCaption_pc_scss = split_by_device(frameWithHCaption_scss, 'PC').match(/[\s]{2}\.t0-b-.*[\s\S]*?\n[\s]{2}\}\n/).to_s
frameWithHCaption_sp_scss = split_by_device(frameWithHCaption_scss, 'SP').match(/[\s]{2}\.t0-b-.*[\s\S]*?\n[\s]{2}\}\n/).to_s

pc_fontSizePx_hd = frameWithHCaption_pc_scss.match(/\$_fontSizePx_hd:\s?(\d*)(px)?;/)[1]
pc_fontSizePx_caption = frameWithHCaption_pc_scss.match(/\$_fontSizePx_caption:\s?(\d*)(px)?;/)[1]
puts pc_textColor = frameWithHCaption_pc_scss.match(/\$_textColor:\s?(.*)?;/)[1]
sp_fontSizePx_hd = frameWithHCaption_sp_scss.match(/\$_fontSizePx_hd:\s?(\d*)(px)?;/)[1]
sp_fontSizePx_caption = frameWithHCaption_sp_scss.match(/\$_fontSizePx_caption:\s?(\d*)(px)?;/)[1]
puts sp_textColor = frameWithHCaption_sp_scss.match(/\$_textColor:\s?(.*)?;/)[1]

def scraping_sass(group_name, i, cls, variation, from_scss)
  cls_variation_scss = from_scss.match(/[\s]{2}\.t0-b-#{Regexp.escape("#{cls}#{variation}")}[\s\S]*?\n[\s]{2}\}\n/).to_s
  cls_variation_scss.gsub!("#{cls}#{variation}", "#{group_name}\#\{$variation#{i}of#{@max_variation[group_name]}\}")
  "#{cls_variation_scss}\n"
end

groups.each do |group, classes|
  group_name = group.split("_").last
  i = 1
  to_pc_scss = "@if $device == PC {\n"
  to_sp_scss = "@if $device == SP {\n"
  classes.each do |cls, variations|
    file_name = Dir.glob("./devStuff/src/parts/*_#{cls}.scss").first
    from_scss = File.open(file_name).read
    from_pc_scss = split_by_device(from_scss, 'PC')
    from_sp_scss = split_by_device(from_scss, 'SP')
    variations.each do |variation|
      to_pc_scss << scraping_sass(group_name, i, cls, variation, from_pc_scss)
      to_sp_scss << scraping_sass(group_name, i, cls, variation, from_sp_scss)
      i += 1
    end
  end
  to_pc_scss << "}\n"
  to_sp_scss << "}\n"
  to_scss = [to_pc_scss, to_sp_scss].join("\n")
  to_scss.gsub!("h3", "h2")
  to_scss.gsub!("h4", "h2")
  to_scss.gsub!(/\s*.*\s?{\s?}/, "")
  to_scss.gsub!("& + div", "&__ft")
  to_scss.gsub!("& > span + &__bd", "&__tp")
  File.open("./devStuff/src/parts/#{group}.scss", "w").puts(to_scss)
  exit
end
