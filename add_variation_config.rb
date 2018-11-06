require 'json'

variations = JSON.parse(File.open('./variations.json').read)
max_variation = JSON.parse(File.open('./max_variation.json').read)

def if_first_to_blank(i)
  i == 1 ? "": i
end

if File.exists?("./devStuff/src/config/_variationConfig.scss")
  i = 1
  add_configs = "\n"
  variations["_1001_frameN"].each do |old_class, class_variations|
    class_variations.each do |class_variation|
      add_configs << "$variation#{if_first_to_blank(i)}of#{max_variation["frameN"]}: '#{if_first_to_blank(i)}';\n"
      i += 1
    end
  end
  old_file = File.open("./devStuff/src/config/_variationConfig.scss").read
  File.open("./devStuff/src/config/_variationConfig.scss", "w").puts("#{old_file.chomp.chomp}\n#{add_configs}")
end

if File.exists?("./devStuff/src/config/_variationConfig2.scss")
  i = 1
  add_configs = "\n"
  variations["_1001_frameN"].each do |old_class, class_variations|
    class_variations.each do |class_variation|
      if class_variation.include?("1of2")
        add_configs << "$variation#{if_first_to_blank(i)}of#{max_variation["frameN"]}: '#{if_first_to_blank(i + 1)}';\n"
      elsif class_variation.include?("2of2")
        add_configs << "$variation#{if_first_to_blank(i)}of#{max_variation["frameN"]}: '#{if_first_to_blank(i - 1)}';\n"
      elsif class_variation.include?("1of3")
        add_configs << "$variation#{if_first_to_blank(i)}of#{max_variation["frameN"]}: '#{if_first_to_blank(i + 2)}';\n"
      elsif class_variation.include?("2of3")
        add_configs << "$variation#{if_first_to_blank(i)}of#{max_variation["frameN"]}: '#{if_first_to_blank(i - 1)}';\n"
      elsif class_variation.include?("3of3")
        add_configs << "$variation#{if_first_to_blank(i)}of#{max_variation["frameN"]}: '#{if_first_to_blank(i - 1)}';\n"
      else
        add_configs << "$variation#{if_first_to_blank(i)}of#{max_variation["frameN"]}: '#{if_first_to_blank(i)}';\n"
      end
      i += 1
    end
  end
  old_file = File.open("./devStuff/src/config/_variationConfig2.scss").read
  File.open("./devStuff/src/config/_variationConfig2.scss", "w").puts("#{old_file.chomp.chomp}\n#{add_configs}")
end

if File.exists?("./devStuff/src/config/_variationConfig3.scss")
  i = 1
  add_configs = "\n"
  variations["_1001_frameN"].each do |old_class, class_variations|
    class_variations.each do |class_variation|
      if class_variation.include?("1of3")
        add_configs << "$variation#{if_first_to_blank(i)}of#{max_variation["frameN"]}: '#{if_first_to_blank(i + 1)}';\n"
      elsif class_variation.include?("2of3")
        add_configs << "$variation#{if_first_to_blank(i)}of#{max_variation["frameN"]}: '#{if_first_to_blank(i + 1)}';\n"
      elsif class_variation.include?("3of3")
        add_configs << "$variation#{if_first_to_blank(i)}of#{max_variation["frameN"]}: '#{if_first_to_blank(i - 2)}';\n"
      else
        add_configs << "$variation#{if_first_to_blank(i)}of#{max_variation["frameN"]}: '#{if_first_to_blank(i)}';\n"
      end
      i += 1
    end
  end
  old_file = File.open("./devStuff/src/config/_variationConfig3.scss").read
  File.open("./devStuff/src/config/_variationConfig3.scss", "w").puts("#{old_file.chomp.chomp}\n#{add_configs}")
end