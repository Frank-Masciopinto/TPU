# **Parts Warehouse Release Notes**

## December 22, 2021 Version 2.3.4
  * The shipping method background-color for the Dark variation should now be black by default, instead of white.
    * Updated Files
      * assets/scss/parts-warehouse.scss

  * Sharing by email from product page share links should now directly open your email client instead of the Google share interrupt page. I have updated the templates/components/common/share.html template file with the latest version from Conerstone v.6.2.0.
    * Updated Files
      * templates/components/common/share.html
      
## November 12, 2021 Version 2.3.3
  * BigCommerce Bug Report
    * [THEME-2109] Parts Warehouse – Web page content is not displaying on iOS mobile devices if “Side Navigation Visibility” is set to “Show Side Navigation”
      * Updated Files:
        * assets/scss/parts-warehouse.scss
    * [THEME-2122] Parts Warehouse quick view quantity selector not static when scrolling. Positioning rules corrected for increment / decrment boxes scrolling within window in QuickView modal.
      * Updated Files
        * assets/scss/parts-warehouse.scss

  * CUSTOMER SUPPORT ITEMS:
    * Quotation marks will be rendered as typed within both QuickSearch Message and Search Results heading. Search_Query text will no longer appear in place of searched term when no results are available.
      * Updated Files
        * lang/en.json
        * templates/components/search/heading.html
        * templates/components/search/quick-results.html

    * Compare checkboxes should now work when clicking on either "Compare" text or "checkbox" in both list & grid views.
      * Updated Files
        * assets/scss/parts-warehouse.scss

## September 8, 2021 Version 2.3.2
End of BigCommerce Fall  2021
 * Updated pricing & meta images for each variation.
   * Updated Files:
     * config.json
     * package.lock.json
     * package.json

## August 30, 2021 Version 2.3.1
Announcing BigCommerce Fall Sale 2021
 * Updated pricing & meta images for each variation.
   * Updated Files:
     * config.json
     * package.lock.json
     * package.json
   * Added Directory & Files:
     * meta/sale

## May 28, 2021 Version 2.3.0
* Customer Support Items:
  * Updated Warranty Tab on the product page to inherit the text entered within en.json file. The quickview modal was already inheriting this.
    * Updated Files:
    * templates/components/products/product-view.html

  * Tool-tip spelling correction for “Including Tax”
    * Updated Files:
      * lang/en.json line#: 740.

  * Fix for font styles not updating within page builder text widget on content pages. Text widgets added to content pages will now adhere to widget font settings, including custom settings for: font-families, font-weights, font-sizes, font-colors and alignment.
    * Updated Files:
      * assets/scss/parts-warehouse.scss

  * If there is 1 or less items visible on product listing pages, then compare checkboxes and compare button will be hidden.
    * Updated Files:
      * assets/js/theme/global/partswarehouse/custom.js


## May 18, 2021 Version 2.2.9
* BigCommerce Bug Report
  * THEME-2018: Lonestar Templates – Facets with Special Characters Do Not Expand on “Show More”. We have updated all files according to: https://github.com/bigcommerce/cornerstone/commit/697fcf98122086974faced80e8fe19cffab161cd. “Show More” Link is opening popup that contains more products. It’s worth noting that in testing special characters within custom fields, niether Cornerstone 5.4.0 or PW 2.2.9 display these custom fields within the facet filters.
    * Replaced following Files with Cornerstone files version 5.2.0:
      * UPDATED: assets/scss/parts-warehouse.scss
      * REPLACED: entire directory with Cornerstone 5.4.0: templates/components/faceted-search

  * THEME-2009: Parts Warehouse – Sale Badge Displays when using Product Rules. *This no longer appears to be an issue. On both Cornerstone 5.4.0 & Partswarehouse 2.2.9, category pages appear the same considering sale flags.
    * Replaced following Files with Cornerstone files version 5.2.0:

  * THEME-1500: Lonestar Templates – Parts Warehouse – Add-to-cart popup behavior inconsistent across storefront. *I tested on 5/17/21 on Cornerstone 5.4.0 on the same product on category page and product page, and it still re-directs to cart page when adding from category page, and displays popup on product page after adding to cart. We are considering this resolved, since this is the current behavior of Cornerstone.
    * Replaced following Files with Cornerstone files version 5.2.0:
      * UPDATED: assets/scss/parts-warehouse.scss
      * REPLACED: entire directory with Cornerstone 5.4.0: templates/components/faceted-search

  * [THEME-1482] Parts Warehouse – “Search suggest” still suggests regardless of setting being toggled off. *Toggling “Search Suggest” in control panel will now enable/disable search suggestions on search results page. Also the en.json file has been updated to correct the syntax.
    * Updated Files:
      * templates/pages/search.html
      * lang/en.json

  * THEME-2068: [Lonestar Templates] Saving vaulted credit cards in Account pages not working for some gateways – Revisions made according to GitHub reference: https://github.com/bigcommerce/cornerstone/commit/ba9eab1b00cbd6c10005239cdc5a1c76dc224341.
    * Replaced following Files with Cornerstone files version 5.2.0:
    * assets/js/theme/common/payment-method.js
    * templates/pages/account/add-payment-method.html
    * templates/pages/account/edit-payment-method.html

  * THEME-2079: Parts Warehouse – wishlist-details.html does not support pagination. Wishlists will now support pagination when more than 50 products are added to a single wishlist.
    * Upadated Files:
      * REPLACED with Cornerstone 5.4.0: assets/js/theme/wishlist.js
      * AMMENDED with Cornerstone 5.4.0: templates/components/account/wishlist-item-list.html
      * AMMENDED with Cornerstone 5.4.0: templates/components/common/paginator.html
      * AMMENDED with Cornerstone 5.4.0: templates/pages/account/wishlist-details.html

  * Removed Geo Trust Seal Theme Editor Option and added various new Footer Global regions that will now be used to enter SSL seal badges and information. These new global footer regions can be used for a multitude of content as well. This was completed at the request of BigCommerce.
    * Upadated Files:
      * schema.json
      * config.json
      * templates/components/common/footer.html
      * templates/components/common/footer-product.html
      * templates/components/common/payment-icons.html
      * assets/scss/parts-warehouse.scss

