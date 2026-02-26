// WAIT FUNCTION FOR ELEMENT TO POPULATE
  function waitForElement(elementPath, callBack){
    window.setTimeout(function(){
      if($(elementPath).length){
        callBack(elementPath, $(elementPath));
      }else{
        waitForElement(elementPath, callBack);
      }
    },250)
  }

// <!-- GET CURRENT YEAR FOR COPYRIGHT -->
if ($("#copyright_year")[0]) {
  document.getElementById("copyright_year").innerHTML = new Date().getFullYear();
}

// <!-- CUSTOM SIDECATEGORY MENU -->
$('.navPages-action.has-subMenu').each(function() {
  $('<span class="down-arrow"><i class="fa fa-chevron-down" aria-hidden="true"><svg><use xlink:href="#icon-chevron-down" /></svg></i></span></span>').insertAfter(this);
});

$( "span.down-arrow" ).on ('click', function() {
  $(this).closest('li').toggleClass('active');
  $(this).next('div.navPage-subMenu').toggleClass('sub-category-visible').slideToggle();
  $('<div class="clear"></div>').insertAfter('.Left #SideCategoryList .sf-menu ul li ul');
  if ( $(this).closest('li.navPages-item').hasClass('active') ) {
      $(this).html('<i class="fa fa-chevron-up" aria-hidden="true"><svg><use xlink:href="#icon-chevron-up" /></svg></i></span>');
  } else ( $(this).html('<i class="fa fa-chevron-down" aria-hidden="true"><svg><use xlink:href="#icon-chevron-down" /></svg></i></span>') );
});

$(document).ready(function($){
  $("span.down-arrow").on ('click', function() {
  $(this).prev('a').toggleClass('active');

  if ( $(this).prev('a').hasClass('active') ) {
      $(this).html('<i class="fa fa-chevron-up" aria-hidden="true"><svg><use xlink:href="#icon-chevron-up" /></svg></i></span>');
  } else ( $(this).html('<i class="fa fa-chevron-down" aria-hidden="true"><svg><use xlink:href="#icon-chevron-down" /></svg></i></span>') );
  });
});

$('#menu .navPage-subMenu li a i').on ('click', function(event) {
 event.preventDefault();
 $(this).next('ul#navPages-').toggleClass('sub-category-visible').slideToggle();
});


$( ".navPage-subMenu span.down-arrow" ).on ('click', function() {
  $(this).closest('li').toggleClass('active');
  $(this).next('ul.navPage-childList').toggleClass('sub-category-visible').slideToggle();
  $('<div class="clear"></div>').insertAfter('.Left #SideCategoryList .sf-menu ul li ul');

  if ( $(this).next('ul.navPage-childList').hasClass('sub-category-visible') ) {
      $(this).html('<i class="fa fa-chevron-up" aria-hidden="true"><svg><use xlink:href="#icon-chevron-up" /></svg></i></span>');
  } else ( $(this).html('<i class="fa fa-chevron-down" aria-hidden="true"><svg><use xlink:href="#icon-chevron-down" /></svg></i></span>') );

});

  $(window).scroll(function() {
      if ($(this).scrollTop() > 100 ) {
          $('.backtoTop').addClass("visible");
      } else {
          $('.backtoTop').removeClass("visible");
      }
  });

  $('.backtoTop').click(function(){
  $("html, body").animate({ scrollTop: 0 }, 600);
  return false;
  });

  $('.custom-pages-nav li a.navPages-action.has-subMenu').hover(
      function () {
          $(this).siblings('div#menu .navPage-subMenu').show();
      },
      function () {
          $(this).siblings('div#menu .navPage-subMenu').hide();
      }
  );

$( document ).ready(function() {
  $('.slider').hover(
      function() {
          $(this).addClass('active');
      },
      function() {
          $(this).removeClass('active');
      }
  );
});

$('.navPages-quickSearch input').change(function() {
  $('section.quickSearchResults').toggleClass("hide");
});

