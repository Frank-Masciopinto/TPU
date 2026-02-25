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

// DO NOT SHOW PRODUCT CAROUSEL UNTIL PAGE COMPLETELY LOADS
$(window).on("load", function(){
    $('.sidebar.right').fadeIn();
	$('.similar-products-by-views').fadeIn();
	$('.new-products-container').fadeIn();
});

if ($('#tab-customField1 span.custom-value').text().length >= 1) {
	$('li.tab.customFieldOne').addClass('visible');
	$('#tab-customField1 .custom-field-container').addClass('visible');
}

$('#tab-customField1 .custom-field-container:contains("customFieldTab1")').wrap("<div class='visible'></div>");

var customName = $('span.custom-name').first().text();
$('.tab.customFieldOne.visible a').text(customName);
$('div#tab-customField1 h3.tab-content-title').text(customName);

// GET TITLE ATTRIBUTE OF SWATCH CHILD AND THEN APPLY IT TO THE PARENT ON HOVER
$( "label.form-option.form-option-swatch" ).hover(function() {
	var title = $(this).find('span').attr("title");
	$(this).prop('title', title);
});

$('section.productView-images a.productView-thumbnail-link').hover(function() {
	$(this).toggleClass('is-active');
});

$(document).ready(function() {
	$('.slider-for').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		infinite: false,
		arrows: true,
		fade: true,
		adaptiveHeight: true,
		asNavFor: '.slider-nav'
	});
	$('.slider-nav').slick({
		slidesToShow: 4,
		slidesToScroll: 1,
		asNavFor: '.slider-for',
		infinite: false,
		dots: false,
		centerMode: false,
		focusOnSelect: true
	});
});

$('.slider-for> :last-child').remove();

$(window).on("load", function(){
	$( ".slider-nav .slick-slide" ).last().addClass( "last" );
});


$(window).on("load", function(){
	$( ".slick-arrow" ).on ('click', function() {
		if  ( $(".slider-nav .slick-slide.last.slick-current.slick-active")[0] ) {
			$(".slider-for .slick-next.slick-arrow").addClass('slick-disabled');
		} else {
			$(".slider-for .slick-next.slick-arrow").removeClass('slick-disabled');
		}
	});
});

$('.fancybox-content').on({ 'touchstart' : function(){ $('.fancybox-button').toggleClass('disabled'); } });

$('figure.productView-image').on("load", function(){
	$('div#product-images-container').addClass('ready');
	$('.productImageSlider.slider-for li').addClass('ready');
});

$(window).on("load", function(){
	$('.slider-nav').show();
});

$(window).on("load", function(){
	$('.product-thumbs-no-carousel').show();
});

$(document).ready(function() {
	$("li.fancy-gallery").fancybox();
});

$(window).on("load", function(){
	$('.productImageSlider').addClass('ready');
});

$( "a.navPage-subMenu-action.navPages-action.navPages-action-depth-max.has-subMenu" ).on ('click', function() {
	window.location = this.href; nm 
});

$('figure.listItem-figure').each(function() {
	if ( $(this).find('img.listItem-image').length >= 2 ) {
    	$(this).addClass('multiple-images');
	}
});


// CUSTOM NAV ARROWS FOR FANCYBOX
$(document).ready(function(){
    $('[data-fancybox="gallery"]').fancybox({
        afterLoad : function( instance, current ) {
			$('#body').addClass("fancy-arrows-visible");
			$("<div class='hide-mobile-fancybox-nav-arrows arrows-visible'><span class='custom-text'><span class='hide'>Hide</span><span class='show'>Show</span> Nav Arrows</span></div>").insertAfter(".fancybox-infobar");
			$(".hide-mobile-fancybox-nav-arrows").on ('click', function() {
				$('#body.fancybox-active').toggleClass("fancy-arrows-visible");
				$(this).toggleClass("arrows-visible");
				$(".button-next.custom").toggleClass('hidden');
				$(".button-previous.custom").toggleClass('hidden');
			});
	        $('.fancybox-navigation .fancybox-button--arrow_left').append('<a data-fancybox-previous class="button-previous custom" href="javascript:;"><i class="icon" aria-hidden="true"><svg class="custom-fancy-arrows custom"><use xlink:href="#icon-angle-left"></use></svg></i></a>');
	        $('.fancybox-navigation .fancybox-button--arrow_right').append('<a data-fancybox-next class="button-next custom" href="javascript:;"><i class="icon" aria-hidden="true"><svg class="custom-fancy-arrows custom"><use xlink:href="#icon-angle-right"></use></svg></i></a>');
	        current.$image.attr('alt', current.opts.$orig.find('img').attr('alt') );
	        current.$image.attr('title', current.opts.$orig.find('img').attr('title') );
  		}
	})
});

$(document).ready(function(){
    $('.product.main.left .slider-nav .slick-slide').click(function(){
        var thumbImgDataUpdate = $('.slick-active figure.productView-image img').attr('src');
        $('.slick-active figure.productView-image').attr('data-image-gallery-main', thumbImgDataUpdate);
        $('.slick-active figure.productView-image').attr('href', thumbImgDataUpdate);
        $('.slick-active figure.productView-image').attr('data-image-gallery-zoom-image-url', thumbImgDataUpdate);
        $('.slick-active figure.productView-image img').attr('src', thumbImgDataUpdate);

        setTimeout(function() {
			var imgDataUpdate = $('.slick-active figure.productView-image').attr('data-image-gallery-new-image-url');
        	$('.slick-active figure.productView-image').attr('data-image-gallery-main', imgDataUpdate);
        	$('.slick-active figure.productView-image').attr('href', imgDataUpdate);
        	$('.slick-active figure.productView-image').attr('data-image-gallery-zoom-image-url', imgDataUpdate);
        	$('.slick-active figure.productView-image img').attr('src', imgDataUpdate);
		}, 700);
	});
});

