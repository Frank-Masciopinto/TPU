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


            var screenWidth = window.matchMedia("(min-width: 801px)");
            var nineHundredScreenWidth = window.matchMedia("(max-width: 900px)");
            var desktopScreenWidth = window.matchMedia("(min-width: 801px)");
            // var sevenToEightScreenWidth = window.matchMedia("(min-width: 701px) and (max-width: 800px)");
            // var sixToSevenScreenWidth = window.matchMedia("(min-width: 601px) and (max-width: 700px)");
            // var fourFiftyToFiveFiftyScreenWidth = window.matchMedia("(min-width: 451px) and (max-width: 550px)");
            // var fourFiftyandBelowScreenWidth = window.matchMedia("(min-width: 1px) and (max-width: 450px)");
            myFunction(screenWidth) // Call listener function at run time
            screenWidth.addListener(myFunction) // Attach listener function on state changes

            function myFunction(screenWidth) {
              // DESKTOP
              if (nineHundredScreenWidth.matches) { // DESKTOP - If screen is 800px or MORE
                // CUSTOM - SET QUICKSEARCH DROPDOWN WIDTH EQUAL TO SEARCH FIELD
                // var searchFieldWidth = $('.navPages-quickSearch.right.searchbar .form-fieldset').width();
                var searchFieldWidth = $('header.header').width();
                searchFieldWidth = (searchFieldWidth * .6);
                // console.log(searchFieldWidth);
                $('div#menu.left-logo section#quickSearch.quickSearchResults').css({
                  'width': (searchFieldWidth) + 'px'
                });
                // LEFT LOGO
                // CUSTOM - SET CARD WIDTH TO EQUAL ARTICLE WIDTH MINUS FIGURE WIDTH
                var quickSearchFigureWidth = $('section#quickSearch .productGrid[data-list-name="Quick Search Results"] article.card .card-body').height();
                var quickSearchArticleWidth = $('section#quickSearch.quickSearchResults article.card').width();
                // console.log(quickSearchArticleWidth);
                $('div#menu.left-logo section#quickSearch .productGrid[data-list-name="Quick Search Results"] article.card .card-body').css({
                  'width': (quickSearchArticleWidth-quickSearchFigureWidth) + 'px'
                });
                // CUSTOM - SET FIGURE WIDTH TO EQUAL FIGURE HEIGHT TO KEEP FIGURE SQAURE
                var quickSearchFigureWidth = $('section#quickSearch .productGrid[data-list-name="Quick Search Results"] article.card .card-body').height();
                // console.log(quickSearchFigureWidth);
                $('div#menu.left-logo section#quickSearch.quickSearchResults figure.card-figure img').attr('style', 'max-height:' +quickSearchFigureWidth+ 'px !important');
                $('div#menu.left-logo section#quickSearch.quickSearchResults figure.card-figure').css({
                  'width': (quickSearchFigureWidth) + 'px'
                });
                // CENTER SEARCH RESULTS FOR LEFT LOGO + STICKY SETTINGS
                var quickSearchResultsWidth = $('.search-container.sticky#menu section.quickSearchResults').width();
                var quickSearchInputWidth = $('.search-container.sticky#menu section.quickSearchResults').width();
                var searchWidthDifference = (quickSearchResultsWidth - quickSearchInputWidth);
                var searchOffset = (searchWidthDifference / 2);
                $('.search-container.sticky#menu section.quickSearchResults').css({
                  'right': (searchOffset) + 'px'
                });

                // CENTERED LOGO
                // CUSTOM - SET FIGURE HEIGHT TO EQUAL FIGURE WIDTH TO KEEP FIGURE SQAURE
                var quickSearchFigureWidth = $('section#quickSearch.quickSearchResults figure.card-figure').width();
                // console.log(quickSearchFigureWidth);
                $('div#menu.center-logo section#quickSearch.quickSearchResults figure.card-figure img').attr('style', 'max-height:' +quickSearchFigureWidth+ 'px !important');
                $('div#menu.center-logo section#quickSearch.quickSearchResults figure.card-figure').css({
                  'height': (quickSearchFigureWidth) + 'px'
                });

                // RIGHT LOGO
                // CUSTOM - SET FIGURE HEIGHT TO EQUAL FIGURE WIDTH TO KEEP FIGURE SQAURE
                var quickSearchFigureWidth = $('section#quickSearch.quickSearchResults figure.card-figure').width();
                // console.log(quickSearchFigureWidth);
                $('div#menu.right-logo section#quickSearch.quickSearchResults figure.card-figure img').attr('style', 'max-height:' +quickSearchFigureWidth+ 'px !important');
                $('div#menu.right-logo section#quickSearch.quickSearchResults figure.card-figure').css({
                  'height': (quickSearchFigureWidth) + 'px'
                });
              } else if (desktopScreenWidth.matches) { // DESKTOP - If screen is 800px or MORE
                // CUSTOM - SET QUICKSEARCH DROPDOWN WIDTH EQUAL TO SEARCH FIELD
                // var searchFieldWidth = $('.navPages-quickSearch.right.searchbar .form-fieldset').width();
                var searchFieldWidth = $('header.header').width();
                searchFieldWidth = (searchFieldWidth * .5);
                // console.log(searchFieldWidth);
                $('div#menu.left-logo section#quickSearch.quickSearchResults').css({
                  'width': (searchFieldWidth) + 'px'
                });
                // LEFT LOGO
                // CUSTOM - SET CARD WIDTH TO EQUAL ARTICLE WIDTH MINUS FIGURE WIDTH
                var quickSearchFigureWidth = $('section#quickSearch .productGrid[data-list-name="Quick Search Results"] article.card .card-body').height();
                var articleWidth = $('section#quickSearch.quickSearchResults article.card').width();
                // console.log(quickSearchArticleWidth);
                $('div#menu.left-logo section#quickSearch .productGrid[data-list-name="Quick Search Results"] article.card .card-body').css({
                  'width': (quickSearchArticleWidth-quickSearchFigureWidth) + 'px'
                });
                // CUSTOM - SET FIGURE WIDTH TO EQUAL FIGURE HEIGHT TO KEEP FIGURE SQAURE
                var quickSearchFigureWidth = $('section#quickSearch.quickSearchResults figure.card-figure').height();
                // console.log(quickSearchFigureWidth);
                $('div#menu.left-logo section#quickSearch.quickSearchResults figure.card-figure img').attr('style', 'max-height:' +quickSearchFigureWidth+ 'px !important');
                $('div#menu.left-logo section#quickSearch.quickSearchResults figure.card-figure').css({
                  'width': (quickSearchFigureWidth) + 'px'
                });

                // CENTER SEARCH RESULTS FOR STICKY NAV
                var quickSearchResultsWidth = $('.search-container.sticky#menu section.quickSearchResults').width();
                // console.log(quickSearchResultsWidth);
                var quickSearchInputWidth = $('.header-container.sticky-header .search-container.sticky#menu .right.searchbar').width();
                // console.log(quickSearchInputWidth);
                var searchWidthDifference = (quickSearchResultsWidth - quickSearchInputWidth);
                // console.log(searchWidthDifference);
                var searchOffset = (searchWidthDifference / 2);
                // console.log(searchOffset);
                $('.header-container.sticky-header .search-container.sticky#menu section.quickSearchResults').css('right', -Math.abs(searchOffset)+"px");
                $('.header-container.sticky-header .search-container.sticky#menu a.modal-close.custom-quick-search').css('right', -Math.abs(searchOffset)+"px");

                // CENTERED LOGO
                $('.center-logo.search-container.not-sticky#menu section#quickSearch.quickSearchResults').css({
                  'width': '100%'
                });
                // CUSTOM - SET FIGURE HEIGHT TO EQUAL FIGURE WIDTH TO KEEP FIGURE SQAURE
                var quickSearchFigureWidth = $('div#menu.center-logo.not-sticky section#quickSearch.quickSearchResults figure.card-figure').width();
                // console.log(quickSearchFigureWidth);
                $('div#menu.center-logo.not-sticky section#quickSearch.quickSearchResults figure.card-figure img').attr('style', 'max-height:' +quickSearchFigureWidth+ 'px !important');
                $('div#menu.center-logo.not-sticky section#quickSearch.quickSearchResults figure.card-figure').css({
                  'height': (quickSearchFigureWidth) + 'px'
                });

                var searchFieldWidth = $('header.header').width();
                searchFieldWidth = (searchFieldWidth * .6);
                // console.log(searchFieldWidth);
                $('.center-logo.search-container.sticky#menu section#quickSearch.quickSearchResults').css({
                  'width': (searchFieldWidth) + 'px'
                });
                // STICKY NAV SEARCH - CENTERED LOGO
                // CUSTOM - SET CARD WIDTH TO EQUAL ARTICLE WIDTH MINUS FIGURE WIDTH
                var quickSearchFigureWidth = $('.center-logo.search-container.sticky#menu section#quickSearch .productGrid[data-list-name="Quick Search Results"] article.card .card-body').height();
                var quickSearchArticleWidth = $('.center-logo.search-container.sticky#menu section#quickSearch.quickSearchResults article.card').width();
                // console.log(quickSearchArticleWidth);
                $('.center-logo.search-container.sticky#menu section#quickSearch .productGrid[data-list-name="Quick Search Results"] article.card .card-body').css({
                  'width': (quickSearchArticleWidth-quickSearchFigureWidth) + 'px'
                });
                // CUSTOM - SET FIGURE WIDTH TO EQUAL FIGURE HEIGHT TO KEEP FIGURE SQAURE
                var quickSearchFigureWidth = $('.center-logo.search-container.sticky#menu section#quickSearch .productGrid[data-list-name="Quick Search Results"] article.card .card-body').height();
                // console.log(quickSearchFigureWidth);
                $('.center-logo.search-container.sticky#menu section#quickSearch.quickSearchResults figure.card-figure img').attr('style', 'max-height:' +quickSearchFigureWidth+ 'px !important');
                $('.center-logo.search-container.sticky#menu section#quickSearch.quickSearchResults figure.card-figure').attr('style', 'width:' +quickSearchFigureWidth+ 'px !important');

                // RIGHT LOGO
                // CUSTOM - SET FIGURE HEIGHT TO EQUAL FIGURE WIDTH TO KEEP FIGURE SQAURE
                var figureWidth = $('section#quickSearch.quickSearchResults figure.card-figure').width();
                // console.log(quickSearchFigureWidth);
                $('div#menu.right-logo section#quickSearch.quickSearchResults figure.card-figure img').attr('style', 'max-height:' +quickSearchFigureWidth+ 'px !important');
                $('div#menu.right-logo section#quickSearch.quickSearchResults figure.card-figure').css({
                  'height': (quickSearchFigureWidth) + 'px'
                });

                var searchFieldWidth = $('header.header').width();
                searchFieldWidth = (searchFieldWidth * .6);
                // console.log(searchFieldWidth);
                $('.right-logo.search-container.sticky#menu section#quickSearch.quickSearchResults').css({
                  'width': (searchFieldWidth) + 'px'
                });
                // STICKY NAV SEARCH - CENTERED LOGO
                // CUSTOM - SET CARD WIDTH TO EQUAL ARTICLE WIDTH MINUS FIGURE WIDTH
                var quickSearchFigureWidth = $('.right-logo.search-container.sticky#menu section#quickSearch .productGrid[data-list-name="Quick Search Results"] article.card .card-body').height();
                var quickSearchArticleWidth = $('.right-logo.search-container.sticky#menu section#quickSearch.quickSearchResults article.card').width();
                // console.log(quickSearchArticleWidth);
                $('.right-logo.search-container.sticky#menu section#quickSearch .productGrid[data-list-name="Quick Search Results"] article.card .card-body').css({
                  'width': (quickSearchArticleWidth-quickSearchFigureWidth) + 'px'
                });
                // CUSTOM - SET FIGURE WIDTH TO EQUAL FIGURE HEIGHT TO KEEP FIGURE SQAURE
                var quickSearchFigureWidth = $('.right-logo.search-container.sticky#menu section#quickSearch .productGrid[data-list-name="Quick Search Results"] article.card .card-body').height();
                // console.log(quickSearchFigureWidth);
                $('.right-logo.search-container.sticky#menu section#quickSearch.quickSearchResults figure.card-figure img').attr('style', 'max-height:' +quickSearchFigureWidth+ 'px !important');
                $('.right-logo.search-container.sticky#menu section#quickSearch.quickSearchResults figure.card-figure').attr('style', 'width:' +quickSearchFigureWidth+ 'px !important');
            }
            }
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
