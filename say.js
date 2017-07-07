define(function(require, exports, module) {
    var bar = "bar";
    var doSomething = function(a) {
        console.log(a)
    };
    // module.exports = {
    //     foo: bar,
    //     doSomething:doSomething
    // };
exports.foo=bar;
exports.doSomething=doSomething;

});


// require.async(['../plugin/swiper/swiper.min.js'], function() {

//       $.ajax({
//           url: "/index/articleList.html?nid=appadbanner",
//           type: "post",
//           success: function(result) {
//               var data = result.data;
//               var len = data.length;
//               var str = "";
//               for (i = 0; i < len; i++) {
//                   var htmli = data[i].content;
//                   str += '<a class="swiper-slide" href="' + data[i].introduction + '"><img src="' + data[i].picPath + '" class="img_swiper" /></a>'
//               };
//               $('#swiper_lct_append').html(str);
//               var swiper = new Swiper('.swiper-container', {
//                   pagination: '.swiper-pagination',
//                   spaceBetween: 0,
//                   centeredSlides: true,
//                   autoplay: 32000,
//                   effect: 'slide',
//                   loop: true,
//                   autoplayDisableOnInteraction: false
//               });
//           }
//       });
//   });