* CUSTOMER SUPPORT ITEMS:
  * Corrected issue of main product image on product page being clipped when image too large for the container.
    * Updated Files:
    * assets/scss/parts-warehouse.scss

  * Brands Page images will now appear as large as possible without distorting.
    * Updated Files:
      * assets/scss/parts-warehouse.scss

  * Bulk Pricing Modal will now appear centered on the screen.
    * Updated Files:
      * assets/scss/parts-warehouse.scss

  * Corrected blog alignment issues on blog page.
    * Updated Files:
      * assets/scss/parts-warehouse.scss

  * Corrected issue of when a default option is out of stock, an add to cart button does not appear for in-stock options. Add to cart button will now appear and be unclickabel if out of stock and will be clickable when options are in stock.
    * Updated Files:
      * UPDATED WITH Cornerstone version 5.4.0: templates/components/products/add-to-cart.html
      * AMMENDED WITH Cornerstone version 5.4.0: assets/js/theme/common/product-details.js. All code was replaced with the exception of leaving “import _ from ‘lodash’;” intact. Also left the entire original section: showProductImage(image). This is necessary to maintain our custom zoom window and product option image swap.
      * AMMENDED WITH Cornerstone version 5.4.0: lang/en.json – beneath “Common”
      * AMMENDED: assets/scss/parts-warehouse.scss – beneath: // FIX FOR ADD TO CART BUTTON VISIBILITY WHEN DEFAULT OPTION IS UNAVAILABLE
      * AMMENEDED section class=”productView-details product-options” with Cornerstone version 5.4.0: templates/components/products/product-view.html
      * AMMENEDED section class=”productView-details product-options” with Cornerstone version 5.4.0:templates/components/products/product-quick-view.html
      * ADDED FROM Cornerstone version 5.4.0: assets/js/theme/common/aria
      * ADDED FROM Cornerstone version 5.4.0: assets/js/theme/common/utils
      * ADDED FROM Cornerstone version 5.4.0: assets/js/theme/common/product-details-base.js

  * Corrected issue when default option is set to an option rule image, and then clicking back to an option without an image rule, the main-image container does not update to the default image in the control panel. Clicking an option without a rule image will now display the first image listed under said product in the control panel, just as Cornerstone does.
    * Updated Files:
      * assets/js/theme/global/loading-progress-bar.js
      * templates/components/common/footer-product.html

  * Added alert boxes for shipping messages to home page.
    * Updated Files:
    * templates/components/page/home-page-with-sidenav-float-carousel.html
    * templates/components/page/home-page-with-sidenav.html

## February 5, 2021 Version 2.2.8
* BigCommerce Bug Report
  * THEME-2039: PartsWarehouse – Lonestar Templates – Theme Vertical Reassignments Completed. Industries have been adjusted according to the recommendations provided by BigCommerce as follows:
    * Classic – “automotive_industrial”, “electronics_computers”
    * Light – “automotive_industrial”, “electronics_computers”
    * Dark – “automotive_industrial”, “electronics_computers”
    * Champion – “automotive_industrial”, “electronics_computers”

    * optimized_for” also updated on all variations to:
      *  “multi_purpose”
      * “mobile_tablet_desktop”
      * “sales_discounts”
      * “large_catalog”

    * Updated Files:
      * config.json

## October 27, 2020 Version 2.2.7
* NEW FEATURES:
  * Global Page Builder Elements Added Throughout Theme! Using the global regions in the header & footer areas will be visible throughout your site. Adding content to the global regions within product, category, or content pages will add that content to the respective pages throughout your site. That is, if you add content to a Global Widget on a product page, that content will be visible within that area on ALL product pages, etc…
    * Updated Files:
      * templates/components/common/header.html
      * templates/components/common/footer-product.html
      * templates/components/common/footer.html
      * templates/components/page/content-page-no-sidenav.html
      * templates/components/page/content-page-with-sidenav.html
      * templates/components/page/product-page-no-sidenav.html
      * templates/components/page/product-page-with-recommended-below.html
      * templates/components/page/product-page-with-sidenav.html
      * templates/components/products/product-quick-view.html
      * templates/components/products/product-view.html
      * templates/layout/base.html
      * templates/layout/checkout.html
      * templates/layout/home-layout.html
      * templates/layout/product-new.html
      * templates/pages/category.html
      * templates/pages/product.html
      * templates/pages/page.html
      * assets/scss/parts-warehouse.scss

* CUSTOMER SUPPORT ITEMS:
  * Corrected issue with Page Builder Region home_below_carousel not displaying on mobile.
    * Updated Files:
      * assets/scss/parts-warehouse.scss

  * Solution for the mobile menu issue triggering links to other pages when scrolling on a mobile device.
    * Updated Files:
      * assets/js/theme/global/partswarehouse/custom.js