$(document).ready(function($){

  $("main.page.blog .blog-post .excerpt").each(function(){
          if ($(this).text().length > 0) {
              $(this).text($(this).text().substr(0, 125));
              $(this).append('...');
              $(this).addClass('visible');
          }
      });
});

$(document).ready(function($){
  $("main.page.blog h2.blog-title a").each(function(){
      $("main.page.blog h2.blog-title a").html().toLowerCase();
          if ($(this).text().length > 19) {
              $(this).text($(this).text().substr(0, 19));
              $(this).append('...');
          }
          $(this).addClass('visible');
      });
});

$(document).ready(function($){
      $('main.page.blog .blog-post-body').addClass('visible');
  });

// <!-- LOGO / SEARCHBAR ALIGNMENT -->
$(document).ready(function($){
if($('.header-logo').hasClass('header-logo--left')) {
  $('.right.searchbar').addClass('right');
  $('.navPages-container.inside-header.left-logo').addClass('visible');
};

if($('.header-logo').hasClass('header-logo--center')) {
  $('.right.searchbar').addClass('center');
  $('.navPages-container.inside-header.center-logo').show();
};

if($('.header-logo').hasClass('header-logo--right')) {
  $('.right.searchbar').addClass('right');
  $('.navPages-container.inside-header.right-logo').show();
};
});

$(window).scroll(function(){
if($(window).innerWidth() <= 800) {
if($(this).scrollTop() > 25) $('div#menu.mobile-menu .currency-converter').addClass('scrolled-down');
if($(this).scrollTop() < 25) $('div#menu.mobile-menu .currency-converter').removeClass('scrolled-down');
}
});

$(window).scroll(function(){
var scrollTop = $(this).scrollTop();

if(scrollTop > 50) $('.header-container.sticky-header .search-container#menu').removeClass('not-sticky').addClass('sticky').appendTo('.top-menu');
if(scrollTop < 50) $('.header-container.sticky-header .search-container#menu').removeClass('sticky').addClass('not-sticky').insertAfter('.header-logo');

var quickSearchResultsWidth = $('.search-container.sticky#menu section.quickSearchResults').width();
var quickSearchInputWidth = $('.header-container.sticky-header .search-container.sticky#menu .right.searchbar').width();
var searchWidthDifference = (quickSearchResultsWidth - quickSearchInputWidth);
var searchOffset = (searchWidthDifference / 2);
var resetOffset = 0;
if(scrollTop > 50) $('.header-container.sticky-header .search-container.sticky#menu section.quickSearchResults').css('right', -Math.abs(searchOffset)+"px");
if(scrollTop > 50) $('.header-container.sticky-header .search-container.sticky#menu a.modal-close.custom-quick-search').css('right', -Math.abs(searchOffset)+"px");
if(scrollTop < 50) $('.header-container .search-container section.quickSearchResults').css('right', -Math.abs(resetOffset)+"px");
if(scrollTop < 50) $('.header-container .search-container a.modal-close.custom-quick-search').css('right', -Math.abs(resetOffset)+"px");

var searchFieldWidth = $('header.header').width();
searchFieldWidth = (searchFieldWidth * .6);
if(scrollTop > 50) $('.header-container.sticky-header .center-logo.search-container.sticky#menu section#quickSearch.quickSearchResults').css({ 'width': (searchFieldWidth) + 'px' });
if(scrollTop > 50) $('.header-container.sticky-header .right-logo.search-container.sticky#menu section#quickSearch.quickSearchResults').css({ 'width': (searchFieldWidth) + 'px' });
if(scrollTop < 50) $('.header-container.sticky-header .center-logo.search-container.not-sticky#menu section#quickSearch.quickSearchResults .productGrid .product').css("opacity", "1");
if(scrollTop < 50) $('.header-container.sticky-header .right-logo.search-container.not-sticky#menu section#quickSearch.quickSearchResults .productGrid .product').css("opacity", "1");
});

$(document).click(function(event) {
  if ( !$(event.target).hasClass('div.currency-converter')) {
       $("div.currency-converter .navPage-subMenu").hide();
       event.stopPropagation();
  }
});

