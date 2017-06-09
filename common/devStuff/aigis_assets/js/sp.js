var gnv_pname = [
                  'part-header-001',
                  'part-header-002',
                  'part-header-003',
                  'part-header-004',
                  'part-header-005'
                ];

var snv_pname = [
                  'part-side-018',
                  'part-side-045'
                ];

var rearrange_pname = {
                        'mod-2col4':{
                          'none':[
                            'part-main-054_001',
                            'part-main-054_002',
                            'part-main-132_001',
                            'part-main-132_002',
                            'part-main-133_001',
                            'part-main-133_002',
                          ],
                          'mod-box5':[
                            'part-main-110_001',
                            'part-main-110_002',
                            'part-main-139_001',
                            'part-main-139_002',
                            'part-main-140_001',
                            'part-main-140_002',
                            'part-main-143_001',
                            'part-main-143_002',
                            'part-main-144_001',
                            'part-main-144_002',
                            'part-main-212_001',
                            'part-main-212_002',
                          ],
                          'mod-box9':[
                            'part-main-006',
                            'part-main-007',
                            'part-main-008',
                            'part-main-009',
                            'part-main-022',
                            'part-main-023',
                            'part-main-024',
                            'part-main-025',
                            'part-main-056_001',
                            'part-main-056_002',
                            'part-main-107_001',
                            'part-main-107_002',
                            'part-main-113_001',
                            'part-main-113_002',
                            'part-main-114_001',
                            'part-main-114_002',
                            'part-main-155_001',
                            'part-main-155_002',
                            'part-main-168_001',
                            'part-main-168_002',
                            'part-main-169_001',
                            'part-main-169_002',
                            'part-main-208',
                            'part-main-209',
                            'part-main-210',
                            'part-main-211',
                            'part-main-221_001',
                            'part-main-221_002',
                            'part-main-222_001',
                            'part-main-222_002',
                            'part-main-225_001',
                            'part-main-225_002',
                            'part-main-226_001',
                            'part-main-226_002',
                            'part-main-227_001',
                            'part-main-227_002',
                            'part-main-228_001',
                            'part-main-228_002',
                            'part-main-229_001',
                            'part-main-229_002',
                            'part-main-230_001',
                            'part-main-230_002',
                          ],
                        },
                        'mod-2col6':{
                          'none':[
                            'part-main-100_001',
                            'part-main-100_002',
                            'part-main-101_001',
                            'part-main-101_002',
                          ],
                          'mod-box9':[
                            'part-main-050_001',
                            'part-main-050_002',
                            'part-main-197_001',
                            'part-main-197_002',
                            'part-main-198_001',
                            'part-main-198_002',
                            'part-main-199_001',
                            'part-main-199_002',
                          ],
                        },
                        'mod-2col17':{
                          'mod-box9':[
                            'part-main-026',
                            'part-main-027',
                            'part-main-028',
                            'part-main-029',
                          ],
                        },
                        'mod-2col31':{
                          'mod-box9':[
                            'part-main-060_001',
                            'part-main-060_002',
                          ],
                        },
                      };

$(function(){
  var site_name_tag = getSiteName();
  var tel_tag = getTelNumber();
  var menu_tag = getMainMenuAccordion();
  replaceTopicPath();
  createHead(site_name_tag, tel_tag, menu_tag);
  createGnavAccordion();
  createSideMenuAccordion();
  rearrangeMod2col();

  $('.mod-sp-accordion-h').click(function() {
    $('.mod-sp-accordion-hide').remove();
    if($(this).parents('.mod-sp-head-bar-menu')[0] && $(this).next().css('display') == 'none') {
      addAccordionHideScreen($(this));
    }
    $(this).next().slideToggle();
    $(this).toggleClass("open");
  });

  $('.mod-sp-accordion-h2').click(function() {
    $(this).parent('.mod-side-menu-item').next().slideToggle();
    $(this).toggleClass("open");
  });

  $('.mod-backto a').click(function() {
    $('html,body').animate({scrollTop:0}, 1500);
    return false;
  });

  if($('.mod-sp-head-bar-menu').find('.mod-side-menu')[0]) {
    var head_menu = $('.mod-sp-head-bar-menu').find('.mod-side-menu');
  }
  $(window).on('load resize', function() {
    if(head_menu != null) {
      head_menu.css('max-height', $(window).height() - 45 + 'px');
    }
  });

  //トップページのみパンくず部品削除
  var url_arr = location.href.split('/');
  //公開ページ用
  if(url_arr[3] === '' || url_arr[3] === 'index.html') {
    if($('.mod-part-topicpath')[0]) $('.mod-part-topicpath').remove();
  }
  //CMS プレビュー用
  if((url_arr[2] === 'www.next-cms-dev.com' ||
      url_arr[2] === 'stg.next.blogdehp.jp' ||
      url_arr[2] === 'www.wms-sample.com' ||
      url_arr[2] === 'www.akibare-hp.com') && url_arr[3] === 'cms_v2') {
    if($('.mod-part-topicpath')[0]) removePartTopicpathForCMS();
  }

});