## July 31, 2020 Version 2.2.6
* CUSTOMER SUPPORT ITEMS:
  * We are aware that there were issues with our last update, version 2.2.5. The issues that we are aware of are of the following: Product Page: reviews, ratings, & bulk pricing are not showing up and/or functioning. In addition, product ratings are not showing up on the home page or within the related products on the product page. We have corrected these issues within version 2.2.6.
    * This process consisted of starting over with Version 2.2.4 and remaking the changes committed in version 2.2.5. In addition we have made the following revisions.

  * Corrected width and alignment of search bar within the body of a 404 error page at 1260px and below.
    * Updated Files:
      * assets/scss/parts-warehouse.scss

  * Theme Editor option for top menu cart icon color will now adjust accordingly.
    * Updated Files:
      * assets/scss/parts-warehouse.scss
      * assets/scss/optimized-checkout.scss

## July 24, 2020 Version 2.2.5
* CUSTOMER SUPPORT ITEMS:
  * Cleaned up styling and alignment of additional payment buttons at the bottom of the cart page, within the cart dropdown, and checkout page.
  * Corrected color styling of mobile open menu close icon “X”. This will now be the topMenu font-color setting on all pages, and the checkout page.
    * Updated Files:
      * assets/scss/parts-warehouse.scss
      * assets/scss/optimized-checkout.scss

  * Enhanced eCommerce data was not being generated within the DOM, where product carousels were used. We have corrected this issue including all home page product carousels, and product page carousels, both vertical and horizontal.
    * Updated Files:
      * templates/components/products/carousel.html
      * templates/components/products/carousel-vertical.html

  * Corrected swatch images being cut off on the far right on hover on the product page.
    * Updated Files:
      * assets/scss/parts-warehouse.scss

  * Updated grunt and icons.svg / sprite img generation method. StumbleUpon svg has been deprecated and removed.
    * Updated Files:
      * package.json
      * package-lock.json
      * templates/layout/amp-iframe.html
      * templates/layout/base.html
      * templates/layout/home-layout.html
      * templates/layout/product-new.html
      * Removed: templates/components/common/icons
      * Removed: assets/icons/stumbleupon.svg
      * Updated: assets/icons/instagram.svg (was corrupted file)
      * Added: Gemfile
      * Added: Gemfile.lock
      * Added: jest-eventemitter2-transformer.js
      * Added: jest.config.js
      * Added: jest.setup.js
      * Generated new: assets/img/icon-sprite.svg

  * Corrected issue when in Quick View when no image swap rules are set and an option is selected. Image was breaking.
    * Updated Files:
      * assets/js/theme/global/modal.js

## July 6, 2020 Version 2.2.4
* CUSTOMER SUPPORT ITEMS:
  * Removed duplicate “Sitemap” link from “Accounts & Orders” column within the footer. There is a “Sitemap” link within the copyright section at the bottom of the footer.
    * Updated Files:
        * templates/components/common/footer.html
        * templates/components/common/footer-product.html

  * Page Builder regions added above and below content area for content pages. There will now be a total of 3 widgets on content pages.
    * Updated Files:
        * templates/pages/page.html
        * templates/components/page/content-page-no-sidenav.html
        * templates/components/page/content-page-with-sidenav.html

  * Styling rule edited for left logo positioning slightly shifting larger when scrolling down the page, when sticky nav is active.
    * Updated Files:
        * assets/scss/parts-warehouse.scss

  * Styling rule edited for truncated product cards when “login for picing” is active for screen-widths 980 and below.
    * Updated Files:
        * assets/scss/parts-warehouse.scss

  * Styling rule edited for visited link color in Light Variation, on product page in tabs description area, after opening in a new window, then returning to original tab and when hovering near the visited link. It should now match the rest of theme editor settings.
    * Updated Files:
        * assets/scss/parts-warehouse.scss

  * Mobile Menu icon color will now adhere to Top Menu font color theme editor settings.
    * Updated Files:
        * assets/scss/parts-warehouse.scss

  * Fix for category page jumping when image is touched or clicked on mobile.
    * Updated Files:
        * templates/components/products/card.html

  * Fix for product card image being hidden on hover when 2nd hover image is disabled within the Theme Editor.
    * Updated Files:
        * templates/components/products/card.html
        * assets/scss/parts-warehouse.scss

  * Fix for duplicate SideNav arrows when FontAwesome script references are added to theme.
    * Updated Files:
        * assets/scss/parts-warehouse.scss

* BIGCOMMERCE BUG REPORT ITEMS:
  * THEME-1981 – PartsWarehouse theme – Lonestar Templates – Update jQuery in Theme. jQuery version updated to 3.5.1
    * Updated Files:
        * package.json
        * templates/components/common/footer-product.html
        * Removed unnecessary/commented-out jQuery references from:
        * templates/layout/base.html
        * templates/layout/product-new.html