$("div.currency-converter li a.navPages-action.has-subMenu").click(function(e){
  e.preventDefault();
  $('div.currency-converter .navPage-subMenu').toggle();
  e.stopPropagation();
});

// <!-- HIDE SUBCATEGORY IMAGES IF CATEGORY IMAGE IS NOT SET-->
$(document).ready(function(){
if($('.subcategory-image.uploaded').length) {
  $("li.subcategory-item .subcategory-image").fadeIn();
}
});

// <!-- HIDE COMPARE BUTTON IF PRODUCT COMPARISONS ARE DISABLED -->
$(document).ready(function(){
if (!$('article.card').hasClass('compare-disabled')) {
  $('.compare').fadeIn();
}
if ($('main#product-listing-container:contains("There are no products listed under this category.")').length > 0) {
$('.compare').hide();
}
});
// <!-- HIDE COMPARE BUTTON IF ONE PRODUCT OR LESS -->
$(window).on("load", function(){
if ($('#product-listing-container ul.productGrid li.product').length <= 1) {
	$('.compare').hide();
}
});
$(window).on("load", function(){
if ($('#product-listing-container ul.productList li.product').length <= 1) {
	$('.compare').hide();
}
});

// ADD PRICES-HIDDEN CLASS IF LOGIN REQUIRED
$(document).ready(function(){
$("article.card .card-text .price-visibility.restricted").each(function(){
  if ($(this).text().trim().length) {
      $(this).addClass("price-hidden");
      $(this).closest('div.card-body').addClass("prices-hidden");
  }
});
});

$(window).on("load", function(){
$('.subcategory-grid').fadeIn();
$('.productGrid').fadeIn();
});

if($(window).innerWidth() <= 480) {
$(document).ready(function() {
  $('.shop-by-price').appendTo('.sideCategoryList.mobile');
});
}

$(window).on("load", function(){
if ($('.subcategory-image').hasClass('uploaded')) {
  $('li.subcategory-item').addClass('hasImage');
}
});

$( "a.navPage-subMenu-action.navPages-action.navPages-action-depth-max.has-subMenu" ).on ('click', function() {
window.location = this.href;
});
  // <!-- HIDE PRELOADER AFTER FIRST SESSION, RESETS IN 24 HOURS -->

    $(document).ready(function($) {
        if ($.cookie('popupShownOnceAlready')) {
        }
        else {
          // and now we create 1 day cookie
            $.cookie('popupShownOnceAlready', true, {path: '/', expire: 1});
            var $myDiv = $('.home');
                if ( $myDiv.length){
                  var id = '#dialog';
                  var maskHeight = $(document).height();
                  var maskWidth = $(window).width();
                  $('#mask').css({'width':maskWidth,'height':maskHeight});
                  $('#mask').fadeIn(500);
                  $('#mask').fadeTo("slow",0.9);
                  var winH = $(window).height();
                  var winW = $(window).width();
                        $(id).css('top',  winH/2-$(id).height()/2);
                  $(id).css('left', winW/2-$(id).width()/2-35);
                     $(id).fadeIn(2000);
                     $('.window .close').click(function (e) {
                  e.preventDefault();
                  $('#mask').hide();
                  $('.window').hide();
                     });
                     $('#mask').click(function () {
                  $(this).hide();
                  $('.window').hide();
                 });
                }
        }
        $(window).on("unload", function(e) {
          deleteCookie('popupShownOnceAlready');
        });
    });

// <!-- GRID/LIST VIEW TOGGLE -->
    jQuery( "a.toggle-link" ).click(function( event ) {
        event.preventDefault();
    });

  $(document).ready(function(){
      jQuery('a.toggle-link').on("click", function(){
        jQuery('a.toggle-link').not(this).removeClass('active');
          jQuery(this).addClass('active');
            if ( jQuery("a.toggle-link.grid").hasClass("active") ) {
                jQuery("ul.productGrid").addClass('visible');
                jQuery(".list-default").addClass('hidden');
            } else {
              jQuery("ul.productGrid").removeClass('visible');
              jQuery(".list-default").removeClass('hidden');
            }
            if ( jQuery("a.toggle-link.list").hasClass("active") ) {
                jQuery("ul.productList").addClass('visible');
                jQuery(".grid-default").addClass('hidden');
            } else {
              jQuery("ul.productList").removeClass('visible');
              jQuery(".grid-default").removeClass('hidden');
            }
          });
        });

