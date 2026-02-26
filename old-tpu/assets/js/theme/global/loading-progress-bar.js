import Nanobar from 'nanobar';

export default function () {
    // Create the nanobar instance
    const nanobar = new Nanobar();

    // Timer for moving progress bar during ajax calls
    let timer = null;
    let current = 0;

    function clearTimer() {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    }

    function setTimer() {
        clearTimer();

        current = 0;
        timer = setInterval(() => {
            current += 3;
            if (current <= 100) {
                nanobar.go(current);
            } else {
                clearTimer();
            }
        }, 50);
    }

    // Attach global jquery handlers to listen for ajax start
    $(document).ajaxSend(() => {
        setTimer();
    });

    $(document).ajaxComplete(() => {
        nanobar.go(100);
        clearTimer();
        // console.log('ajaxComplete!');
        // console.log("page is loaded!");
        if ( $('a.toggle-link.list').hasClass('active') && (!$('a.toggle-link.list').hasClass('default')) ){
          // console.log('list-is-active');
          $('a.toggle-link.list').trigger("click");
        } else if ( $('a.toggle-link.grid').hasClass('active') && (!$('a.toggle-link.grid').hasClass('default')) ){
            // console.log('grid-is-active');
            $('a.toggle-link.grid').trigger("click");
        }
        // MAKE COMPARE TEXT CLICKABLE IN LIST VIEW
        $( ".listItem-body label.button.button--small.card-figcaption-button.compare" ).on ('click', function() {
          var checkBox = $(this).find("input[type='checkbox']");
          checkBox.prop("checked", !checkBox.prop("checked"));
        });

        $(document).ready(function(){
          $(".add-to-cart-button").each(function() {
            if ($.trim($(this).html()).length <= 0 ) {
              var productLink = $(this).parents('.card-body').find('.card-title a').attr('href');
               $(this).append("<a href="+productLink+" class='button button--small card-figcaption-button false-stock-message' data-product-id='{{id}}'>View Details</a>");
             }
          });
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
             var maxHeight = -1;
             $('.body.content .card .current-price').each(function() {
               maxHeight = maxHeight > $(this).height() ? maxHeight : $(this).height();
               // console.log(maxHeight);
             });
             $('.body.content .card .current-price').each(function() {
               $(this).attr('style', 'min-height:' +maxHeight+ 'px !important');
             });



             // BEFORE THUMBNAILS ARE CLICKED, THE PRODUCT OPTION IMG RULES UPDATE CORRECTLY
             // FOR COMPARISON OF IMG DATA WHEN OPTIONS ARE CLICKED AFTER A THUMBNAIL IS CLICKED:
             // GET DEFAULT IMG + FIRST SLIDE IMG SRC + DEFAULT OPTION IMAGE
             // const defaultImg = $('.main-image-container .slick-slide[data-slick-index="0"] figure').attr('id');
             // console.log( "Default img, first img in control panel is: " + (defaultImg) );
             const updatedFirstSlideImgSrc = $('.main-image-container .slick-slide[data-slick-index="0"] figure img').attr('src');
             // console.log(updatedFirstSlideImgSrc);
             // console.log( "Updated Img Src in first slide is : " + (updatedFirstSlideImgSrc) );
             // $(document).on('click', ".productView.thumbnail-clicked", function() {
             $(".productView.thumbnail-clicked div[data-product-option-change] input.form-radio").change(function() {
               var updatedFirstSlideImgSrc = $('.main-image-container .slick-slide[data-slick-index="0"] figure img').attr('src');
               // console.log(updatedFirstSlideImgSrc);
             });

             // RUN THIS SCRIPT ONLY BEFORE THUMBNAILS HAVE BEEN CLICKED
             $(document).on('click', ".productView.thumbnail-unclicked", function() {
             $(".productView.thumbnail-unclicked div[data-product-option-change] input.form-radio").change(function() {
               setTimeout(function() {
                 var updatedFirstSlideImgSrc = $('.main-image-container .slick-slide[data-slick-index="0"] figure img').attr('src');
                 // console.log(updatedFirstSlideImgSrc);
               $('.slick-active figure.productView-image').attr('data-image-gallery-main', updatedFirstSlideImgSrc);
                 $('.slick-active figure.productView-image').attr('href', updatedFirstSlideImgSrc);
                 $('.slick-active figure.productView-image').attr('data-image-gallery-zoom-image-url', updatedFirstSlideImgSrc);
                 $('.slick-active figure.productView-image img').attr('src', updatedFirstSlideImgSrc);
               }, 1000);
             });
             });

             $(window).on("load", function(){
               setTimeout(function() {
                 var defaultImg = $('.main-image-container .slick-slide[data-slick-index="0"] figure').attr('id');
                 var onLoadFirstSlideImgSrc = $('.main-image-container .slick-slide[data-slick-index="0"] figure img').attr('src');
                 var defaultOptionImg = $('.main-image-container .slick-active figure.productView-image').attr('data-zoom-image');
                 // console.log( "Default img, first img in control panel is: " + (defaultImg) );
                 // console.log( "Intial Page Load Img Src in first slide is : " + (onLoadFirstSlideImgSrc) );
                 // console.log( "Default Option img onLoad is: " + (defaultOptionImg) );
                 setTimeout(function() {
                   $('.slick-active figure.productView-image').attr('data-image-gallery-main', defaultOptionImg);
                   $('.slick-active figure.productView-image').attr('href', defaultOptionImg);
                   $('.slick-active figure.productView-image').attr('data-image-gallery-zoom-image-url', defaultOptionImg);
                   $('.slick-active figure.productView-image img').attr('src', defaultOptionImg);
                 }, 1000);
               }, 700);
             });

               // RUN THIS SCRIPT ONLY AFTER THUMBNAILS HAVE BEEN CLICKED
               $(document).on('click', ".productView.thumbnail-clicked", function() {
                 $(".productView.thumbnail-clicked div[data-product-option-change] input.form-radio").change(function() {
                   setTimeout(function() {
                     var updatedFirstSlideImgSrc = $('.main-image-container .slick-slide[data-slick-index="0"] figure img').attr('src');
                     // console.log(updatedFirstSlideImgSrc);
                     $('.slick-active figure.productView-image').attr('data-image-gallery-main', updatedFirstSlideImgSrc);
                     $('.slick-active figure.productView-image').attr('href', updatedFirstSlideImgSrc);
                     $('.slick-active figure.productView-image').attr('data-image-gallery-zoom-image-url', updatedFirstSlideImgSrc);
                     $('.slick-active figure.productView-image img').attr('src', updatedFirstSlideImgSrc);
                     }, 1000);
                   });
                 });

                 // RUN THIS SCRIPT ONLY AFTER THUMBNAILS HAVE BEEN CLICKED
                 $(document).on('click', ".productView.thumbnail-clicked", function() {
                   $(".productView.thumbnail-clicked div[data-product-option-change] .form-select").change(function() {
                     setTimeout(function() {
                       var updatedFirstSlideImgSrc = $('.main-image-container .slick-slide[data-slick-index="0"] figure img').attr('src');
                       // console.log(updatedFirstSlideImgSrc);
                       $('.slick-active figure.productView-image').attr('data-image-gallery-main', updatedFirstSlideImgSrc);
                       $('.slick-active figure.productView-image').attr('href', updatedFirstSlideImgSrc);
                       $('.slick-active figure.productView-image').attr('data-image-gallery-zoom-image-url', updatedFirstSlideImgSrc);
                       $('.slick-active figure.productView-image img').attr('src', updatedFirstSlideImgSrc);
                    }, 1000);
                   });
                 });

                 });
             }
