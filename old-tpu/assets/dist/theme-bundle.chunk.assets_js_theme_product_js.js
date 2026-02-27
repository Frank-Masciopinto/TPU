(self["webpackChunklonestartemplates_partswarehouse"] = self["webpackChunklonestartemplates_partswarehouse"] || []).push([["assets_js_theme_product_js"],{

/***/ "./assets/js/theme/common/form-utils.js"
/*!**********************************************!*\
  !*** ./assets/js/theme/common/form-utils.js ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Validators: () => (/* binding */ Validators),
/* harmony export */   classifyForm: () => (/* binding */ classifyForm),
/* harmony export */   insertStateHiddenField: () => (/* binding */ insertStateHiddenField)
/* harmony export */ });
/* harmony import */ var lodash_capitalize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/capitalize */ "./node_modules/lodash/capitalize.js");
/* harmony import */ var lodash_capitalize__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_capitalize__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_camelCase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/camelCase */ "./node_modules/lodash/camelCase.js");
/* harmony import */ var lodash_camelCase__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_camelCase__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash_includes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash/includes */ "./node_modules/lodash/includes.js");
/* harmony import */ var lodash_includes__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash_includes__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es6_array_find_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es6.array.find.js */ "./node_modules/core-js/modules/es6.array.find.js");
/* harmony import */ var core_js_modules_es6_array_find_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_array_find_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es6_regexp_match_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es6.regexp.match.js */ "./node_modules/core-js/modules/es6.regexp.match.js");
/* harmony import */ var core_js_modules_es6_regexp_match_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_regexp_match_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_es6_regexp_constructor_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es6.regexp.constructor.js */ "./node_modules/core-js/modules/es6.regexp.constructor.js");
/* harmony import */ var core_js_modules_es6_regexp_constructor_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_regexp_constructor_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var core_js_modules_es6_object_keys_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! core-js/modules/es6.object.keys.js */ "./node_modules/core-js/modules/es6.object.keys.js");
/* harmony import */ var core_js_modules_es6_object_keys_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_object_keys_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _nod__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./nod */ "./assets/js/theme/common/nod.js");
/* harmony import */ var _models_forms__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./models/forms */ "./assets/js/theme/common/models/forms.js");
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.min.js");









var inputTagNames = ['input', 'select', 'textarea'];

/**
 * Apply class name to an input element on its type
 * @param {object} input
 * @param {string} formFieldClass
 * @return {object} Element itself
 */
function classifyInput(input, formFieldClass) {
  var $input = $(input);
  var $formField = $input.parent("." + formFieldClass);
  var tagName = $input.prop('tagName').toLowerCase();
  var className = formFieldClass + "--" + tagName;
  var specificClassName;

  // Input can be text/checkbox/radio etc...
  if (tagName === 'input') {
    var inputType = $input.prop('type');
    if (lodash_includes__WEBPACK_IMPORTED_MODULE_2___default()(['radio', 'checkbox', 'submit'], inputType)) {
      // ie: .form-field--checkbox, .form-field--radio
      className = formFieldClass + "--" + lodash_camelCase__WEBPACK_IMPORTED_MODULE_1___default()(inputType);
    } else {
      // ie: .form-field--input .form-field--inputText
      specificClassName = "" + className + lodash_capitalize__WEBPACK_IMPORTED_MODULE_0___default()(inputType);
    }
  }

  // Apply class modifier
  return $formField.addClass(className).addClass(specificClassName);
}

/**
 * Apply class name to each input element in a form based on its type
 * @example
 * // Before
 * <form id="form">
 *     <div class="form-field">
 *         <input type="text">
 *     </div>
 *     <div class="form-field">
 *         <select>...</select>
 *     </div>
 * </form>
 *
 * classifyForm('#form', { formFieldClass: 'form-field' });
 *
 * // After
 * <div class="form-field form-field--input form-field--inputText">...</div>
 * <div class="form-field form-field--select">...</div>
 *
 * @param {string|object} formSelector - selector or element
 * @param {object} options
 * @return {jQuery} Element itself
 */
function classifyForm(formSelector, options) {
  if (options === void 0) {
    options = {};
  }
  var $form = $(formSelector);
  var $inputs = $form.find(inputTagNames.join(', '));

  // Obtain options
  var _options = options,
    _options$formFieldCla = _options.formFieldClass,
    formFieldClass = _options$formFieldCla === void 0 ? 'form-field' : _options$formFieldCla;

  // Classify each input in a form
  $inputs.each(function (__, input) {
    classifyInput(input, formFieldClass);
  });
  return $form;
}

/**
 * Get id from given field
 * @param {object} $field JQuery field object
 * @return {string}
 */
function getFieldId($field) {
  var fieldId = $field.prop('name').match(/(\[.*\])/);
  if (fieldId && fieldId.length !== 0) {
    return fieldId[0];
  }
  return '';
}

/**
 * Insert hidden field after State/Province field
 * @param {object} $stateField JQuery field object
 */
function insertStateHiddenField($stateField) {
  var fieldId = getFieldId($stateField);
  var stateFieldAttrs = {
    type: 'hidden',
    name: "FormFieldIsText" + fieldId,
    value: '1'
  };
  $stateField.after($('<input />', stateFieldAttrs));
}
var Validators = {
  /**
   * Sets up a new validation when the form is dirty
   * @param validator
   * @param field
   */
  setEmailValidation: function setEmailValidation(validator, field) {
    if (field) {
      validator.add({
        selector: field,
        validate: function validate(cb, val) {
          var result = _models_forms__WEBPACK_IMPORTED_MODULE_8__["default"].email(val);
          cb(result);
        },
        errorMessage: 'You must enter a valid email.'
      });
    }
  },
  /**
   * Validate password fields
   * @param validator
   * @param passwordSelector
   * @param password2Selector
   * @param requirements
   * @param isOptional
   */
  setPasswordValidation: function setPasswordValidation(validator, passwordSelector, password2Selector, requirements, isOptional) {
    var $password = $(passwordSelector);
    var passwordValidations = [{
      selector: passwordSelector,
      validate: function validate(cb, val) {
        var result = val.length;
        if (isOptional) {
          return cb(true);
        }
        cb(result);
      },
      errorMessage: 'You must enter a password.'
    }, {
      selector: passwordSelector,
      validate: function validate(cb, val) {
        var result = val.match(new RegExp(requirements.alpha)) && val.match(new RegExp(requirements.numeric)) && val.length >= requirements.minlength;

        // If optional and nothing entered, it is valid
        if (isOptional && val.length === 0) {
          return cb(true);
        }
        cb(result);
      },
      errorMessage: requirements.error
    }, {
      selector: password2Selector,
      validate: function validate(cb, val) {
        var result = val.length;
        if (isOptional) {
          return cb(true);
        }
        cb(result);
      },
      errorMessage: 'You must enter a password.'
    }, {
      selector: password2Selector,
      validate: function validate(cb, val) {
        var result = val === $password.val();
        cb(result);
      },
      errorMessage: 'Your passwords do not match.'
    }];
    validator.add(passwordValidations);
  },
  /**
   * Validate password fields
   * @param {Nod} validator
   * @param {Object} selectors
   * @param {string} selectors.errorSelector
   * @param {string} selectors.fieldsetSelector
   * @param {string} selectors.formSelector
   * @param {string} selectors.maxPriceSelector
   * @param {string} selectors.minPriceSelector
   */
  setMinMaxPriceValidation: function setMinMaxPriceValidation(validator, selectors) {
    var errorSelector = selectors.errorSelector,
      fieldsetSelector = selectors.fieldsetSelector,
      formSelector = selectors.formSelector,
      maxPriceSelector = selectors.maxPriceSelector,
      minPriceSelector = selectors.minPriceSelector;
    validator.configure({
      form: formSelector,
      preventSubmit: true,
      successClass: '_' // KLUDGE: Don't apply success class
    });
    validator.add({
      errorMessage: 'Min price must be less than max. price.',
      selector: minPriceSelector,
      validate: "min-max:" + minPriceSelector + ":" + maxPriceSelector
    });
    validator.add({
      errorMessage: 'Min price must be less than max. price.',
      selector: maxPriceSelector,
      validate: "min-max:" + minPriceSelector + ":" + maxPriceSelector
    });
    validator.add({
      errorMessage: 'Max. price is required.',
      selector: maxPriceSelector,
      validate: 'presence'
    });
    validator.add({
      errorMessage: 'Min. price is required.',
      selector: minPriceSelector,
      validate: 'presence'
    });
    validator.add({
      errorMessage: 'Input must be greater than 0.',
      selector: [minPriceSelector, maxPriceSelector],
      validate: 'min-number:0'
    });
    validator.setMessageOptions({
      selector: [minPriceSelector, maxPriceSelector],
      parent: fieldsetSelector,
      errorSpan: errorSelector
    });
  },
  /**
   * Sets up a new validation when the form is dirty
   * @param validator
   * @param field
   */
  setStateCountryValidation: function setStateCountryValidation(validator, field) {
    if (field) {
      validator.add({
        selector: field,
        validate: 'presence',
        errorMessage: 'The \'State/Province\' field cannot be blank.'
      });
    }
  },
  /**
   * Removes classes from dirty form if previously checked
   * @param field
   */
  cleanUpStateValidation: function cleanUpStateValidation(field) {
    var $fieldClassElement = $("[data-type=\"" + field.data('fieldType') + "\"]");
    Object.keys(_nod__WEBPACK_IMPORTED_MODULE_7__["default"].classes).forEach(function (value) {
      if ($fieldClassElement.hasClass(_nod__WEBPACK_IMPORTED_MODULE_7__["default"].classes[value])) {
        $fieldClassElement.removeClass(_nod__WEBPACK_IMPORTED_MODULE_7__["default"].classes[value]);
      }
    });
  }
};


/***/ },

/***/ "./assets/js/theme/product.js"
/*!************************************!*\
  !*** ./assets/js/theme/product.js ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Product)
/* harmony export */ });
/* harmony import */ var core_js_modules_es6_object_set_prototype_of_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es6.object.set-prototype-of.js */ "./node_modules/core-js/modules/es6.object.set-prototype-of.js");
/* harmony import */ var core_js_modules_es6_object_set_prototype_of_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_object_set_prototype_of_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _page_manager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./page-manager */ "./assets/js/theme/page-manager.js");
/* harmony import */ var _product_reviews__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./product/reviews */ "./assets/js/theme/product/reviews.js");
/* harmony import */ var _common_collapsible__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./common/collapsible */ "./assets/js/theme/common/collapsible.js");
/* harmony import */ var _common_product_details__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./common/product-details */ "./assets/js/theme/common/product-details.js");
/* harmony import */ var _product_video_gallery__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./product/video-gallery */ "./assets/js/theme/product/video-gallery.js");
/* harmony import */ var _common_form_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./common/form-utils */ "./assets/js/theme/common/form-utils.js");
/* harmony import */ var _fancyapps_fancybox__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @fancyapps/fancybox */ "./node_modules/@fancyapps/fancybox/dist/jquery.fancybox.js");
/* harmony import */ var _fancyapps_fancybox__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_fancyapps_fancybox__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _product_pdp_shipping_calculator__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./product/pdp-shipping-calculator */ "./assets/js/theme/product/pdp-shipping-calculator.js");
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.min.js");

function _inheritsLoose(t, o) { t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
/*
 Import all product specific js
 */








var Product = /*#__PURE__*/function (_PageManager) {
  function Product(context) {
    var _this;
    _this = _PageManager.call(this, context) || this;
    _this.url = window.location.href;
    _this.$reviewLink = $('[data-reveal-id="modal-review-form"]');
    _this.$bulkPricingLink = $('[data-reveal-id="modal-bulk-pricing"]');
    return _this;
  }
  _inheritsLoose(Product, _PageManager);
  var _proto = Product.prototype;
  _proto.onReady = function onReady() {
    var _this2 = this;
    // Listen for foundation modal close events to sanitize URL after review.
    $(document).on('close.fndtn.reveal', function () {
      if (_this2.url.indexOf('#write_review') !== -1 && typeof window.history.replaceState === 'function') {
        window.history.replaceState(null, document.title, window.location.pathname);
      }
    });
    var validator;

    // Init collapsible
    (0,_common_collapsible__WEBPACK_IMPORTED_MODULE_3__["default"])();
    this.productDetails = new _common_product_details__WEBPACK_IMPORTED_MODULE_4__["default"]($('.productView'), this.context, window.BCData.product_attributes);
    this.productDetails.setProductVariant();
    (0,_product_video_gallery__WEBPACK_IMPORTED_MODULE_5__["default"])();
    var $reviewForm = (0,_common_form_utils__WEBPACK_IMPORTED_MODULE_6__.classifyForm)('.writeReview-form');
    var review = new _product_reviews__WEBPACK_IMPORTED_MODULE_2__["default"]($reviewForm);
    $('body').on('click', '[data-reveal-id="modal-review-form"]', function () {
      validator = review.registerValidation(_this2.context);
    });
    $reviewForm.on('submit', function () {
      if (validator) {
        validator.performCheck();
        return validator.areAll('valid');
      }
      return false;
    });
    var $shippingCalc = $('[data-pdp-shipping-calc]');
    if ($shippingCalc.length) {
      this.shippingCalculator = new _product_pdp_shipping_calculator__WEBPACK_IMPORTED_MODULE_8__["default"]($shippingCalc, this.context);
    }
    this.productReviewHandler();
    this.bulkPricingHandler();
  };
  _proto.productReviewHandler = function productReviewHandler() {
    if (this.url.indexOf('#write_review') !== -1) {
      this.$reviewLink.trigger('click');
    }
  };
  _proto.bulkPricingHandler = function bulkPricingHandler() {
    if (this.url.indexOf('#bulk_pricing') !== -1) {
      this.$bulkPricingLink.trigger('click');
    }
  };
  return Product;
}(_page_manager__WEBPACK_IMPORTED_MODULE_1__["default"]);


/***/ },

