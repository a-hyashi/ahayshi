require 'json'

PC_HEADER = <<-PC_HEADER
    &__hd {
      text-align: center;
      color: $_textColor_hd;
      padding-bottom: 10px;
      &-h {
        text-align: center;
        h2 {
          @include g-font-layout($_fontSizePx_hd, $_lineHeightType, $layout);
        }
        &--size-1 {
          h2 {
            @include g-font-layout($_fontSizePx_hd - 2, $_lineHeightType, $layout);
          }
        }
        &--size-3 {
          h2 {
            @include g-font-layout($_fontSizePx_hd + 2, $_lineHeightType, $layout);
          }
        }
      }
      &-caption-upper {
        @include g-font-layout($_fontSizePx_caption, $_lineHeightType, $layout);
        padding: 0 0 5px 0;
      }
      &-caption-lower {
        @include g-font-layout($_fontSizePx_caption, $_lineHeightType, $layout);
        padding: 5px 0 0 0;
      }
    }
PC_HEADER

PC_FOOTER = <<-PC_FOOTER
    &__ft {
      margin-top: 2%;
    }
PC_FOOTER

SP_HEADER = <<-SP_HEADER
    &__hd {
      text-align: center;
      color: $_textColor_hd;
      padding: 5px 0;
      &-h {
        text-align: center;
        h2 {
          @include g-font($_fontSizePx_hd, $_lineHeightType);
        }
      }
      &-caption-upper {
        @include g-font-layout($_fontSizePx_caption, $_lineHeightType);
        padding: 0 0 5px 0;
      }
      &-caption-lower {
        @include g-font-layout($_fontSizePx_caption, $_lineHeightType);
        padding: 5px 0 0 0;
      }
    }
SP_HEADER

SP_FOOTER = <<-SP_FOOTER
    &__ft {
      margin-top: 20px;
    }
SP_FOOTER

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

@pc_fontSizePx_hd = frameWithHCaption_pc_scss.match(/\$_fontSizePx_hd:\s?(\d*)(px)?;/)[1]
@pc_fontSizePx_caption = frameWithHCaption_pc_scss.match(/\$_fontSizePx_caption:\s?(\d*)(px)?;/)[1]
@pc_textColor = frameWithHCaption_pc_scss.match(/\$_textColor:\s?(.*)?;/)[1]
@sp_fontSizePx_hd = frameWithHCaption_sp_scss.match(/\$_fontSizePx_hd:\s?(\d*)(px)?;/)[1]
@sp_fontSizePx_caption = frameWithHCaption_sp_scss.match(/\$_fontSizePx_caption:\s?(\d*)(px)?;/)[1]
@sp_textColor = frameWithHCaption_sp_scss.match(/\$_textColor:\s?(.*)?;/)[1]

def scraping_sass(group_name, i, cls, variation, from_scss)
  cls_variation_scss = from_scss.match(/[\s]{2}\.t0-b-#{Regexp.escape("#{cls}#{variation}")}[\s\S]*?\n[\s]{2}\}\n/).to_s
  cls_variation_scss.gsub!("#{cls}#{variation}", "#{group_name}\#\{$variation#{i}of#{@max_variation[group_name]}\}")
  "#{cls_variation_scss}\n"
end

def add_pc_header_and_footer(cls_variation_scss)
  if cls_variation_scss.match(/&__hd\s?{/).to_s == ""
    # バリエーションのセレクタの直後に変数を追加する
    before_variable = cls_variation_scss.match(/\s{2}.*\{\n/).to_s
    cls_variation_scss.gsub!(before_variable, "#{before_variable}\n    $_fontSizePx_hd: #{@pc_fontSizePx_hd};\n    $_fontSizePx_caption: #{@pc_fontSizePx_caption};\n    $_lineHeightType: 1;\n    $_textColor_hd: #{@pc_textColor};\n")

    # 初めに現れる{の直前にヘッダーのセレクタを追加する
    after_header = cls_variation_scss.match(/\s{4}.*\{\n/).to_s
    if after_header != ""
      cls_variation_scss.gsub!(after_header, "\n\n#{PC_HEADER.chop}#{after_header}")
    else
      cls_variation_scss.gsub!("\n  }", "\n#{PC_HEADER.chop}\n\n  }")
    end
  end

  # バリエーションのセレクタの閉じかっこのの直前にフッターのセレクタを追加する
  unless cls_variation_scss.include?("& + div") || cls_variation_scss.include?("&__ft")
    cls_variation_scss.gsub!("\n  }", "\n#{PC_FOOTER.chop}\n\n  }")
  end
  cls_variation_scss
end

def add_sp_header_and_footer(cls_variation_scss)
  if cls_variation_scss.match(/&__hd\s?{/).to_s == ""
    before_variable = cls_variation_scss.match(/\s{2}.*\{\n/).to_s
    cls_variation_scss.gsub!(before_variable, "#{before_variable}\n    $_fontSizePx_hd: #{@sp_fontSizePx_hd};\n    $_fontSizePx_caption: #{@sp_fontSizePx_caption};\n    $_lineHeightType: 1;\n    $_textColor_hd: #{@sp_textColor};\n")
    after_header = cls_variation_scss.match(/\s{4}.*\{\n/).to_s
    if after_header != ""
      cls_variation_scss.gsub!(after_header, "\n\n#{SP_HEADER.chop}#{after_header}")
    else
      cls_variation_scss.gsub!("\n  }", "\n#{SP_HEADER.chop}\n\n  }")
    end
  end
  unless cls_variation_scss.include?("& + div") || cls_variation_scss.include?("&__ft")
    cls_variation_scss.gsub!("\n  }", "\n#{SP_FOOTER.chop}\n\n  }")
  end
  cls_variation_scss
end

groups.each do |group, classes|
  group_name = group.split("_").last
  i = 1
  to_pc_scss = "@if $device == PC {\n\n"
  to_sp_scss = "@if $device == SP {\n\n"
  classes.each do |cls, variations|
    file_name = Dir.glob("./devStuff/src/parts/*_#{cls}.scss").first
    from_scss = File.open(file_name).read
    from_pc_scss = split_by_device(from_scss, 'PC')
    from_sp_scss = split_by_device(from_scss, 'SP')
    variations.each do |variation|
      to_pc_scss << add_pc_header_and_footer(scraping_sass(group_name, i, cls, variation, from_pc_scss))
      to_sp_scss << add_sp_header_and_footer(scraping_sass(group_name, i, cls, variation, from_sp_scss))
      i += 1
    end
  end
  to_pc_scss << "}\n"
  to_sp_scss << "}\n"
  to_scss = [to_pc_scss, to_sp_scss].join("\n")
  to_scss.gsub!("h3", "h2")
  to_scss.gsub!("h4", "h2")
  # 空のセレクタを削除
  to_scss.gsub!(/\s*.*\s?{\s?}/, "")
  to_scss.gsub!("& + div", "&__ft")
  to_scss.gsub!("& > span + &__bd", "&__tp")
  File.open("./devStuff/src/parts/#{group}.scss", "w").puts(to_scss)
end