function filterParts(target_area, target_pname) {
  var pname_ptn = new RegExp("^" + target_pname);
  var obj = $(target_area).children('div').children('div').children('div').children('div').filter(function() {
              if($(this).attr('class') != null) {
                if($(this).attr('class').match(pname_ptn)) {
                  return $(this);
                }
              }
            });
  return obj;
}

function addAccordionHideScreen(obj) {
  var ins_tag = '<div class="mod-sp-accordion-hide"></div>';
  $('.mod-sp-head-bar-menu').append(ins_tag);
  $('.mod-sp-accordion-hide').click(function() {
    obj.next().slideToggle();
    obj.toggleClass('open');
    $(this).remove();
  });
}

function getMainMenuAccordion() {
  var main_menu_tag = '';
  if($('#sp-sidemenu-html')[0]) {
    var sp_sidemenu_html = $('#sp-sidemenu-html');
    var tmp_obj_cls_nm = 'mod-sp-side-menu-box';
    var mod_side_menu_box_h = 'mod-side-menu-box-h';
    var mod_side_menu = 'mod-side-menu';
    var tmp_obj = sp_sidemenu_html.eq(0).addClass(tmp_obj_cls_nm);
    sp_sidemenu_html.remove();

    var wrap_tag = '<div class="mod-side-menu-box-inner"><div class="mod-side-menu-box-inner2"><div class="' + mod_side_menu + '"></div></div></div>';
    tmp_obj.wrapInner(wrap_tag);
    tmp_obj.find('.mod-side-menu').before('<div class="' + mod_side_menu_box_h + '" />');

    var side_menu = $('<div>').append(tmp_obj.clone());
    var side_menu2 = side_menu.children('.' + tmp_obj_cls_nm);
    var menu_lv1 = side_menu2.find('.' + mod_side_menu).children('.mod-side-menu-list').children('ul').children('li').children('.mod-side-menu-item');

    menu_lv1.each(function() {
      if(!$(this).children('a')[0]) {
        $(this).html('<span class="mod-sp-not-link">' + $(this).text() + '</span>');
      }
      if($(this).next('.mod-side-menu-list')[0]) {
        $(this).prepend('<span class="mod-sp-accordion-h2"></span>');
        var menu_lv2 = $(this).next('.mod-side-menu-list');
        menu_lv2.addClass('mod-sp-lv2');
        menu_lv2.find('.mod-side-menu-item').each(function() {
          if(!$(this).children('a')[0]) {
            $(this).html('<span class="mod-sp-not-link">' + $(this).text() + '</span>');
          }
        });
      } else {
        $(this).addClass('mod-sp-space');
      }
    });

    var head = side_menu2.find('.' + mod_side_menu_box_h);
    var ins_tag = '<p>MENU</p>';
    head.addClass('mod-sp-accordion-h').html(ins_tag);
    side_menu2.addClass('mod-sp-accordion');
    side_menu2.removeClass('mod-margin1 mod-margin2 mod-margin3');
    side_menu2.find('.mod-side-menu').css('max-height', $(window).height() - 45 + 'px');

    main_menu_tag = side_menu.html();
  }
  return main_menu_tag;
}