/***/ "./assets/js/theme/product/pdp-shipping-calculator.js"
/*!************************************************************!*\
  !*** ./assets/js/theme/product/pdp-shipping-calculator.js ***!
  \************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PDPShippingCalculator)
/* harmony export */ });
/* harmony import */ var core_js_modules_es6_array_find_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es6.array.find.js */ "./node_modules/core-js/modules/es6.array.find.js");
/* harmony import */ var core_js_modules_es6_array_find_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_array_find_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es6_function_name_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es6.function.name.js */ "./node_modules/core-js/modules/es6.function.name.js");
/* harmony import */ var core_js_modules_es6_function_name_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_function_name_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es6_array_slice_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es6.array.slice.js */ "./node_modules/core-js/modules/es6.array.slice.js");
/* harmony import */ var core_js_modules_es6_array_slice_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_array_slice_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es6_regexp_replace_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es6.regexp.replace.js */ "./node_modules/core-js/modules/es6.regexp.replace.js");
/* harmony import */ var core_js_modules_es6_regexp_replace_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_regexp_replace_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es6_object_to_string_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es6.object.to-string.js */ "./node_modules/core-js/modules/es6.object.to-string.js");
/* harmony import */ var core_js_modules_es6_object_to_string_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_object_to_string_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_es6_regexp_to_string_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es6.regexp.to-string.js */ "./node_modules/core-js/modules/es6.regexp.to-string.js");
/* harmony import */ var core_js_modules_es6_regexp_to_string_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_regexp_to_string_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var core_js_modules_es6_regexp_match_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! core-js/modules/es6.regexp.match.js */ "./node_modules/core-js/modules/es6.regexp.match.js");
/* harmony import */ var core_js_modules_es6_regexp_match_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_regexp_match_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var core_js_modules_es7_object_entries_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! core-js/modules/es7.object.entries.js */ "./node_modules/core-js/modules/es7.object.entries.js");
/* harmony import */ var core_js_modules_es7_object_entries_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es7_object_entries_js__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var core_js_modules_es6_promise_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! core-js/modules/es6.promise.js */ "./node_modules/core-js/modules/es6.promise.js");
/* harmony import */ var core_js_modules_es6_promise_js__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_promise_js__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var core_js_modules_es6_array_map_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! core-js/modules/es6.array.map.js */ "./node_modules/core-js/modules/es6.array.map.js");
/* harmony import */ var core_js_modules_es6_array_map_js__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_array_map_js__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var core_js_modules_es6_symbol_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! core-js/modules/es6.symbol.js */ "./node_modules/core-js/modules/es6.symbol.js");
/* harmony import */ var core_js_modules_es6_symbol_js__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_symbol_js__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var core_js_modules_es6_object_get_prototype_of_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! core-js/modules/es6.object.get-prototype-of.js */ "./node_modules/core-js/modules/es6.object.get-prototype-of.js");
/* harmony import */ var core_js_modules_es6_object_get_prototype_of_js__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_object_get_prototype_of_js__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var core_js_modules_es6_object_set_prototype_of_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! core-js/modules/es6.object.set-prototype-of.js */ "./node_modules/core-js/modules/es6.object.set-prototype-of.js");
/* harmony import */ var core_js_modules_es6_object_set_prototype_of_js__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_object_set_prototype_of_js__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var core_js_modules_es6_array_from_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! core-js/modules/es6.array.from.js */ "./node_modules/core-js/modules/es6.array.from.js");
/* harmony import */ var core_js_modules_es6_array_from_js__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_array_from_js__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var core_js_modules_es6_string_iterator_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! core-js/modules/es6.string.iterator.js */ "./node_modules/core-js/modules/es6.string.iterator.js");
/* harmony import */ var core_js_modules_es6_string_iterator_js__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_string_iterator_js__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var core_js_modules_es6_array_iterator_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! core-js/modules/es6.array.iterator.js */ "./node_modules/core-js/modules/es6.array.iterator.js");
/* harmony import */ var core_js_modules_es6_array_iterator_js__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_array_iterator_js__WEBPACK_IMPORTED_MODULE_15__);
/* harmony import */ var core_js_modules_web_dom_iterable_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! core-js/modules/web.dom.iterable.js */ "./node_modules/core-js/modules/web.dom.iterable.js");
/* harmony import */ var core_js_modules_web_dom_iterable_js__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_iterable_js__WEBPACK_IMPORTED_MODULE_16__);
/* harmony import */ var _bigcommerce_stencil_utils__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @bigcommerce/stencil-utils */ "./node_modules/@bigcommerce/stencil-utils/src/main.js");
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.min.js");
function _createForOfIteratorHelperLoose(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (t) return (t = t.call(r)).next.bind(t); if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var o = 0; return function () { return o >= r.length ? { done: !0 } : { done: !1, value: r[o++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }

















function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }

var SHIPPING_LOCATION_KEY = 'tpu_shipping_location';
var CART_API = '/api/storefront/carts?include=lineItems.physicalItems.options,lineItems.digitalItems.options';

/**
 * Snapshot the current session cart and delete it so the next cart.itemAdd
 * creates a fresh, single-product cart.  Returns everything needed to
 * restore the cart afterwards.  Returns null when the cart is already empty.
 */
function snapshotAndClearCart() {
  return _snapshotAndClearCart.apply(this, arguments);
}
/**
 * Recreate the cart from a previous snapshot and re-apply coupons.
 * Failures are logged but never thrown so the caller's finally-block
 * doesn't mask the original shipping-quote result.
 */
function _snapshotAndClearCart() {
  _snapshotAndClearCart = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
    var carts, cart, physical, digital, giftCerts, savedItems, savedGiftCerts, couponCodes, originalQuantity;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          _context2.n = 1;
          return fetch(CART_API, {
            credentials: 'same-origin'
          }).then(function (r) {
            return r.json();
          });
        case 1:
          carts = _context2.v;
          cart = carts[0];
          if (cart) {
            _context2.n = 2;
            break;
          }
          return _context2.a(2, null);
        case 2:
          physical = cart.lineItems.physicalItems || [];
          digital = cart.lineItems.digitalItems || [];
          giftCerts = cart.lineItems.giftCertificates || [];
          savedItems = [].concat(physical, digital).map(function (item) {
            return {
              productId: item.productId,
              quantity: item.quantity,
              variantId: item.variantId
            };
          });
          savedGiftCerts = giftCerts.map(function (gc) {
            return {
              name: gc.name,
              theme: gc.theme,
              amount: gc.amount,
              quantity: gc.quantity,
              sender: gc.sender,
              recipient: gc.recipient,
              message: gc.message
            };
          });
          couponCodes = (cart.coupons || []).map(function (c) {
            return c.code;
          });
          originalQuantity = physical.reduce(function (sum, i) {
            return sum + i.quantity;
          }, 0) + digital.reduce(function (sum, i) {
            return sum + i.quantity;
          }, 0);
          _context2.n = 3;
          return fetch("/api/storefront/carts/" + cart.id, {
            method: 'DELETE',
            credentials: 'same-origin'
          });
        case 3:
          return _context2.a(2, {
            savedItems: savedItems,
            savedGiftCerts: savedGiftCerts,
            couponCodes: couponCodes,
            originalQuantity: originalQuantity
          });
      }
    }, _callee2);
  }));
  return _snapshotAndClearCart.apply(this, arguments);
}
function restoreCart(_x) {
  return _restoreCart.apply(this, arguments);
}
function _restoreCart() {
  _restoreCart = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(snapshot) {
    var _newCart$, body, res, newCart, newCartId, _iterator, _step, code, _t2, _t3;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          _context3.p = 0;
          body = {
            lineItems: snapshot.savedItems
          };
          if (snapshot.savedGiftCerts.length > 0) {
            body.giftCertificates = snapshot.savedGiftCerts;
          }
          _context3.n = 1;
          return fetch('/api/storefront/carts', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
          });
        case 1:
          res = _context3.v;
          _context3.n = 2;
          return res.json();
        case 2:
          newCart = _context3.v;
          newCartId = (newCart == null ? void 0 : newCart.id) || (newCart == null || (_newCart$ = newCart[0]) == null ? void 0 : _newCart$.id);
          if (!newCartId) {
            _context3.n = 8;
            break;
          }
          _iterator = _createForOfIteratorHelperLoose(snapshot.couponCodes);
        case 3:
          if ((_step = _iterator()).done) {
            _context3.n = 8;
            break;
          }
          code = _step.value;
          _context3.p = 4;
          _context3.n = 5;
          return fetch("/api/storefront/carts/" + newCartId + "/coupons", {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              couponCode: code
            })
          });
        case 5:
          _context3.n = 7;
          break;
        case 6:
          _context3.p = 6;
          _t2 = _context3.v;
          console.warn('[ShippingCalc] Could not re-apply coupon:', code, _t2);
        case 7:
          _context3.n = 3;
          break;
        case 8:
          $('body').trigger('cart-quantity-update', snapshot.originalQuantity);
          _context3.n = 10;
          break;
        case 9:
          _context3.p = 9;
          _t3 = _context3.v;
          console.error('[ShippingCalc] Failed to restore cart:', _t3);
        case 10:
          return _context3.a(2);
      }
    }, _callee3, null, [[4, 6], [0, 9]]);
  }));
  return _restoreCart.apply(this, arguments);
}
var US_STATES = [{
  id: 1,
  name: 'Alabama',
  abbr: 'AL'
}, {
  id: 2,
  name: 'Alaska',
  abbr: 'AK'
}, {
  id: 4,
  name: 'Arizona',
  abbr: 'AZ'
}, {
  id: 5,
  name: 'Arkansas',
  abbr: 'AR'
}, {
  id: 12,
  name: 'California',
  abbr: 'CA'
}, {
  id: 13,
  name: 'Colorado',
  abbr: 'CO'
}, {
  id: 14,
  name: 'Connecticut',
  abbr: 'CT'
}, {
  id: 15,
  name: 'Delaware',
  abbr: 'DE'
}, {
  id: 16,
  name: 'District of Columbia',
  abbr: 'DC'
}, {
  id: 18,
  name: 'Florida',
  abbr: 'FL'
}, {
  id: 19,
  name: 'Georgia',
  abbr: 'GA'
}, {
  id: 21,
  name: 'Hawaii',
  abbr: 'HI'
}, {
  id: 22,
  name: 'Idaho',
  abbr: 'ID'
}, {
  id: 23,
  name: 'Illinois',
  abbr: 'IL'
}, {
  id: 24,
  name: 'Indiana',
  abbr: 'IN'
}, {
  id: 25,
  name: 'Iowa',
  abbr: 'IA'
}, {
  id: 26,
  name: 'Kansas',
  abbr: 'KS'
}, {
  id: 27,
  name: 'Kentucky',
  abbr: 'KY'
}, {
  id: 28,
  name: 'Louisiana',
  abbr: 'LA'
}, {
  id: 29,
  name: 'Maine',
  abbr: 'ME'
}, {
  id: 31,
  name: 'Maryland',
  abbr: 'MD'
}, {
  id: 32,
  name: 'Massachusetts',
  abbr: 'MA'
}, {
  id: 33,
  name: 'Michigan',
  abbr: 'MI'
}, {
  id: 34,
  name: 'Minnesota',
  abbr: 'MN'
}, {
  id: 35,
  name: 'Mississippi',
  abbr: 'MS'
}, {
  id: 36,
  name: 'Missouri',
  abbr: 'MO'
}, {
  id: 37,
  name: 'Montana',
  abbr: 'MT'
}, {
  id: 38,
  name: 'Nebraska',
  abbr: 'NE'
}, {
  id: 39,
  name: 'Nevada',
  abbr: 'NV'
}, {
  id: 40,
  name: 'New Hampshire',
  abbr: 'NH'
}, {
  id: 41,
  name: 'New Jersey',
  abbr: 'NJ'
}, {
  id: 42,
  name: 'New Mexico',
  abbr: 'NM'
}, {
  id: 43,
  name: 'New York',
  abbr: 'NY'
}, {
  id: 44,
  name: 'North Carolina',
  abbr: 'NC'
}, {
  id: 45,
  name: 'North Dakota',
  abbr: 'ND'
}, {
  id: 47,
  name: 'Ohio',
  abbr: 'OH'
}, {
  id: 48,
  name: 'Oklahoma',
  abbr: 'OK'
}, {
  id: 49,
  name: 'Oregon',
  abbr: 'OR'
}, {
  id: 51,
  name: 'Pennsylvania',
  abbr: 'PA'
}, {
  id: 53,
  name: 'Rhode Island',
  abbr: 'RI'
}, {
  id: 54,
  name: 'South Carolina',
  abbr: 'SC'
}, {
  id: 55,
  name: 'South Dakota',
  abbr: 'SD'
}, {
  id: 56,
  name: 'Tennessee',
  abbr: 'TN'
}, {
  id: 57,
  name: 'Texas',
  abbr: 'TX'
}, {
  id: 58,
  name: 'Utah',
  abbr: 'UT'
}, {
  id: 59,
  name: 'Vermont',
  abbr: 'VT'
}, {
  id: 61,
  name: 'Virginia',
  abbr: 'VA'
}, {
  id: 62,
  name: 'Washington',
  abbr: 'WA'
}, {
  id: 63,
  name: 'West Virginia',
  abbr: 'WV'
}, {
  id: 64,
  name: 'Wisconsin',
  abbr: 'WI'
}, {
  id: 65,
  name: 'Wyoming',
  abbr: 'WY'
}];

/**
 * PDPShippingCalculator - Estimate shipping costs on the PDP by state and ZIP.
 * Silently adds/removes a cart item to fetch BigCommerce shipping quotes.
 * Persists chosen location to localStorage for reuse across product pages.
 */
var PDPShippingCalculator = /*#__PURE__*/function () {
  function PDPShippingCalculator($container, context) {
    this.$container = $container;
    this.context = context;
    this.productId = $('form[data-cart-item-add] input[name="product_id"]').val();
    this.minQty = parseInt($('form[data-cart-item-add] input[name="qty[]"]').val(), 10) || 1;
    this.isEditing = false;
    this.isLoading = false;
    this.selectedState = '';
    this.zipCode = '';
    this.quotes = null;
    this.recalcTimer = null;
    this.$title = $container.find('[data-calc-title]');
    this.$editBtn = $container.find('[data-calc-edit]');
    this.$form = $container.find('[data-calc-form]');
    this.$stateSelect = $container.find('[data-calc-state]');
    this.$zipInput = $container.find('[data-calc-zip]');
    this.$submitBtn = $container.find('[data-calc-submit]');
    this.$error = $container.find('[data-calc-error]');
    this.$loading = $container.find('[data-calc-loading]');
    this.$results = $container.find('[data-calc-results]');
    this.$empty = $container.find('[data-calc-empty]');
    this.populateStateOptions();
    this.bindEvents();
    this.loadSavedLocation();
  }
  var _proto = PDPShippingCalculator.prototype;
  _proto.populateStateOptions = function populateStateOptions() {
    var fragment = document.createDocumentFragment();
    US_STATES.forEach(function (state) {
      var opt = document.createElement('option');
      opt.value = state.id;
      opt.textContent = state.name;
      fragment.appendChild(opt);
    });
    this.$stateSelect.append(fragment);
  };
  _proto.bindEvents = function bindEvents() {
    var _this = this;
    this.$submitBtn.on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (_this.canSubmit()) {
        _this.calculateShipping(_this.selectedState, _this.zipCode, true);
      }
    });
    this.$editBtn.on('click', function () {
      _this.showForm();
      _this.clearError();
    });
    this.$stateSelect.on('change', function () {
      _this.selectedState = _this.$stateSelect.val();
      _this.updateSubmitState();
    });
    this.$zipInput.on('input', function () {
      _this.zipCode = _this.$zipInput.val().replace(/\D/g, '').slice(0, 5);
      _this.$zipInput.val(_this.zipCode);
      _this.$zipInput.toggleClass('has-error', _this.zipCode.length > 0 && !_this.isValidZip());
      _this.updateSubmitState();
    });
    this.$zipInput.on('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        if (_this.canSubmit()) {
          _this.calculateShipping(_this.selectedState, _this.zipCode, true);
        }
      }
    });
    $('body').on('shippingCalc:optionsChanged', function () {
      return _this.onOptionsChanged();
    });
  };
  _proto.loadSavedLocation = function loadSavedLocation() {
    var saved = getSavedShippingLocation();
    if (saved && saved.stateId && saved.zip) {
      this.selectedState = saved.stateId.toString();
      this.zipCode = saved.zip;
      this.$stateSelect.val(this.selectedState);
      this.$zipInput.val(this.zipCode);
      this.calculateShipping(saved.stateId, saved.zip, false);
    } else {
      this.showForm();
    }
  };
  _proto.onOptionsChanged = function onOptionsChanged() {
    var _this2 = this;
    this.clearError();
    if (this.selectedState && this.zipCode && this.isValidZip()) {
      clearTimeout(this.recalcTimer);
      this.recalcTimer = setTimeout(function () {
        _this2.calculateShipping(_this2.selectedState, _this2.zipCode, false);
      }, 500);
    }
  }

  // --- Validation helpers ---
;
  _proto.isValidZip = function isValidZip() {
    return /^\d{5}$/.test(this.zipCode);
  };
  _proto.canSubmit = function canSubmit() {
    return this.selectedState && this.isValidZip() && !this.isLoading;
  };
  _proto.updateSubmitState = function updateSubmitState() {
    this.$submitBtn.prop('disabled', !this.canSubmit());
  };
  _proto.getStateName = function getStateName(stateId) {
    var state = US_STATES.find(function (s) {
      return s.id.toString() === (stateId == null ? void 0 : stateId.toString());
    });
    return state ? state.abbr : '';
  }

  /**
   * Read current product option selections from the add-to-cart form.
   * Returns an object of { attributeId: value } pairs.
   */;
  _proto.getOptionSelections = function getOptionSelections() {
    var options = {};
    var $form = $('form[data-cart-item-add]');
    $form.find('[name^="attribute["]').each(function (_, el) {
      var $el = $(el);
      var name = $el.attr('name');
      var match = name.match(/attribute\[(\d+)\]/);
      if (!match) return;
      var attrId = match[1];
      if ($el.is(':radio') || $el.is(':checkbox')) {
        if ($el.is(':checked')) {
          options[attrId] = $el.val();
        }
      } else {
        var val = $el.val();
        if (val !== undefined && val !== null && val !== '') {
          options[attrId] = val;
        }
      }
    });
    return options;
  }

  // --- Core API flow ---

  /**
   * Isolate the viewed product by snapshotting/clearing the session cart,
   * adding only this product, fetching quotes, then restoring the original
   * cart.  This ensures BigCommerce returns shipping methods applicable to
   * the single product rather than the entire cart.
   */;
  _proto.calculateShipping =
  /*#__PURE__*/
  function () {
    var _calculateShipping = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(stateId, zip, shouldSave) {
      var snapshot, options, formData, addResult, cartItemId, shippingParams, quotesResult, rawHtml, quotes, stateObj, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            if (shouldSave === void 0) {
              shouldSave = true;
            }
            if (this.productId) {
              _context.n = 1;
              break;
            }
            return _context.a(2);
          case 1:
            this.isLoading = true;
            this.showLoading();
            this.clearError();
            this.updateSubmitState();
            snapshot = null;
            _context.p = 2;
            _context.n = 3;
            return snapshotAndClearCart();
          case 3:
            snapshot = _context.v;
            console.log('[ShippingCalc] snapshot:', snapshot);
            options = this.getOptionSelections();
            formData = new FormData();
            formData.append('action', 'add');
            formData.append('product_id', this.productId);
            formData.append('qty[]', this.minQty);
            Object.entries(options).forEach(function (_ref) {
              var optionId = _ref[0],
                value = _ref[1];
              if (value !== undefined && value !== null && value !== '') {
                formData.append("attribute[" + optionId + "]", value);
              }
            });
            _context.n = 4;
            return new Promise(function (resolve, reject) {
              _bigcommerce_stencil_utils__WEBPACK_IMPORTED_MODULE_17__["default"].api.cart.itemAdd(formData, function (err, response) {
                if (err) return reject(new Error(err.message || 'Failed to add item'));
                if (response && response.data && response.data.error) {
                  return reject(new Error(response.data.error));
                }
                resolve(response);
              });
            });
          case 4:
            addResult = _context.v;
            cartItemId = addResult && addResult.data && addResult.data.cart_item ? addResult.data.cart_item.id : null;
            shippingParams = {
              country_id: 226,
              state_id: stateId,
              zip_code: zip
            };
            _context.n = 5;
            return new Promise(function (resolve, reject) {
              _bigcommerce_stencil_utils__WEBPACK_IMPORTED_MODULE_17__["default"].api.cart.getShippingQuotes(shippingParams, 'cart/shipping-quotes', function (err, response) {
                if (err) return reject(new Error('Failed to get shipping quotes'));
                resolve(response);
              });
            });
          case 5:
            quotesResult = _context.v;
            if (!cartItemId) {
              _context.n = 6;
              break;
            }
            _context.n = 6;
            return new Promise(function (resolve) {
              _bigcommerce_stencil_utils__WEBPACK_IMPORTED_MODULE_17__["default"].api.cart.itemRemove(cartItemId, function () {
                return resolve();
              });
            });
          case 6:
            rawHtml = quotesResult && quotesResult.content || quotesResult;
            console.log('[ShippingCalc] raw quotes HTML:', rawHtml);
            quotes = this.parseShippingQuotes(rawHtml);
            this.quotes = quotes;
            if (shouldSave) {
              stateObj = US_STATES.find(function (s) {
                return s.id.toString() === (stateId == null ? void 0 : stateId.toString());
              });
              saveShippingLocation({
                state: stateObj ? stateObj.name : '',
                stateId: parseInt(stateId, 10),
                zip: zip
              });
            }
            this.hideForm();
            this.renderQuotes(quotes);
            _context.n = 8;
            break;
          case 7:
            _context.p = 7;
            _t = _context.v;
            console.error('[ShippingCalc] Error:', _t);
            this.showError(_t.message || 'Unable to calculate shipping');
            this.quotes = null;
            this.hideResults();
          case 8:
            _context.p = 8;
            if (!(snapshot && snapshot.savedItems.length > 0)) {
              _context.n = 9;
              break;
            }
            _context.n = 9;
            return restoreCart(snapshot);
          case 9:
            this.isLoading = false;
            this.hideLoading();
            this.updateSubmitState();
            return _context.f(8);
          case 10:
            return _context.a(2);
        }
      }, _callee, this, [[2, 7, 8, 10]]);
    }));
    function calculateShipping(_x2, _x3, _x4) {
      return _calculateShipping.apply(this, arguments);
    }
    return calculateShipping;
  }()
  /**
   * Parse the BigCommerce shipping-quotes HTML into a simple array.
   */