// <!-- HIDE GRID/LIST TOGGLE ONCLICK -->
$(document).ready(function($){
$("a.navBar-action").on ('click', function() {
$('.grid-list-view.toggle').hide();
$('form.actionBar').hide();
});

$("li.navBar-item.products a.navBar-action").on ('click', function() {
$('.grid-list-view.toggle').show();
$('form.actionBar').show();
});
});

// <!-- HIDE GRID/LIST IF NO PRODUCTS ON PAGE -->
if($('li.product').length === 0){
$('.grid-list-view.toggle').hide();
$('form.actionBar').hide();
}

// <!-- REPOSITION CART LINK IF HAS COUNTPILL -->
if ( $('.countPill').hasClass('countPill--positive') ){
  $('.top-menu .right').addClass('shift-right');
}

$( "div#mobile-menu li a" ).hover(function() {
event.preventDefault();
});

// <!-- HIDE CAROUSEL NAV DOTS IF ONLY ONE SLIDE -->
$(window).on("load", function(){
if(!$('.slick-arrow').length){
$('.heroCarousel .slick-dots').hide();
}
});

// <!-- FIX FOR MOBILE ANDROID DROPDOWNS -->
  $(document).ready(function(){
      $("select.form-select").addClass("needsclick");
  });

// <!-- GET CURRENT CATEGORY AND ACTIVATE IN SIDENAV -->
$(document).ready( function() {
$('.container.main div#side-categories a.activePage').parents('.navPages-item').find('.topLevel').next('span.down-arrow').trigger("click");
$('.container.main div#side-categories a.activePage').next('span.down-arrow').trigger("click");
});


$(document).ready(function(){
  $(".page.blog .blog-title a").text(function(index, currentText) {
  var maxLength = $(this).attr('data-maxlength');
  if(currentText.length >= maxLength) {
    return currentText.substr(0, maxLength) + "...";
  } else {
    return currentText
  }
});
});

$(document).ready(function(){
  $(".page.blog .blog-date, .page.blog .blog-author").text(function(index, currentText) {
  var maxLength = $(this).attr('data-maxlength');
  if(currentText.length >= maxLength) {
    return currentText.substr(0, maxLength) + "...";
  } else {
    return currentText
  }
});
});

$(document).ready(function(){
waitForElement("#carousel-active img",function(){
$('#carousel-active .slick-slider').fadeIn();
});
});





$(".navPages-quickSearch input").click(function(e){
  $('section#quickSearch.quickSearchResults .productGrid .product').css("opacity", "1");
});

// FOR WINDOW DRAGGERS & THEME EDITOR RESPONSIVE BUTTONS
window.addEventListener("resize", function() {
$('section#quickSearch.quickSearchResults .productGrid .product').css("opacity", "0");
var nineHundredScreenWidth = window.matchMedia("(max-width: 900px)");
var desktopScreenWidth = window.matchMedia("(min-width: 801px)");

if (nineHundredScreenWidth.matches) {
    var searchFieldWidth = $('header.header').width();
    searchFieldWidth = (searchFieldWidth * .6);
    $('div#menu.left-logo section#quickSearch.quickSearchResults').css({ 'width': (searchFieldWidth) + 'px' });
  } else if (desktopScreenWidth.matches) {
    var searchFieldWidth = $('header.header').width();
    searchFieldWidth = (searchFieldWidth * .5);
    $('div#menu.left-logo section#quickSearch.quickSearchResults').css({ 'width': (searchFieldWidth) + 'px' });
  }
  $('section#quickSearch.quickSearchResults .productGrid .product').css("opacity", "1");
}, false);