function getSiteName() {
  var site_name_tag = '';
  var obj = filterParts('.area-header', 't0-b-headerImgDouble');
  if(obj != null) {
    $(obj).each(function() {
      var target_tag = $(this).children('.t0-b-headerImgDouble__bd').children('.mod-image8');
      var target_tag2 = target_tag.find('img');
      var href = '/';
      if(target_tag.children('a')[0]) {
        if(target_tag.children('a').attr('href') != null) {
          href = target_tag.children('a').attr('href');
        }
      }
      if(target_tag2.attr('src') != null) {
        var img_alt = (target_tag2.attr('alt') != null)? target_tag2.attr('alt') : '';
        site_name_tag = '<a href="' + href + '"><img src="' + target_tag2.attr('src') + '" height="36" alt="' + img_alt +'"></a>';
      }
      $(this).remove();
    });
  }
  if(site_name_tag == '') {
    var site_name = $('meta[property="og:site_name"]').attr('content');
    if(site_name != null) {
      switch(true) {
        case site_name.length > 9 && site_name.length <= 12:
        site_name_tag = '<p class="mod-sp-fsizeM"><span>' + site_name + '</span></p>';
          break;
        case site_name.length > 12:
        site_name_tag = '<p class="mod-sp-fsizeS"><span>' + site_name + '</span></p>';
          break;
        default:
        site_name_tag = '<p class="mod-sp-fsizeL"><span>' + site_name + '</span></p>';
          break;
      }
    } else {
      site_name_tag = '<div></div>';
    }
  }
  return site_name_tag;
}

function getTelNumber() {
  var tel_tag = '';
  var tel_ptn = /0\d{1,4}-\d{1,4}-\d{3,4}/;
  var tel_obj = $('div').filter(function() {
                  if($(this).text().match(tel_ptn) && $(this).text().match("^(?!.*03-0000-0000)")) {
                    return $(this);
                  }
                });
  var tel_arr = tel_obj.eq(0).text().match(tel_ptn);
  if(tel_arr != null) {
    var tel_str = tel_arr[0].replace(/-/g, '');
    var tel_tag = '<p><a href="tel:' + tel_str + '"></a></p>';
  }
  return tel_tag;
}

function createHead(site_name_tag, tel_tag, menu_tag) {
  var ins_tag = '<div class="mod-sp-head-bar"><div class="mod-sp-head-bar-inner"><div class="mod-sp-head-bar-menu">' + menu_tag + '</div><div class="mod-sp-head-bar-name">' + site_name_tag + '</div><div class="mod-sp-head-bar-tel">' + tel_tag + '</div></div></div>';
  $('.area-header').prepend(ins_tag);
  if(menu_tag != '') {
    var cls_arr = $('.mod-sp-accordion').attr('class').split(' ');
    for(var i = 0; i < cls_arr.length; i++) {
      if(cls_arr[i].indexOf('ex-style') != -1) {
        $('.mod-sp-head-bar').addClass(cls_arr[i]);
      }
    }
  }
}

function createGnavAccordion() {
  $('nav').each(function() {
    var part_name = $(this).attr('data-parts-name').split(' ')[0];
    var part_ver = $(this).attr('data-parts-name').split(' ')[1];
    if($.inArray(part_name, gnv_pname) != -1) {
      switch(part_ver) {
        case 'v4':
          var obj = $(this).children('.mod-gnav-inner');
          break;
        default:
          var obj = $(this).children('.mod-gnav-inner').children('.mod-gnav-inner2');
          break;
      }
      var ins_tag = '<div class="mod-sp-accordion-h"><p>メインメニュー</p></div>';
      obj.prepend(ins_tag);
      var obj2 = obj.children('ul').children('li');
      obj2.each(function() {
        var target_tag = $(this).children('span');
        if(target_tag.children('a')[0]) {
          target_tag.addClass('mod-gnav-item');
        } else {
          target_tag.wrap('<span class="mod-gnav-item" />');
        }
      });
      $(this).addClass('mod-sp-accordion2');
    }
  });
}

function getSideMenu() {
  var side_menu = '';
  $.each(snv_pname, function(idx, val) {
    if($('[data-parts-name*="' + val + '"]')[0]) {
      var obj = $('[data-parts-name*="' + val + '"]');
      if(val == 'part-side-045') {
        obj.find('.mod-side-menu2').children('.mod-side-menu-list').children('ul').children('div').children('div').children('li').unwrap().unwrap();
      }
      if(side_menu == '') {
        side_menu = obj;
      } else {
        side_menu.push(obj);
      }
    }
  });
  return side_menu;
}