;
  _proto.parseShippingQuotes = function parseShippingQuotes(htmlContent) {
    if (!htmlContent) return [];
    try {
      var parser = new DOMParser();
      var doc = parser.parseFromString(htmlContent, 'text/html');
      var quotes = [];
      doc.querySelectorAll('.estimator-form-row, li').forEach(function (item) {
        var labelEl = item.querySelector('.estimator-form-label-text, label');
        var priceEl = item.querySelector('.estimator-form-input--price b, .price');
        var inputEl = item.querySelector('input[type="radio"]');
        if (labelEl && priceEl) {
          var name = (labelEl.textContent || '').trim();
          var price = (priceEl.textContent || '').trim();
          var id = inputEl ? inputEl.value : '';
          if (name && price) {
            quotes.push({
              id: id,
              name: name,
              price: price
            });
          }
        }
      });
      if (quotes.length === 0) {
        var text = doc.body && doc.body.textContent || '';
        var priceMatches = text.match(/\$[\d,.]+/g);
        if (priceMatches && priceMatches.length > 0) {
          quotes.push({
            id: 'fallback',
            name: 'Shipping',
            price: priceMatches[0]
          });
        }
      }
      return quotes;
    } catch (err) {
      console.error('[ShippingCalc] Parse error:', err);
      return [];
    }
  }

  // --- DOM manipulation ---
;
  _proto.renderQuotes = function renderQuotes(quotes) {
    var _this3 = this;
    this.$results.empty();
    this.$empty.hide();
    if (quotes.length === 0) {
      this.$results.hide();
      this.$empty.show();
      return;
    }
    quotes.forEach(function (quote) {
      var $option = $("<div class=\"pdp-shipping-calc__option\">\n                    <span class=\"pdp-shipping-calc__option-name\"></span>\n                    <span class=\"pdp-shipping-calc__option-price\"></span>\n                </div>");
      $option.find('.pdp-shipping-calc__option-name').text(quote.name);
      $option.find('.pdp-shipping-calc__option-price').text(quote.price);
      _this3.$results.append($option);
    });
    this.$results.show();
    this.updateTitle();
  };
  _proto.updateTitle = function updateTitle() {
    if (!this.isEditing && this.quotes && this.selectedState && this.zipCode) {
      var abbr = this.getStateName(this.selectedState);
      this.$title.html("Shipping to <strong>" + abbr + " " + this.zipCode + "</strong>");
      this.$editBtn.show();
    } else {
      this.$title.text('Calculate Shipping');
      this.$editBtn.hide();
    }
  };
  _proto.showForm = function showForm() {
    this.isEditing = true;
    this.$form.show();
    this.updateTitle();
    this.updateSubmitState();
  };
  _proto.hideForm = function hideForm() {
    this.isEditing = false;
    this.$form.hide();
    this.updateTitle();
  };
  _proto.showLoading = function showLoading() {
    if (!this.isEditing) {
      this.$loading.show();
    }
    this.$submitBtn.find('[data-calc-btn-text]').text('');
    this.$submitBtn.find('[data-calc-btn-spinner]').show();
  };
  _proto.hideLoading = function hideLoading() {
    this.$loading.hide();
    this.$submitBtn.find('[data-calc-btn-text]').text('Get Rates');
    this.$submitBtn.find('[data-calc-btn-spinner]').hide();
  };
  _proto.showError = function showError(message) {
    this.$error.text(message).show();
  };
  _proto.clearError = function clearError() {
    this.$error.text('').hide();
  };
  _proto.hideResults = function hideResults() {
    this.$results.hide();
    this.$empty.hide();
  };
  return PDPShippingCalculator;
}(); // --- localStorage helpers ---

function getSavedShippingLocation() {
  try {
    var saved = localStorage.getItem(SHIPPING_LOCATION_KEY);
    if (!saved) return null;
    var parsed = JSON.parse(saved);
    if (!parsed.stateId || !parsed.zip) return null;
    return parsed;
  } catch (err) {
    return null;
  }
}
function saveShippingLocation(location) {
  try {
    localStorage.setItem(SHIPPING_LOCATION_KEY, JSON.stringify({
      state: location.state || '',
      stateId: location.stateId,
      zip: location.zip,
      timestamp: Date.now()
    }));
  } catch (err) {
    // localStorage may be unavailable
  }
}

/***/ },

/***/ "./assets/js/theme/product/reviews.js"
/*!********************************************!*\
  !*** ./assets/js/theme/product/reviews.js ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _default)
/* harmony export */ });
/* harmony import */ var core_js_modules_es6_array_find_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es6.array.find.js */ "./node_modules/core-js/modules/es6.array.find.js");
/* harmony import */ var core_js_modules_es6_array_find_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_array_find_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _common_nod__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/nod */ "./assets/js/theme/common/nod.js");
/* harmony import */ var _common_collapsible__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/collapsible */ "./assets/js/theme/common/collapsible.js");
/* harmony import */ var _common_models_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/models/forms */ "./assets/js/theme/common/models/forms.js");
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.min.js");




var _default = /*#__PURE__*/function () {
  function _default($reviewForm) {
    this.validator = (0,_common_nod__WEBPACK_IMPORTED_MODULE_1__["default"])({
      submit: $reviewForm.find('input[type="submit"]')
    });
    this.$reviewsContent = $('#product-reviews');
    this.$collapsible = $('[data-collapsible]', this.$reviewsContent);
    this.initLinkBind();
    this.injectPaginationLink();
    this.collapseReviews();
  }

  /**
   * On initial page load, the user clicks on "(12 Reviews)" link
   * The browser jumps to the review page and should expand the reviews section
   */
  var _proto = _default.prototype;
  _proto.initLinkBind = function initLinkBind() {
    var _this = this;
    var $content = $('#productReviews-content', this.$reviewsContent);
    $('.productView-reviewLink').on('click', function () {
      $('.productView-reviewTabLink').trigger('click');
      if (!$content.hasClass('is-open')) {
        _this.$collapsible.trigger(_common_collapsible__WEBPACK_IMPORTED_MODULE_2__.CollapsibleEvents.click);
      }
    });
  };
  _proto.collapseReviews = function collapseReviews() {
    // We're in paginating state, do not collapse
    if (window.location.hash && window.location.hash.indexOf('#product-reviews') === 0) {
      return;
    }

    // force collapse on page load
    this.$collapsible.trigger(_common_collapsible__WEBPACK_IMPORTED_MODULE_2__.CollapsibleEvents.click);
  }

  /**
   * Inject ID into the pagination link
   */;
  _proto.injectPaginationLink = function injectPaginationLink() {
    var $nextLink = $('.pagination-item--next .pagination-link', this.$reviewsContent);
    var $prevLink = $('.pagination-item--previous .pagination-link', this.$reviewsContent);
    if ($nextLink.length) {
      $nextLink.attr('href', $nextLink.attr('href') + " #product-reviews");
    }
    if ($prevLink.length) {
      $prevLink.attr('href', $prevLink.attr('href') + " #product-reviews");
    }
  };
  _proto.registerValidation = function registerValidation(context) {
    this.context = context;
    this.validator.add([{
      selector: '[name="revrating"]',
      validate: 'presence',
      errorMessage: this.context.reviewRating
    }, {
      selector: '[name="revtitle"]',
      validate: 'presence',
      errorMessage: this.context.reviewSubject
    }, {
      selector: '[name="revtext"]',
      validate: 'presence',
      errorMessage: this.context.reviewComment
    }, {
      selector: '[name="email"]',
      validate: function validate(cb, val) {
        var result = _common_models_forms__WEBPACK_IMPORTED_MODULE_3__["default"].email(val);
        cb(result);
      },
      errorMessage: this.context.reviewEmail
    }]);
    return this.validator;
  };
  _proto.validate = function validate() {
    return this.validator.performCheck();
  };
  return _default;
}();


/***/ },

/***/ "./assets/js/theme/product/video-gallery.js"
/*!**************************************************!*\
  !*** ./assets/js/theme/product/video-gallery.js ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VideoGallery: () => (/* binding */ VideoGallery),
/* harmony export */   "default": () => (/* binding */ videoGallery)
/* harmony export */ });
/* harmony import */ var core_js_modules_es6_array_find_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es6.array.find.js */ "./node_modules/core-js/modules/es6.array.find.js");
/* harmony import */ var core_js_modules_es6_array_find_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_array_find_js__WEBPACK_IMPORTED_MODULE_0__);
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.min.js");

var VideoGallery = /*#__PURE__*/function () {
  function VideoGallery($element) {
    this.$player = $element.find('[data-video-player]');
    this.$videos = $element.find('[data-video-item]');
    this.currentVideo = {};
    this.bindEvents();
  }
  var _proto = VideoGallery.prototype;
  _proto.selectNewVideo = function selectNewVideo(e) {
    e.preventDefault();
    var $target = $(e.currentTarget);
    this.currentVideo = {
      id: $target.data('videoId'),
      $selectedThumb: $target
    };
    this.setMainVideo();
    this.setActiveThumb();
  };
  _proto.setMainVideo = function setMainVideo() {
    this.$player.attr('src', "//www.youtube.com/embed/" + this.currentVideo.id);
  };
  _proto.setActiveThumb = function setActiveThumb() {
    this.$videos.removeClass('is-active');
    this.currentVideo.$selectedThumb.addClass('is-active');
  };
  _proto.bindEvents = function bindEvents() {
    this.$videos.on('click', this.selectNewVideo.bind(this));
  };
  return VideoGallery;
}();
function videoGallery() {
  var pluginKey = 'video-gallery';
  var $videoGallery = $("[data-" + pluginKey + "]");
  $videoGallery.each(function (index, element) {
    var $el = $(element);
    var isInitialized = $el.data(pluginKey) instanceof VideoGallery;
    if (isInitialized) {
      return;
    }
    $el.data(pluginKey, new VideoGallery($el));
  });
}

/***/ },

/***/ "./node_modules/core-js/modules/es7.object.entries.js"
/*!************************************************************!*\
  !*** ./node_modules/core-js/modules/es7.object.entries.js ***!
  \************************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-values-entries
var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/modules/_export.js");
var $entries = __webpack_require__(/*! ./_object-to-array */ "./node_modules/core-js/modules/_object-to-array.js")(true);

$export($export.S, 'Object', {
  entries: function entries(it) {
    return $entries(it);
  }
});


