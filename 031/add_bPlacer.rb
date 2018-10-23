require 'json'

# PC, SPのみのscssを返す.
def split_by_device(from_scss, device)
  from_scss.match(/@if\s\$device\s==\s\'#{device}\'[\s\S]*?\n}/).to_s
end

variations = JSON.parse(File.open('./variations.json').read)
max_variation = JSON.parse(File.open('./max_variation.json').read)
b_placer = File.open('./devStuff/src/config/_bPlacer.scss').read

pc_b_placer = split_by_device(b_placer, 'PC')
sp_b_placer = split_by_device(b_placer, 'SP')

pc_add_b_placer = ""
sp_add_b_placer = ""

variations.each do |new_class, old_classes|
  new_class_values = new_class.match(/_(\d{4})_(frame(\d)colD?)/)
  pc_add_b_placer << "  //## main | #{new_class_values[1]}_枠(#{new_class_values[3]}列)\n"
  i = 1
  old_classes.each do |old_class, old_class_variations|
    old_class_variations.each do |old_class_variation|
      pc_class_variation_b_placer = pc_b_placer.match(/\.t0-b-#{old_class}#{Regexp.escape(old_class_variation)}-bPlacer\{(.*)\}/)[1]
      sp_class_variation_b_placer = sp_b_placer.match(/\.t0-b-#{old_class}#{Regexp.escape(old_class_variation)}-bPlacer\{(.*)\}/)[1]
      pc_add_b_placer << "  .t0-b-#{new_class_values[2]}\#\{$variation#{i}of#{max_variation[new_class_values[2]]}\}-bPlacer\{#{pc_class_variation_b_placer}\}\n"
      sp_add_b_placer << "  .t0-b-#{new_class_values[2]}\#\{$variation#{i}of#{max_variation[new_class_values[2]]}\}-bPlacer\{#{sp_class_variation_b_placer}\}\n"
      puts sp_add_b_placer
      i += 1
    end
  end
end

sp_add_position = sp_b_placer.match(/\s{2}\.t0-b-creditCard-bPlacer{.*}/).to_s

pc_b_placer.gsub!('//# 12.その他', "#{pc_add_b_placer}//# 12.その他")
sp_b_placer.gsub!(sp_add_position, "#{sp_add_b_placer}#{sp_add_position}")

puts sp_add_b_placer

b_placer = File.open('./devStuff/src/config/_bPlacer.scss', 'w').puts("#{b_placer.split("\n").first}\n#{pc_b_placer}\n#{sp_b_placer}")