$( document ).ready(function() {
// MAKE COMPARE TEXT CLICKABLE IN LIST VIEW
$( ".listItem-body label.button.button--small.card-figcaption-button.compare" ).on ('click', function() {
  var checkBox = $(this).find("input[type='checkbox']");
  checkBox.prop("checked", !checkBox.prop("checked"));
});
});


/**
 * Gets the browser name or returns an empty string if unknown.
 * This function also caches the result to provide for any
 * future calls this function has.
 *
 * @returns {string}
 */
var browser = function() {
    // Return cached result if avalible, else get result then cache it.
    if (browser.prototype._cachedResult)
        return browser.prototype._cachedResult;

    // Opera 8.0+
    var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

    // Firefox 1.0+
    var isFirefox = typeof InstallTrigger !== 'undefined';

    // Safari 3.0+ "[object HTMLElementConstructor]"
    var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification);

    // Internet Explorer 6-11
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    if (isIE = /*@cc_on!@*/false || !!document.documentMode) {
      $('#body').addClass('internet-explorer');
    } else {
      $('#body').addClass('not-internet-explorer');
    }

    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;

    // Chrome 1+
    var isChrome = !!window.chrome && !!window.chrome.webstore;

    // Blink engine detection
    var isBlink = (isChrome || isOpera) && !!window.CSS;

    return browser.prototype._cachedResult =
        isOpera ? 'Opera' :
        isFirefox ? 'Firefox' :
        isSafari ? 'Safari' :
        isChrome ? 'Chrome' :
        isIE ? 'IE' : 'NOT IE'
        isEdge ? 'Edge' :
        isBlink ? 'Blink' :
        "Don't know";
};

console.log(browser());

$(window).on("load", function(){
  $(".category .page-content.both-grid-list-views").css("opacity", "1");
});

if (!$(".product-filtering-enabled")[0]) {
$('a.toggle-link.list').on("click", function(){
    if (history.pushState) {
        var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?list-active';
        window.history.pushState({path:newurl},'',newurl);
    }
});
}
if (!$(".product-filtering-enabled")[0]) {
$('a.toggle-link.grid').on("click", function(){
    if (history.pushState) {
        var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?grid-active';
        window.history.pushState({path:newurl},'',newurl);
    }
});
}

if (!$(".product-filtering-enabled")[0]) {
  $('a.pagination-link').on("click", function(){
    var uri = window.location.toString();
    if ( (uri.indexOf("?list-active") > 0) || (uri.indexOf("?grid-active") > 0) ) {
      $(this).attr({
        href: $(this).attr("href") + window.location.search
      });
    }
  });
}

if (!$(".product-filtering-enabled")[0]) {
$( document ).ready(function() {
	var uri = window.location.toString();
  if ( (uri.indexOf("?list-active") > 0) && (!$('a.toggle-link.list').hasClass('default')) ) {
    $('a.toggle-link.list').trigger("click");
  } else if ( (uri.indexOf("?grid-active") > 0) && (!$('a.toggle-link.grid').hasClass('default')) ) {
      $('a.toggle-link.grid').trigger("click");
    }
});
}

$(window).on("load", function(){
  $('ul.productList.visible').css("opacity", "1");
  $('ul.productGrid.visible').css("opacity", "1");
});