## May 15, 2020 Version 2.2.3
* Customer Support
  * Product options containing special characters such as ampersands and quotes should render as entered on cart page and cart preview modal. This was corrected by using triple braces instead of double for everywhere the {{value}} expression appears in the templates/cart/content.html and templates/cart/preview.html files.
  * Product reviews that contain special characters such as ampersands and quotes, should render as typed within reviews setions on product pages. This was corrected within the templates/components/products/reviews.html, templates/components/amp/products/reviews.html files, by using triple braces and removing the nl2br where the {{nl2br text}} expression appears in this element:
  {{{text}}}.

  * Removing the nl2br removes line breaks entered on the user end, but we have compensated for this using the css rule:
    * p.productReview-body {
      white-space: pre-line;
    }
    ...yielding the same results.

    * The title within each review now has triple braces as well within this element:
      * {{{ title }}}
  * Fix for sidenav banners not appearing on subcategory pages, and when product filtering is disabled. Duplicate sidenav banners will not appear when product filtering is enabled. All calls to sidenav banners are now found here: templates/custom/category-sidenav.html, templates/custom/brand-sidenav.html, and templates/custom/search-results-sidenav.html.
  * Promo input field and “Apply” button on optimized checkout will now be full-width and stacked vertically, as the display flex styling was not allowing enough space to enter Gift Certificate codes on handheld devices.
  * Input field colors on optimized checkout will be controlled by the colors under Forms and not by the Optimized Checkout section within the Theme Editor.
  * Fix for product card/images not loading in IE11. This was an issue that pertained to a custom module developed to allow the fancybox zoom to work on mobile devices. We updated our custom module and both the ie11 issue of card images not loading and the mobile fancybox now work.

## May 5, 2020, Version 2.2.2
  * BC CLI Reinstall - https://developer.bigcommerce.com/stencil-docs/installing-stencil-cli/installing-stencil

## April 28, 2020 Version 2.2.2
* Fix for jittery and non-functional "Create Account" button.

## April 17, 2020 Version 2.2.1
* New Page Builder Features Included with additional widgets strategically placed to allow for optimum customizations to your store!
* Customer Support
* Fix for “&” symbol rendering incorrectly within sidebar for faceted search.
* Main nav arrow colors will now adjust when changing color settings under Main Navigation > Main Nav Font Color.
* Restyled download button on cart page to a circle instead of rectangular
* Focus button color within Shipping Estimator on cart page will now match the hover color your theme settings.
* Design Improvements
* Added Fancybox functionality to mobile.
* Added 2nd hover image on touch for mobile product cards, along with buttons to select quickview or product details which directs to the product page.
* Enabled and styled quickview for mobile.

## February 7, 2020 Version 2.2.0
* Design Improvements
  * Wishlist button & dropdown color fix for Dark variation
  * Positioning fix for topMenu cart button when positive on mobile
  * Quickview modal z-index fix. Now appears on top of sticky quickSearch
  * Positioning fix for newsletter popup on mobile. Should now be centered in screen
  * Fix for bottom marketing banners width. They were too wide when body width is set to 1170px. Changed from 80% to 78%.
  * Disabled MSRP by default. If you already have this feature you may still need to change as needed.
  * Set Classic variation body with to 1170px by default. (for new purchases only).
  * Set Sale price to primary color on each variation.
  * Set non-sale price to variation base font color.

* Customer Support
  * Fix for main product image alignment on product page when images have varying aspect ratios
  * Fix for hiding MSRP price when toggled off
  * Fix for product carousel beneath main product image on product page not working properly. The slider nav carousel was not sliding and not displaying all images.
  * Fix for theme settings to disable the slider nav carousel beneath the main product image on the product page. Will now display as a grid, if disabled as intended
  * When only one product image set, arrows to scroll will not appear now.
  * Added Theme Editor option for Pagination colors found here: Global > Pagination Visibility & Color > Background Color & Font Color. Active & hover color for pagination will be set here: Global > Common Colors > Primary Color. Border Colors for pagination will be set here: Global > Common Colors > Common dark border.
  * Credit Card CVV code hover popup background color will now be set to the checkout input field color found here: Optimized Checkout > Form inputs > Background Color. This is limited to either "white" or transparent. This was only an issue when using the Dark variation.
  * Added Theme Editor option to adjust qty box background-color and font-color found here: Global > Qty Box Background Color and Qty Box Font Color.
  * Corrected issue with "Now" pricing label showing on product page when it should not.
  * Fix for: Related product pricing is overwritten for products with variants. Related products section cannot be within the div with the class of productView. Moved related-products-container out of productView div.
  * Gave div#side-categories.sideCategoryList.desktop display none style at 800px and below on product page only. This was causing an issue with the breadcrumbs and additional spacing at top of product page.

* New Features
  * Added custom "Call for Price" text input fields for text on one line and phone number on 2nd line. This will only show on products that have the Show “Call for pricing” message instead of the price, checked in the control panel. Otherwise, nothing concerning the "Call for Price" message will show on the product cards. Also, it will only show that message when text is entered in the Theme Editor option found here: Products > Card Prices > Call for Price Text & Call for Price Phone Number.
  * A "View Details" button will now show on all products without pricing that links to the product page. The "View Details" button will also show on products that cannot be purchased due to no stock, unless an out of stock message is entered and active within the control panel, found here: Advanced Settings > Inventory > Stock level > Out-of-stock message", at which point the entered custom "Out of Stock" message will show.
  * Removed some even font-size settings from Main & Sub-nav, and SideNav and SideSubNav in order to accommodate for new features within schema file. There are still plenty of font-size settings remaining. The only difference is now they increment/decrement by 2 font-sizes instead of one.

## January 17, 2020 Version 2.1.9
* New Product Card Design and Features
  * > Options to display Brands and/or SKUs
  * > Options to show brands and skus on separate lines or up to 2 lines each
  * > Options to show/hide MSRP price
  * > Options to show/hide Non-Sale price
  * > Options to choose 1,2,3,or 4 line Product Titles
  * > Options to adjust font-sizes for Product Titles
  * > Options to show current pricing on up to 2 lines
  * > Options to adjust font-sizes for current prices
  * > Options to change or remove pricing labels for Current, Sale, Regular, and MSRP prices
  * > Options to choose independent colors for Sale, Regular, MSRP, and Current prices.
  * > Vertically aligned images, even when 2nd hover image is enabled and a different height or dimension

