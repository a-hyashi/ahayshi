#!/bin/sh

declare -a themes=("031" "031A" "031B" "033" "033A" "033B" "033C" "033D" "033E" "034" "034A" "034B" "034C" "034D" "034E")
for theme in "${themes[@]}"; do
  echo ${theme}
  cp create_variations.rb ${theme}/create_variations.rb
  cp create_parts_sass.rb ${theme}/create_parts_sass.rb
  cp add_variation_config.rb ${theme}/add_variation_config.rb
  cp add_bPlacer.rb ${theme}/add_bPlacer.rb
  cp add_all.rb ${theme}/add_all.rb
  cd ${theme}
  ruby create_variations.rb
  ruby create_parts_sass.rb
  ruby add_variation_config.rb
  ruby add_bPlacer.rb
  ruby add_all.rb
  cd ..
done