$(document).ready(function(){
	$(".add-to-cart-button").each(function() {
    if ($.trim($(this).html()).length <= 0 ) {
      var productLink = $(this).parents('.card-body').find('.card-title a').attr('href');
	     $(this).append("<a href="+productLink+" class='button button--small card-figcaption-button false-stock-message' data-product-id='{{id}}'>View Details</a>");
     }
	});
});
// COMPARE ENABLED
$(document).ready(function(){
	$(".compare-enabled .card-text .price-visibility").each(function() {
	   if ( ($.trim($(this).html()).length <= 0 ) && ($(".withTax")[0]) && ($(".withoutTax")[0]) ) {
	     $(this).append("<div class='msrp-sale-regular-price-section'></div>");
       $(this).append("<div class='price-section-withTax current-price'></div>");
       $(this).append("<div class='price-section-withoutTax current-price'></div>");
     }
		 });
});
$(document).ready(function(){
	$(".compare-enabled .card-text .price-visibility").each(function() {
	   if ( ($.trim($(this).html()).length <= 0 ) && ($(".withTax")[0]) && (!$(".withoutTax")[0]) ) {
	     $(this).append("<div class='msrp-sale-regular-price-section'></div>");
       $(this).append("<div class='price-section-withTax current-price'></div>");
     }
		 });
});
$(document).ready(function(){
	$(".compare-enabled .card-text .price-visibility").each(function() {
	   if ( ($.trim($(this).html()).length <= 0 ) && (!$(".withTax")[0]) && ($(".withoutTax")[0]) ) {
	     $(this).append("<div class='msrp-sale-regular-price-section'></div>");
       $(this).append("<div class='price-section-withoutTax current-price'></div>");
     }
		 });
});
// COMPARE DISABLED
$(document).ready(function(){
	$(".compare-disabled .card-text .price-visibility").each(function() {
	   if ( ($.trim($(this).html()).length <= 0 ) && ($(".withTax")[0]) && ($(".withoutTax")[0]) ) {
	     $(this).append("<div class='msrp-sale-regular-price-section'></div>");
       $(this).append("<div class='price-section-withTax current-price'></div>");
       $(this).append("<div class='price-section-withoutTax current-price'></div>");
     }
		 });
});
$(document).ready(function(){
	$(".compare-disabled .card-text .price-visibility").each(function() {
	   if ( ($.trim($(this).html()).length <= 0 ) && ($(".withTax")[0]) && (!$(".withoutTax")[0]) ) {
	     $(this).append("<div class='msrp-sale-regular-price-section'></div>");
       $(this).append("<div class='price-section-withTax current-price'></div>");
     }
		 });
});
$(document).ready(function(){
	$(".compare-disabled .card-text .price-visibility").each(function() {
	   if ( ($.trim($(this).html()).length <= 0 ) && (!$(".withTax")[0]) && ($(".withoutTax")[0]) ) {
	     $(this).append("<div class='msrp-sale-regular-price-section'></div>");
       $(this).append("<div class='price-section-withoutTax current-price'></div>");
     }
		 });
});

$(document).ready(function(){
  if ($("a.button.button--small.card-figcaption-button.login-for-pricing")[0]) {
    $('.card-text .price-visibility.visible').hide();
  }
});

  $(document).ready(function(){
  	$(".add-to-cart-button.call-for-price span.line-one").each(function() {
      if ($.trim($(this).html()).length <= 0 ) {
  	     $(this).parents('.add-to-cart-button.call-for-price').addClass('line-one-empty');
       }
  	});
  });

  $(document).ready(function(){
    $(".add-to-cart-button.call-for-price span.line-two").each(function() {
      if ($.trim($(this).html()).length <= 0 ) {
         $(this).parents('.add-to-cart-button.call-for-price').addClass('line-two-empty');
       }
    });
  });

  $(window).on("load", function(){
    var maxHeight = -1;
    $('.body.content .card .current-price').each(function() {
      maxHeight = maxHeight > $(this).height() ? maxHeight : $(this).height();
    });
    $('.body.content .card .current-price').each(function() {
      $(this).attr('style', 'min-height:' +maxHeight+ 'px !important');
    });
  });

// QUICKVIEW FOR MOBILE
  $('a.image-link.mobile').on ('click', function(event) {
    event.preventDefault();
  });
  $('figure').on ('click', function(event) {
  $('figure.active').not(this).removeClass('active');
    $(this).toggleClass('active');
});

// CHECK IF LESS FOUR SLIDES EXIST IN VERTICAL SLIDER & ADD CLASS
$(window).on("load", function(){
  var numOfSlides = $('.sidebar.right .carousel-vertical .slick-slide').length;
  if ( numOfSlides <= 3 ) {
      $('.sidebar.right .carousel-vertical').addClass('single-slide');
  }
});