function createSideMenuAccordion() {
  var obj = getSideMenu();
  if(obj != '') {
    $(obj).each(function() {
      var obj_part_nm = $(this).attr('data-parts-name').split(' ')[0];
      var obj_part_ver = $(this).attr('data-parts-name').split(' ')[1];
      var obj_cls_arr = $(this).attr('class').split(' ');
      var obj_cls_nm = '';
      for(var i = 0; i < obj_cls_arr.length; i++) {
        if(obj_cls_arr[i].indexOf('mod-side-menu-box') != -1 || obj_cls_arr[i].indexOf('mod-set-navi-side') != -1) {
          obj_cls_nm = obj_cls_arr[i];
        }
      }
      if(obj_part_nm != '' && obj_cls_nm != '') {
        switch(obj_part_nm) {
          case 'part-side-018':
            var add_cls_nm = 'mod-sp-accordion3';
            break;
          case 'part-side-045':
            var add_cls_nm = 'mod-sp-accordion3_2';
            break;
        }
        switch(obj_cls_nm) {
          case 'mod-side-menu-box':
            var head = $(this).find('.mod-side-menu-box-h');
            break;
          // case 'mod-side-menu-box2':
          //   var head = $(this).find('.mod-side-menu-box2-h');
          //   break;
          case 'mod-set-navi-side':
            var head = $(this).find('.mod-h_4_side');
            break;
        }
        if(head.children()[0] == null) {
          var ins_tag = '<p>メニュー</p>';
          head.append(ins_tag);
        }
        head.addClass('mod-sp-accordion-h').removeClass('mod-side-menu-box-h mod-side-menu-box2-h mod-h_4_side');
        $(this).addClass(add_cls_nm);
      }
    });
  }
}

function replaceTopicPath() {
  var topicpath = '';
  var tag = '<div>';
  var obj = '';

  if($('.mod-part-topicpath-header')[0]) {
    obj = $('.mod-part-topicpath-header').first();
    $('.mod-part-topicpath-header').remove();
  }
  if($('.mod-part-topicpath')[0]) {
    obj = $('.mod-part-topicpath').first();
    $('.mod-part-topicpath').remove();
  }
  if(obj != '') {
    topicpath = $(tag).append(obj.clone()).html();
    $('[class*="area-main-inner"]').last().append(topicpath);
  }
}


function rearrangeParts(btype, obj, obj2) {
  var ins_tag = $('<div>').append(obj.clone());
  var exist_flg = false;
  switch(btype) {
    case 'none':
      var target_tag = obj2.children().eq(0);
      if(target_tag.attr('class').match(/mod-h_4/)) {
        target_tag.after(ins_tag.html());
        exist_flg = true;
      }
      break;
    default:
      if(obj2.children('.' + btype)[0]) {
        var target_tag = obj2.children('.' + btype).eq(0).children().eq(0);
        if(target_tag.attr('class').match(/mod-h_4/)) {
          target_tag.after(ins_tag.html());
          exist_flg = true;
        }
      }
      break;
  }
  if(!exist_flg) {
    obj2.prepend(ins_tag.html());
  }
  obj.remove();
}

function rearrangeMod2col() {
  $.each(rearrange_pname, function(col_type, val) {
    $.each(val, function(box_type, val2) {
      $.each(val2, function(idx, pname) {
        var obj = filterParts('.area-main', pname);
        if(obj != null) {
          $(obj).each(function() {
            var obj2 = $(this).find('.' + col_type);
            $(obj2).each(function() {
              if($(this).children('.mod-2col-inner')[0] && $(this).children('.mod-2col-inner2')[0]) {
                var obj_col_innner = $(this).children('.mod-2col-inner');
                var obj_col_innner2 = $(this).children('.mod-2col-inner2');
                rearrangeParts(box_type, obj_col_innner, obj_col_innner2);
              }
            });
          });
        }
      });
    });
  });
}

function removePartTopicpathForCMS(suffix) {
  suffix = suffix || '';
  var remove_flg = true
  var part_elm = $('.mod-part-topicpath' + suffix);
  part_elm.each(function() {
    i = $(this).find('[itemscope]').length;
    if(i > 1) remove_flg = false
  });
  if(remove_flg) part_elm.remove();
}

$(function() {
  $("[class^=b-sideMenu] label").on("click", function() {
    $(this).next().slideToggle();
    $(this).toggleClass("active");
  });
});