/***/ }

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWUtYnVuZGxlLmNodW5rLmFzc2V0c19qc190aGVtZV9wcm9kdWN0X2pzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUN3QjtBQUNXO0FBRW5DLElBQU1FLGFBQWEsR0FBRyxDQUNsQixPQUFPLEVBQ1AsUUFBUSxFQUNSLFVBQVUsQ0FDYjs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTQyxhQUFhQSxDQUFDQyxLQUFLLEVBQUVDLGNBQWMsRUFBRTtFQUMxQyxJQUFNQyxNQUFNLEdBQUdDLENBQUMsQ0FBQ0gsS0FBSyxDQUFDO0VBQ3ZCLElBQU1JLFVBQVUsR0FBR0YsTUFBTSxDQUFDRyxNQUFNLE9BQUtKLGNBQWdCLENBQUM7RUFDdEQsSUFBTUssT0FBTyxHQUFHSixNQUFNLENBQUNLLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQ0MsV0FBVyxDQUFDLENBQUM7RUFFcEQsSUFBSUMsU0FBUyxHQUFNUixjQUFjLFVBQUtLLE9BQVM7RUFDL0MsSUFBSUksaUJBQWlCOztFQUVyQjtFQUNBLElBQUlKLE9BQU8sS0FBSyxPQUFPLEVBQUU7SUFDckIsSUFBTUssU0FBUyxHQUFHVCxNQUFNLENBQUNLLElBQUksQ0FBQyxNQUFNLENBQUM7SUFFckMsSUFBSUssc0RBQUEsQ0FBVyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLEVBQUVELFNBQVMsQ0FBQyxFQUFFO01BQ3hEO01BQ0FGLFNBQVMsR0FBTVIsY0FBYyxVQUFLWSx1REFBQSxDQUFZRixTQUFTLENBQUc7SUFDOUQsQ0FBQyxNQUFNO01BQ0g7TUFDQUQsaUJBQWlCLFFBQU1ELFNBQVMsR0FBR0ssd0RBQUEsQ0FBYUgsU0FBUyxDQUFHO0lBQ2hFO0VBQ0o7O0VBRUE7RUFDQSxPQUFPUCxVQUFVLENBQ1pXLFFBQVEsQ0FBQ04sU0FBUyxDQUFDLENBQ25CTSxRQUFRLENBQUNMLGlCQUFpQixDQUFDO0FBQ3BDOztBQUVB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LEVBQUU7TUFDZjtJQUNKO0lBRUE3RyxHQUFHLENBQUM3TixJQUFJLENBQUNzVSxTQUFTLEVBQUUsSUFBSVgsWUFBWSxDQUFDOUYsR0FBRyxDQUFDLENBQUM7RUFDOUMsQ0FBQyxDQUFDO0FBQ04sQzs7Ozs7Ozs7OztBQ2xEQTtBQUNBLGNBQWMsbUJBQU8sQ0FBQyw0REFBVztBQUNqQyxlQUFlLG1CQUFPLENBQUMsOEVBQW9COztBQUUzQztBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9sb25lc3RhcnRlbXBsYXRlcy1wYXJ0c3dhcmVob3VzZS8uL2Fzc2V0cy9qcy90aGVtZS9jb21tb24vZm9ybS11dGlscy5qcyIsIndlYnBhY2s6Ly9sb25lc3RhcnRlbXBsYXRlcy1wYXJ0c3dhcmVob3VzZS8uL2Fzc2V0cy9qcy90aGVtZS9wcm9kdWN0LmpzIiwid2VicGFjazovL2xvbmVzdGFydGVtcGxhdGVzLXBhcnRzd2FyZWhvdXNlLy4vYXNzZXRzL2pzL3RoZW1lL3Byb2R1Y3QvcGRwLXNoaXBwaW5nLWNhbGN1bGF0b3IuanMiLCJ3ZWJwYWNrOi8vbG9uZXN0YXJ0ZW1wbGF0ZXMtcGFydHN3YXJlaG91c2UvLi9hc3NldHMvanMvdGhlbWUvcHJvZHVjdC9yZXZpZXdzLmpzIiwid2VicGFjazovL2xvbmVzdGFydGVtcGxhdGVzLXBhcnRzd2FyZWhvdXNlLy4vYXNzZXRzL2pzL3RoZW1lL3Byb2R1Y3QvdmlkZW8tZ2FsbGVyeS5qcyIsIndlYnBhY2s6Ly9sb25lc3RhcnRlbXBsYXRlcy1wYXJ0c3dhcmVob3VzZS8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM3Lm9iamVjdC5lbnRyaWVzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgbm9kIGZyb20gJy4vbm9kJztcbmltcG9ydCBmb3JtcyBmcm9tICcuL21vZGVscy9mb3Jtcyc7XG5cbmNvbnN0IGlucHV0VGFnTmFtZXMgPSBbXG4gICAgJ2lucHV0JyxcbiAgICAnc2VsZWN0JyxcbiAgICAndGV4dGFyZWEnLFxuXTtcblxuLyoqXG4gKiBBcHBseSBjbGFzcyBuYW1lIHRvIGFuIGlucHV0IGVsZW1lbnQgb24gaXRzIHR5cGVcbiAqIEBwYXJhbSB7b2JqZWN0fSBpbnB1dFxuICogQHBhcmFtIHtzdHJpbmd9IGZvcm1GaWVsZENsYXNzXG4gKiBAcmV0dXJuIHtvYmplY3R9IEVsZW1lbnQgaXRzZWxmXG4gKi9cbmZ1bmN0aW9uIGNsYXNzaWZ5SW5wdXQoaW5wdXQsIGZvcm1GaWVsZENsYXNzKSB7XG4gICAgY29uc3QgJGlucHV0ID0gJChpbnB1dCk7XG4gICAgY29uc3QgJGZvcm1GaWVsZCA9ICRpbnB1dC5wYXJlbnQoYC4ke2Zvcm1GaWVsZENsYXNzfWApO1xuICAgIGNvbnN0IHRhZ05hbWUgPSAkaW5wdXQucHJvcCgndGFnTmFtZScpLnRvTG93ZXJDYXNlKCk7XG5cbiAgICBsZXQgY2xhc3NOYW1lID0gYCR7Zm9ybUZpZWxkQ2xhc3N9LS0ke3RhZ05hbWV9YDtcbiAgICBsZXQgc3BlY2lmaWNDbGFzc05hbWU7XG5cbiAgICAvLyBJbnB1dCBjYW4gYmUgdGV4dC9jaGVja2JveC9yYWRpbyBldGMuLi5cbiAgICBpZiAodGFnTmFtZSA9PT0gJ2lucHV0Jykge1xuICAgICAgICBjb25zdCBpbnB1dFR5cGUgPSAkaW5wdXQucHJvcCgndHlwZScpO1xuXG4gICAgICAgIGlmIChfLmluY2x1ZGVzKFsncmFkaW8nLCAnY2hlY2tib3gnLCAnc3VibWl0J10sIGlucHV0VHlwZSkpIHtcbiAgICAgICAgICAgIC8vIGllOiAuZm9ybS1maWVsZC0tY2hlY2tib3gsIC5mb3JtLWZpZWxkLS1yYWRpb1xuICAgICAgICAgICAgY2xhc3NOYW1lID0gYCR7Zm9ybUZpZWxkQ2xhc3N9LS0ke18uY2FtZWxDYXNlKGlucHV0VHlwZSl9YDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGllOiAuZm9ybS1maWVsZC0taW5wdXQgLmZvcm0tZmllbGQtLWlucHV0VGV4dFxuICAgICAgICAgICAgc3BlY2lmaWNDbGFzc05hbWUgPSBgJHtjbGFzc05hbWV9JHtfLmNhcGl0YWxpemUoaW5wdXRUeXBlKX1gO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gQXBwbHkgY2xhc3MgbW9kaWZpZXJcbiAgICByZXR1cm4gJGZvcm1GaWVsZFxuICAgICAgICAuYWRkQ2xhc3MoY2xhc3NOYW1lKVxuICAgICAgICAuYWRkQ2xhc3Moc3BlY2lmaWNDbGFzc05hbWUpO1xufVxuXG4vKipcbiAqIEFwcGx5IGNsYXNzIG5hbWUgdG8gZWFjaCBpbnB1dCBlbGVtZW50IGluIGEgZm9ybSBiYXNlZCBvbiBpdHMgdHlwZVxuICogQGV4YW1wbGVcbiAqIC8vIEJlZm9yZVxuICogPGZvcm0gaWQ9XCJmb3JtXCI+XG4gKiAgICAgPGRpdiBjbGFzcz1cImZvcm0tZmllbGRcIj5cbiAqICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCI+XG4gKiAgICAgPC9kaXY+XG4gKiAgICAgPGRpdiBjbGFzcz1cImZvcm0tZmllbGRcIj5cbiAqICAgICAgICAgPHNlbGVjdD4uLi48L3NlbGVjdD5cbiAqICAgICA8L2Rpdj5cbiAqIDwvZm9ybT5cbiAqXG4gKiBjbGFzc2lmeUZvcm0oJyNmb3JtJywgeyBmb3JtRmllbGRDbGFzczogJ2Zvcm0tZmllbGQnIH0pO1xuICpcbiAqIC8vIEFmdGVyXG4gKiA8ZGl2IGNsYXNzPVwiZm9ybS1maWVsZCBmb3JtLWZpZWxkLS1pbnB1dCBmb3JtLWZpZWxkLS1pbnB1dFRleHRcIj4uLi48L2Rpdj5cbiAqIDxkaXYgY2xhc3M9XCJmb3JtLWZpZWxkIGZvcm0tZmllbGQtLXNlbGVjdFwiPi4uLjwvZGl2PlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfG9iamVjdH0gZm9ybVNlbGVjdG9yIC0gc2VsZWN0b3Igb3IgZWxlbWVudFxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge2pRdWVyeX0gRWxlbWVudCBpdHNlbGZcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsYXNzaWZ5Rm9ybShmb3JtU2VsZWN0b3IsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0ICRmb3JtID0gJChmb3JtU2VsZWN0b3IpO1xuICAgIGNvbnN0ICRpbnB1dHMgPSAkZm9ybS5maW5kKGlucHV0VGFnTmFtZXMuam9pbignLCAnKSk7XG5cbiAgICAvLyBPYnRhaW4gb3B0aW9uc1xuICAgIGNvbnN0IHsgZm9ybUZpZWxkQ2xhc3MgPSAnZm9ybS1maWVsZCcgfSA9IG9wdGlvbnM7XG5cbiAgICAvLyBDbGFzc2lmeSBlYWNoIGlucHV0IGluIGEgZm9ybVxuICAgICRpbnB1dHMuZWFjaCgoX18sIGlucHV0KSA9PiB7XG4gICAgICAgIGNsYXNzaWZ5SW5wdXQoaW5wdXQsIGZvcm1GaWVsZENsYXNzKTtcbiAgICB9KTtcblxuICAgIHJldHVybiAkZm9ybTtcbn1cblxuLyoqXG4gKiBHZXQgaWQgZnJvbSBnaXZlbiBmaWVsZFxuICogQHBhcmFtIHtvYmplY3R9ICRmaWVsZCBKUXVlcnkgZmllbGQgb2JqZWN0XG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGdldEZpZWxkSWQoJGZpZWxkKSB7XG4gICAgY29uc3QgZmllbGRJZCA9ICRmaWVsZC5wcm9wKCduYW1lJykubWF0Y2goLyhcXFsuKlxcXSkvKTtcblxuICAgIGlmIChmaWVsZElkICYmIGZpZWxkSWQubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgIHJldHVybiBmaWVsZElkWzBdO1xuICAgIH1cblxuICAgIHJldHVybiAnJztcbn1cblxuLyoqXG4gKiBJbnNlcnQgaGlkZGVuIGZpZWxkIGFmdGVyIFN0YXRlL1Byb3ZpbmNlIGZpZWxkXG4gKiBAcGFyYW0ge29iamVjdH0gJHN0YXRlRmllbGQgSlF1ZXJ5IGZpZWxkIG9iamVjdFxuICovXG5mdW5jdGlvbiBpbnNlcnRTdGF0ZUhpZGRlbkZpZWxkKCRzdGF0ZUZpZWxkKSB7XG4gICAgY29uc3QgZmllbGRJZCA9IGdldEZpZWxkSWQoJHN0YXRlRmllbGQpO1xuICAgIGNvbnN0IHN0YXRlRmllbGRBdHRycyA9IHtcbiAgICAgICAgdHlwZTogJ2hpZGRlbicsXG4gICAgICAgIG5hbWU6IGBGb3JtRmllbGRJc1RleHQke2ZpZWxkSWR9YCxcbiAgICAgICAgdmFsdWU6ICcxJyxcbiAgICB9O1xuXG4gICAgJHN0YXRlRmllbGQuYWZ0ZXIoJCgnPGlucHV0IC8+Jywgc3RhdGVGaWVsZEF0dHJzKSk7XG59XG5cbmNvbnN0IFZhbGlkYXRvcnMgPSB7XG4gICAgLyoqXG4gICAgICogU2V0cyB1cCBhIG5ldyB2YWxpZGF0aW9uIHdoZW4gdGhlIGZvcm0gaXMgZGlydHlcbiAgICAgKiBAcGFyYW0gdmFsaWRhdG9yXG4gICAgICogQHBhcmFtIGZpZWxkXG4gICAgICovXG4gICAgc2V0RW1haWxWYWxpZGF0aW9uOiAodmFsaWRhdG9yLCBmaWVsZCkgPT4ge1xuICAgICAgICBpZiAoZmllbGQpIHtcbiAgICAgICAgICAgIHZhbGlkYXRvci5hZGQoe1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiBmaWVsZCxcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZTogKGNiLCB2YWwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gZm9ybXMuZW1haWwodmFsKTtcblxuICAgICAgICAgICAgICAgICAgICBjYihyZXN1bHQpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiAnWW91IG11c3QgZW50ZXIgYSB2YWxpZCBlbWFpbC4nLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVmFsaWRhdGUgcGFzc3dvcmQgZmllbGRzXG4gICAgICogQHBhcmFtIHZhbGlkYXRvclxuICAgICAqIEBwYXJhbSBwYXNzd29yZFNlbGVjdG9yXG4gICAgICogQHBhcmFtIHBhc3N3b3JkMlNlbGVjdG9yXG4gICAgICogQHBhcmFtIHJlcXVpcmVtZW50c1xuICAgICAqIEBwYXJhbSBpc09wdGlvbmFsXG4gICAgICovXG4gICAgc2V0UGFzc3dvcmRWYWxpZGF0aW9uOiAodmFsaWRhdG9yLCBwYXNzd29yZFNlbGVjdG9yLCBwYXNzd29yZDJTZWxlY3RvciwgcmVxdWlyZW1lbnRzLCBpc09wdGlvbmFsKSA9PiB7XG4gICAgICAgIGNvbnN0ICRwYXNzd29yZCA9ICQocGFzc3dvcmRTZWxlY3Rvcik7XG4gICAgICAgIGNvbnN0IHBhc3N3b3JkVmFsaWRhdGlvbnMgPSBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6IHBhc3N3b3JkU2VsZWN0b3IsXG4gICAgICAgICAgICAgICAgdmFsaWRhdGU6IChjYiwgdmFsKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHZhbC5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzT3B0aW9uYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYih0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNiKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2U6ICdZb3UgbXVzdCBlbnRlciBhIHBhc3N3b3JkLicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiBwYXNzd29yZFNlbGVjdG9yLFxuICAgICAgICAgICAgICAgIHZhbGlkYXRlOiAoY2IsIHZhbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSB2YWwubWF0Y2gobmV3IFJlZ0V4cChyZXF1aXJlbWVudHMuYWxwaGEpKVxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgdmFsLm1hdGNoKG5ldyBSZWdFeHAocmVxdWlyZW1lbnRzLm51bWVyaWMpKVxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgdmFsLmxlbmd0aCA+PSByZXF1aXJlbWVudHMubWlubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIG9wdGlvbmFsIGFuZCBub3RoaW5nIGVudGVyZWQsIGl0IGlzIHZhbGlkXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc09wdGlvbmFsICYmIHZhbC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYih0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNiKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2U6IHJlcXVpcmVtZW50cy5lcnJvcixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6IHBhc3N3b3JkMlNlbGVjdG9yLFxuICAgICAgICAgICAgICAgIHZhbGlkYXRlOiAoY2IsIHZhbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSB2YWwubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc09wdGlvbmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2IodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjYihyZXN1bHQpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiAnWW91IG11c3QgZW50ZXIgYSBwYXNzd29yZC4nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RvcjogcGFzc3dvcmQyU2VsZWN0b3IsXG4gICAgICAgICAgICAgICAgdmFsaWRhdGU6IChjYiwgdmFsKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHZhbCA9PT0gJHBhc3N3b3JkLnZhbCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNiKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2U6ICdZb3VyIHBhc3N3b3JkcyBkbyBub3QgbWF0Y2guJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIF07XG5cbiAgICAgICAgdmFsaWRhdG9yLmFkZChwYXNzd29yZFZhbGlkYXRpb25zKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVmFsaWRhdGUgcGFzc3dvcmQgZmllbGRzXG4gICAgICogQHBhcmFtIHtOb2R9IHZhbGlkYXRvclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzZWxlY3RvcnNcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3JzLmVycm9yU2VsZWN0b3JcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3JzLmZpZWxkc2V0U2VsZWN0b3JcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3JzLmZvcm1TZWxlY3RvclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvcnMubWF4UHJpY2VTZWxlY3RvclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvcnMubWluUHJpY2VTZWxlY3RvclxuICAgICAqL1xuICAgIHNldE1pbk1heFByaWNlVmFsaWRhdGlvbjogKHZhbGlkYXRvciwgc2VsZWN0b3JzKSA9PiB7XG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICAgIGVycm9yU2VsZWN0b3IsXG4gICAgICAgICAgICBmaWVsZHNldFNlbGVjdG9yLFxuICAgICAgICAgICAgZm9ybVNlbGVjdG9yLFxuICAgICAgICAgICAgbWF4UHJpY2VTZWxlY3RvcixcbiAgICAgICAgICAgIG1pblByaWNlU2VsZWN0b3IsXG4gICAgICAgIH0gPSBzZWxlY3RvcnM7XG5cbiAgICAgICAgdmFsaWRhdG9yLmNvbmZpZ3VyZSh7XG4gICAgICAgICAgICBmb3JtOiBmb3JtU2VsZWN0b3IsXG4gICAgICAgICAgICBwcmV2ZW50U3VibWl0OiB0cnVlLFxuICAgICAgICAgICAgc3VjY2Vzc0NsYXNzOiAnXycsIC8vIEtMVURHRTogRG9uJ3QgYXBwbHkgc3VjY2VzcyBjbGFzc1xuICAgICAgICB9KTtcblxuICAgICAgICB2YWxpZGF0b3IuYWRkKHtcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogJ01pbiBwcmljZSBtdXN0IGJlIGxlc3MgdGhhbiBtYXguIHByaWNlLicsXG4gICAgICAgICAgICBzZWxlY3RvcjogbWluUHJpY2VTZWxlY3RvcixcbiAgICAgICAgICAgIHZhbGlkYXRlOiBgbWluLW1heDoke21pblByaWNlU2VsZWN0b3J9OiR7bWF4UHJpY2VTZWxlY3Rvcn1gLFxuICAgICAgICB9KTtcblxuICAgICAgICB2YWxpZGF0b3IuYWRkKHtcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogJ01pbiBwcmljZSBtdXN0IGJlIGxlc3MgdGhhbiBtYXguIHByaWNlLicsXG4gICAgICAgICAgICBzZWxlY3RvcjogbWF4UHJpY2VTZWxlY3RvcixcbiAgICAgICAgICAgIHZhbGlkYXRlOiBgbWluLW1heDoke21pblByaWNlU2VsZWN0b3J9OiR7bWF4UHJpY2VTZWxlY3Rvcn1gLFxuICAgICAgICB9KTtcblxuICAgICAgICB2YWxpZGF0b3IuYWRkKHtcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogJ01heC4gcHJpY2UgaXMgcmVxdWlyZWQuJyxcbiAgICAgICAgICAgIHNlbGVjdG9yOiBtYXhQcmljZVNlbGVjdG9yLFxuICAgICAgICAgICAgdmFsaWRhdGU6ICdwcmVzZW5jZScsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhbGlkYXRvci5hZGQoe1xuICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiAnTWluLiBwcmljZSBpcyByZXF1aXJlZC4nLFxuICAgICAgICAgICAgc2VsZWN0b3I6IG1pblByaWNlU2VsZWN0b3IsXG4gICAgICAgICAgICB2YWxpZGF0ZTogJ3ByZXNlbmNlJyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFsaWRhdG9yLmFkZCh7XG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6ICdJbnB1dCBtdXN0IGJlIGdyZWF0ZXIgdGhhbiAwLicsXG4gICAgICAgICAgICBzZWxlY3RvcjogW21pblByaWNlU2VsZWN0b3IsIG1heFByaWNlU2VsZWN0b3JdLFxuICAgICAgICAgICAgdmFsaWRhdGU6ICdtaW4tbnVtYmVyOjAnLFxuICAgICAgICB9KTtcblxuICAgICAgICB2YWxpZGF0b3Iuc2V0TWVzc2FnZU9wdGlvbnMoe1xuICAgICAgICAgICAgc2VsZWN0b3I6IFttaW5QcmljZVNlbGVjdG9yLCBtYXhQcmljZVNlbGVjdG9yXSxcbiAgICAgICAgICAgIHBhcmVudDogZmllbGRzZXRTZWxlY3RvcixcbiAgICAgICAgICAgIGVycm9yU3BhbjogZXJyb3JTZWxlY3RvcixcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldHMgdXAgYSBuZXcgdmFsaWRhdGlvbiB3aGVuIHRoZSBmb3JtIGlzIGRpcnR5XG4gICAgICogQHBhcmFtIHZhbGlkYXRvclxuICAgICAqIEBwYXJhbSBmaWVsZFxuICAgICAqL1xuICAgIHNldFN0YXRlQ291bnRyeVZhbGlkYXRpb246ICh2YWxpZGF0b3IsIGZpZWxkKSA9PiB7XG4gICAgICAgIGlmIChmaWVsZCkge1xuICAgICAgICAgICAgdmFsaWRhdG9yLmFkZCh7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6IGZpZWxkLFxuICAgICAgICAgICAgICAgIHZhbGlkYXRlOiAncHJlc2VuY2UnLFxuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZTogJ1RoZSBcXCdTdGF0ZS9Qcm92aW5jZVxcJyBmaWVsZCBjYW5ub3QgYmUgYmxhbmsuJyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgY2xhc3NlcyBmcm9tIGRpcnR5IGZvcm0gaWYgcHJldmlvdXNseSBjaGVja2VkXG4gICAgICogQHBhcmFtIGZpZWxkXG4gICAgICovXG4gICAgY2xlYW5VcFN0YXRlVmFsaWRhdGlvbjogKGZpZWxkKSA9PiB7XG4gICAgICAgIGNvbnN0ICRmaWVsZENsYXNzRWxlbWVudCA9ICQoKGBbZGF0YS10eXBlPVwiJHtmaWVsZC5kYXRhKCdmaWVsZFR5cGUnKX1cIl1gKSk7XG5cbiAgICAgICAgT2JqZWN0LmtleXMobm9kLmNsYXNzZXMpLmZvckVhY2goKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBpZiAoJGZpZWxkQ2xhc3NFbGVtZW50Lmhhc0NsYXNzKG5vZC5jbGFzc2VzW3ZhbHVlXSkpIHtcbiAgICAgICAgICAgICAgICAkZmllbGRDbGFzc0VsZW1lbnQucmVtb3ZlQ2xhc3Mobm9kLmNsYXNzZXNbdmFsdWVdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcbn07XG5cbmV4cG9ydCB7IFZhbGlkYXRvcnMsIGluc2VydFN0YXRlSGlkZGVuRmllbGQgfTtcbiIsIi8qXG4gSW1wb3J0IGFsbCBwcm9kdWN0IHNwZWNpZmljIGpzXG4gKi9cbmltcG9ydCBQYWdlTWFuYWdlciBmcm9tICcuL3BhZ2UtbWFuYWdlcic7XG5pbXBvcnQgUmV2aWV3IGZyb20gJy4vcHJvZHVjdC9yZXZpZXdzJztcbmltcG9ydCBjb2xsYXBzaWJsZUZhY3RvcnkgZnJvbSAnLi9jb21tb24vY29sbGFwc2libGUnO1xuaW1wb3J0IFByb2R1Y3REZXRhaWxzIGZyb20gJy4vY29tbW9uL3Byb2R1Y3QtZGV0YWlscyc7XG5pbXBvcnQgdmlkZW9HYWxsZXJ5IGZyb20gJy4vcHJvZHVjdC92aWRlby1nYWxsZXJ5JztcbmltcG9ydCB7IGNsYXNzaWZ5Rm9ybSB9IGZyb20gJy4vY29tbW9uL2Zvcm0tdXRpbHMnO1xuaW1wb3J0ICdAZmFuY3lhcHBzL2ZhbmN5Ym94JztcbmltcG9ydCBQRFBTaGlwcGluZ0NhbGN1bGF0b3IgZnJvbSAnLi9wcm9kdWN0L3BkcC1zaGlwcGluZy1jYWxjdWxhdG9yJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJvZHVjdCBleHRlbmRzIFBhZ2VNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3Rvcihjb250ZXh0KSB7XG4gICAgICAgIHN1cGVyKGNvbnRleHQpO1xuICAgICAgICB0aGlzLnVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgICAgICB0aGlzLiRyZXZpZXdMaW5rID0gJCgnW2RhdGEtcmV2ZWFsLWlkPVwibW9kYWwtcmV2aWV3LWZvcm1cIl0nKTtcbiAgICAgICAgdGhpcy4kYnVsa1ByaWNpbmdMaW5rID0gJCgnW2RhdGEtcmV2ZWFsLWlkPVwibW9kYWwtYnVsay1wcmljaW5nXCJdJyk7XG4gICAgfVxuXG4gICAgb25SZWFkeSgpIHtcbiAgICAgICAgLy8gTGlzdGVuIGZvciBmb3VuZGF0aW9uIG1vZGFsIGNsb3NlIGV2ZW50cyB0byBzYW5pdGl6ZSBVUkwgYWZ0ZXIgcmV2aWV3LlxuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xvc2UuZm5kdG4ucmV2ZWFsJywgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMudXJsLmluZGV4T2YoJyN3cml0ZV9yZXZpZXcnKSAhPT0gLTEgJiYgdHlwZW9mIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZShudWxsLCBkb2N1bWVudC50aXRsZSwgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IHZhbGlkYXRvcjtcblxuICAgICAgICAvLyBJbml0IGNvbGxhcHNpYmxlXG4gICAgICAgIGNvbGxhcHNpYmxlRmFjdG9yeSgpO1xuXG4gICAgICAgIHRoaXMucHJvZHVjdERldGFpbHMgPSBuZXcgUHJvZHVjdERldGFpbHMoJCgnLnByb2R1Y3RWaWV3JyksIHRoaXMuY29udGV4dCwgd2luZG93LkJDRGF0YS5wcm9kdWN0X2F0dHJpYnV0ZXMpO1xuICAgICAgICB0aGlzLnByb2R1Y3REZXRhaWxzLnNldFByb2R1Y3RWYXJpYW50KCk7XG5cbiAgICAgICAgdmlkZW9HYWxsZXJ5KCk7XG5cbiAgICAgICAgY29uc3QgJHJldmlld0Zvcm0gPSBjbGFzc2lmeUZvcm0oJy53cml0ZVJldmlldy1mb3JtJyk7XG4gICAgICAgIGNvbnN0IHJldmlldyA9IG5ldyBSZXZpZXcoJHJldmlld0Zvcm0pO1xuXG4gICAgICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnW2RhdGEtcmV2ZWFsLWlkPVwibW9kYWwtcmV2aWV3LWZvcm1cIl0nLCAoKSA9PiB7XG4gICAgICAgICAgICB2YWxpZGF0b3IgPSByZXZpZXcucmVnaXN0ZXJWYWxpZGF0aW9uKHRoaXMuY29udGV4dCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRyZXZpZXdGb3JtLm9uKCdzdWJtaXQnLCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAodmFsaWRhdG9yKSB7XG4gICAgICAgICAgICAgICAgdmFsaWRhdG9yLnBlcmZvcm1DaGVjaygpO1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWxpZGF0b3IuYXJlQWxsKCd2YWxpZCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0ICRzaGlwcGluZ0NhbGMgPSAkKCdbZGF0YS1wZHAtc2hpcHBpbmctY2FsY10nKTtcbiAgICAgICAgaWYgKCRzaGlwcGluZ0NhbGMubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnNoaXBwaW5nQ2FsY3VsYXRvciA9IG5ldyBQRFBTaGlwcGluZ0NhbGN1bGF0b3IoJHNoaXBwaW5nQ2FsYywgdGhpcy5jb250ZXh0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucHJvZHVjdFJldmlld0hhbmRsZXIoKTtcbiAgICAgICAgdGhpcy5idWxrUHJpY2luZ0hhbmRsZXIoKTtcbiAgICB9XG5cbiAgICBwcm9kdWN0UmV2aWV3SGFuZGxlcigpIHtcbiAgICAgICAgaWYgKHRoaXMudXJsLmluZGV4T2YoJyN3cml0ZV9yZXZpZXcnKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuJHJldmlld0xpbmsudHJpZ2dlcignY2xpY2snKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGJ1bGtQcmljaW5nSGFuZGxlcigpIHtcbiAgICAgICAgaWYgKHRoaXMudXJsLmluZGV4T2YoJyNidWxrX3ByaWNpbmcnKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuJGJ1bGtQcmljaW5nTGluay50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHV0aWxzIGZyb20gJ0BiaWdjb21tZXJjZS9zdGVuY2lsLXV0aWxzJztcblxuY29uc3QgU0hJUFBJTkdfTE9DQVRJT05fS0VZID0gJ3RwdV9zaGlwcGluZ19sb2NhdGlvbic7XG5jb25zdCBDQVJUX0FQSSA9ICcvYXBpL3N0b3JlZnJvbnQvY2FydHM/aW5jbHVkZT1saW5lSXRlbXMucGh5c2ljYWxJdGVtcy5vcHRpb25zLGxpbmVJdGVtcy5kaWdpdGFsSXRlbXMub3B0aW9ucyc7XG5cbi8qKlxuICogU25hcHNob3QgdGhlIGN1cnJlbnQgc2Vzc2lvbiBjYXJ0IGFuZCBkZWxldGUgaXQgc28gdGhlIG5leHQgY2FydC5pdGVtQWRkXG4gKiBjcmVhdGVzIGEgZnJlc2gsIHNpbmdsZS1wcm9kdWN0IGNhcnQuICBSZXR1cm5zIGV2ZXJ5dGhpbmcgbmVlZGVkIHRvXG4gKiByZXN0b3JlIHRoZSBjYXJ0IGFmdGVyd2FyZHMuICBSZXR1cm5zIG51bGwgd2hlbiB0aGUgY2FydCBpcyBhbHJlYWR5IGVtcHR5LlxuICovXG5hc3luYyBmdW5jdGlvbiBzbmFwc2hvdEFuZENsZWFyQ2FydCgpIHtcbiAgICBjb25zdCBjYXJ0cyA9IGF3YWl0IGZldGNoKENBUlRfQVBJLCB7IGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nIH0pLnRoZW4ociA9PiByLmpzb24oKSk7XG4gICAgY29uc3QgY2FydCA9IGNhcnRzWzBdO1xuICAgIGlmICghY2FydCkgcmV0dXJuIG51bGw7XG5cbiAgICBjb25zdCBwaHlzaWNhbCA9IGNhcnQubGluZUl0ZW1zLnBoeXNpY2FsSXRlbXMgfHwgW107XG4gICAgY29uc3QgZGlnaXRhbCA9IGNhcnQubGluZUl0ZW1zLmRpZ2l0YWxJdGVtcyB8fCBbXTtcbiAgICBjb25zdCBnaWZ0Q2VydHMgPSBjYXJ0LmxpbmVJdGVtcy5naWZ0Q2VydGlmaWNhdGVzIHx8IFtdO1xuXG4gICAgY29uc3Qgc2F2ZWRJdGVtcyA9IFsuLi5waHlzaWNhbCwgLi4uZGlnaXRhbF0ubWFwKGl0ZW0gPT4gKHtcbiAgICAgICAgcHJvZHVjdElkOiBpdGVtLnByb2R1Y3RJZCxcbiAgICAgICAgcXVhbnRpdHk6IGl0ZW0ucXVhbnRpdHksXG4gICAgICAgIHZhcmlhbnRJZDogaXRlbS52YXJpYW50SWQsXG4gICAgfSkpO1xuXG4gICAgY29uc3Qgc2F2ZWRHaWZ0Q2VydHMgPSBnaWZ0Q2VydHMubWFwKGdjID0+ICh7XG4gICAgICAgIG5hbWU6IGdjLm5hbWUsXG4gICAgICAgIHRoZW1lOiBnYy50aGVtZSxcbiAgICAgICAgYW1vdW50OiBnYy5hbW91bnQsXG4gICAgICAgIHF1YW50aXR5OiBnYy5xdWFudGl0eSxcbiAgICAgICAgc2VuZGVyOiBnYy5zZW5kZXIsXG4gICAgICAgIHJlY2lwaWVudDogZ2MucmVjaXBpZW50LFxuICAgICAgICBtZXNzYWdlOiBnYy5tZXNzYWdlLFxuICAgIH0pKTtcblxuICAgIGNvbnN0IGNvdXBvbkNvZGVzID0gKGNhcnQuY291cG9ucyB8fCBbXSkubWFwKGMgPT4gYy5jb2RlKTtcbiAgICBjb25zdCBvcmlnaW5hbFF1YW50aXR5ID0gcGh5c2ljYWwucmVkdWNlKChzdW0sIGkpID0+IHN1bSArIGkucXVhbnRpdHksIDApXG4gICAgICAgICsgZGlnaXRhbC5yZWR1Y2UoKHN1bSwgaSkgPT4gc3VtICsgaS5xdWFudGl0eSwgMCk7XG5cbiAgICBhd2FpdCBmZXRjaChgL2FwaS9zdG9yZWZyb250L2NhcnRzLyR7Y2FydC5pZH1gLCB7XG4gICAgICAgIG1ldGhvZDogJ0RFTEVURScsXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHsgc2F2ZWRJdGVtcywgc2F2ZWRHaWZ0Q2VydHMsIGNvdXBvbkNvZGVzLCBvcmlnaW5hbFF1YW50aXR5IH07XG59XG5cbi8qKlxuICogUmVjcmVhdGUgdGhlIGNhcnQgZnJvbSBhIHByZXZpb3VzIHNuYXBzaG90IGFuZCByZS1hcHBseSBjb3Vwb25zLlxuICogRmFpbHVyZXMgYXJlIGxvZ2dlZCBidXQgbmV2ZXIgdGhyb3duIHNvIHRoZSBjYWxsZXIncyBmaW5hbGx5LWJsb2NrXG4gKiBkb2Vzbid0IG1hc2sgdGhlIG9yaWdpbmFsIHNoaXBwaW5nLXF1b3RlIHJlc3VsdC5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gcmVzdG9yZUNhcnQoc25hcHNob3QpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBib2R5ID0geyBsaW5lSXRlbXM6IHNuYXBzaG90LnNhdmVkSXRlbXMgfTtcbiAgICAgICAgaWYgKHNuYXBzaG90LnNhdmVkR2lmdENlcnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGJvZHkuZ2lmdENlcnRpZmljYXRlcyA9IHNuYXBzaG90LnNhdmVkR2lmdENlcnRzO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goJy9hcGkvc3RvcmVmcm9udC9jYXJ0cycsIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbicsXG4gICAgICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGJvZHkpLFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgbmV3Q2FydCA9IGF3YWl0IHJlcy5qc29uKCk7XG4gICAgICAgIGNvbnN0IG5ld0NhcnRJZCA9IG5ld0NhcnQ/LmlkIHx8IG5ld0NhcnQ/LlswXT8uaWQ7XG5cbiAgICAgICAgaWYgKG5ld0NhcnRJZCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBjb2RlIG9mIHNuYXBzaG90LmNvdXBvbkNvZGVzKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgZmV0Y2goYC9hcGkvc3RvcmVmcm9udC9jYXJ0cy8ke25ld0NhcnRJZH0vY291cG9uc2AsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbicsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgY291cG9uQ29kZTogY29kZSB9KSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ1tTaGlwcGluZ0NhbGNdIENvdWxkIG5vdCByZS1hcHBseSBjb3Vwb246JywgY29kZSwgZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJCgnYm9keScpLnRyaWdnZXIoJ2NhcnQtcXVhbnRpdHktdXBkYXRlJywgc25hcHNob3Qub3JpZ2luYWxRdWFudGl0eSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tTaGlwcGluZ0NhbGNdIEZhaWxlZCB0byByZXN0b3JlIGNhcnQ6JywgZXJyKTtcbiAgICB9XG59XG5cbmNvbnN0IFVTX1NUQVRFUyA9IFtcbiAgICB7IGlkOiAxLCBuYW1lOiAnQWxhYmFtYScsIGFiYnI6ICdBTCcgfSxcbiAgICB7IGlkOiAyLCBuYW1lOiAnQWxhc2thJywgYWJicjogJ0FLJyB9LFxuICAgIHsgaWQ6IDQsIG5hbWU6ICdBcml6b25hJywgYWJicjogJ0FaJyB9LFxuICAgIHsgaWQ6IDUsIG5hbWU6ICdBcmthbnNhcycsIGFiYnI6ICdBUicgfSxcbiAgICB7IGlkOiAxMiwgbmFtZTogJ0NhbGlmb3JuaWEnLCBhYmJyOiAnQ0EnIH0sXG4gICAgeyBpZDogMTMsIG5hbWU6ICdDb2xvcmFkbycsIGFiYnI6ICdDTycgfSxcbiAgICB7IGlkOiAxNCwgbmFtZTogJ0Nvbm5lY3RpY3V0JywgYWJicjogJ0NUJyB9LFxuICAgIHsgaWQ6IDE1LCBuYW1lOiAnRGVsYXdhcmUnLCBhYmJyOiAnREUnIH0sXG4gICAgeyBpZDogMTYsIG5hbWU6ICdEaXN0cmljdCBvZiBDb2x1bWJpYScsIGFiYnI6ICdEQycgfSxcbiAgICB7IGlkOiAxOCwgbmFtZTogJ0Zsb3JpZGEnLCBhYmJyOiAnRkwnIH0sXG4gICAgeyBpZDogMTksIG5hbWU6ICdHZW9yZ2lhJywgYWJicjogJ0dBJyB9LFxuICAgIHsgaWQ6IDIxLCBuYW1lOiAnSGF3YWlpJywgYWJicjogJ0hJJyB9LFxuICAgIHsgaWQ6IDIyLCBuYW1lOiAnSWRhaG8nLCBhYmJyOiAnSUQnIH0sXG4gICAgeyBpZDogMjMsIG5hbWU6ICdJbGxpbm9pcycsIGFiYnI6ICdJTCcgfSxcbiAgICB7IGlkOiAyNCwgbmFtZTogJ0luZGlhbmEnLCBhYmJyOiAnSU4nIH0sXG4gICAgeyBpZDogMjUsIG5hbWU6ICdJb3dhJywgYWJicjogJ0lBJyB9LFxuICAgIHsgaWQ6IDI2LCBuYW1lOiAnS2Fuc2FzJywgYWJicjogJ0tTJyB9LFxuICAgIHsgaWQ6IDI3LCBuYW1lOiAnS2VudHVja3knLCBhYmJyOiAnS1knIH0sXG4gICAgeyBpZDogMjgsIG5hbWU6ICdMb3Vpc2lhbmEnLCBhYmJyOiAnTEEnIH0sXG4gICAgeyBpZDogMjksIG5hbWU6ICdNYWluZScsIGFiYnI6ICdNRScgfSxcbiAgICB7IGlkOiAzMSwgbmFtZTogJ01hcnlsYW5kJywgYWJicjogJ01EJyB9LFxuICAgIHsgaWQ6IDMyLCBuYW1lOiAnTWFzc2FjaHVzZXR0cycsIGFiYnI6ICdNQScgfSxcbiAgICB7IGlkOiAzMywgbmFtZTogJ01pY2hpZ2FuJywgYWJicjogJ01JJyB9LFxuICAgIHsgaWQ6IDM0LCBuYW1lOiAnTWlubmVzb3RhJywgYWJicjogJ01OJyB9LFxuICAgIHsgaWQ6IDM1LCBuYW1lOiAnTWlzc2lzc2lwcGknLCBhYmJyOiAnTVMnIH0sXG4gICAgeyBpZDogMzYsIG5hbWU6ICdNaXNzb3VyaScsIGFiYnI6ICdNTycgfSxcbiAgICB7IGlkOiAzNywgbmFtZTogJ01vbnRhbmEnLCBhYmJyOiAnTVQnIH0sXG4gICAgeyBpZDogMzgsIG5hbWU6ICdOZWJyYXNrYScsIGFiYnI6ICdORScgfSxcbiAgICB7IGlkOiAzOSwgbmFtZTogJ05ldmFkYScsIGFiYnI6ICdOVicgfSxcbiAgICB7IGlkOiA0MCwgbmFtZTogJ05ldyBIYW1wc2hpcmUnLCBhYmJyOiAnTkgnIH0sXG4gICAgeyBpZDogNDEsIG5hbWU6ICdOZXcgSmVyc2V5JywgYWJicjogJ05KJyB9LFxuICAgIHsgaWQ6IDQyLCBuYW1lOiAnTmV3IE1leGljbycsIGFiYnI6ICdOTScgfSxcbiAgICB7IGlkOiA0MywgbmFtZTogJ05ldyBZb3JrJywgYWJicjogJ05ZJyB9LFxuICAgIHsgaWQ6IDQ0LCBuYW1lOiAnTm9ydGggQ2Fyb2xpbmEnLCBhYmJyOiAnTkMnIH0sXG4gICAgeyBpZDogNDUsIG5hbWU6ICdOb3J0aCBEYWtvdGEnLCBhYmJyOiAnTkQnIH0sXG4gICAgeyBpZDogNDcsIG5hbWU6ICdPaGlvJywgYWJicjogJ09IJyB9LFxuICAgIHsgaWQ6IDQ4LCBuYW1lOiAnT2tsYWhvbWEnLCBhYmJyOiAnT0snIH0sXG4gICAgeyBpZDogNDksIG5hbWU6ICdPcmVnb24nLCBhYmJyOiAnT1InIH0sXG4gICAgeyBpZDogNTEsIG5hbWU6ICdQZW5uc3lsdmFuaWEnLCBhYmJyOiAnUEEnIH0sXG4gICAgeyBpZDogNTMsIG5hbWU6ICdSaG9kZSBJc2xhbmQnLCBhYmJyOiAnUkknIH0sXG4gICAgeyBpZDogNTQsIG5hbWU6ICdTb3V0aCBDYXJvbGluYScsIGFiYnI6ICdTQycgfSxcbiAgICB7IGlkOiA1NSwgbmFtZTogJ1NvdXRoIERha290YScsIGFiYnI6ICdTRCcgfSxcbiAgICB7IGlkOiA1NiwgbmFtZTogJ1Rlbm5lc3NlZScsIGFiYnI6ICdUTicgfSxcbiAgICB7IGlkOiA1NywgbmFtZTogJ1RleGFzJywgYWJicjogJ1RYJyB9LFxuICAgIHsgaWQ6IDU4LCBuYW1lOiAnVXRhaCcsIGFiYnI6ICdVVCcgfSxcbiAgICB7IGlkOiA1OSwgbmFtZTogJ1Zlcm1vbnQnLCBhYmJyOiAnVlQnIH0sXG4gICAgeyBpZDogNjEsIG5hbWU6ICdWaXJnaW5pYScsIGFiYnI6ICdWQScgfSxcbiAgICB7IGlkOiA2MiwgbmFtZTogJ1dhc2hpbmd0b24nLCBhYmJyOiAnV0EnIH0sXG4gICAgeyBpZDogNjMsIG5hbWU6ICdXZXN0IFZpcmdpbmlhJywgYWJicjogJ1dWJyB9LFxuICAgIHsgaWQ6IDY0LCBuYW1lOiAnV2lzY29uc2luJywgYWJicjogJ1dJJyB9LFxuICAgIHsgaWQ6IDY1LCBuYW1lOiAnV3lvbWluZycsIGFiYnI6ICdXWScgfSxcbl07XG5cbi8qKlxuICogUERQU2hpcHBpbmdDYWxjdWxhdG9yIC0gRXN0aW1hdGUgc2hpcHBpbmcgY29zdHMgb24gdGhlIFBEUCBieSBzdGF0ZSBhbmQgWklQLlxuICogU2lsZW50bHkgYWRkcy9yZW1vdmVzIGEgY2FydCBpdGVtIHRvIGZldGNoIEJpZ0NvbW1lcmNlIHNoaXBwaW5nIHF1b3Rlcy5cbiAqIFBlcnNpc3RzIGNob3NlbiBsb2NhdGlvbiB0byBsb2NhbFN0b3JhZ2UgZm9yIHJldXNlIGFjcm9zcyBwcm9kdWN0IHBhZ2VzLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQRFBTaGlwcGluZ0NhbGN1bGF0b3Ige1xuICAgIGNvbnN0cnVjdG9yKCRjb250YWluZXIsIGNvbnRleHQpIHtcbiAgICAgICAgdGhpcy4kY29udGFpbmVyID0gJGNvbnRhaW5lcjtcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgdGhpcy5wcm9kdWN0SWQgPSAkKCdmb3JtW2RhdGEtY2FydC1pdGVtLWFkZF0gaW5wdXRbbmFtZT1cInByb2R1Y3RfaWRcIl0nKS52YWwoKTtcbiAgICAgICAgdGhpcy5taW5RdHkgPSBwYXJzZUludCgkKCdmb3JtW2RhdGEtY2FydC1pdGVtLWFkZF0gaW5wdXRbbmFtZT1cInF0eVtdXCJdJykudmFsKCksIDEwKSB8fCAxO1xuXG4gICAgICAgIHRoaXMuaXNFZGl0aW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRTdGF0ZSA9ICcnO1xuICAgICAgICB0aGlzLnppcENvZGUgPSAnJztcbiAgICAgICAgdGhpcy5xdW90ZXMgPSBudWxsO1xuICAgICAgICB0aGlzLnJlY2FsY1RpbWVyID0gbnVsbDtcblxuICAgICAgICB0aGlzLiR0aXRsZSA9ICRjb250YWluZXIuZmluZCgnW2RhdGEtY2FsYy10aXRsZV0nKTtcbiAgICAgICAgdGhpcy4kZWRpdEJ0biA9ICRjb250YWluZXIuZmluZCgnW2RhdGEtY2FsYy1lZGl0XScpO1xuICAgICAgICB0aGlzLiRmb3JtID0gJGNvbnRhaW5lci5maW5kKCdbZGF0YS1jYWxjLWZvcm1dJyk7XG4gICAgICAgIHRoaXMuJHN0YXRlU2VsZWN0ID0gJGNvbnRhaW5lci5maW5kKCdbZGF0YS1jYWxjLXN0YXRlXScpO1xuICAgICAgICB0aGlzLiR6aXBJbnB1dCA9ICRjb250YWluZXIuZmluZCgnW2RhdGEtY2FsYy16aXBdJyk7XG4gICAgICAgIHRoaXMuJHN1Ym1pdEJ0biA9ICRjb250YWluZXIuZmluZCgnW2RhdGEtY2FsYy1zdWJtaXRdJyk7XG4gICAgICAgIHRoaXMuJGVycm9yID0gJGNvbnRhaW5lci5maW5kKCdbZGF0YS1jYWxjLWVycm9yXScpO1xuICAgICAgICB0aGlzLiRsb2FkaW5nID0gJGNvbnRhaW5lci5maW5kKCdbZGF0YS1jYWxjLWxvYWRpbmddJyk7XG4gICAgICAgIHRoaXMuJHJlc3VsdHMgPSAkY29udGFpbmVyLmZpbmQoJ1tkYXRhLWNhbGMtcmVzdWx0c10nKTtcbiAgICAgICAgdGhpcy4kZW1wdHkgPSAkY29udGFpbmVyLmZpbmQoJ1tkYXRhLWNhbGMtZW1wdHldJyk7XG5cbiAgICAgICAgdGhpcy5wb3B1bGF0ZVN0YXRlT3B0aW9ucygpO1xuICAgICAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgICAgICAgdGhpcy5sb2FkU2F2ZWRMb2NhdGlvbigpO1xuICAgIH1cblxuICAgIHBvcHVsYXRlU3RhdGVPcHRpb25zKCkge1xuICAgICAgICBjb25zdCBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgICAgVVNfU1RBVEVTLmZvckVhY2goc3RhdGUgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb3B0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgICAgICBvcHQudmFsdWUgPSBzdGF0ZS5pZDtcbiAgICAgICAgICAgIG9wdC50ZXh0Q29udGVudCA9IHN0YXRlLm5hbWU7XG4gICAgICAgICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChvcHQpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy4kc3RhdGVTZWxlY3QuYXBwZW5kKGZyYWdtZW50KTtcbiAgICB9XG5cbiAgICBiaW5kRXZlbnRzKCkge1xuICAgICAgICB0aGlzLiRzdWJtaXRCdG4ub24oJ2NsaWNrJywgZSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgaWYgKHRoaXMuY2FuU3VibWl0KCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVNoaXBwaW5nKHRoaXMuc2VsZWN0ZWRTdGF0ZSwgdGhpcy56aXBDb2RlLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4kZWRpdEJ0bi5vbignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNob3dGb3JtKCk7XG4gICAgICAgICAgICB0aGlzLmNsZWFyRXJyb3IoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4kc3RhdGVTZWxlY3Qub24oJ2NoYW5nZScsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRTdGF0ZSA9IHRoaXMuJHN0YXRlU2VsZWN0LnZhbCgpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVTdWJtaXRTdGF0ZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiR6aXBJbnB1dC5vbignaW5wdXQnLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnppcENvZGUgPSB0aGlzLiR6aXBJbnB1dC52YWwoKS5yZXBsYWNlKC9cXEQvZywgJycpLnNsaWNlKDAsIDUpO1xuICAgICAgICAgICAgdGhpcy4kemlwSW5wdXQudmFsKHRoaXMuemlwQ29kZSk7XG4gICAgICAgICAgICB0aGlzLiR6aXBJbnB1dC50b2dnbGVDbGFzcygnaGFzLWVycm9yJywgdGhpcy56aXBDb2RlLmxlbmd0aCA+IDAgJiYgIXRoaXMuaXNWYWxpZFppcCgpKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU3VibWl0U3RhdGUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4kemlwSW5wdXQub24oJ2tleWRvd24nLCBlID0+IHtcbiAgICAgICAgICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJykge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNhblN1Ym1pdCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlU2hpcHBpbmcodGhpcy5zZWxlY3RlZFN0YXRlLCB0aGlzLnppcENvZGUsIHRydWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCgnYm9keScpLm9uKCdzaGlwcGluZ0NhbGM6b3B0aW9uc0NoYW5nZWQnLCAoKSA9PiB0aGlzLm9uT3B0aW9uc0NoYW5nZWQoKSk7XG4gICAgfVxuXG4gICAgbG9hZFNhdmVkTG9jYXRpb24oKSB7XG4gICAgICAgIGNvbnN0IHNhdmVkID0gZ2V0U2F2ZWRTaGlwcGluZ0xvY2F0aW9uKCk7XG4gICAgICAgIGlmIChzYXZlZCAmJiBzYXZlZC5zdGF0ZUlkICYmIHNhdmVkLnppcCkge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFN0YXRlID0gc2F2ZWQuc3RhdGVJZC50b1N0cmluZygpO1xuICAgICAgICAgICAgdGhpcy56aXBDb2RlID0gc2F2ZWQuemlwO1xuICAgICAgICAgICAgdGhpcy4kc3RhdGVTZWxlY3QudmFsKHRoaXMuc2VsZWN0ZWRTdGF0ZSk7XG4gICAgICAgICAgICB0aGlzLiR6aXBJbnB1dC52YWwodGhpcy56aXBDb2RlKTtcbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlU2hpcHBpbmcoc2F2ZWQuc3RhdGVJZCwgc2F2ZWQuemlwLCBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNob3dGb3JtKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbk9wdGlvbnNDaGFuZ2VkKCkge1xuICAgICAgICB0aGlzLmNsZWFyRXJyb3IoKTtcblxuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZFN0YXRlICYmIHRoaXMuemlwQ29kZSAmJiB0aGlzLmlzVmFsaWRaaXAoKSkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMucmVjYWxjVGltZXIpO1xuICAgICAgICAgICAgdGhpcy5yZWNhbGNUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlU2hpcHBpbmcodGhpcy5zZWxlY3RlZFN0YXRlLCB0aGlzLnppcENvZGUsIGZhbHNlKTtcbiAgICAgICAgICAgIH0sIDUwMCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyAtLS0gVmFsaWRhdGlvbiBoZWxwZXJzIC0tLVxuXG4gICAgaXNWYWxpZFppcCgpIHtcbiAgICAgICAgcmV0dXJuIC9eXFxkezV9JC8udGVzdCh0aGlzLnppcENvZGUpO1xuICAgIH1cblxuICAgIGNhblN1Ym1pdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRTdGF0ZSAmJiB0aGlzLmlzVmFsaWRaaXAoKSAmJiAhdGhpcy5pc0xvYWRpbmc7XG4gICAgfVxuXG4gICAgdXBkYXRlU3VibWl0U3RhdGUoKSB7XG4gICAgICAgIHRoaXMuJHN1Ym1pdEJ0bi5wcm9wKCdkaXNhYmxlZCcsICF0aGlzLmNhblN1Ym1pdCgpKTtcbiAgICB9XG5cbiAgICBnZXRTdGF0ZU5hbWUoc3RhdGVJZCkge1xuICAgICAgICBjb25zdCBzdGF0ZSA9IFVTX1NUQVRFUy5maW5kKHMgPT4gcy5pZC50b1N0cmluZygpID09PSBzdGF0ZUlkPy50b1N0cmluZygpKTtcbiAgICAgICAgcmV0dXJuIHN0YXRlID8gc3RhdGUuYWJiciA6ICcnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlYWQgY3VycmVudCBwcm9kdWN0IG9wdGlvbiBzZWxlY3Rpb25zIGZyb20gdGhlIGFkZC10by1jYXJ0IGZvcm0uXG4gICAgICogUmV0dXJucyBhbiBvYmplY3Qgb2YgeyBhdHRyaWJ1dGVJZDogdmFsdWUgfSBwYWlycy5cbiAgICAgKi9cbiAgICBnZXRPcHRpb25TZWxlY3Rpb25zKCkge1xuICAgICAgICBjb25zdCBvcHRpb25zID0ge307XG4gICAgICAgIGNvbnN0ICRmb3JtID0gJCgnZm9ybVtkYXRhLWNhcnQtaXRlbS1hZGRdJyk7XG4gICAgICAgICRmb3JtLmZpbmQoJ1tuYW1lXj1cImF0dHJpYnV0ZVtcIl0nKS5lYWNoKChfLCBlbCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgJGVsID0gJChlbCk7XG4gICAgICAgICAgICBjb25zdCBuYW1lID0gJGVsLmF0dHIoJ25hbWUnKTtcbiAgICAgICAgICAgIGNvbnN0IG1hdGNoID0gbmFtZS5tYXRjaCgvYXR0cmlidXRlXFxbKFxcZCspXFxdLyk7XG4gICAgICAgICAgICBpZiAoIW1hdGNoKSByZXR1cm47XG5cbiAgICAgICAgICAgIGNvbnN0IGF0dHJJZCA9IG1hdGNoWzFdO1xuICAgICAgICAgICAgaWYgKCRlbC5pcygnOnJhZGlvJykgfHwgJGVsLmlzKCc6Y2hlY2tib3gnKSkge1xuICAgICAgICAgICAgICAgIGlmICgkZWwuaXMoJzpjaGVja2VkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uc1thdHRySWRdID0gJGVsLnZhbCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsID0gJGVsLnZhbCgpO1xuICAgICAgICAgICAgICAgIGlmICh2YWwgIT09IHVuZGVmaW5lZCAmJiB2YWwgIT09IG51bGwgJiYgdmFsICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zW2F0dHJJZF0gPSB2YWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnM7XG4gICAgfVxuXG4gICAgLy8gLS0tIENvcmUgQVBJIGZsb3cgLS0tXG5cbiAgICAvKipcbiAgICAgKiBJc29sYXRlIHRoZSB2aWV3ZWQgcHJvZHVjdCBieSBzbmFwc2hvdHRpbmcvY2xlYXJpbmcgdGhlIHNlc3Npb24gY2FydCxcbiAgICAgKiBhZGRpbmcgb25seSB0aGlzIHByb2R1Y3QsIGZldGNoaW5nIHF1b3RlcywgdGhlbiByZXN0b3JpbmcgdGhlIG9yaWdpbmFsXG4gICAgICogY2FydC4gIFRoaXMgZW5zdXJlcyBCaWdDb21tZXJjZSByZXR1cm5zIHNoaXBwaW5nIG1ldGhvZHMgYXBwbGljYWJsZSB0b1xuICAgICAqIHRoZSBzaW5nbGUgcHJvZHVjdCByYXRoZXIgdGhhbiB0aGUgZW50aXJlIGNhcnQuXG4gICAgICovXG4gICAgYXN5bmMgY2FsY3VsYXRlU2hpcHBpbmcoc3RhdGVJZCwgemlwLCBzaG91bGRTYXZlID0gdHJ1ZSkge1xuICAgICAgICBpZiAoIXRoaXMucHJvZHVjdElkKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLnNob3dMb2FkaW5nKCk7XG4gICAgICAgIHRoaXMuY2xlYXJFcnJvcigpO1xuICAgICAgICB0aGlzLnVwZGF0ZVN1Ym1pdFN0YXRlKCk7XG5cbiAgICAgICAgbGV0IHNuYXBzaG90ID0gbnVsbDtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gU25hcHNob3QgYW5kIGNsZWFyIHRoZSBleGlzdGluZyBjYXJ0IHNvIHF1b3RlcyBhcmUgcHJvZHVjdC1zcGVjaWZpY1xuICAgICAgICAgICAgc25hcHNob3QgPSBhd2FpdCBzbmFwc2hvdEFuZENsZWFyQ2FydCgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1tTaGlwcGluZ0NhbGNdIHNuYXBzaG90OicsIHNuYXBzaG90KTtcblxuICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuZ2V0T3B0aW9uU2VsZWN0aW9ucygpO1xuXG4gICAgICAgICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICAgICAgICAgICAgZm9ybURhdGEuYXBwZW5kKCdhY3Rpb24nLCAnYWRkJyk7XG4gICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoJ3Byb2R1Y3RfaWQnLCB0aGlzLnByb2R1Y3RJZCk7XG4gICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoJ3F0eVtdJywgdGhpcy5taW5RdHkpO1xuXG4gICAgICAgICAgICBPYmplY3QuZW50cmllcyhvcHRpb25zKS5mb3JFYWNoKChbb3B0aW9uSWQsIHZhbHVlXSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoYGF0dHJpYnV0ZVske29wdGlvbklkfV1gLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGFkZFJlc3VsdCA9IGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICB1dGlscy5hcGkuY2FydC5pdGVtQWRkKGZvcm1EYXRhLCAoZXJyLCByZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSByZXR1cm4gcmVqZWN0KG5ldyBFcnJvcihlcnIubWVzc2FnZSB8fCAnRmFpbGVkIHRvIGFkZCBpdGVtJykpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UgJiYgcmVzcG9uc2UuZGF0YSAmJiByZXNwb25zZS5kYXRhLmVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KG5ldyBFcnJvcihyZXNwb25zZS5kYXRhLmVycm9yKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3QgY2FydEl0ZW1JZCA9IGFkZFJlc3VsdCAmJiBhZGRSZXN1bHQuZGF0YSAmJiBhZGRSZXN1bHQuZGF0YS5jYXJ0X2l0ZW1cbiAgICAgICAgICAgICAgICA/IGFkZFJlc3VsdC5kYXRhLmNhcnRfaXRlbS5pZFxuICAgICAgICAgICAgICAgIDogbnVsbDtcblxuICAgICAgICAgICAgY29uc3Qgc2hpcHBpbmdQYXJhbXMgPSB7XG4gICAgICAgICAgICAgICAgY291bnRyeV9pZDogMjI2LFxuICAgICAgICAgICAgICAgIHN0YXRlX2lkOiBzdGF0ZUlkLFxuICAgICAgICAgICAgICAgIHppcF9jb2RlOiB6aXAsXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCBxdW90ZXNSZXN1bHQgPSBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgdXRpbHMuYXBpLmNhcnQuZ2V0U2hpcHBpbmdRdW90ZXMoc2hpcHBpbmdQYXJhbXMsICdjYXJ0L3NoaXBwaW5nLXF1b3RlcycsIChlcnIsIHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHJldHVybiByZWplY3QobmV3IEVycm9yKCdGYWlsZWQgdG8gZ2V0IHNoaXBwaW5nIHF1b3RlcycpKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKGNhcnRJdGVtSWQpIHtcbiAgICAgICAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdXRpbHMuYXBpLmNhcnQuaXRlbVJlbW92ZShjYXJ0SXRlbUlkLCAoKSA9PiByZXNvbHZlKCkpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCByYXdIdG1sID0gKHF1b3Rlc1Jlc3VsdCAmJiBxdW90ZXNSZXN1bHQuY29udGVudCkgfHwgcXVvdGVzUmVzdWx0O1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1tTaGlwcGluZ0NhbGNdIHJhdyBxdW90ZXMgSFRNTDonLCByYXdIdG1sKTtcbiAgICAgICAgICAgIGNvbnN0IHF1b3RlcyA9IHRoaXMucGFyc2VTaGlwcGluZ1F1b3RlcyhyYXdIdG1sKTtcbiAgICAgICAgICAgIHRoaXMucXVvdGVzID0gcXVvdGVzO1xuXG4gICAgICAgICAgICBpZiAoc2hvdWxkU2F2ZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXRlT2JqID0gVVNfU1RBVEVTLmZpbmQocyA9PiBzLmlkLnRvU3RyaW5nKCkgPT09IHN0YXRlSWQ/LnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIHNhdmVTaGlwcGluZ0xvY2F0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGU6IHN0YXRlT2JqID8gc3RhdGVPYmoubmFtZSA6ICcnLFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZUlkOiBwYXJzZUludChzdGF0ZUlkLCAxMCksXG4gICAgICAgICAgICAgICAgICAgIHppcCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5oaWRlRm9ybSgpO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJRdW90ZXMocXVvdGVzKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdbU2hpcHBpbmdDYWxjXSBFcnJvcjonLCBlcnIpO1xuICAgICAgICAgICAgdGhpcy5zaG93RXJyb3IoZXJyLm1lc3NhZ2UgfHwgJ1VuYWJsZSB0byBjYWxjdWxhdGUgc2hpcHBpbmcnKTtcbiAgICAgICAgICAgIHRoaXMucXVvdGVzID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuaGlkZVJlc3VsdHMoKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIGlmIChzbmFwc2hvdCAmJiBzbmFwc2hvdC5zYXZlZEl0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBhd2FpdCByZXN0b3JlQ2FydChzbmFwc2hvdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5oaWRlTG9hZGluZygpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVTdWJtaXRTdGF0ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGFyc2UgdGhlIEJpZ0NvbW1lcmNlIHNoaXBwaW5nLXF1b3RlcyBIVE1MIGludG8gYSBzaW1wbGUgYXJyYXkuXG4gICAgICovXG4gICAgcGFyc2VTaGlwcGluZ1F1b3RlcyhodG1sQ29udGVudCkge1xuICAgICAgICBpZiAoIWh0bWxDb250ZW50KSByZXR1cm4gW107XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBET01QYXJzZXIoKTtcbiAgICAgICAgICAgIGNvbnN0IGRvYyA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcoaHRtbENvbnRlbnQsICd0ZXh0L2h0bWwnKTtcbiAgICAgICAgICAgIGNvbnN0IHF1b3RlcyA9IFtdO1xuXG4gICAgICAgICAgICBkb2MucXVlcnlTZWxlY3RvckFsbCgnLmVzdGltYXRvci1mb3JtLXJvdywgbGknKS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxhYmVsRWwgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5lc3RpbWF0b3ItZm9ybS1sYWJlbC10ZXh0LCBsYWJlbCcpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHByaWNlRWwgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5lc3RpbWF0b3ItZm9ybS1pbnB1dC0tcHJpY2UgYiwgLnByaWNlJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5wdXRFbCA9IGl0ZW0ucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cInJhZGlvXCJdJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAobGFiZWxFbCAmJiBwcmljZUVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSAobGFiZWxFbC50ZXh0Q29udGVudCB8fCAnJykudHJpbSgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwcmljZSA9IChwcmljZUVsLnRleHRDb250ZW50IHx8ICcnKS50cmltKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gaW5wdXRFbCA/IGlucHV0RWwudmFsdWUgOiAnJztcblxuICAgICAgICAgICAgICAgICAgICBpZiAobmFtZSAmJiBwcmljZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcXVvdGVzLnB1c2goeyBpZCwgbmFtZSwgcHJpY2UgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKHF1b3Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXh0ID0gKGRvYy5ib2R5ICYmIGRvYy5ib2R5LnRleHRDb250ZW50KSB8fCAnJztcbiAgICAgICAgICAgICAgICBjb25zdCBwcmljZU1hdGNoZXMgPSB0ZXh0Lm1hdGNoKC9cXCRbXFxkLC5dKy9nKTtcbiAgICAgICAgICAgICAgICBpZiAocHJpY2VNYXRjaGVzICYmIHByaWNlTWF0Y2hlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHF1b3Rlcy5wdXNoKHsgaWQ6ICdmYWxsYmFjaycsIG5hbWU6ICdTaGlwcGluZycsIHByaWNlOiBwcmljZU1hdGNoZXNbMF0gfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcXVvdGVzO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tTaGlwcGluZ0NhbGNdIFBhcnNlIGVycm9yOicsIGVycik7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyAtLS0gRE9NIG1hbmlwdWxhdGlvbiAtLS1cblxuICAgIHJlbmRlclF1b3RlcyhxdW90ZXMpIHtcbiAgICAgICAgdGhpcy4kcmVzdWx0cy5lbXB0eSgpO1xuICAgICAgICB0aGlzLiRlbXB0eS5oaWRlKCk7XG5cbiAgICAgICAgaWYgKHF1b3Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuJHJlc3VsdHMuaGlkZSgpO1xuICAgICAgICAgICAgdGhpcy4kZW1wdHkuc2hvdygpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcXVvdGVzLmZvckVhY2gocXVvdGUgPT4ge1xuICAgICAgICAgICAgY29uc3QgJG9wdGlvbiA9ICQoXG4gICAgICAgICAgICAgICAgYDxkaXYgY2xhc3M9XCJwZHAtc2hpcHBpbmctY2FsY19fb3B0aW9uXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicGRwLXNoaXBwaW5nLWNhbGNfX29wdGlvbi1uYW1lXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInBkcC1zaGlwcGluZy1jYWxjX19vcHRpb24tcHJpY2VcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9kaXY+YCxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICAkb3B0aW9uLmZpbmQoJy5wZHAtc2hpcHBpbmctY2FsY19fb3B0aW9uLW5hbWUnKS50ZXh0KHF1b3RlLm5hbWUpO1xuICAgICAgICAgICAgJG9wdGlvbi5maW5kKCcucGRwLXNoaXBwaW5nLWNhbGNfX29wdGlvbi1wcmljZScpLnRleHQocXVvdGUucHJpY2UpO1xuICAgICAgICAgICAgdGhpcy4kcmVzdWx0cy5hcHBlbmQoJG9wdGlvbik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuJHJlc3VsdHMuc2hvdygpO1xuICAgICAgICB0aGlzLnVwZGF0ZVRpdGxlKCk7XG4gICAgfVxuXG4gICAgdXBkYXRlVGl0bGUoKSB7XG4gICAgICAgIGlmICghdGhpcy5pc0VkaXRpbmcgJiYgdGhpcy5xdW90ZXMgJiYgdGhpcy5zZWxlY3RlZFN0YXRlICYmIHRoaXMuemlwQ29kZSkge1xuICAgICAgICAgICAgY29uc3QgYWJiciA9IHRoaXMuZ2V0U3RhdGVOYW1lKHRoaXMuc2VsZWN0ZWRTdGF0ZSk7XG4gICAgICAgICAgICB0aGlzLiR0aXRsZS5odG1sKGBTaGlwcGluZyB0byA8c3Ryb25nPiR7YWJicn0gJHt0aGlzLnppcENvZGV9PC9zdHJvbmc+YCk7XG4gICAgICAgICAgICB0aGlzLiRlZGl0QnRuLnNob3coKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuJHRpdGxlLnRleHQoJ0NhbGN1bGF0ZSBTaGlwcGluZycpO1xuICAgICAgICAgICAgdGhpcy4kZWRpdEJ0bi5oaWRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzaG93Rm9ybSgpIHtcbiAgICAgICAgdGhpcy5pc0VkaXRpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLiRmb3JtLnNob3coKTtcbiAgICAgICAgdGhpcy51cGRhdGVUaXRsZSgpO1xuICAgICAgICB0aGlzLnVwZGF0ZVN1Ym1pdFN0YXRlKCk7XG4gICAgfVxuXG4gICAgaGlkZUZvcm0oKSB7XG4gICAgICAgIHRoaXMuaXNFZGl0aW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuJGZvcm0uaGlkZSgpO1xuICAgICAgICB0aGlzLnVwZGF0ZVRpdGxlKCk7XG4gICAgfVxuXG4gICAgc2hvd0xvYWRpbmcoKSB7XG4gICAgICAgIGlmICghdGhpcy5pc0VkaXRpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuJGxvYWRpbmcuc2hvdygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuJHN1Ym1pdEJ0bi5maW5kKCdbZGF0YS1jYWxjLWJ0bi10ZXh0XScpLnRleHQoJycpO1xuICAgICAgICB0aGlzLiRzdWJtaXRCdG4uZmluZCgnW2RhdGEtY2FsYy1idG4tc3Bpbm5lcl0nKS5zaG93KCk7XG4gICAgfVxuXG4gICAgaGlkZUxvYWRpbmcoKSB7XG4gICAgICAgIHRoaXMuJGxvYWRpbmcuaGlkZSgpO1xuICAgICAgICB0aGlzLiRzdWJtaXRCdG4uZmluZCgnW2RhdGEtY2FsYy1idG4tdGV4dF0nKS50ZXh0KCdHZXQgUmF0ZXMnKTtcbiAgICAgICAgdGhpcy4kc3VibWl0QnRuLmZpbmQoJ1tkYXRhLWNhbGMtYnRuLXNwaW5uZXJdJykuaGlkZSgpO1xuICAgIH1cblxuICAgIHNob3dFcnJvcihtZXNzYWdlKSB7XG4gICAgICAgIHRoaXMuJGVycm9yLnRleHQobWVzc2FnZSkuc2hvdygpO1xuICAgIH1cblxuICAgIGNsZWFyRXJyb3IoKSB7XG4gICAgICAgIHRoaXMuJGVycm9yLnRleHQoJycpLmhpZGUoKTtcbiAgICB9XG5cbiAgICBoaWRlUmVzdWx0cygpIHtcbiAgICAgICAgdGhpcy4kcmVzdWx0cy5oaWRlKCk7XG4gICAgICAgIHRoaXMuJGVtcHR5LmhpZGUoKTtcbiAgICB9XG59XG5cbi8vIC0tLSBsb2NhbFN0b3JhZ2UgaGVscGVycyAtLS1cblxuZnVuY3Rpb24gZ2V0U2F2ZWRTaGlwcGluZ0xvY2F0aW9uKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHNhdmVkID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oU0hJUFBJTkdfTE9DQVRJT05fS0VZKTtcbiAgICAgICAgaWYgKCFzYXZlZCkgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgY29uc3QgcGFyc2VkID0gSlNPTi5wYXJzZShzYXZlZCk7XG4gICAgICAgIGlmICghcGFyc2VkLnN0YXRlSWQgfHwgIXBhcnNlZC56aXApIHJldHVybiBudWxsO1xuXG4gICAgICAgIHJldHVybiBwYXJzZWQ7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gc2F2ZVNoaXBwaW5nTG9jYXRpb24obG9jYXRpb24pIHtcbiAgICB0cnkge1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShTSElQUElOR19MT0NBVElPTl9LRVksIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHN0YXRlOiBsb2NhdGlvbi5zdGF0ZSB8fCAnJyxcbiAgICAgICAgICAgIHN0YXRlSWQ6IGxvY2F0aW9uLnN0YXRlSWQsXG4gICAgICAgICAgICB6aXA6IGxvY2F0aW9uLnppcCxcbiAgICAgICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgICAgICAgfSkpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAvLyBsb2NhbFN0b3JhZ2UgbWF5IGJlIHVuYXZhaWxhYmxlXG4gICAgfVxufVxuIiwiaW1wb3J0IG5vZCBmcm9tICcuLi9jb21tb24vbm9kJztcbmltcG9ydCB7IENvbGxhcHNpYmxlRXZlbnRzIH0gZnJvbSAnLi4vY29tbW9uL2NvbGxhcHNpYmxlJztcbmltcG9ydCBmb3JtcyBmcm9tICcuLi9jb21tb24vbW9kZWxzL2Zvcm1zJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICAgIGNvbnN0cnVjdG9yKCRyZXZpZXdGb3JtKSB7XG4gICAgICAgIHRoaXMudmFsaWRhdG9yID0gbm9kKHtcbiAgICAgICAgICAgIHN1Ym1pdDogJHJldmlld0Zvcm0uZmluZCgnaW5wdXRbdHlwZT1cInN1Ym1pdFwiXScpLFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiRyZXZpZXdzQ29udGVudCA9ICQoJyNwcm9kdWN0LXJldmlld3MnKTtcbiAgICAgICAgdGhpcy4kY29sbGFwc2libGUgPSAkKCdbZGF0YS1jb2xsYXBzaWJsZV0nLCB0aGlzLiRyZXZpZXdzQ29udGVudCk7XG5cbiAgICAgICAgdGhpcy5pbml0TGlua0JpbmQoKTtcbiAgICAgICAgdGhpcy5pbmplY3RQYWdpbmF0aW9uTGluaygpO1xuICAgICAgICB0aGlzLmNvbGxhcHNlUmV2aWV3cygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE9uIGluaXRpYWwgcGFnZSBsb2FkLCB0aGUgdXNlciBjbGlja3Mgb24gXCIoMTIgUmV2aWV3cylcIiBsaW5rXG4gICAgICogVGhlIGJyb3dzZXIganVtcHMgdG8gdGhlIHJldmlldyBwYWdlIGFuZCBzaG91bGQgZXhwYW5kIHRoZSByZXZpZXdzIHNlY3Rpb25cbiAgICAgKi9cbiAgICBpbml0TGlua0JpbmQoKSB7XG4gICAgICAgIGNvbnN0ICRjb250ZW50ID0gJCgnI3Byb2R1Y3RSZXZpZXdzLWNvbnRlbnQnLCB0aGlzLiRyZXZpZXdzQ29udGVudCk7XG5cbiAgICAgICAgJCgnLnByb2R1Y3RWaWV3LXJldmlld0xpbmsnKS5vbignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICAkKCcucHJvZHVjdFZpZXctcmV2aWV3VGFiTGluaycpLnRyaWdnZXIoJ2NsaWNrJyk7XG4gICAgICAgICAgICBpZiAoISRjb250ZW50Lmhhc0NsYXNzKCdpcy1vcGVuJykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLiRjb2xsYXBzaWJsZS50cmlnZ2VyKENvbGxhcHNpYmxlRXZlbnRzLmNsaWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29sbGFwc2VSZXZpZXdzKCkge1xuICAgICAgICAvLyBXZSdyZSBpbiBwYWdpbmF0aW5nIHN0YXRlLCBkbyBub3QgY29sbGFwc2VcbiAgICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5oYXNoICYmIHdpbmRvdy5sb2NhdGlvbi5oYXNoLmluZGV4T2YoJyNwcm9kdWN0LXJldmlld3MnKSA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZm9yY2UgY29sbGFwc2Ugb24gcGFnZSBsb2FkXG4gICAgICAgIHRoaXMuJGNvbGxhcHNpYmxlLnRyaWdnZXIoQ29sbGFwc2libGVFdmVudHMuY2xpY2spO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluamVjdCBJRCBpbnRvIHRoZSBwYWdpbmF0aW9uIGxpbmtcbiAgICAgKi9cbiAgICBpbmplY3RQYWdpbmF0aW9uTGluaygpIHtcbiAgICAgICAgY29uc3QgJG5leHRMaW5rID0gJCgnLnBhZ2luYXRpb24taXRlbS0tbmV4dCAucGFnaW5hdGlvbi1saW5rJywgdGhpcy4kcmV2aWV3c0NvbnRlbnQpO1xuICAgICAgICBjb25zdCAkcHJldkxpbmsgPSAkKCcucGFnaW5hdGlvbi1pdGVtLS1wcmV2aW91cyAucGFnaW5hdGlvbi1saW5rJywgdGhpcy4kcmV2aWV3c0NvbnRlbnQpO1xuXG4gICAgICAgIGlmICgkbmV4dExpbmsubGVuZ3RoKSB7XG4gICAgICAgICAgICAkbmV4dExpbmsuYXR0cignaHJlZicsIGAkeyRuZXh0TGluay5hdHRyKCdocmVmJyl9ICNwcm9kdWN0LXJldmlld3NgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkcHJldkxpbmsubGVuZ3RoKSB7XG4gICAgICAgICAgICAkcHJldkxpbmsuYXR0cignaHJlZicsIGAkeyRwcmV2TGluay5hdHRyKCdocmVmJyl9ICNwcm9kdWN0LXJldmlld3NgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlZ2lzdGVyVmFsaWRhdGlvbihjb250ZXh0KSB7XG4gICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgIHRoaXMudmFsaWRhdG9yLmFkZChbe1xuICAgICAgICAgICAgc2VsZWN0b3I6ICdbbmFtZT1cInJldnJhdGluZ1wiXScsXG4gICAgICAgICAgICB2YWxpZGF0ZTogJ3ByZXNlbmNlJyxcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogdGhpcy5jb250ZXh0LnJldmlld1JhdGluZyxcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgc2VsZWN0b3I6ICdbbmFtZT1cInJldnRpdGxlXCJdJyxcbiAgICAgICAgICAgIHZhbGlkYXRlOiAncHJlc2VuY2UnLFxuICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiB0aGlzLmNvbnRleHQucmV2aWV3U3ViamVjdCxcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgc2VsZWN0b3I6ICdbbmFtZT1cInJldnRleHRcIl0nLFxuICAgICAgICAgICAgdmFsaWRhdGU6ICdwcmVzZW5jZScsXG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6IHRoaXMuY29udGV4dC5yZXZpZXdDb21tZW50LFxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBzZWxlY3RvcjogJ1tuYW1lPVwiZW1haWxcIl0nLFxuICAgICAgICAgICAgdmFsaWRhdGU6IChjYiwgdmFsKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gZm9ybXMuZW1haWwodmFsKTtcbiAgICAgICAgICAgICAgICBjYihyZXN1bHQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogdGhpcy5jb250ZXh0LnJldmlld0VtYWlsLFxuICAgICAgICB9XSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMudmFsaWRhdG9yO1xuICAgIH1cblxuICAgIHZhbGlkYXRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy52YWxpZGF0b3IucGVyZm9ybUNoZWNrKCk7XG4gICAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFZpZGVvR2FsbGVyeSB7XG4gICAgY29uc3RydWN0b3IoJGVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy4kcGxheWVyID0gJGVsZW1lbnQuZmluZCgnW2RhdGEtdmlkZW8tcGxheWVyXScpO1xuICAgICAgICB0aGlzLiR2aWRlb3MgPSAkZWxlbWVudC5maW5kKCdbZGF0YS12aWRlby1pdGVtXScpO1xuICAgICAgICB0aGlzLmN1cnJlbnRWaWRlbyA9IHt9O1xuICAgICAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgICB9XG5cbiAgICBzZWxlY3ROZXdWaWRlbyhlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBjb25zdCAkdGFyZ2V0ID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuXG4gICAgICAgIHRoaXMuY3VycmVudFZpZGVvID0ge1xuICAgICAgICAgICAgaWQ6ICR0YXJnZXQuZGF0YSgndmlkZW9JZCcpLFxuICAgICAgICAgICAgJHNlbGVjdGVkVGh1bWI6ICR0YXJnZXQsXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5zZXRNYWluVmlkZW8oKTtcbiAgICAgICAgdGhpcy5zZXRBY3RpdmVUaHVtYigpO1xuICAgIH1cblxuICAgIHNldE1haW5WaWRlbygpIHtcbiAgICAgICAgdGhpcy4kcGxheWVyLmF0dHIoJ3NyYycsIGAvL3d3dy55b3V0dWJlLmNvbS9lbWJlZC8ke3RoaXMuY3VycmVudFZpZGVvLmlkfWApO1xuICAgIH1cblxuICAgIHNldEFjdGl2ZVRodW1iKCkge1xuICAgICAgICB0aGlzLiR2aWRlb3MucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICB0aGlzLmN1cnJlbnRWaWRlby4kc2VsZWN0ZWRUaHVtYi5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgfVxuXG4gICAgYmluZEV2ZW50cygpIHtcbiAgICAgICAgdGhpcy4kdmlkZW9zLm9uKCdjbGljaycsIHRoaXMuc2VsZWN0TmV3VmlkZW8uYmluZCh0aGlzKSk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB2aWRlb0dhbGxlcnkoKSB7XG4gICAgY29uc3QgcGx1Z2luS2V5ID0gJ3ZpZGVvLWdhbGxlcnknO1xuICAgIGNvbnN0ICR2aWRlb0dhbGxlcnkgPSAkKGBbZGF0YS0ke3BsdWdpbktleX1dYCk7XG5cbiAgICAkdmlkZW9HYWxsZXJ5LmVhY2goKGluZGV4LCBlbGVtZW50KSA9PiB7XG4gICAgICAgIGNvbnN0ICRlbCA9ICQoZWxlbWVudCk7XG4gICAgICAgIGNvbnN0IGlzSW5pdGlhbGl6ZWQgPSAkZWwuZGF0YShwbHVnaW5LZXkpIGluc3RhbmNlb2YgVmlkZW9HYWxsZXJ5O1xuXG4gICAgICAgIGlmIChpc0luaXRpYWxpemVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAkZWwuZGF0YShwbHVnaW5LZXksIG5ldyBWaWRlb0dhbGxlcnkoJGVsKSk7XG4gICAgfSk7XG59XG4iLCIvLyBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1vYmplY3QtdmFsdWVzLWVudHJpZXNcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgJGVudHJpZXMgPSByZXF1aXJlKCcuL19vYmplY3QtdG8tYXJyYXknKSh0cnVlKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdPYmplY3QnLCB7XG4gIGVudHJpZXM6IGZ1bmN0aW9uIGVudHJpZXMoaXQpIHtcbiAgICByZXR1cm4gJGVudHJpZXMoaXQpO1xuICB9XG59KTtcbiJdLCJuYW1lcyI6WyJub2QiLCJmb3JtcyIsImlucHV0VGFnTmFtZXMiLCJjbGFzc2lmeUlucHV0IiwiaW5wdXQiLCJmb3JtRmllbGRDbGFzcyIsIiRpbnB1dCIsIiQiLCIkZm9ybUZpZWxkIiwicGFyZW50IiwidGFnTmFtZSIsInByb3AiLCJ0b0xvd2VyQ2FzZSIsImNsYXNzTmFtZSIsInNwZWNpZmljQ2xhc3NOYW1lIiwiaW5wdXRUeXBlIiwiX2luY2x1ZGVzIiwiX2NhbWVsQ2FzZSIsIl9jYXBpdGFsaXplIiwiYWRkQ2xhc3MiLCJjbGFzc2lmeUZvcm0iLCJmb3JtU2VsZWN0b3IiLCJvcHRpb25zIiwiJGZvcm0iLCIkaW5wdXRzIiwiZmluZCIsImpvaW4iLCJfb3B0aW9ucyIsIl9vcHRpb25zJGZvcm1GaWVsZENsYSIsImVhY2giLCJfXyIsImdldEZpZWxkSWQiLCIkZmllbGQiLCJmaWVsZElkIiwibWF0Y2giLCJsZW5ndGgiLCJpbnNlcnRTdGF0ZUhpZGRlbkZpZWxkIiwiJHN0YXRlRmllbGQiLCJzdGF0ZUZpZWxkQXR0cnMiLCJ0eXBlIiwibmFtZSIsInZhbHVlIiwiYWZ0ZXIiLCJWYWxpZGF0b3JzIiwic2V0RW1haWxWYWxpZGF0aW9uIiwidmFsaWRhdG9yIiwiZmllbGQiLCJhZGQiLCJzZWxlY3RvciIsInZhbGlkYXRlIiwiY2IiLCJ2YWwiLCJyZXN1bHQiLCJlbWFpbCIsImVycm9yTWVzc2FnZSIsInNldFBhc3N3b3JkVmFsaWRhdGlvbiIsInBhc3N3b3JkU2VsZWN0b3IiLCJwYXNzd29yZDJTZWxlY3RvciIsInJlcXVpcmVtZW50cyIsImlzT3B0aW9uYWwiLCIkcGFzc3dvcmQiLCJwYXNzd29yZFZhbGlkYXRpb25zIiwiUmVnRXhwIiwiYWxwaGEiLCJudW1lcmljIiwibWlubGVuZ3RoIiwiZXJyb3IiLCJzZXRNaW5NYXhQcmljZVZhbGlkYXRpb24iLCJzZWxlY3RvcnMiLCJlcnJvclNlbGVjdG9yIiwiZmllbGRzZXRTZWxlY3RvciIsIm1heFByaWNlU2VsZWN0b3IiLCJtaW5QcmljZVNlbGVjdG9yIiwiY29uZmlndXJlIiwiZm9ybSIsInByZXZlbnRTdWJtaXQiLCJzdWNjZXNzQ2xhc3MiLCJzZXRNZXNzYWdlT3B0aW9ucyIsImVycm9yU3BhbiIsInNldFN0YXRlQ291bnRyeVZhbGlkYXRpb24iLCJjbGVhblVwU3RhdGVWYWxpZGF0aW9uIiwiJGZpZWxkQ2xhc3NFbGVtZW50IiwiZGF0YSIsIk9iamVjdCIsImtleXMiLCJjbGFzc2VzIiwiZm9yRWFjaCIsImhhc0NsYXNzIiwicmVtb3ZlQ2xhc3MiLCJQYWdlTWFuYWdlciIsIlJldmlldyIsImNvbGxhcHNpYmxlRmFjdG9yeSIsIlByb2R1Y3REZXRhaWxzIiwidmlkZW9HYWxsZXJ5IiwiUERQU2hpcHBpbmdDYWxjdWxhdG9yIiwiUHJvZHVjdCIsIl9QYWdlTWFuYWdlciIsImNvbnRleHQiLCJfdGhpcyIsImNhbGwiLCJ1cmwiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhyZWYiLCIkcmV2aWV3TGluayIsIiRidWxrUHJpY2luZ0xpbmsiLCJfaW5oZXJpdHNMb29zZSIsIl9wcm90byIsInByb3RvdHlwZSIsIm9uUmVhZHkiLCJfdGhpczIiLCJkb2N1bWVudCIsIm9uIiwiaW5kZXhPZiIsImhpc3RvcnkiLCJyZXBsYWNlU3RhdGUiLCJ0aXRsZSIsInBhdGhuYW1lIiwicHJvZHVjdERldGFpbHMiLCJCQ0RhdGEiLCJwcm9kdWN0X2F0dHJpYnV0ZXMiLCJzZXRQcm9kdWN0VmFyaWFudCIsIiRyZXZpZXdGb3JtIiwicmV2aWV3IiwicmVnaXN0ZXJWYWxpZGF0aW9uIiwicGVyZm9ybUNoZWNrIiwiYXJlQWxsIiwiJHNoaXBwaW5nQ2FsYyIsInNoaXBwaW5nQ2FsY3VsYXRvciIsInByb2R1Y3RSZXZpZXdIYW5kbGVyIiwiYnVsa1ByaWNpbmdIYW5kbGVyIiwidHJpZ2dlciIsImRlZmF1bHQiLCJlIiwidCIsInIiLCJTeW1ib2wiLCJuIiwiaXRlcmF0b3IiLCJvIiwidG9TdHJpbmdUYWciLCJpIiwiYyIsIkdlbmVyYXRvciIsInUiLCJjcmVhdGUiLCJfcmVnZW5lcmF0b3JEZWZpbmUyIiwiZiIsInAiLCJ5IiwiRyIsInYiLCJhIiwiZCIsImJpbmQiLCJsIiwiVHlwZUVycm9yIiwiZG9uZSIsInJldHVybiIsIkdlbmVyYXRvckZ1bmN0aW9uIiwiR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUiLCJnZXRQcm90b3R5cGVPZiIsInNldFByb3RvdHlwZU9mIiwiX19wcm90b19fIiwiZGlzcGxheU5hbWUiLCJfcmVnZW5lcmF0b3IiLCJ3IiwibSIsImRlZmluZVByb3BlcnR5IiwiX3JlZ2VuZXJhdG9yRGVmaW5lIiwiX2ludm9rZSIsImVudW1lcmFibGUiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsImFzeW5jR2VuZXJhdG9yU3RlcCIsIlByb21pc2UiLCJyZXNvbHZlIiwidGhlbiIsIl9hc3luY1RvR2VuZXJhdG9yIiwiYXJndW1lbnRzIiwiYXBwbHkiLCJfbmV4dCIsIl90aHJvdyIsInV0aWxzIiwiU0hJUFBJTkdfTE9DQVRJT05fS0VZIiwiQ0FSVF9BUEkiLCJzbmFwc2hvdEFuZENsZWFyQ2FydCIsIl9zbmFwc2hvdEFuZENsZWFyQ2FydCIsIl9jYWxsZWUyIiwiY2FydHMiLCJjYXJ0IiwicGh5c2ljYWwiLCJkaWdpdGFsIiwiZ2lmdENlcnRzIiwic2F2ZWRJdGVtcyIsInNhdmVkR2lmdENlcnRzIiwiY291cG9uQ29kZXMiLCJvcmlnaW5hbFF1YW50aXR5IiwiX2NvbnRleHQyIiwiZmV0Y2giLCJjcmVkZW50aWFscyIsImpzb24iLCJsaW5lSXRlbXMiLCJwaHlzaWNhbEl0ZW1zIiwiZGlnaXRhbEl0ZW1zIiwiZ2lmdENlcnRpZmljYXRlcyIsImNvbmNhdCIsIm1hcCIsIml0ZW0iLCJwcm9kdWN0SWQiLCJxdWFudGl0eSIsInZhcmlhbnRJZCIsImdjIiwidGhlbWUiLCJhbW91bnQiLCJzZW5kZXIiLCJyZWNpcGllbnQiLCJtZXNzYWdlIiwiY291cG9ucyIsImNvZGUiLCJyZWR1Y2UiLCJzdW0iLCJpZCIsIm1ldGhvZCIsInJlc3RvcmVDYXJ0IiwiX3giLCJfcmVzdG9yZUNhcnQiLCJfY2FsbGVlMyIsInNuYXBzaG90IiwiX25ld0NhcnQkIiwiYm9keSIsInJlcyIsIm5ld0NhcnQiLCJuZXdDYXJ0SWQiLCJfaXRlcmF0b3IiLCJfc3RlcCIsIl90MiIsIl90MyIsIl9jb250ZXh0MyIsImhlYWRlcnMiLCJKU09OIiwic3RyaW5naWZ5IiwiX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXJMb29zZSIsImNvdXBvbkNvZGUiLCJjb25zb2xlIiwid2FybiIsIlVTX1NUQVRFUyIsImFiYnIiLCIkY29udGFpbmVyIiwibWluUXR5IiwicGFyc2VJbnQiLCJpc0VkaXRpbmciLCJpc0xvYWRpbmciLCJzZWxlY3RlZFN0YXRlIiwiemlwQ29kZSIsInF1b3RlcyIsInJlY2FsY1RpbWVyIiwiJHRpdGxlIiwiJGVkaXRCdG4iLCIkc3RhdGVTZWxlY3QiLCIkemlwSW5wdXQiLCIkc3VibWl0QnRuIiwiJGVycm9yIiwiJGxvYWRpbmciLCIkcmVzdWx0cyIsIiRlbXB0eSIsInBvcHVsYXRlU3RhdGVPcHRpb25zIiwiYmluZEV2ZW50cyIsImxvYWRTYXZlZExvY2F0aW9uIiwiZnJhZ21lbnQiLCJjcmVhdGVEb2N1bWVudEZyYWdtZW50Iiwic3RhdGUiLCJvcHQiLCJjcmVhdGVFbGVtZW50IiwidGV4dENvbnRlbnQiLCJhcHBlbmRDaGlsZCIsImFwcGVuZCIsInByZXZlbnREZWZhdWx0Iiwic3RvcFByb3BhZ2F0aW9uIiwiY2FuU3VibWl0IiwiY2FsY3VsYXRlU2hpcHBpbmciLCJzaG93Rm9ybSIsImNsZWFyRXJyb3IiLCJ1cGRhdGVTdWJtaXRTdGF0ZSIsInJlcGxhY2UiLCJzbGljZSIsInRvZ2dsZUNsYXNzIiwiaXNWYWxpZFppcCIsImtleSIsIm9uT3B0aW9uc0NoYW5nZWQiLCJzYXZlZCIsImdldFNhdmVkU2hpcHBpbmdMb2NhdGlvbiIsInN0YXRlSWQiLCJ6aXAiLCJ0b1N0cmluZyIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJ0ZXN0IiwiZ2V0U3RhdGVOYW1lIiwicyIsImdldE9wdGlvblNlbGVjdGlvbnMiLCJfIiwiZWwiLCIkZWwiLCJhdHRyIiwiYXR0cklkIiwiaXMiLCJ1bmRlZmluZWQiLCJfY2FsY3VsYXRlU2hpcHBpbmciLCJfY2FsbGVlIiwic2hvdWxkU2F2ZSIsImZvcm1EYXRhIiwiYWRkUmVzdWx0IiwiY2FydEl0ZW1JZCIsInNoaXBwaW5nUGFyYW1zIiwicXVvdGVzUmVzdWx0IiwicmF3SHRtbCIsInN0YXRlT2JqIiwiX3QiLCJfY29udGV4dCIsInNob3dMb2FkaW5nIiwibG9nIiwiRm9ybURhdGEiLCJlbnRyaWVzIiwiX3JlZiIsIm9wdGlvbklkIiwicmVqZWN0IiwiYXBpIiwiaXRlbUFkZCIsImVyciIsInJlc3BvbnNlIiwiRXJyb3IiLCJjYXJ0X2l0ZW0iLCJjb3VudHJ5X2lkIiwic3RhdGVfaWQiLCJ6aXBfY29kZSIsImdldFNoaXBwaW5nUXVvdGVzIiwiaXRlbVJlbW92ZSIsImNvbnRlbnQiLCJwYXJzZVNoaXBwaW5nUXVvdGVzIiwic2F2ZVNoaXBwaW5nTG9jYXRpb24iLCJoaWRlRm9ybSIsInJlbmRlclF1b3RlcyIsInNob3dFcnJvciIsImhpZGVSZXN1bHRzIiwiaGlkZUxvYWRpbmciLCJfeDIiLCJfeDMiLCJfeDQiLCJodG1sQ29udGVudCIsInBhcnNlciIsIkRPTVBhcnNlciIsImRvYyIsInBhcnNlRnJvbVN0cmluZyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJsYWJlbEVsIiwicXVlcnlTZWxlY3RvciIsInByaWNlRWwiLCJpbnB1dEVsIiwidHJpbSIsInByaWNlIiwicHVzaCIsInRleHQiLCJwcmljZU1hdGNoZXMiLCJfdGhpczMiLCJlbXB0eSIsImhpZGUiLCJzaG93IiwicXVvdGUiLCIkb3B0aW9uIiwidXBkYXRlVGl0bGUiLCJodG1sIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsInBhcnNlZCIsInBhcnNlIiwic2V0SXRlbSIsInRpbWVzdGFtcCIsIkRhdGUiLCJub3ciLCJDb2xsYXBzaWJsZUV2ZW50cyIsIl9kZWZhdWx0Iiwic3VibWl0IiwiJHJldmlld3NDb250ZW50IiwiJGNvbGxhcHNpYmxlIiwiaW5pdExpbmtCaW5kIiwiaW5qZWN0UGFnaW5hdGlvbkxpbmsiLCJjb2xsYXBzZVJldmlld3MiLCIkY29udGVudCIsImNsaWNrIiwiaGFzaCIsIiRuZXh0TGluayIsIiRwcmV2TGluayIsInJldmlld1JhdGluZyIsInJldmlld1N1YmplY3QiLCJyZXZpZXdDb21tZW50IiwicmV2aWV3RW1haWwiLCJWaWRlb0dhbGxlcnkiLCIkZWxlbWVudCIsIiRwbGF5ZXIiLCIkdmlkZW9zIiwiY3VycmVudFZpZGVvIiwic2VsZWN0TmV3VmlkZW8iLCIkdGFyZ2V0IiwiY3VycmVudFRhcmdldCIsIiRzZWxlY3RlZFRodW1iIiwic2V0TWFpblZpZGVvIiwic2V0QWN0aXZlVGh1bWIiLCJwbHVnaW5LZXkiLCIkdmlkZW9HYWxsZXJ5IiwiaW5kZXgiLCJlbGVtZW50IiwiaXNJbml0aWFsaXplZCJdLCJzb3VyY2VSb290IjoiIn0=