require 'json'

variations = JSON.parse(File.open('./variations.json').read)
max_variation = JSON.parse(File.open('./max_variation.json').read)

def if_first_to_blank(i)
  i == 1 ? "": i
end

if File.exists?("./devStuff/src/config/_variationConfig.scss")
  i = 1
  add_configs = "\n"
  variations["_1001_frame1colD"].each do |old_class, class_variations|
    class_variations.each do |class_variation|
      add_configs << "$variation#{if_first_to_blank(i)}of#{max_variation["frame1colD"]}: '#{if_first_to_blank(i)}';\n"
      i += 1
    end
  end
  File.open("./devStuff/src/config/_variationConfig.scss", "a").puts(add_configs)
end

if File.exists?("./devStuff/src/config/_variationConfig2.scss")
  i = 1
  add_configs = "\n"
  variations["_1001_frame1colD"].each do |old_class, class_variations|
    class_variations.each do |class_variation|
      if class_variation.include?("1of2")
        add_configs << "$variation#{if_first_to_blank(i)}of#{max_variation["frame1colD"]}: '#{if_first_to_blank(i + 1)}';\n"
      elsif class_variation.include?("2of2")
        add_configs << "$variation#{if_first_to_blank(i)}of#{max_variation["frame1colD"]}: '#{if_first_to_blank(i - 1)}';\n"
      elsif class_variation.include?("1of3")
        add_configs << "$variation#{if_first_to_blank(i)}of#{max_variation["frame1colD"]}: '#{if_first_to_blank(i + 2)}';\n"
      elsif class_variation.include?("2of3")
        add_configs << "$variation#{if_first_to_blank(i)}of#{max_variation["frame1colD"]}: '#{if_first_to_blank(i - 1)}';\n"
      elsif class_variation.include?("3of3")
        add_configs << "$variation#{if_first_to_blank(i)}of#{max_variation["frame1colD"]}: '#{if_first_to_blank(i - 1)}';\n"
      else
        add_configs << "$variation#{if_first_to_blank(i)}of#{max_variation["frame1colD"]}: '#{if_first_to_blank(i)}';\n"
      end
      i += 1
    end
  end
   File.open("./devStuff/src/config/_variationConfig2.scss", "a").puts(add_configs)
end

if File.exists?("./devStuff/src/config/_variationConfig3.scss")
  i = 1
  add_configs = "\n"
  variations["_1001_frame1colD"].each do |old_class, class_variations|
    class_variations.each do |class_variation|
      if class_variation.include?("1of3")
        add_configs << "$variation#{if_first_to_blank(i)}of#{max_variation["frame1colD"]}: '#{if_first_to_blank(i + 1)}';\n"
      elsif class_variation.include?("2of3")
        add_configs << "$variation#{if_first_to_blank(i)}of#{max_variation["frame1colD"]}: '#{if_first_to_blank(i + 1)}';\n"
      elsif class_variation.include?("3of3")
        add_configs << "$variation#{if_first_to_blank(i)}of#{max_variation["frame1colD"]}: '#{if_first_to_blank(i - 2)}';\n"
      else
        add_configs << "$variation#{if_first_to_blank(i)}of#{max_variation["frame1colD"]}: '#{if_first_to_blank(i)}';\n"
      end
      i += 1
    end
  end
   File.open("./devStuff/src/config/_variationConfig3.scss", "a").puts(add_configs)
end