* Redesigned QuickSearch
  * > Images are now larger and in square container figures like the rest of the theme
  * > QuickView option added
  * > 2nd hover image functionality added
  * > QuickSearch results will now dropdown to 70% of the viewport
  * > Closing the quicksearch automatically resets it, making it easier and quicker to type a new search. This new functionality deprecated the reset button and the need to hightlight and delete the previous search.</li>
  * > When right and centered logos are active, quicksearch results will now be full-width of the body container and in grid-layout
  * > When sticky topmenu is active quicksearch and quickSearch results will always be centered in the page after scrolling down
  * > Mobile quicksearch results will now be in grid-layout 2-columns wide

* Product Page Features
  * > Added product carousels to product page, including vertical slider when using correlated layout
  * > Added arrows to main and thumbnail images when needed
  * > New pricing design to help your customers get the information they need and aid in conversions

* Redesigned Compare page
  * > Compare results page will now closely resemble the rest of the theme and include all new features such as brand/sku and pricing options

* List/Grid View
 	* > When list or grid view is toggled, the selected layout will now remain active after pagination
 	* > Corrected issue with bottom pagination not being clickable when list-view is active by default

* Internet Explorer Fixes
  * > Cleaned up design of carousel arrows for IE

* Carousel Arrow colors
  * > New Global controls for arrow colors for hero, main product image, and fancybox. Found here: Global > Arrow Colors (includes, hero, main product img, and fancybox.) > Arrow color

* Responsive Design Improvements
 	* > Adjusted width of newsletter popup at mobile width of 550px and below to 95% so that it fits within the container
 	* > Corrected quicksearch dropdown overlapping product page buttons when not active on iPad portrait view
 	* > Adjusted positioning of dropdown arrows in mobile menu to be more aligned with corresponding items
 	* > Added Theme Editor color options for mobile menu font-colors and mobile menu active font colors. Useful for changing background-colors on active items
 	* > Mobile Menu: Eliminated double click. Items with submenus now require a single click to go to the linked page. Only clicking the arrows will open the submenu below.

* Updates per Customer Requests
 	* > Added theme editor settings to adjust number of blog posts on blog page with options of 6, 9, or 12 per page. Found here: Blog > Number of Posts per page.
 	* > Added theme editor settings to adjust number of recent blog posts within footer with options of 4, 6, or 8. Found here: Footer > Number of recent blog posts.
 	* > Corrected logo text color on optimized checkout to match the setting within the theme editor, same as the rest of the theme.
 	* > Added theme editor setting to adjust Credits Bar Border Color. Found here: Footer > Credits Bar Border Color.
 	* > Corrected the issue with "New Products" not displaying on home page when not using product carousels.
 	* > Corrected distorted images in featured products sections on home page.
 	* > Corrected z-index issue with login "or" text within footer on mobile when mobile menu is open.
 	* > Fancybox images will now have correct corresponding image alt and title tags.</li>
 	* > Fix for subcategory images misalignment when link texts are varying between 1 to 2 lines for desktop and mobile.
  * > Structured Data: Errors: Invalid enum value in field 'availability'. We have added suggested code from <a href="https://support.bigcommerce.com/s/question/0D51B00004ANw0vSAD/itemprop-availability-in-cornerstone-theme">https://support.bigcommerce.com/s/question/0D51B00004ANw0vSAD/itemprop-availability-in-cornerstone-theme</a> to both the price.html & price-range.html files. Note that it may take awhile for Google to recognize the fix. If the problem persists we will continue to research & troubleshoot.

* BigCommerce Bug Report
  * THEME-1912: Fix for Hiding Footer year and store name will hide all Product Thumbnails.  The custom js that gets the current year was looking for a div that did not exist when this setting is disabled. Has been corrected with an if statement that checks if the div exists before executing.
  * THEME-1916: Fix for Firefox - Mobile - Parts of menu are inaccessible. This has been corrected. Had to switch the bottom padding to the navPages-list element from the .navPages element.


