import _ from 'lodash';
import utils from '@bigcommerce/stencil-utils';
import StencilDropDown from './stencil-dropdown';

export default function () {
    const TOP_STYLING = 'top: 49px;';
    const $quickSearchResults = $('.quickSearchResults');
    const $quickSearchDiv = $('#quickSearch');
    const $searchQuery = $('#search_query');
    var searchInputValue = $('#search_query');
    const stencilDropDownExtendables = {
        // hide: () => {
        //     $searchQuery.trigger('blur');
        // },
        // show: (event) => {
        //     $searchQuery.trigger('focus');
        //     event.stopPropagation();
        // },
    };
    const stencilDropDown = new StencilDropDown(stencilDropDownExtendables);
    stencilDropDown.bind($('[data-search="quickSearch"]'), $quickSearchDiv, TOP_STYLING);

    stencilDropDownExtendables.onBodyClick = (e, $container) => {
        // If the target element has this data tag or one of it's parents, do not close the search results
        // We have to specify `.modal-background` because of limitations around Foundation Reveal not allowing
        // any modification to the background element.
        if ($(e.target).closest('[data-prevent-quick-search-close], .modal-background').length === 0) {
            stencilDropDown.hide($container);
        }
    };

    // stagger searching for 200ms after last input
    const doSearch = _.debounce((searchQuery) => {
        utils.api.search.search(searchQuery, { template: 'search/quick-results' }, (err, response) => {
            if (err) {
                return false;
            }

            $quickSearchResults.html(response);

            // QUICKVIEW FOR MOBILE
              $('a.image-link.mobile').on ('click', function(event) {
                event.preventDefault();
              });
              $('figure').on ('click', function(event) {
              $('figure.active').not(this).removeClass('active');
                $(this).toggleClass('active');
            });


              $("#quickSearch .add-to-cart-button.call-for-price span.line-one").each(function() {
                if ($.trim($(this).html()).length <= 0 ) {
                   $(this).parents('.add-to-cart-button.call-for-price').addClass('line-one-empty');
                 }
              });

              $("#quickSearch .add-to-cart-button.call-for-price span.line-two").each(function() {
                if ($.trim($(this).html()).length <= 0 ) {
                   $(this).parents('.add-to-cart-button.call-for-price').addClass('line-two-empty');
                 }
              });
                 // var maxHeight = -1;
                 // $('#quickSearch article.card .add-to-cart-button').each(function() {
                 //   maxHeight = maxHeight > $(this).height() ? maxHeight : $(this).height();
                 //   console.log(maxHeight);
                 // });
                 // $('#quickSearch article.card .add-to-cart-button a').each(function() {
                 //   $(this).attr('style', 'min-height:' +maxHeight+ 'px !important');
                 // });
                 var maxHeight = -1;
                 $('#quickSearch .current-price').each(function() {
                   maxHeight = maxHeight > $(this).height() ? maxHeight : $(this).height();
                   console.log(maxHeight);
                 });
                 $('#quickSearch .current-price').each(function() {
                   $(this).attr('style', 'min-height:' +maxHeight+ 'px !important');
                 });

            $('a.modal-close.custom-quick-search').css("display", "inline-block").fadeIn();
            $('html').addClass('quickSearchResultsActive');
            $('#body').addClass('quickSearchResultsActive');
            $('.header-container').addClass('quickSearchResultsActive');
            $('.top-menu').addClass('quickSearchResultsActive');

            // KEEP EQUAL CARD HEIGHTS IF PRICE IS EMPTY
            	$(".card-text .price-visibility").each(function() {
            	   if ( ($.trim($(this).html()).length <= 0 ) && ($(".withTax")[0]) && ($(".withoutTax")[0]) ) {
                   console.log('withTax and withoutTax');
            	     $(this).append("<div class='msrp-sale-regular-price-section'></div>");
                   $(this).append("<div class='price-section-withTax current-price'></div>");
                   $(this).append("<div class='price-section-withoutTax current-price'></div>");
                 }
            		 });
            	$(".card-text .price-visibility").each(function() {
            	   if ( ($.trim($(this).html()).length <= 0 ) && ($(".withTax")[0]) && (!$(".withoutTax")[0]) ) {
                   console.log('withTax only');
            	     $(this).append("<div class='msrp-sale-regular-price-section'></div>");
                   $(this).append("<div class='price-section-withTax current-price'></div>");
                 }
            		 });
            	$(".card-text .price-visibility").each(function() {
            	   if ( ($.trim($(this).html()).length <= 0 ) && (!$(".withTax")[0]) && ($(".withoutTax")[0]) ) {
                   console.log('withoutTax only');
            	     $(this).append("<div class='msrp-sale-regular-price-section'></div>");
                   $(this).append("<div class='price-section-withoutTax current-price'></div>");
                 }
            		 });


            $(document).click(function(event) {
              if ( $(event.target).hasClass('quickSearchResultsActive')) {
                // console.log('not search clicked!');
                searchInputValue = $('#search_query').val("SEARCH");
                searchInputValue = $('#search_query').attr('placeholder','SEARCH');
                $("section.quickSearchResults").empty();
                $('a.reset.quicksearch').fadeOut();
                $('a.modal-close.custom-quick-search').fadeOut();
              }
            });

            // 2nd HOVER IMAGES
            // $('figure.card-figure').each(function() {
            // if ( $(this).find('img.card-image').length >= 2 ) {
            //   $(this).addClass('multiple-images');
            // }
            // });


        });
    }, 200);

    utils.hooks.on('search-quick', (event, currentTarget) => {
      const searchQuery = $(currentTarget).val();

        // server will only perform search with at least 3 characters
        if (searchQuery.length < 3) {
            return;
        }

        doSearch(searchQuery);

        $('.navPages-quickSearch input').on('focus click', function() {
          $(this)[0].setSelectionRange(0, 0);
          const searchQuery = $(currentTarget).val("");
        });

        $('a.modal-close.custom-quick-search').click(function(e) {
            e.preventDefault();
          searchInputValue = $(event.currentTarget).val("SEARCH");
          searchInputValue = $(event.currentTarget).attr('placeholder','SEARCH');
          $('#body').removeClass('quick-search-active');
          $('header-container').removeClass('quick-search-active');
          $('.main-nav-container').removeClass('quick-search-active');
          $('.top-menu .content').removeClass('quick-search-active');
          $("section.quickSearchResults").empty();
          $(this).fadeOut();
          $('a.reset.quicksearch').fadeOut();
          $('a.modal-close.custom-quick-search').fadeOut();
        });
    });

    // Catch the submission of the quick-search
    $quickSearchDiv.on('submit', event => {
        const searchQuery = $(event.currentTarget).find('input').val();

        if (searchQuery.length === 0) {
            return event.preventDefault();
        }

        return true;
    });
}