// Lone Star Templates DO NOT EDIT ABOVE THIS LINE
$(document).ready( function() {
	$(".form-select").change(function() {
		setTimeout(function() {
			var imgOptionFormDataUpdate = $('.slick-active figure.productView-image').attr('data-zoom-image');
		    $('.slick-active figure.productView-image img').attr('data-image-gallery-new-image-url', imgOptionFormDataUpdate);
		    $('.slick-active figure.productView-image').attr('data-image-gallery-main', imgOptionFormDataUpdate);
		    $('.slick-active figure.productView-image').attr('href', imgOptionFormDataUpdate);
		    $('.slick-active figure.productView-image').attr('data-image-gallery-zoom-image-url', imgOptionFormDataUpdate);
		    $('.slick-active figure.productView-image img').attr('src', imgOptionFormDataUpdatee);
		}, 700);
	});
});

$(document).ready( function() {
	$("div[data-product-option-change] input.form-radio").change(function() {
 		setTimeout(function() {
	    	var imgOptionSwatchDataUpdate = $('.slick-active figure.productView-image').attr('data-zoom-image');
		    $('.slick-active figure.productView-image').attr('data-image-gallery-main', imgOptionSwatchDataUpdate);
		    $('.slick-active figure.productView-image').attr('href', imgOptionSwatchDataUpdate);
		    $('.slick-active figure.productView-image').attr('data-image-gallery-zoom-image-url', imgOptionSwatchDataUpdate);
	    	$('.slick-active figure.productView-image img').attr('src', imgOptionSwatchDataUpdate);
	    }, 700);
 	});
});

// SCROLL TO REVIEWS IN TABS AND MAKE ACTIVE WHEN REVIEW LINK UP TOP IS CLICKED
$( ".productView-product .productView-reviewLink.reviewList > a" ).on ('click', function() {
	$('html,body').animate({
        scrollTop: $(".productView-description").offset().top
    }, 1000);
	$('article.productView-description .tab').removeClass('is-active');
	$('article.productView-description .tab-content').removeClass('is-active');
	$("article.productView-description .tab.reviews").addClass('is-active');
	$("article.productView-description .tab-content.reviews").addClass('is-active');
	return false;
});


// PAGINATION FOR REVIEWS ON PRODUCT PAGE SCROLL & ACTIVE REVIEWS TAB
$(window).on("load", function(){
	if (window.location.href.indexOf("#product-reviews") > -1) {
		$("span.reviewList a").on ('click', function() {
			$('html,body').animate({
				scrollTop: $(".productView-description").offset().top
			}, 1000);
			$('.tab').removeClass('is-active');
			$('.tab-content').removeClass('is-active');
			$(".tab.reviews").addClass('is-active');
			$(".tab-content.reviews").addClass('is-active');
		});
	}
});

// PAGINATION FOR REVIEWS ON PRODUCT PAGE SCROLL & ACTIVE REVIEWS TAB
$(window).on("load", function(){
	if ((window.location.href.indexOf("#product-reviews") > -1) || (window.location.href.indexOf("?revpage") > -1)) {
		$('html,body').animate({
			scrollTop: $(".productView-description").offset().top
		}, 1000);
		$('.tab').removeClass('is-active');
		$('.tab-content').removeClass('is-active');
		$(".tab.reviews").addClass('is-active');
		$(".tab-content.reviews").addClass('is-active');
	}
});

$( "div#mobile-menu li a" ).hover(function() {
	event.preventDefault();
});

// FIX FOR Multiple Product Video not clickable
$(document).ready(function(){
    $(".videoGallery-list li.videoGallery-item a.video").click(function(e){
        e.preventDefault();
        var videoID = $(this).attr("data-video-id");
        $(".videoGallery-main iframe#player").attr("src", "//www.youtube.com/embed/" + videoID);
        $("a.video.is-active").removeClass("is-active");
        $(this).addClass("is-active");
        $("iframe#player")[0].scrollIntoView(true);
    });
});

$(document).ready(function(){
	waitForElement("#carousel-active img",function(){
		$('#carousel-active .slick-slider').fadeIn();
	});
});

$(document).ready(function(){
	$(".productView-details .msrp-sale-regular-price-section .price-label").each(function() {
    	if ($.trim($(this).html()).length > 0 )
        $(this).addClass('label-active');
	});
});

$(document).ready(function(){
	$(".productView-details span.price.price--non-sale").each(function() {
    	if ($.trim($(this).html()).length <= 0 )
        $('.productView-details .price-section.current-price span.price-label.price-now-label').addClass('label-inactive');
	});
});

$(document).ready(function(){
    if ($(".productView-details .price.price--non-sale")[0]) {
        $('.productView-details .price-now-label').addClass('label-active');
	}
});

$(document).ready(function(){
    if (!$(".productView-details .price.price--non-sale")[0]) {
        $('.productView-details .price-now-label').addClass('label-inactive');
	}
});

$(document).ready(function(){
	$(".productView-details .productView-price div").each(function() {
		if ( ($(".withTax")[0]) && ($(".withoutTax")[0]) ) {
			$(this).parents('.productView-details').addClass('withTax-withoutTax-active');
		$('div.withoutTax').addClass("hide-msrp-nonSale-price-withoutTax");
		} else {
		// Do something if class does not exist
		}
	});
});

$(window).on("load", function(){
	$('section.productView-details').show();
});