## September 26, 2019 Version 2.1.8
*   Fixes & Updates per Customer Requests
*   We have corrected the issue of the Side Navigation not functioning properly on the product page. This was due to duplicate jQuery and has been removed along with other unnecessary jQuery within the footer on the product page.
*   We removed height & line-height CSS rules for logo text. The result is a more condensed logo when using text and the logo is rendered on more than one line. Otherwise, you should see no change.
*   We have revised the style sheet for when list/view (list-by-default) is active to so that all links within the subcategory section are clickable. The issue was that the section below that contains the products was overlapping the section above.
*   Fix for first section of "Featured Products" images appearing smaller than normal. Deactivated CSS rule from line 10486: width: auto !important;
*   Pre-Order Now button spacing fix: Reduced padding left & right on product page add-to-cart button & add-to-wishlist buttons so that they fit on the same line without overlap, when pre-order button is active.
*   Fix for excess spacing below Hero slider in IE11. Removed lazyload from hero as it wasn't rendering correctly for IE.
*   Product page wishlist button border & text colors will now inherit background-color & background-color:hover settings for add to cart button.
*   QuickView: Quickview will now show reviews and review info links. Clicking the “Write a Review” link in quickview will open the product page and automatically open the Review modal. Clicking the (# reviews) link in QuickView will open product page & automatically scroll down to the tabs and open the “Reviews” tab. Zoom functionality on hover cleaned up.
*   Product Page: Write a review link on product page will now open review modal instead of scrolling to review section. (*num* review) link still scrolls to review section in tabs.


## September 4, 2019 Version 2.1.7
*   Fixes & Updates per Customer Requests
*   Fix for category page ratings still showing when disabled.
*   BigCommerce Update Request
*   Updated jQuery reference calls to version 3.4.1.
*   Eliminated all hard-coded jQuery references (duplicates & unnecessary) with the exception of the  product page, as it is currently required for the fancybox functionality. However, this reference has now been updated to version 3.4.1 as well.

*  Updated call to 3.4.1: https://github.com/bigcommerce-themes/lonestar-partswarehouse/blob/master/templates/components/common/footer-product.html#L135

*  File removed, un-needed: https://github.com/bigcommerce-themes/lonestar-partswarehouse/blob/master/templates/components/common/footer-speed.html#L135

*  ALL CALLS REMOVED: https://github.com/bigcommerce-themes/lonestar-partswarehouse/blob/master/templates/components/common/footer.html#L134

*  ALL CALLS REMOVED: https://github.com/bigcommerce-themes/lonestar-partswarehouse/blob/master/templates/components/common/checkout-footer.html#L127

*  ALL CALLS REMOVED: https://github.com/bigcommerce-themes/lonestar-partswarehouse/blob/master/templates/layout/base.html#L60

## March 21, 2019 Version 2.1.2

*   - Cleanup and XSS fix on Cart page. [#1434] (https://github.com/bigcommerce/cornerstone/pull/1434)

## May 31, 2018 Version 2.0.3

*   Fourth Variation with default settings to showcase new features.

## May 25, 2018 2.0.2

*   Pagination fix for intermittent issues in miscellaneous browsers.
*   Selected Grid/List toggle remains active with use of pagination.
*   Fix for product image and details alignment in Quick View.

## May 22, 2018 Version 2.0.1

*   Fix for Product Option Image Swap, SKU change, and Inventory Visuals.
*   Fix for Responsive equal height product containers with all site-width settings.
*   Fix for Toggle functionality in theme editor to turn off/on "Product Hover Images".
*   Fix for bottom banner visibility on Home Page when carousel is floated.
*   Options to Show/Hide Top & Bottom Pagination Independently.
*   Sticky TopMenu Option in Theme Editor. TopMenu & Searchbar will scroll with page.
*   Scrollable Quick Search Results
*   When Pagination for reviews on product page is clicked, after the page reloads it will scroll to & activate the Reviews Tab.

## May 18, 2018 Version 2.0.0

### Brand New Features for Parts Warehouse!!! More Control, More Options, More Power for your eCommenrce Store.

We've added so many significant features to our Parts Warehouse theme that we've named this upgrade Version 2.0.0.

### **New PartsWarehouse 2.0.0 Features:**

*   New! Hero Slider width options include Full-Screen Width, Full-Container-Width, & our classic, Right of SideNav.
*   New! Adjustable Site Max-Width Settings in Theme Editor. Includes five different settings, from 960px, up to 1440px. Make your site wider, and your product images will render larger, relative to your original uploaded image resolutions, or use our classic layout. The choice is yours.
*   New! Grid/List View options include: "Grid/List" toggle (grid by default), "List/Grid" toggle (list by default), "List Only", & our classic "Grid Only". Pages affected include Category, Brand, Search, & Compare.
*   New! Newsletter Popup Option on Homepage. Can be enabled/disabled in theme editor. The text is editable through en.json file.
*   New! Zoom Lightbox for main product image with carousel capability on the Product Page.
*   New! Carousel for product main image & thumbnails on the product page.
*   New! Second product image upon hover in both Grid & List views. Can be enabled/disabled within the Theme Editor. Consistent product image sizes work best with this functionality.
*   New! Product Ratings will now be visible on Home Page(Featured, Top Sellers, & New Products), as well as the Product Page(Recommended & Related Products) if ratings are enabled through the admin dashboard.
*   New! Theme-Styled popup window when removing items from the cart on cart page.
*   New! Added Storewide styles. The custom header and custom footer are now being called in the checkout and order confirmation pages. This means that the "Theme Styled" header and footer will be present on the checkout pages. The body width settings also affect this page. (Only available if using the Optimized One Page Checkout).

### **Fixes & Updates for PartsWarehouse 2.0.0:**

*   Theme Editor Optimization. We have reduced the number of available fonts within the Theme Editor, eliminating unnecessary options. We have left both Roboto & Roboto condensed versions intact. You should see some speed and response time improvements within the theme editor.
*   Multi-Language Setup for Optimized One-Page Checkout. https://stencil.bigcommerce.com/docs/multi-language-checkout#lang
*   Compare page is no longer in a table and is fully responsive, styled to match the theme. Grid/List view is available as well.
*   Product Filter fix for multiple options applied at once.
*   Product Filter, Show More link functional with a popup.
*   Amazon & Apple Pay buttons will appear on the cart page and cart preview drop-down if activated within Store Setup > Payments > Digital Wallets. Includes theme editor option to disable additional payment buttons in cart preview drop-down. Apple Pay will only be visible in Cart Preview if [Sitewide HTTPS](https://support.bigcommerce.com/articles/Public/Site-Wide-HTTPS) is enabled.

    Note: Amazon Pay: You must be using Optimized One Page Checkout. You must then set up an Amazon Pay Account and enable it within your store. [Read about Requirements.](https://support.bigcommerce.com/articles/Public/Connecting-with-Amazon-Pay)

    Note: Apple Pay buttons only appear in Safari browsers and compatible iOS devices. [Read about Requirements.](https://support.bigcommerce.com/articles/Public/Connecting-with-Apple-Pay)

*   Footer Scripts added to the checkout and order confirmation pages. This means that custom scripts added through the admin dashboard will now be effective on the checkout pages.
*   New Script Manager has been tested by adding both script URLs and code chunks. Page options have also been tested successfully.
*   UPC codes now update when Options change if an Option/SKU Rule is set up in the admin dashboard.
*   Google Shopping Products now show correct price for products with variable pricing when URL is visited
*   Page speed improvements. We have made adjustments to increase Google Page Insights Scores. This is an on-going process, and certain things like moving the CSS files cannot be done in BigCommerce without delaying the loading of the page. This will vary from store to store. Things that may impact page speed include images that need to be optimized and also Multiple payment methods. We will continue to make adjustments to improve site speed and efficiency as we can.
*   Zero Structured Data Errors/Warnings
*   Options, quantities, cart removal, etc. all functional.
*   If Reviews are disabled, Review link & tab is not visible on the product page.
*   Social Media Header in Footer will not be visible if Social Media is not enabled.
*   Zero console errors across pages.

## April 28, 2018 Version 1.2.1

*   Fix for Product Options not visible after update for Product Filtering was applied.

## April 27, 2018 Version 1.2.0

*   Fix for Product Filtering not adding more than 1 when applied. Also "clear" action fixed.

## April 20, 2018 Version 1.1.9

*   Fix for distored images after 1.1.8 update.

## April 19, 2018 Version 1.1.8

*   Name of product option swatch will now display on hover. A tooltip will display above the hovered option swatch that contains whatever text you enter within the Color/Patterns fields.
*   Google AMP has been added to our Parts Warehouse Theme. To activate Google AMP, go to Advanced Settings › Google AMP.
*   Support for multi-language checkout and optimized checkout. https://stencil.bigcommerce.com/docs/multi-language-checkout https://stencil.bigcommerce.com/docs/optimized-checkout-prereqs

## March 7, 2018 Version 1.1.7

*   Fix for missing schema/structured data for item condition on the product page.

## March 5, 2018 Version 1.1.6

*   Fix for, if a product has an "option/variant" price associated with itself that is lower than the "Price" field within the backend, the Sale Flag will not be visible. This fix is effective in Home, Category, Brand, & Search Results pages.

## February 15, 2018 - Version 1.1.5

*   Reverted jQuery version within package.json from 3.0.0 back to 2.2.1 due to bundling conflict.

## February 2, 2018 - Version 1.1.4

*   Updated jQuery version within package.json from 2.2.1 to 3.0.0 per GitHub notification.
*   Removed commented out code for Tagline within header.html
*   Fix for search bar not showing in the mobile menu when the logo is centered.
*   Fix for Logo Text position when center or right aligned. Note this change only affects the logo when using text, not an image. When using an image for logo, positioning was and still is working correctly.
*   Fix for wider images within quick-search results overlapping product details.
*   Fix for spacing of Subcategory Links if no image is uploaded on the category page. If image is uploaded then subcategory links will have an image above and spacing will adjust properly.
*   Safari fixes for smaller images appearing in product cards within the "New Products" section when more than 4 New Products are visible.
*   Fix for modal review button not working. There was a conflict with calling the write a review link and the popup modal within the same template twice. The "write a review" link in the top section now scrolls to the tab section and activates the "Reviews" tab where customers can leave their comments.
*   Review count link up top now scrolls to Reviews tab section and activates "Reviews" tab.
*   Fix for Carousel links on the home page not clickable in Edge & IE
*   Fix for "Search by Price" positioning and visibility and colors on mobile.

## January 19, 2018 - Version 1.1.3

*   Fix for Product Options/Details overlapping on Cart page on mobile.
*   Fix for Product Option radio button alignment on mobile.
*   Fix for card button overlapping product info on account page within "Recently Viewed" tab.
*   Font Awesome Warning within console have been resolved.
*   Removed "Similar Products" tab from Product page. This was deprecated in the transition from Blueprint to Cornerstone. We attempted to do a custom solution which only worked properly in specific circumstances. This feature can still be added to your theme but is now considered custom.
*   Fix for hover color of "Previous" pagination button on the Category page. Now uses themes set primary color.
*   Fix for product container widths within "Recommended Section" on Product page when there is more than 4 products visible and the Recommended Section is horizontally displayed at the bottom of the Product page.
*   Fix for alignment and clearing of subcategory image containers on Category page.
*   Fix for broken link within cart preview box for multiple checkout items - removed link.
*   Fix for duplicate "Call for Pricing" option on Product page.
*   Videos are now displayed by default when Video Tab is active on Product Page. Toggle link is set to open by default but still functional.
*   Fix for alignment of product thumbnails on Product page on mobile.
*   Fix for Google Structured Data errors on Product page.
*   Fix for "You May Also Like" and "Recommended" product pricing unnecessarily updating when main product option is selected on Product Page.
*   Videos now appear in QuickView within tabs.

## November 28, 2017 - Version 1.1.2

*   Fix for Product Options not showing on product page when SideNav is activated.
*   Fix for zoom image on product page when SideNav is active.
*   Fix for main product image appearance in Internet Explorer 11 Only.
*   Fix for newsletter signup form appearance in Internet Explorer 11 Only.
*   Shop by Price Filter "Update" button color and hover color will now update when the forms button settings are adjusted within the Theme Editor under Forms > Form Buttons
*   Shop by Price filtering now available on mobile.

## November 13, 2017 - Version 1.1.1

*   Fix for SideCategory List functionality when Product Filtering is enabled.

## November 6, 2017 - Version 1.1.0

*   Fix for "Excluding Tax" font color on product page and product cards site-wide.
*   Card height fix for "with and without tax prices" so prices are no longer covered up

## November 3, 2017 - Version 1.0.9

*   Account/Wishlist Pages. Button, Button Hover, Link, & Link Hover Colors are now customizable by editing the Form Button options in the Forms Section, and the Link Colors within the Content Page section of the Theme Editor.
*   Side Navigation is now full-depth on all store pages, which now includes, category, product, brand, and search pages.
*   Traditional One-Page Checkout: All buttons are now customizable by editing the Form Button options in the Forms Section of the Theme Editor.

## October 6, 2017 - Version 1.0.8

*   Fix for unsecured referenced image: image in stylesheet referenced with http now using https
*   Fix for control of button colors in Theme Editor on Default Checkout
*   Fix for control of button colors on Hero Slider
*   Fix for control of button colors in Theme Editor on Gift Certificate page
*   Any page that has a form, the button colors can be controlled within the "Forms" section of the Theme Editor
*   Custom Fields will now be displayed in the Product Details section, just to the right of the main product image. Pulling the custom field value into the Custom Tabs section was creating an issue for those who wanted multiple custom fields.
*   Added Feature for Product Page Layout: Option added to relocate the "Recommended Products" section from the right-hand side to the bottom of the page. The main benefit of using this layout would be your product images will be larger on the product page.

## September 21, 2017 - Version 1.0.7

*   Currency Converter: selectable top-menu font-color fix
*   Currency Converter: now working in Firefox
*   Cart Page and Cart Preview: log in for pricing now functioning properly
*   Default One-page Checkout: widened credit card date fields
*   Mobile Menu: customizable options added to Theme Editor include: (Main Background Color), (Container-Headers - background, border, and font-colors)
*   Mobile Product Page: alignment fix for Recommended Products
*   Compare button hidden on Category and Brand pages, if product comparisons are disabled within the Store Settings "OR" not logged in when login is required to view prices.
*   Product Card Heights and Spacing: height and spacing now automatically adjusted based on conditional logic such as "enabled/disabled product comparisons", "as low as pricing setting", "required login to view pricing" and "enabled/disabled ratings". This means those who do not enable product comparisons, or product ratings will no longer have the extra spacing which means cleaner looking product cards than before.
*   Subcategory Images on Category Page: Fix for subcategory images not showing in Safari
*   Distorted "Recommended Products" images fixed for 800px and below
*   Wishlist Positioning on Product Page: alignment fix for 800px and below

## September 15, 2017 - Version 1.0.6

*   Added Full-Width Header and Color Options within the Theme Editor
*   Fix for Purchase Options: "As low as" pricing is now functional
*   Fix for Purchase Options: "Restrict Purchase to Login" is now functional
*   Product Page is now 100% width of the body container if both the SideNav and Related Products are disabled
*   Revised Theme features list
*   Updated "Release Notes" link

## September 12, 2017 - Version 1.0.5

*   Adjustable color swatch sizes
*   Centered Logo on Mobile Only regardless of alignment selected within the Theme Editor
*   Added spacing beneath Category header when just text below
*   Added Customizable Quick Cart Buttons within Theme Editor
*   Full-width product images within product galleries (if images are perfectly square then they will fill the entire card figure.)
*   Added Adjustable card figure background-color within Theme Editor (useful for rectangular images.)
*   Fix for un-even amount of New Products & Similar Products
*   Added Brands visibility option within SideNav
*   Added Main Menu selectable option within Theme Editor for left or center alignment

## September 5, 2017 - Version 1.0.4

*   Fix for header spacing consistency
*   Fix for distorted product thumbnails
*   Fix for miscellaneous spacing issues

## September 1, 2017 - Version 1.0.3

*   Fix for thumbnails being distorted in Safari
*   Fix for distorted thumbnails in Quick Search Results and Product Carousels

## August 31, 2017 - Version 1.0.2

*   Fix for small Product Thumbnails in Safari
*   Added Logo flexible positioning (left, center, right alignment options in theme editor)
*   SideNav toggle availability on Product, Content, & Contact Page
*   Optimized Checkout Styling to match all 3 Theme Variations
*   Fix for cart drop-down being hidden behind search bar.
*   Fix for subCategory images not showing if spaces in filename
*   Dynamic Content for subCategory grid images on category Page - Images are visible along with placeholder if one is uploaded. No images or blocks are visible if no images are uploaded, but subcategory-links are visible.
*   Update to PW Theme Description

## August 25, 2017 - Version 1.0.1

*   QuickSearch Fix - placement, and accessibility: (added functionality to reset quick search results, close by clicking "x" or anywhere else on the page, and products within quick search results are now clickable)
*   SideNav now allows for the number of category levels to be set within the admin (allowing you to create multi-level categories, with subcategories that can go far beyond the standard 3 levels deep
*   Pagination now exists Top and Bottom on category, brand, search results, and blog pages
*   Currency Converter now working on Desktop and Mobile
