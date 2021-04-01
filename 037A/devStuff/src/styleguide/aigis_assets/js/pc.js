// $(document).ready(function(){
//   //トップページのみパンくず部品削除
//   var url_arr = location.href.split('/');
//   //公開ページ用
//   if(url_arr[3] === '' || url_arr[3] === 'index.html') {
//     if($('.mod-part-topicpath')[0]) $('.mod-part-topicpath').remove();
//   }
//   //CMS プレビュー用
//   if((url_arr[2] === 'www.next-cms-dev.com' ||
//       url_arr[2] === 'stg.next.blogdehp.jp' ||
//       url_arr[2] === 'www.wms-sample.com' ||
//       url_arr[2] === 'www.akibare-hp.com') && url_arr[3] === 'cms_v2') {
//     if($('.mod-part-topicpath')[0]) removePartTopicpathForCMS();
//   }
// });

// function removePartTopicpathForCMS(suffix) {
//   suffix = suffix || '';
//   var remove_flg = true
//   var part_elm = $('.mod-part-topicpath' + suffix);
//   part_elm.each(function() {
//     i = $(this).find('[itemscope]').length;
//     if(i > 1) remove_flg = false
//   });
//   if(remove_flg) part_elm.remove();
// }
