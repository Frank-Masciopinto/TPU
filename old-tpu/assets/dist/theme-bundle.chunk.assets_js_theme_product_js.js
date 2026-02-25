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
/* harmony import */ var core_js_modules_es6_symbol_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! core-js/modules/es6.symbol.js */ "./node_modules/core-js/modules/es6.symbol.js");
/* harmony import */ var core_js_modules_es6_symbol_js__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_symbol_js__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var core_js_modules_es6_object_get_prototype_of_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! core-js/modules/es6.object.get-prototype-of.js */ "./node_modules/core-js/modules/es6.object.get-prototype-of.js");
/* harmony import */ var core_js_modules_es6_object_get_prototype_of_js__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_object_get_prototype_of_js__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var core_js_modules_es6_object_set_prototype_of_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! core-js/modules/es6.object.set-prototype-of.js */ "./node_modules/core-js/modules/es6.object.set-prototype-of.js");
/* harmony import */ var core_js_modules_es6_object_set_prototype_of_js__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_object_set_prototype_of_js__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _bigcommerce_stencil_utils__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @bigcommerce/stencil-utils */ "./node_modules/@bigcommerce/stencil-utils/src/main.js");
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.min.js");
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }













var SHIPPING_LOCATION_KEY = 'tpu_shipping_location';
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
   * Three-step flow: add temp cart item -> fetch quotes -> remove temp item.
   * Keeps the real cart unaffected.
   */;
  _proto.calculateShipping =
  /*#__PURE__*/
  function () {
    var _calculateShipping = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(stateId, zip, shouldSave) {
      var options, formData, addResult, cartItemId, shippingParams, quotesResult, quotes, stateObj, _t;
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
            _context.p = 2;
            options = this.getOptionSelections(); // Build form data matching stencil-utils expectations
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

            // Step 1: add product to cart
            _context.n = 3;
            return new Promise(function (resolve, reject) {
              _bigcommerce_stencil_utils__WEBPACK_IMPORTED_MODULE_12__["default"].api.cart.itemAdd(formData, function (err, response) {
                if (err) return reject(new Error(err.message || 'Failed to add item'));
                if (response && response.data && response.data.error) {
                  return reject(new Error(response.data.error));
                }
                resolve(response);
              });
            });
          case 3:
            addResult = _context.v;
            cartItemId = addResult && addResult.data && addResult.data.cart_item ? addResult.data.cart_item.id : null; // Step 2: get shipping quotes
            shippingParams = {
              country_id: 226,
              state_id: stateId,
              zip_code: zip
            };
            _context.n = 4;
            return new Promise(function (resolve, reject) {
              _bigcommerce_stencil_utils__WEBPACK_IMPORTED_MODULE_12__["default"].api.cart.getShippingQuotes(shippingParams, 'cart/shipping-quotes', function (err, response) {
                if (err) return reject(new Error('Failed to get shipping quotes'));
                resolve(response);
              });
            });
          case 4:
            quotesResult = _context.v;
            if (!cartItemId) {
              _context.n = 5;
              break;
            }
            _context.n = 5;
            return new Promise(function (resolve) {
              _bigcommerce_stencil_utils__WEBPACK_IMPORTED_MODULE_12__["default"].api.cart.itemRemove(cartItemId, function () {
                return resolve();
              });
            });
          case 5:
            quotes = this.parseShippingQuotes(quotesResult && quotesResult.content || quotesResult);
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
            _context.n = 7;
            break;
          case 6:
            _context.p = 6;
            _t = _context.v;
            console.error('[ShippingCalc] Error:', _t);
            this.showError(_t.message || 'Unable to calculate shipping');
            this.quotes = null;
            this.hideResults();
          case 7:
            _context.p = 7;
            this.isLoading = false;
            this.hideLoading();
            this.updateSubmitState();
            return _context.f(7);
          case 8:
            return _context.a(2);
        }
      }, _callee, this, [[2, 6, 7, 8]]);
    }));
    function calculateShipping(_x, _x2, _x3) {
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

/***/ "./node_modules/core-js/modules/es6.object.get-prototype-of.js"
/*!*********************************************************************!*\
  !*** ./node_modules/core-js/modules/es6.object.get-prototype-of.js ***!
  \*********************************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

// 19.1.2.9 Object.getPrototypeOf(O)
var toObject = __webpack_require__(/*! ./_to-object */ "./node_modules/core-js/modules/_to-object.js");
var $getPrototypeOf = __webpack_require__(/*! ./_object-gpo */ "./node_modules/core-js/modules/_object-gpo.js");

__webpack_require__(/*! ./_object-sap */ "./node_modules/core-js/modules/_object-sap.js")('getPrototypeOf', function () {
  return function getPrototypeOf(it) {
    return $getPrototypeOf(toObject(it));
  };
});


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWUtYnVuZGxlLmNodW5rLmFzc2V0c19qc190aGVtZV9wcm9kdWN0X2pzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUN3QjtBQUNXO0FBRW5DLElBQU1FLGFBQWEsR0FBRyxDQUNsQixPQUFPLEVBQ1AsUUFBUSxFQUNSLFVBQVUsQ0FDYjs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTQyxhQUFhQSxDQUFDQyxLQUFLLEVBQUVDLGNBQWMsRUFBRTtFQUMxQyxJQUFNQyxNQUFNLEdBQUdDLENBQUMsQ0FBQ0gsS0FBSyxDQUFDO0VBQ3ZCLElBQU1JLFVBQVUsR0FBR0YsTUFBTSxDQUFDRyxNQUFNLE9BQUtKLGNBQWdCLENBQUM7RUFDdEQsSUFBTUssT0FBTyxHQUFHSixNQUFNLENBQUNLLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQ0MsV0FBVyxDQUFDLENBQUM7RUFFcEQsSUFBSUMsU0FBUyxHQUFNUixjQUFjLFVBQUtLLE9BQVM7RUFDL0MsSUFBSUksaUJBQWlCOztFQUVyQjtFQUNBLElBQUlKLE9BQU8sS0FBSyxPQUFPLEVBQUU7SUFDckIsSUFBTUssU0FBUyxHQUFHVCxNQUFNLENBQUNLLElBQUksQ0FBQyxNQUFNLENBQUM7SUFFckMsSUFBSUssc0RBQUEsQ0FBVyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLEVBQUVELFNBQVMsQ0FBQyxFQUFFO01BQ3hEO01BQ0FGLFNBQVMsR0FBTVIsY0FBYyxVQUFLWSx1REFBQSxDQUFZRixTQUFTLENBQUc7SUFDOUQsQ0FBQyxNQUFNO01BQ0g7TUFDQUQsaUJBQWlCLFFBQU1ELFNBQVMsR0FBR0ssd0RBQUEsQ0FBYUgsU0FBUyxDQUFHO0lBQ2hFO0VBQ0o7O0VBRUE7RUFDQSxPQUFPUCxVQUFVLENBQ1pXLFFBQVEsQ0FBQ04sU0FBUyxDQUFDLENBQ25CTSxRQUFRLENBQUNMLGlCQUFpQixDQUFDO0FBQ3BDOztBQUVB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LENBQUM7Ozs7Ozs7Ozs7O0FDUkQ7QUFDQSxjQUFjLG1CQUFPLENBQUMsNERBQVc7QUFDakMsZUFBZSxtQkFBTyxDQUFDLDhFQUFvQjs7QUFFM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbG9uZXN0YXJ0ZW1wbGF0ZXMtcGFydHN3YXJlaG91c2UvLi9hc3NldHMvanMvdGhlbWUvY29tbW9uL2Zvcm0tdXRpbHMuanMiLCJ3ZWJwYWNrOi8vbG9uZXN0YXJ0ZW1wbGF0ZXMtcGFydHN3YXJlaG91c2UvLi9hc3NldHMvanMvdGhlbWUvcHJvZHVjdC5qcyIsIndlYnBhY2s6Ly9sb25lc3RhcnRlbXBsYXRlcy1wYXJ0c3dhcmVob3VzZS8uL2Fzc2V0cy9qcy90aGVtZS9wcm9kdWN0L3BkcC1zaGlwcGluZy1jYWxjdWxhdG9yLmpzIiwid2VicGFjazovL2xvbmVzdGFydGVtcGxhdGVzLXBhcnRzd2FyZWhvdXNlLy4vYXNzZXRzL2pzL3RoZW1lL3Byb2R1Y3QvcmV2aWV3cy5qcyIsIndlYnBhY2s6Ly9sb25lc3RhcnRlbXBsYXRlcy1wYXJ0c3dhcmVob3VzZS8uL2Fzc2V0cy9qcy90aGVtZS9wcm9kdWN0L3ZpZGVvLWdhbGxlcnkuanMiLCJ3ZWJwYWNrOi8vbG9uZXN0YXJ0ZW1wbGF0ZXMtcGFydHN3YXJlaG91c2UvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3QuZ2V0LXByb3RvdHlwZS1vZi5qcyIsIndlYnBhY2s6Ly9sb25lc3RhcnRlbXBsYXRlcy1wYXJ0c3dhcmVob3VzZS8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM3Lm9iamVjdC5lbnRyaWVzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgbm9kIGZyb20gJy4vbm9kJztcbmltcG9ydCBmb3JtcyBmcm9tICcuL21vZGVscy9mb3Jtcyc7XG5cbmNvbnN0IGlucHV0VGFnTmFtZXMgPSBbXG4gICAgJ2lucHV0JyxcbiAgICAnc2VsZWN0JyxcbiAgICAndGV4dGFyZWEnLFxuXTtcblxuLyoqXG4gKiBBcHBseSBjbGFzcyBuYW1lIHRvIGFuIGlucHV0IGVsZW1lbnQgb24gaXRzIHR5cGVcbiAqIEBwYXJhbSB7b2JqZWN0fSBpbnB1dFxuICogQHBhcmFtIHtzdHJpbmd9IGZvcm1GaWVsZENsYXNzXG4gKiBAcmV0dXJuIHtvYmplY3R9IEVsZW1lbnQgaXRzZWxmXG4gKi9cbmZ1bmN0aW9uIGNsYXNzaWZ5SW5wdXQoaW5wdXQsIGZvcm1GaWVsZENsYXNzKSB7XG4gICAgY29uc3QgJGlucHV0ID0gJChpbnB1dCk7XG4gICAgY29uc3QgJGZvcm1GaWVsZCA9ICRpbnB1dC5wYXJlbnQoYC4ke2Zvcm1GaWVsZENsYXNzfWApO1xuICAgIGNvbnN0IHRhZ05hbWUgPSAkaW5wdXQucHJvcCgndGFnTmFtZScpLnRvTG93ZXJDYXNlKCk7XG5cbiAgICBsZXQgY2xhc3NOYW1lID0gYCR7Zm9ybUZpZWxkQ2xhc3N9LS0ke3RhZ05hbWV9YDtcbiAgICBsZXQgc3BlY2lmaWNDbGFzc05hbWU7XG5cbiAgICAvLyBJbnB1dCBjYW4gYmUgdGV4dC9jaGVja2JveC9yYWRpbyBldGMuLi5cbiAgICBpZiAodGFnTmFtZSA9PT0gJ2lucHV0Jykge1xuICAgICAgICBjb25zdCBpbnB1dFR5cGUgPSAkaW5wdXQucHJvcCgndHlwZScpO1xuXG4gICAgICAgIGlmIChfLmluY2x1ZGVzKFsncmFkaW8nLCAnY2hlY2tib3gnLCAnc3VibWl0J10sIGlucHV0VHlwZSkpIHtcbiAgICAgICAgICAgIC8vIGllOiAuZm9ybS1maWVsZC0tY2hlY2tib3gsIC5mb3JtLWZpZWxkLS1yYWRpb1xuICAgICAgICAgICAgY2xhc3NOYW1lID0gYCR7Zm9ybUZpZWxkQ2xhc3N9LS0ke18uY2FtZWxDYXNlKGlucHV0VHlwZSl9YDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGllOiAuZm9ybS1maWVsZC0taW5wdXQgLmZvcm0tZmllbGQtLWlucHV0VGV4dFxuICAgICAgICAgICAgc3BlY2lmaWNDbGFzc05hbWUgPSBgJHtjbGFzc05hbWV9JHtfLmNhcGl0YWxpemUoaW5wdXRUeXBlKX1gO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gQXBwbHkgY2xhc3MgbW9kaWZpZXJcbiAgICByZXR1cm4gJGZvcm1GaWVsZFxuICAgICAgICAuYWRkQ2xhc3MoY2xhc3NOYW1lKVxuICAgICAgICAuYWRkQ2xhc3Moc3BlY2lmaWNDbGFzc05hbWUpO1xufVxuXG4vKipcbiAqIEFwcGx5IGNsYXNzIG5hbWUgdG8gZWFjaCBpbnB1dCBlbGVtZW50IGluIGEgZm9ybSBiYXNlZCBvbiBpdHMgdHlwZVxuICogQGV4YW1wbGVcbiAqIC8vIEJlZm9yZVxuICogPGZvcm0gaWQ9XCJmb3JtXCI+XG4gKiAgICAgPGRpdiBjbGFzcz1cImZvcm0tZmllbGRcIj5cbiAqICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCI+XG4gKiAgICAgPC9kaXY+XG4gKiAgICAgPGRpdiBjbGFzcz1cImZvcm0tZmllbGRcIj5cbiAqICAgICAgICAgPHNlbGVjdD4uLi48L3NlbGVjdD5cbiAqICAgICA8L2Rpdj5cbiAqIDwvZm9ybT5cbiAqXG4gKiBjbGFzc2lmeUZvcm0oJyNmb3JtJywgeyBmb3JtRmllbGRDbGFzczogJ2Zvcm0tZmllbGQnIH0pO1xuICpcbiAqIC8vIEFmdGVyXG4gKiA8ZGl2IGNsYXNzPVwiZm9ybS1maWVsZCBmb3JtLWZpZWxkLS1pbnB1dCBmb3JtLWZpZWxkLS1pbnB1dFRleHRcIj4uLi48L2Rpdj5cbiAqIDxkaXYgY2xhc3M9XCJmb3JtLWZpZWxkIGZvcm0tZmllbGQtLXNlbGVjdFwiPi4uLjwvZGl2PlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfG9iamVjdH0gZm9ybVNlbGVjdG9yIC0gc2VsZWN0b3Igb3IgZWxlbWVudFxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge2pRdWVyeX0gRWxlbWVudCBpdHNlbGZcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsYXNzaWZ5Rm9ybShmb3JtU2VsZWN0b3IsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0ICRmb3JtID0gJChmb3JtU2VsZWN0b3IpO1xuICAgIGNvbnN0ICRpbnB1dHMgPSAkZm9ybS5maW5kKGlucHV0VGFnTmFtZXMuam9pbignLCAnKSk7XG5cbiAgICAvLyBPYnRhaW4gb3B0aW9uc1xuICAgIGNvbnN0IHsgZm9ybUZpZWxkQ2xhc3MgPSAnZm9ybS1maWVsZCcgfSA9IG9wdGlvbnM7XG5cbiAgICAvLyBDbGFzc2lmeSBlYWNoIGlucHV0IGluIGEgZm9ybVxuICAgICRpbnB1dHMuZWFjaCgoX18sIGlucHV0KSA9PiB7XG4gICAgICAgIGNsYXNzaWZ5SW5wdXQoaW5wdXQsIGZvcm1GaWVsZENsYXNzKTtcbiAgICB9KTtcblxuICAgIHJldHVybiAkZm9ybTtcbn1cblxuLyoqXG4gKiBHZXQgaWQgZnJvbSBnaXZlbiBmaWVsZFxuICogQHBhcmFtIHtvYmplY3R9ICRmaWVsZCBKUXVlcnkgZmllbGQgb2JqZWN0XG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGdldEZpZWxkSWQoJGZpZWxkKSB7XG4gICAgY29uc3QgZmllbGRJZCA9ICRmaWVsZC5wcm9wKCduYW1lJykubWF0Y2goLyhcXFsuKlxcXSkvKTtcblxuICAgIGlmIChmaWVsZElkICYmIGZpZWxkSWQubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgIHJldHVybiBmaWVsZElkWzBdO1xuICAgIH1cblxuICAgIHJldHVybiAnJztcbn1cblxuLyoqXG4gKiBJbnNlcnQgaGlkZGVuIGZpZWxkIGFmdGVyIFN0YXRlL1Byb3ZpbmNlIGZpZWxkXG4gKiBAcGFyYW0ge29iamVjdH0gJHN0YXRlRmllbGQgSlF1ZXJ5IGZpZWxkIG9iamVjdFxuICovXG5mdW5jdGlvbiBpbnNlcnRTdGF0ZUhpZGRlbkZpZWxkKCRzdGF0ZUZpZWxkKSB7XG4gICAgY29uc3QgZmllbGRJZCA9IGdldEZpZWxkSWQoJHN0YXRlRmllbGQpO1xuICAgIGNvbnN0IHN0YXRlRmllbGRBdHRycyA9IHtcbiAgICAgICAgdHlwZTogJ2hpZGRlbicsXG4gICAgICAgIG5hbWU6IGBGb3JtRmllbGRJc1RleHQke2ZpZWxkSWR9YCxcbiAgICAgICAgdmFsdWU6ICcxJyxcbiAgICB9O1xuXG4gICAgJHN0YXRlRmllbGQuYWZ0ZXIoJCgnPGlucHV0IC8+Jywgc3RhdGVGaWVsZEF0dHJzKSk7XG59XG5cbmNvbnN0IFZhbGlkYXRvcnMgPSB7XG4gICAgLyoqXG4gICAgICogU2V0cyB1cCBhIG5ldyB2YWxpZGF0aW9uIHdoZW4gdGhlIGZvcm0gaXMgZGlydHlcbiAgICAgKiBAcGFyYW0gdmFsaWRhdG9yXG4gICAgICogQHBhcmFtIGZpZWxkXG4gICAgICovXG4gICAgc2V0RW1haWxWYWxpZGF0aW9uOiAodmFsaWRhdG9yLCBmaWVsZCkgPT4ge1xuICAgICAgICBpZiAoZmllbGQpIHtcbiAgICAgICAgICAgIHZhbGlkYXRvci5hZGQoe1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiBmaWVsZCxcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZTogKGNiLCB2YWwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gZm9ybXMuZW1haWwodmFsKTtcblxuICAgICAgICAgICAgICAgICAgICBjYihyZXN1bHQpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiAnWW91IG11c3QgZW50ZXIgYSB2YWxpZCBlbWFpbC4nLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVmFsaWRhdGUgcGFzc3dvcmQgZmllbGRzXG4gICAgICogQHBhcmFtIHZhbGlkYXRvclxuICAgICAqIEBwYXJhbSBwYXNzd29yZFNlbGVjdG9yXG4gICAgICogQHBhcmFtIHBhc3N3b3JkMlNlbGVjdG9yXG4gICAgICogQHBhcmFtIHJlcXVpcmVtZW50c1xuICAgICAqIEBwYXJhbSBpc09wdGlvbmFsXG4gICAgICovXG4gICAgc2V0UGFzc3dvcmRWYWxpZGF0aW9uOiAodmFsaWRhdG9yLCBwYXNzd29yZFNlbGVjdG9yLCBwYXNzd29yZDJTZWxlY3RvciwgcmVxdWlyZW1lbnRzLCBpc09wdGlvbmFsKSA9PiB7XG4gICAgICAgIGNvbnN0ICRwYXNzd29yZCA9ICQocGFzc3dvcmRTZWxlY3Rvcik7XG4gICAgICAgIGNvbnN0IHBhc3N3b3JkVmFsaWRhdGlvbnMgPSBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6IHBhc3N3b3JkU2VsZWN0b3IsXG4gICAgICAgICAgICAgICAgdmFsaWRhdGU6IChjYiwgdmFsKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHZhbC5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzT3B0aW9uYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYih0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNiKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2U6ICdZb3UgbXVzdCBlbnRlciBhIHBhc3N3b3JkLicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiBwYXNzd29yZFNlbGVjdG9yLFxuICAgICAgICAgICAgICAgIHZhbGlkYXRlOiAoY2IsIHZhbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSB2YWwubWF0Y2gobmV3IFJlZ0V4cChyZXF1aXJlbWVudHMuYWxwaGEpKVxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgdmFsLm1hdGNoKG5ldyBSZWdFeHAocmVxdWlyZW1lbnRzLm51bWVyaWMpKVxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgdmFsLmxlbmd0aCA+PSByZXF1aXJlbWVudHMubWlubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIG9wdGlvbmFsIGFuZCBub3RoaW5nIGVudGVyZWQsIGl0IGlzIHZhbGlkXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc09wdGlvbmFsICYmIHZhbC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYih0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNiKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2U6IHJlcXVpcmVtZW50cy5lcnJvcixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6IHBhc3N3b3JkMlNlbGVjdG9yLFxuICAgICAgICAgICAgICAgIHZhbGlkYXRlOiAoY2IsIHZhbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSB2YWwubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc09wdGlvbmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2IodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjYihyZXN1bHQpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiAnWW91IG11c3QgZW50ZXIgYSBwYXNzd29yZC4nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RvcjogcGFzc3dvcmQyU2VsZWN0b3IsXG4gICAgICAgICAgICAgICAgdmFsaWRhdGU6IChjYiwgdmFsKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHZhbCA9PT0gJHBhc3N3b3JkLnZhbCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNiKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2U6ICdZb3VyIHBhc3N3b3JkcyBkbyBub3QgbWF0Y2guJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIF07XG5cbiAgICAgICAgdmFsaWRhdG9yLmFkZChwYXNzd29yZFZhbGlkYXRpb25zKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVmFsaWRhdGUgcGFzc3dvcmQgZmllbGRzXG4gICAgICogQHBhcmFtIHtOb2R9IHZhbGlkYXRvclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzZWxlY3RvcnNcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3JzLmVycm9yU2VsZWN0b3JcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3JzLmZpZWxkc2V0U2VsZWN0b3JcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3JzLmZvcm1TZWxlY3RvclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvcnMubWF4UHJpY2VTZWxlY3RvclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvcnMubWluUHJpY2VTZWxlY3RvclxuICAgICAqL1xuICAgIHNldE1pbk1heFByaWNlVmFsaWRhdGlvbjogKHZhbGlkYXRvciwgc2VsZWN0b3JzKSA9PiB7XG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICAgIGVycm9yU2VsZWN0b3IsXG4gICAgICAgICAgICBmaWVsZHNldFNlbGVjdG9yLFxuICAgICAgICAgICAgZm9ybVNlbGVjdG9yLFxuICAgICAgICAgICAgbWF4UHJpY2VTZWxlY3RvcixcbiAgICAgICAgICAgIG1pblByaWNlU2VsZWN0b3IsXG4gICAgICAgIH0gPSBzZWxlY3RvcnM7XG5cbiAgICAgICAgdmFsaWRhdG9yLmNvbmZpZ3VyZSh7XG4gICAgICAgICAgICBmb3JtOiBmb3JtU2VsZWN0b3IsXG4gICAgICAgICAgICBwcmV2ZW50U3VibWl0OiB0cnVlLFxuICAgICAgICAgICAgc3VjY2Vzc0NsYXNzOiAnXycsIC8vIEtMVURHRTogRG9uJ3QgYXBwbHkgc3VjY2VzcyBjbGFzc1xuICAgICAgICB9KTtcblxuICAgICAgICB2YWxpZGF0b3IuYWRkKHtcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogJ01pbiBwcmljZSBtdXN0IGJlIGxlc3MgdGhhbiBtYXguIHByaWNlLicsXG4gICAgICAgICAgICBzZWxlY3RvcjogbWluUHJpY2VTZWxlY3RvcixcbiAgICAgICAgICAgIHZhbGlkYXRlOiBgbWluLW1heDoke21pblByaWNlU2VsZWN0b3J9OiR7bWF4UHJpY2VTZWxlY3Rvcn1gLFxuICAgICAgICB9KTtcblxuICAgICAgICB2YWxpZGF0b3IuYWRkKHtcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogJ01pbiBwcmljZSBtdXN0IGJlIGxlc3MgdGhhbiBtYXguIHByaWNlLicsXG4gICAgICAgICAgICBzZWxlY3RvcjogbWF4UHJpY2VTZWxlY3RvcixcbiAgICAgICAgICAgIHZhbGlkYXRlOiBgbWluLW1heDoke21pblByaWNlU2VsZWN0b3J9OiR7bWF4UHJpY2VTZWxlY3Rvcn1gLFxuICAgICAgICB9KTtcblxuICAgICAgICB2YWxpZGF0b3IuYWRkKHtcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogJ01heC4gcHJpY2UgaXMgcmVxdWlyZWQuJyxcbiAgICAgICAgICAgIHNlbGVjdG9yOiBtYXhQcmljZVNlbGVjdG9yLFxuICAgICAgICAgICAgdmFsaWRhdGU6ICdwcmVzZW5jZScsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhbGlkYXRvci5hZGQoe1xuICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiAnTWluLiBwcmljZSBpcyByZXF1aXJlZC4nLFxuICAgICAgICAgICAgc2VsZWN0b3I6IG1pblByaWNlU2VsZWN0b3IsXG4gICAgICAgICAgICB2YWxpZGF0ZTogJ3ByZXNlbmNlJyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFsaWRhdG9yLmFkZCh7XG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6ICdJbnB1dCBtdXN0IGJlIGdyZWF0ZXIgdGhhbiAwLicsXG4gICAgICAgICAgICBzZWxlY3RvcjogW21pblByaWNlU2VsZWN0b3IsIG1heFByaWNlU2VsZWN0b3JdLFxuICAgICAgICAgICAgdmFsaWRhdGU6ICdtaW4tbnVtYmVyOjAnLFxuICAgICAgICB9KTtcblxuICAgICAgICB2YWxpZGF0b3Iuc2V0TWVzc2FnZU9wdGlvbnMoe1xuICAgICAgICAgICAgc2VsZWN0b3I6IFttaW5QcmljZVNlbGVjdG9yLCBtYXhQcmljZVNlbGVjdG9yXSxcbiAgICAgICAgICAgIHBhcmVudDogZmllbGRzZXRTZWxlY3RvcixcbiAgICAgICAgICAgIGVycm9yU3BhbjogZXJyb3JTZWxlY3RvcixcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldHMgdXAgYSBuZXcgdmFsaWRhdGlvbiB3aGVuIHRoZSBmb3JtIGlzIGRpcnR5XG4gICAgICogQHBhcmFtIHZhbGlkYXRvclxuICAgICAqIEBwYXJhbSBmaWVsZFxuICAgICAqL1xuICAgIHNldFN0YXRlQ291bnRyeVZhbGlkYXRpb246ICh2YWxpZGF0b3IsIGZpZWxkKSA9PiB7XG4gICAgICAgIGlmIChmaWVsZCkge1xuICAgICAgICAgICAgdmFsaWRhdG9yLmFkZCh7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6IGZpZWxkLFxuICAgICAgICAgICAgICAgIHZhbGlkYXRlOiAncHJlc2VuY2UnLFxuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZTogJ1RoZSBcXCdTdGF0ZS9Qcm92aW5jZVxcJyBmaWVsZCBjYW5ub3QgYmUgYmxhbmsuJyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgY2xhc3NlcyBmcm9tIGRpcnR5IGZvcm0gaWYgcHJldmlvdXNseSBjaGVja2VkXG4gICAgICogQHBhcmFtIGZpZWxkXG4gICAgICovXG4gICAgY2xlYW5VcFN0YXRlVmFsaWRhdGlvbjogKGZpZWxkKSA9PiB7XG4gICAgICAgIGNvbnN0ICRmaWVsZENsYXNzRWxlbWVudCA9ICQoKGBbZGF0YS10eXBlPVwiJHtmaWVsZC5kYXRhKCdmaWVsZFR5cGUnKX1cIl1gKSk7XG5cbiAgICAgICAgT2JqZWN0LmtleXMobm9kLmNsYXNzZXMpLmZvckVhY2goKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBpZiAoJGZpZWxkQ2xhc3NFbGVtZW50Lmhhc0NsYXNzKG5vZC5jbGFzc2VzW3ZhbHVlXSkpIHtcbiAgICAgICAgICAgICAgICAkZmllbGRDbGFzc0VsZW1lbnQucmVtb3ZlQ2xhc3Mobm9kLmNsYXNzZXNbdmFsdWVdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcbn07XG5cbmV4cG9ydCB7IFZhbGlkYXRvcnMsIGluc2VydFN0YXRlSGlkZGVuRmllbGQgfTtcbiIsIi8qXG4gSW1wb3J0IGFsbCBwcm9kdWN0IHNwZWNpZmljIGpzXG4gKi9cbmltcG9ydCBQYWdlTWFuYWdlciBmcm9tICcuL3BhZ2UtbWFuYWdlcic7XG5pbXBvcnQgUmV2aWV3IGZyb20gJy4vcHJvZHVjdC9yZXZpZXdzJztcbmltcG9ydCBjb2xsYXBzaWJsZUZhY3RvcnkgZnJvbSAnLi9jb21tb24vY29sbGFwc2libGUnO1xuaW1wb3J0IFByb2R1Y3REZXRhaWxzIGZyb20gJy4vY29tbW9uL3Byb2R1Y3QtZGV0YWlscyc7XG5pbXBvcnQgdmlkZW9HYWxsZXJ5IGZyb20gJy4vcHJvZHVjdC92aWRlby1nYWxsZXJ5JztcbmltcG9ydCB7IGNsYXNzaWZ5Rm9ybSB9IGZyb20gJy4vY29tbW9uL2Zvcm0tdXRpbHMnO1xuaW1wb3J0ICdAZmFuY3lhcHBzL2ZhbmN5Ym94JztcbmltcG9ydCBQRFBTaGlwcGluZ0NhbGN1bGF0b3IgZnJvbSAnLi9wcm9kdWN0L3BkcC1zaGlwcGluZy1jYWxjdWxhdG9yJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJvZHVjdCBleHRlbmRzIFBhZ2VNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3Rvcihjb250ZXh0KSB7XG4gICAgICAgIHN1cGVyKGNvbnRleHQpO1xuICAgICAgICB0aGlzLnVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgICAgICB0aGlzLiRyZXZpZXdMaW5rID0gJCgnW2RhdGEtcmV2ZWFsLWlkPVwibW9kYWwtcmV2aWV3LWZvcm1cIl0nKTtcbiAgICAgICAgdGhpcy4kYnVsa1ByaWNpbmdMaW5rID0gJCgnW2RhdGEtcmV2ZWFsLWlkPVwibW9kYWwtYnVsay1wcmljaW5nXCJdJyk7XG4gICAgfVxuXG4gICAgb25SZWFkeSgpIHtcbiAgICAgICAgLy8gTGlzdGVuIGZvciBmb3VuZGF0aW9uIG1vZGFsIGNsb3NlIGV2ZW50cyB0byBzYW5pdGl6ZSBVUkwgYWZ0ZXIgcmV2aWV3LlxuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xvc2UuZm5kdG4ucmV2ZWFsJywgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMudXJsLmluZGV4T2YoJyN3cml0ZV9yZXZpZXcnKSAhPT0gLTEgJiYgdHlwZW9mIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZShudWxsLCBkb2N1bWVudC50aXRsZSwgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IHZhbGlkYXRvcjtcblxuICAgICAgICAvLyBJbml0IGNvbGxhcHNpYmxlXG4gICAgICAgIGNvbGxhcHNpYmxlRmFjdG9yeSgpO1xuXG4gICAgICAgIHRoaXMucHJvZHVjdERldGFpbHMgPSBuZXcgUHJvZHVjdERldGFpbHMoJCgnLnByb2R1Y3RWaWV3JyksIHRoaXMuY29udGV4dCwgd2luZG93LkJDRGF0YS5wcm9kdWN0X2F0dHJpYnV0ZXMpO1xuICAgICAgICB0aGlzLnByb2R1Y3REZXRhaWxzLnNldFByb2R1Y3RWYXJpYW50KCk7XG5cbiAgICAgICAgdmlkZW9HYWxsZXJ5KCk7XG5cbiAgICAgICAgY29uc3QgJHJldmlld0Zvcm0gPSBjbGFzc2lmeUZvcm0oJy53cml0ZVJldmlldy1mb3JtJyk7XG4gICAgICAgIGNvbnN0IHJldmlldyA9IG5ldyBSZXZpZXcoJHJldmlld0Zvcm0pO1xuXG4gICAgICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnW2RhdGEtcmV2ZWFsLWlkPVwibW9kYWwtcmV2aWV3LWZvcm1cIl0nLCAoKSA9PiB7XG4gICAgICAgICAgICB2YWxpZGF0b3IgPSByZXZpZXcucmVnaXN0ZXJWYWxpZGF0aW9uKHRoaXMuY29udGV4dCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRyZXZpZXdGb3JtLm9uKCdzdWJtaXQnLCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAodmFsaWRhdG9yKSB7XG4gICAgICAgICAgICAgICAgdmFsaWRhdG9yLnBlcmZvcm1DaGVjaygpO1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWxpZGF0b3IuYXJlQWxsKCd2YWxpZCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0ICRzaGlwcGluZ0NhbGMgPSAkKCdbZGF0YS1wZHAtc2hpcHBpbmctY2FsY10nKTtcbiAgICAgICAgaWYgKCRzaGlwcGluZ0NhbGMubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnNoaXBwaW5nQ2FsY3VsYXRvciA9IG5ldyBQRFBTaGlwcGluZ0NhbGN1bGF0b3IoJHNoaXBwaW5nQ2FsYywgdGhpcy5jb250ZXh0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucHJvZHVjdFJldmlld0hhbmRsZXIoKTtcbiAgICAgICAgdGhpcy5idWxrUHJpY2luZ0hhbmRsZXIoKTtcbiAgICB9XG5cbiAgICBwcm9kdWN0UmV2aWV3SGFuZGxlcigpIHtcbiAgICAgICAgaWYgKHRoaXMudXJsLmluZGV4T2YoJyN3cml0ZV9yZXZpZXcnKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuJHJldmlld0xpbmsudHJpZ2dlcignY2xpY2snKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGJ1bGtQcmljaW5nSGFuZGxlcigpIHtcbiAgICAgICAgaWYgKHRoaXMudXJsLmluZGV4T2YoJyNidWxrX3ByaWNpbmcnKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuJGJ1bGtQcmljaW5nTGluay50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHV0aWxzIGZyb20gJ0BiaWdjb21tZXJjZS9zdGVuY2lsLXV0aWxzJztcblxuY29uc3QgU0hJUFBJTkdfTE9DQVRJT05fS0VZID0gJ3RwdV9zaGlwcGluZ19sb2NhdGlvbic7XG5cbmNvbnN0IFVTX1NUQVRFUyA9IFtcbiAgICB7IGlkOiAxLCBuYW1lOiAnQWxhYmFtYScsIGFiYnI6ICdBTCcgfSxcbiAgICB7IGlkOiAyLCBuYW1lOiAnQWxhc2thJywgYWJicjogJ0FLJyB9LFxuICAgIHsgaWQ6IDQsIG5hbWU6ICdBcml6b25hJywgYWJicjogJ0FaJyB9LFxuICAgIHsgaWQ6IDUsIG5hbWU6ICdBcmthbnNhcycsIGFiYnI6ICdBUicgfSxcbiAgICB7IGlkOiAxMiwgbmFtZTogJ0NhbGlmb3JuaWEnLCBhYmJyOiAnQ0EnIH0sXG4gICAgeyBpZDogMTMsIG5hbWU6ICdDb2xvcmFkbycsIGFiYnI6ICdDTycgfSxcbiAgICB7IGlkOiAxNCwgbmFtZTogJ0Nvbm5lY3RpY3V0JywgYWJicjogJ0NUJyB9LFxuICAgIHsgaWQ6IDE1LCBuYW1lOiAnRGVsYXdhcmUnLCBhYmJyOiAnREUnIH0sXG4gICAgeyBpZDogMTYsIG5hbWU6ICdEaXN0cmljdCBvZiBDb2x1bWJpYScsIGFiYnI6ICdEQycgfSxcbiAgICB7IGlkOiAxOCwgbmFtZTogJ0Zsb3JpZGEnLCBhYmJyOiAnRkwnIH0sXG4gICAgeyBpZDogMTksIG5hbWU6ICdHZW9yZ2lhJywgYWJicjogJ0dBJyB9LFxuICAgIHsgaWQ6IDIxLCBuYW1lOiAnSGF3YWlpJywgYWJicjogJ0hJJyB9LFxuICAgIHsgaWQ6IDIyLCBuYW1lOiAnSWRhaG8nLCBhYmJyOiAnSUQnIH0sXG4gICAgeyBpZDogMjMsIG5hbWU6ICdJbGxpbm9pcycsIGFiYnI6ICdJTCcgfSxcbiAgICB7IGlkOiAyNCwgbmFtZTogJ0luZGlhbmEnLCBhYmJyOiAnSU4nIH0sXG4gICAgeyBpZDogMjUsIG5hbWU6ICdJb3dhJywgYWJicjogJ0lBJyB9LFxuICAgIHsgaWQ6IDI2LCBuYW1lOiAnS2Fuc2FzJywgYWJicjogJ0tTJyB9LFxuICAgIHsgaWQ6IDI3LCBuYW1lOiAnS2VudHVja3knLCBhYmJyOiAnS1knIH0sXG4gICAgeyBpZDogMjgsIG5hbWU6ICdMb3Vpc2lhbmEnLCBhYmJyOiAnTEEnIH0sXG4gICAgeyBpZDogMjksIG5hbWU6ICdNYWluZScsIGFiYnI6ICdNRScgfSxcbiAgICB7IGlkOiAzMSwgbmFtZTogJ01hcnlsYW5kJywgYWJicjogJ01EJyB9LFxuICAgIHsgaWQ6IDMyLCBuYW1lOiAnTWFzc2FjaHVzZXR0cycsIGFiYnI6ICdNQScgfSxcbiAgICB7IGlkOiAzMywgbmFtZTogJ01pY2hpZ2FuJywgYWJicjogJ01JJyB9LFxuICAgIHsgaWQ6IDM0LCBuYW1lOiAnTWlubmVzb3RhJywgYWJicjogJ01OJyB9LFxuICAgIHsgaWQ6IDM1LCBuYW1lOiAnTWlzc2lzc2lwcGknLCBhYmJyOiAnTVMnIH0sXG4gICAgeyBpZDogMzYsIG5hbWU6ICdNaXNzb3VyaScsIGFiYnI6ICdNTycgfSxcbiAgICB7IGlkOiAzNywgbmFtZTogJ01vbnRhbmEnLCBhYmJyOiAnTVQnIH0sXG4gICAgeyBpZDogMzgsIG5hbWU6ICdOZWJyYXNrYScsIGFiYnI6ICdORScgfSxcbiAgICB7IGlkOiAzOSwgbmFtZTogJ05ldmFkYScsIGFiYnI6ICdOVicgfSxcbiAgICB7IGlkOiA0MCwgbmFtZTogJ05ldyBIYW1wc2hpcmUnLCBhYmJyOiAnTkgnIH0sXG4gICAgeyBpZDogNDEsIG5hbWU6ICdOZXcgSmVyc2V5JywgYWJicjogJ05KJyB9LFxuICAgIHsgaWQ6IDQyLCBuYW1lOiAnTmV3IE1leGljbycsIGFiYnI6ICdOTScgfSxcbiAgICB7IGlkOiA0MywgbmFtZTogJ05ldyBZb3JrJywgYWJicjogJ05ZJyB9LFxuICAgIHsgaWQ6IDQ0LCBuYW1lOiAnTm9ydGggQ2Fyb2xpbmEnLCBhYmJyOiAnTkMnIH0sXG4gICAgeyBpZDogNDUsIG5hbWU6ICdOb3J0aCBEYWtvdGEnLCBhYmJyOiAnTkQnIH0sXG4gICAgeyBpZDogNDcsIG5hbWU6ICdPaGlvJywgYWJicjogJ09IJyB9LFxuICAgIHsgaWQ6IDQ4LCBuYW1lOiAnT2tsYWhvbWEnLCBhYmJyOiAnT0snIH0sXG4gICAgeyBpZDogNDksIG5hbWU6ICdPcmVnb24nLCBhYmJyOiAnT1InIH0sXG4gICAgeyBpZDogNTEsIG5hbWU6ICdQZW5uc3lsdmFuaWEnLCBhYmJyOiAnUEEnIH0sXG4gICAgeyBpZDogNTMsIG5hbWU6ICdSaG9kZSBJc2xhbmQnLCBhYmJyOiAnUkknIH0sXG4gICAgeyBpZDogNTQsIG5hbWU6ICdTb3V0aCBDYXJvbGluYScsIGFiYnI6ICdTQycgfSxcbiAgICB7IGlkOiA1NSwgbmFtZTogJ1NvdXRoIERha290YScsIGFiYnI6ICdTRCcgfSxcbiAgICB7IGlkOiA1NiwgbmFtZTogJ1Rlbm5lc3NlZScsIGFiYnI6ICdUTicgfSxcbiAgICB7IGlkOiA1NywgbmFtZTogJ1RleGFzJywgYWJicjogJ1RYJyB9LFxuICAgIHsgaWQ6IDU4LCBuYW1lOiAnVXRhaCcsIGFiYnI6ICdVVCcgfSxcbiAgICB7IGlkOiA1OSwgbmFtZTogJ1Zlcm1vbnQnLCBhYmJyOiAnVlQnIH0sXG4gICAgeyBpZDogNjEsIG5hbWU6ICdWaXJnaW5pYScsIGFiYnI6ICdWQScgfSxcbiAgICB7IGlkOiA2MiwgbmFtZTogJ1dhc2hpbmd0b24nLCBhYmJyOiAnV0EnIH0sXG4gICAgeyBpZDogNjMsIG5hbWU6ICdXZXN0IFZpcmdpbmlhJywgYWJicjogJ1dWJyB9LFxuICAgIHsgaWQ6IDY0LCBuYW1lOiAnV2lzY29uc2luJywgYWJicjogJ1dJJyB9LFxuICAgIHsgaWQ6IDY1LCBuYW1lOiAnV3lvbWluZycsIGFiYnI6ICdXWScgfSxcbl07XG5cbi8qKlxuICogUERQU2hpcHBpbmdDYWxjdWxhdG9yIC0gRXN0aW1hdGUgc2hpcHBpbmcgY29zdHMgb24gdGhlIFBEUCBieSBzdGF0ZSBhbmQgWklQLlxuICogU2lsZW50bHkgYWRkcy9yZW1vdmVzIGEgY2FydCBpdGVtIHRvIGZldGNoIEJpZ0NvbW1lcmNlIHNoaXBwaW5nIHF1b3Rlcy5cbiAqIFBlcnNpc3RzIGNob3NlbiBsb2NhdGlvbiB0byBsb2NhbFN0b3JhZ2UgZm9yIHJldXNlIGFjcm9zcyBwcm9kdWN0IHBhZ2VzLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQRFBTaGlwcGluZ0NhbGN1bGF0b3Ige1xuICAgIGNvbnN0cnVjdG9yKCRjb250YWluZXIsIGNvbnRleHQpIHtcbiAgICAgICAgdGhpcy4kY29udGFpbmVyID0gJGNvbnRhaW5lcjtcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgdGhpcy5wcm9kdWN0SWQgPSAkKCdmb3JtW2RhdGEtY2FydC1pdGVtLWFkZF0gaW5wdXRbbmFtZT1cInByb2R1Y3RfaWRcIl0nKS52YWwoKTtcbiAgICAgICAgdGhpcy5taW5RdHkgPSBwYXJzZUludCgkKCdmb3JtW2RhdGEtY2FydC1pdGVtLWFkZF0gaW5wdXRbbmFtZT1cInF0eVtdXCJdJykudmFsKCksIDEwKSB8fCAxO1xuXG4gICAgICAgIHRoaXMuaXNFZGl0aW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRTdGF0ZSA9ICcnO1xuICAgICAgICB0aGlzLnppcENvZGUgPSAnJztcbiAgICAgICAgdGhpcy5xdW90ZXMgPSBudWxsO1xuICAgICAgICB0aGlzLnJlY2FsY1RpbWVyID0gbnVsbDtcblxuICAgICAgICB0aGlzLiR0aXRsZSA9ICRjb250YWluZXIuZmluZCgnW2RhdGEtY2FsYy10aXRsZV0nKTtcbiAgICAgICAgdGhpcy4kZWRpdEJ0biA9ICRjb250YWluZXIuZmluZCgnW2RhdGEtY2FsYy1lZGl0XScpO1xuICAgICAgICB0aGlzLiRmb3JtID0gJGNvbnRhaW5lci5maW5kKCdbZGF0YS1jYWxjLWZvcm1dJyk7XG4gICAgICAgIHRoaXMuJHN0YXRlU2VsZWN0ID0gJGNvbnRhaW5lci5maW5kKCdbZGF0YS1jYWxjLXN0YXRlXScpO1xuICAgICAgICB0aGlzLiR6aXBJbnB1dCA9ICRjb250YWluZXIuZmluZCgnW2RhdGEtY2FsYy16aXBdJyk7XG4gICAgICAgIHRoaXMuJHN1Ym1pdEJ0biA9ICRjb250YWluZXIuZmluZCgnW2RhdGEtY2FsYy1zdWJtaXRdJyk7XG4gICAgICAgIHRoaXMuJGVycm9yID0gJGNvbnRhaW5lci5maW5kKCdbZGF0YS1jYWxjLWVycm9yXScpO1xuICAgICAgICB0aGlzLiRsb2FkaW5nID0gJGNvbnRhaW5lci5maW5kKCdbZGF0YS1jYWxjLWxvYWRpbmddJyk7XG4gICAgICAgIHRoaXMuJHJlc3VsdHMgPSAkY29udGFpbmVyLmZpbmQoJ1tkYXRhLWNhbGMtcmVzdWx0c10nKTtcbiAgICAgICAgdGhpcy4kZW1wdHkgPSAkY29udGFpbmVyLmZpbmQoJ1tkYXRhLWNhbGMtZW1wdHldJyk7XG5cbiAgICAgICAgdGhpcy5wb3B1bGF0ZVN0YXRlT3B0aW9ucygpO1xuICAgICAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgICAgICAgdGhpcy5sb2FkU2F2ZWRMb2NhdGlvbigpO1xuICAgIH1cblxuICAgIHBvcHVsYXRlU3RhdGVPcHRpb25zKCkge1xuICAgICAgICBjb25zdCBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgICAgVVNfU1RBVEVTLmZvckVhY2goc3RhdGUgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb3B0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgICAgICBvcHQudmFsdWUgPSBzdGF0ZS5pZDtcbiAgICAgICAgICAgIG9wdC50ZXh0Q29udGVudCA9IHN0YXRlLm5hbWU7XG4gICAgICAgICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChvcHQpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy4kc3RhdGVTZWxlY3QuYXBwZW5kKGZyYWdtZW50KTtcbiAgICB9XG5cbiAgICBiaW5kRXZlbnRzKCkge1xuICAgICAgICB0aGlzLiRzdWJtaXRCdG4ub24oJ2NsaWNrJywgZSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgaWYgKHRoaXMuY2FuU3VibWl0KCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVNoaXBwaW5nKHRoaXMuc2VsZWN0ZWRTdGF0ZSwgdGhpcy56aXBDb2RlLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4kZWRpdEJ0bi5vbignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNob3dGb3JtKCk7XG4gICAgICAgICAgICB0aGlzLmNsZWFyRXJyb3IoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4kc3RhdGVTZWxlY3Qub24oJ2NoYW5nZScsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRTdGF0ZSA9IHRoaXMuJHN0YXRlU2VsZWN0LnZhbCgpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVTdWJtaXRTdGF0ZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiR6aXBJbnB1dC5vbignaW5wdXQnLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnppcENvZGUgPSB0aGlzLiR6aXBJbnB1dC52YWwoKS5yZXBsYWNlKC9cXEQvZywgJycpLnNsaWNlKDAsIDUpO1xuICAgICAgICAgICAgdGhpcy4kemlwSW5wdXQudmFsKHRoaXMuemlwQ29kZSk7XG4gICAgICAgICAgICB0aGlzLiR6aXBJbnB1dC50b2dnbGVDbGFzcygnaGFzLWVycm9yJywgdGhpcy56aXBDb2RlLmxlbmd0aCA+IDAgJiYgIXRoaXMuaXNWYWxpZFppcCgpKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU3VibWl0U3RhdGUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4kemlwSW5wdXQub24oJ2tleWRvd24nLCBlID0+IHtcbiAgICAgICAgICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJykge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNhblN1Ym1pdCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlU2hpcHBpbmcodGhpcy5zZWxlY3RlZFN0YXRlLCB0aGlzLnppcENvZGUsIHRydWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCgnYm9keScpLm9uKCdzaGlwcGluZ0NhbGM6b3B0aW9uc0NoYW5nZWQnLCAoKSA9PiB0aGlzLm9uT3B0aW9uc0NoYW5nZWQoKSk7XG4gICAgfVxuXG4gICAgbG9hZFNhdmVkTG9jYXRpb24oKSB7XG4gICAgICAgIGNvbnN0IHNhdmVkID0gZ2V0U2F2ZWRTaGlwcGluZ0xvY2F0aW9uKCk7XG4gICAgICAgIGlmIChzYXZlZCAmJiBzYXZlZC5zdGF0ZUlkICYmIHNhdmVkLnppcCkge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFN0YXRlID0gc2F2ZWQuc3RhdGVJZC50b1N0cmluZygpO1xuICAgICAgICAgICAgdGhpcy56aXBDb2RlID0gc2F2ZWQuemlwO1xuICAgICAgICAgICAgdGhpcy4kc3RhdGVTZWxlY3QudmFsKHRoaXMuc2VsZWN0ZWRTdGF0ZSk7XG4gICAgICAgICAgICB0aGlzLiR6aXBJbnB1dC52YWwodGhpcy56aXBDb2RlKTtcbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlU2hpcHBpbmcoc2F2ZWQuc3RhdGVJZCwgc2F2ZWQuemlwLCBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNob3dGb3JtKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbk9wdGlvbnNDaGFuZ2VkKCkge1xuICAgICAgICB0aGlzLmNsZWFyRXJyb3IoKTtcblxuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZFN0YXRlICYmIHRoaXMuemlwQ29kZSAmJiB0aGlzLmlzVmFsaWRaaXAoKSkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMucmVjYWxjVGltZXIpO1xuICAgICAgICAgICAgdGhpcy5yZWNhbGNUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlU2hpcHBpbmcodGhpcy5zZWxlY3RlZFN0YXRlLCB0aGlzLnppcENvZGUsIGZhbHNlKTtcbiAgICAgICAgICAgIH0sIDUwMCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyAtLS0gVmFsaWRhdGlvbiBoZWxwZXJzIC0tLVxuXG4gICAgaXNWYWxpZFppcCgpIHtcbiAgICAgICAgcmV0dXJuIC9eXFxkezV9JC8udGVzdCh0aGlzLnppcENvZGUpO1xuICAgIH1cblxuICAgIGNhblN1Ym1pdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRTdGF0ZSAmJiB0aGlzLmlzVmFsaWRaaXAoKSAmJiAhdGhpcy5pc0xvYWRpbmc7XG4gICAgfVxuXG4gICAgdXBkYXRlU3VibWl0U3RhdGUoKSB7XG4gICAgICAgIHRoaXMuJHN1Ym1pdEJ0bi5wcm9wKCdkaXNhYmxlZCcsICF0aGlzLmNhblN1Ym1pdCgpKTtcbiAgICB9XG5cbiAgICBnZXRTdGF0ZU5hbWUoc3RhdGVJZCkge1xuICAgICAgICBjb25zdCBzdGF0ZSA9IFVTX1NUQVRFUy5maW5kKHMgPT4gcy5pZC50b1N0cmluZygpID09PSBzdGF0ZUlkPy50b1N0cmluZygpKTtcbiAgICAgICAgcmV0dXJuIHN0YXRlID8gc3RhdGUuYWJiciA6ICcnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlYWQgY3VycmVudCBwcm9kdWN0IG9wdGlvbiBzZWxlY3Rpb25zIGZyb20gdGhlIGFkZC10by1jYXJ0IGZvcm0uXG4gICAgICogUmV0dXJucyBhbiBvYmplY3Qgb2YgeyBhdHRyaWJ1dGVJZDogdmFsdWUgfSBwYWlycy5cbiAgICAgKi9cbiAgICBnZXRPcHRpb25TZWxlY3Rpb25zKCkge1xuICAgICAgICBjb25zdCBvcHRpb25zID0ge307XG4gICAgICAgIGNvbnN0ICRmb3JtID0gJCgnZm9ybVtkYXRhLWNhcnQtaXRlbS1hZGRdJyk7XG4gICAgICAgICRmb3JtLmZpbmQoJ1tuYW1lXj1cImF0dHJpYnV0ZVtcIl0nKS5lYWNoKChfLCBlbCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgJGVsID0gJChlbCk7XG4gICAgICAgICAgICBjb25zdCBuYW1lID0gJGVsLmF0dHIoJ25hbWUnKTtcbiAgICAgICAgICAgIGNvbnN0IG1hdGNoID0gbmFtZS5tYXRjaCgvYXR0cmlidXRlXFxbKFxcZCspXFxdLyk7XG4gICAgICAgICAgICBpZiAoIW1hdGNoKSByZXR1cm47XG5cbiAgICAgICAgICAgIGNvbnN0IGF0dHJJZCA9IG1hdGNoWzFdO1xuICAgICAgICAgICAgaWYgKCRlbC5pcygnOnJhZGlvJykgfHwgJGVsLmlzKCc6Y2hlY2tib3gnKSkge1xuICAgICAgICAgICAgICAgIGlmICgkZWwuaXMoJzpjaGVja2VkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uc1thdHRySWRdID0gJGVsLnZhbCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsID0gJGVsLnZhbCgpO1xuICAgICAgICAgICAgICAgIGlmICh2YWwgIT09IHVuZGVmaW5lZCAmJiB2YWwgIT09IG51bGwgJiYgdmFsICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zW2F0dHJJZF0gPSB2YWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnM7XG4gICAgfVxuXG4gICAgLy8gLS0tIENvcmUgQVBJIGZsb3cgLS0tXG5cbiAgICAvKipcbiAgICAgKiBUaHJlZS1zdGVwIGZsb3c6IGFkZCB0ZW1wIGNhcnQgaXRlbSAtPiBmZXRjaCBxdW90ZXMgLT4gcmVtb3ZlIHRlbXAgaXRlbS5cbiAgICAgKiBLZWVwcyB0aGUgcmVhbCBjYXJ0IHVuYWZmZWN0ZWQuXG4gICAgICovXG4gICAgYXN5bmMgY2FsY3VsYXRlU2hpcHBpbmcoc3RhdGVJZCwgemlwLCBzaG91bGRTYXZlID0gdHJ1ZSkge1xuICAgICAgICBpZiAoIXRoaXMucHJvZHVjdElkKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLnNob3dMb2FkaW5nKCk7XG4gICAgICAgIHRoaXMuY2xlYXJFcnJvcigpO1xuICAgICAgICB0aGlzLnVwZGF0ZVN1Ym1pdFN0YXRlKCk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLmdldE9wdGlvblNlbGVjdGlvbnMoKTtcblxuICAgICAgICAgICAgLy8gQnVpbGQgZm9ybSBkYXRhIG1hdGNoaW5nIHN0ZW5jaWwtdXRpbHMgZXhwZWN0YXRpb25zXG4gICAgICAgICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICAgICAgICAgICAgZm9ybURhdGEuYXBwZW5kKCdhY3Rpb24nLCAnYWRkJyk7XG4gICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoJ3Byb2R1Y3RfaWQnLCB0aGlzLnByb2R1Y3RJZCk7XG4gICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoJ3F0eVtdJywgdGhpcy5taW5RdHkpO1xuXG4gICAgICAgICAgICBPYmplY3QuZW50cmllcyhvcHRpb25zKS5mb3JFYWNoKChbb3B0aW9uSWQsIHZhbHVlXSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoYGF0dHJpYnV0ZVske29wdGlvbklkfV1gLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFN0ZXAgMTogYWRkIHByb2R1Y3QgdG8gY2FydFxuICAgICAgICAgICAgY29uc3QgYWRkUmVzdWx0ID0gYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIHV0aWxzLmFwaS5jYXJ0Lml0ZW1BZGQoZm9ybURhdGEsIChlcnIsIHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHJldHVybiByZWplY3QobmV3IEVycm9yKGVyci5tZXNzYWdlIHx8ICdGYWlsZWQgdG8gYWRkIGl0ZW0nKSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZSAmJiByZXNwb25zZS5kYXRhICYmIHJlc3BvbnNlLmRhdGEuZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZWplY3QobmV3IEVycm9yKHJlc3BvbnNlLmRhdGEuZXJyb3IpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBjYXJ0SXRlbUlkID0gYWRkUmVzdWx0ICYmIGFkZFJlc3VsdC5kYXRhICYmIGFkZFJlc3VsdC5kYXRhLmNhcnRfaXRlbVxuICAgICAgICAgICAgICAgID8gYWRkUmVzdWx0LmRhdGEuY2FydF9pdGVtLmlkXG4gICAgICAgICAgICAgICAgOiBudWxsO1xuXG4gICAgICAgICAgICAvLyBTdGVwIDI6IGdldCBzaGlwcGluZyBxdW90ZXNcbiAgICAgICAgICAgIGNvbnN0IHNoaXBwaW5nUGFyYW1zID0ge1xuICAgICAgICAgICAgICAgIGNvdW50cnlfaWQ6IDIyNixcbiAgICAgICAgICAgICAgICBzdGF0ZV9pZDogc3RhdGVJZCxcbiAgICAgICAgICAgICAgICB6aXBfY29kZTogemlwLFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3QgcXVvdGVzUmVzdWx0ID0gYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIHV0aWxzLmFwaS5jYXJ0LmdldFNoaXBwaW5nUXVvdGVzKHNoaXBwaW5nUGFyYW1zLCAnY2FydC9zaGlwcGluZy1xdW90ZXMnLCAoZXJyLCByZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSByZXR1cm4gcmVqZWN0KG5ldyBFcnJvcignRmFpbGVkIHRvIGdldCBzaGlwcGluZyBxdW90ZXMnKSk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFN0ZXAgMzogcmVtb3ZlIHRlbXAgY2FydCBpdGVtXG4gICAgICAgICAgICBpZiAoY2FydEl0ZW1JZCkge1xuICAgICAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgICAgICAgICB1dGlscy5hcGkuY2FydC5pdGVtUmVtb3ZlKGNhcnRJdGVtSWQsICgpID0+IHJlc29sdmUoKSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHF1b3RlcyA9IHRoaXMucGFyc2VTaGlwcGluZ1F1b3RlcyhcbiAgICAgICAgICAgICAgICAocXVvdGVzUmVzdWx0ICYmIHF1b3Rlc1Jlc3VsdC5jb250ZW50KSB8fCBxdW90ZXNSZXN1bHQsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy5xdW90ZXMgPSBxdW90ZXM7XG5cbiAgICAgICAgICAgIGlmIChzaG91bGRTYXZlKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhdGVPYmogPSBVU19TVEFURVMuZmluZChzID0+IHMuaWQudG9TdHJpbmcoKSA9PT0gc3RhdGVJZD8udG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgc2F2ZVNoaXBwaW5nTG9jYXRpb24oe1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZTogc3RhdGVPYmogPyBzdGF0ZU9iai5uYW1lIDogJycsXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlSWQ6IHBhcnNlSW50KHN0YXRlSWQsIDEwKSxcbiAgICAgICAgICAgICAgICAgICAgemlwLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmhpZGVGb3JtKCk7XG4gICAgICAgICAgICB0aGlzLnJlbmRlclF1b3RlcyhxdW90ZXMpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tTaGlwcGluZ0NhbGNdIEVycm9yOicsIGVycik7XG4gICAgICAgICAgICB0aGlzLnNob3dFcnJvcihlcnIubWVzc2FnZSB8fCAnVW5hYmxlIHRvIGNhbGN1bGF0ZSBzaGlwcGluZycpO1xuICAgICAgICAgICAgdGhpcy5xdW90ZXMgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5oaWRlUmVzdWx0cygpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuaGlkZUxvYWRpbmcoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU3VibWl0U3RhdGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBhcnNlIHRoZSBCaWdDb21tZXJjZSBzaGlwcGluZy1xdW90ZXMgSFRNTCBpbnRvIGEgc2ltcGxlIGFycmF5LlxuICAgICAqL1xuICAgIHBhcnNlU2hpcHBpbmdRdW90ZXMoaHRtbENvbnRlbnQpIHtcbiAgICAgICAgaWYgKCFodG1sQ29udGVudCkgcmV0dXJuIFtdO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBwYXJzZXIgPSBuZXcgRE9NUGFyc2VyKCk7XG4gICAgICAgICAgICBjb25zdCBkb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKGh0bWxDb250ZW50LCAndGV4dC9odG1sJyk7XG4gICAgICAgICAgICBjb25zdCBxdW90ZXMgPSBbXTtcblxuICAgICAgICAgICAgZG9jLnF1ZXJ5U2VsZWN0b3JBbGwoJy5lc3RpbWF0b3ItZm9ybS1yb3csIGxpJykuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBsYWJlbEVsID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcuZXN0aW1hdG9yLWZvcm0tbGFiZWwtdGV4dCwgbGFiZWwnKTtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmljZUVsID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcuZXN0aW1hdG9yLWZvcm0taW5wdXQtLXByaWNlIGIsIC5wcmljZScpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGlucHV0RWwgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XCJyYWRpb1wiXScpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGxhYmVsRWwgJiYgcHJpY2VFbCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuYW1lID0gKGxhYmVsRWwudGV4dENvbnRlbnQgfHwgJycpLnRyaW0oKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJpY2UgPSAocHJpY2VFbC50ZXh0Q29udGVudCB8fCAnJykudHJpbSgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpZCA9IGlucHV0RWwgPyBpbnB1dEVsLnZhbHVlIDogJyc7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG5hbWUgJiYgcHJpY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1b3Rlcy5wdXNoKHsgaWQsIG5hbWUsIHByaWNlIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChxdW90ZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGV4dCA9IChkb2MuYm9keSAmJiBkb2MuYm9keS50ZXh0Q29udGVudCkgfHwgJyc7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJpY2VNYXRjaGVzID0gdGV4dC5tYXRjaCgvXFwkW1xcZCwuXSsvZyk7XG4gICAgICAgICAgICAgICAgaWYgKHByaWNlTWF0Y2hlcyAmJiBwcmljZU1hdGNoZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBxdW90ZXMucHVzaCh7IGlkOiAnZmFsbGJhY2snLCBuYW1lOiAnU2hpcHBpbmcnLCBwcmljZTogcHJpY2VNYXRjaGVzWzBdIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHF1b3RlcztcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdbU2hpcHBpbmdDYWxjXSBQYXJzZSBlcnJvcjonLCBlcnIpO1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gLS0tIERPTSBtYW5pcHVsYXRpb24gLS0tXG5cbiAgICByZW5kZXJRdW90ZXMocXVvdGVzKSB7XG4gICAgICAgIHRoaXMuJHJlc3VsdHMuZW1wdHkoKTtcbiAgICAgICAgdGhpcy4kZW1wdHkuaGlkZSgpO1xuXG4gICAgICAgIGlmIChxdW90ZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLiRyZXN1bHRzLmhpZGUoKTtcbiAgICAgICAgICAgIHRoaXMuJGVtcHR5LnNob3coKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHF1b3Rlcy5mb3JFYWNoKHF1b3RlID0+IHtcbiAgICAgICAgICAgIGNvbnN0ICRvcHRpb24gPSAkKFxuICAgICAgICAgICAgICAgIGA8ZGl2IGNsYXNzPVwicGRwLXNoaXBwaW5nLWNhbGNfX29wdGlvblwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInBkcC1zaGlwcGluZy1jYWxjX19vcHRpb24tbmFtZVwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwZHAtc2hpcHBpbmctY2FsY19fb3B0aW9uLXByaWNlXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvZGl2PmAsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgJG9wdGlvbi5maW5kKCcucGRwLXNoaXBwaW5nLWNhbGNfX29wdGlvbi1uYW1lJykudGV4dChxdW90ZS5uYW1lKTtcbiAgICAgICAgICAgICRvcHRpb24uZmluZCgnLnBkcC1zaGlwcGluZy1jYWxjX19vcHRpb24tcHJpY2UnKS50ZXh0KHF1b3RlLnByaWNlKTtcbiAgICAgICAgICAgIHRoaXMuJHJlc3VsdHMuYXBwZW5kKCRvcHRpb24pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiRyZXN1bHRzLnNob3coKTtcbiAgICAgICAgdGhpcy51cGRhdGVUaXRsZSgpO1xuICAgIH1cblxuICAgIHVwZGF0ZVRpdGxlKCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNFZGl0aW5nICYmIHRoaXMucXVvdGVzICYmIHRoaXMuc2VsZWN0ZWRTdGF0ZSAmJiB0aGlzLnppcENvZGUpIHtcbiAgICAgICAgICAgIGNvbnN0IGFiYnIgPSB0aGlzLmdldFN0YXRlTmFtZSh0aGlzLnNlbGVjdGVkU3RhdGUpO1xuICAgICAgICAgICAgdGhpcy4kdGl0bGUuaHRtbChgU2hpcHBpbmcgdG8gPHN0cm9uZz4ke2FiYnJ9ICR7dGhpcy56aXBDb2RlfTwvc3Ryb25nPmApO1xuICAgICAgICAgICAgdGhpcy4kZWRpdEJ0bi5zaG93KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLiR0aXRsZS50ZXh0KCdDYWxjdWxhdGUgU2hpcHBpbmcnKTtcbiAgICAgICAgICAgIHRoaXMuJGVkaXRCdG4uaGlkZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2hvd0Zvcm0oKSB7XG4gICAgICAgIHRoaXMuaXNFZGl0aW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy4kZm9ybS5zaG93KCk7XG4gICAgICAgIHRoaXMudXBkYXRlVGl0bGUoKTtcbiAgICAgICAgdGhpcy51cGRhdGVTdWJtaXRTdGF0ZSgpO1xuICAgIH1cblxuICAgIGhpZGVGb3JtKCkge1xuICAgICAgICB0aGlzLmlzRWRpdGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLiRmb3JtLmhpZGUoKTtcbiAgICAgICAgdGhpcy51cGRhdGVUaXRsZSgpO1xuICAgIH1cblxuICAgIHNob3dMb2FkaW5nKCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNFZGl0aW5nKSB7XG4gICAgICAgICAgICB0aGlzLiRsb2FkaW5nLnNob3coKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLiRzdWJtaXRCdG4uZmluZCgnW2RhdGEtY2FsYy1idG4tdGV4dF0nKS50ZXh0KCcnKTtcbiAgICAgICAgdGhpcy4kc3VibWl0QnRuLmZpbmQoJ1tkYXRhLWNhbGMtYnRuLXNwaW5uZXJdJykuc2hvdygpO1xuICAgIH1cblxuICAgIGhpZGVMb2FkaW5nKCkge1xuICAgICAgICB0aGlzLiRsb2FkaW5nLmhpZGUoKTtcbiAgICAgICAgdGhpcy4kc3VibWl0QnRuLmZpbmQoJ1tkYXRhLWNhbGMtYnRuLXRleHRdJykudGV4dCgnR2V0IFJhdGVzJyk7XG4gICAgICAgIHRoaXMuJHN1Ym1pdEJ0bi5maW5kKCdbZGF0YS1jYWxjLWJ0bi1zcGlubmVyXScpLmhpZGUoKTtcbiAgICB9XG5cbiAgICBzaG93RXJyb3IobWVzc2FnZSkge1xuICAgICAgICB0aGlzLiRlcnJvci50ZXh0KG1lc3NhZ2UpLnNob3coKTtcbiAgICB9XG5cbiAgICBjbGVhckVycm9yKCkge1xuICAgICAgICB0aGlzLiRlcnJvci50ZXh0KCcnKS5oaWRlKCk7XG4gICAgfVxuXG4gICAgaGlkZVJlc3VsdHMoKSB7XG4gICAgICAgIHRoaXMuJHJlc3VsdHMuaGlkZSgpO1xuICAgICAgICB0aGlzLiRlbXB0eS5oaWRlKCk7XG4gICAgfVxufVxuXG4vLyAtLS0gbG9jYWxTdG9yYWdlIGhlbHBlcnMgLS0tXG5cbmZ1bmN0aW9uIGdldFNhdmVkU2hpcHBpbmdMb2NhdGlvbigpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBzYXZlZCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFNISVBQSU5HX0xPQ0FUSU9OX0tFWSk7XG4gICAgICAgIGlmICghc2F2ZWQpIHJldHVybiBudWxsO1xuXG4gICAgICAgIGNvbnN0IHBhcnNlZCA9IEpTT04ucGFyc2Uoc2F2ZWQpO1xuICAgICAgICBpZiAoIXBhcnNlZC5zdGF0ZUlkIHx8ICFwYXJzZWQuemlwKSByZXR1cm4gbnVsbDtcblxuICAgICAgICByZXR1cm4gcGFyc2VkO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHNhdmVTaGlwcGluZ0xvY2F0aW9uKGxvY2F0aW9uKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oU0hJUFBJTkdfTE9DQVRJT05fS0VZLCBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICBzdGF0ZTogbG9jYXRpb24uc3RhdGUgfHwgJycsXG4gICAgICAgICAgICBzdGF0ZUlkOiBsb2NhdGlvbi5zdGF0ZUlkLFxuICAgICAgICAgICAgemlwOiBsb2NhdGlvbi56aXAsXG4gICAgICAgICAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gICAgICAgIH0pKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgLy8gbG9jYWxTdG9yYWdlIG1heSBiZSB1bmF2YWlsYWJsZVxuICAgIH1cbn1cbiIsImltcG9ydCBub2QgZnJvbSAnLi4vY29tbW9uL25vZCc7XG5pbXBvcnQgeyBDb2xsYXBzaWJsZUV2ZW50cyB9IGZyb20gJy4uL2NvbW1vbi9jb2xsYXBzaWJsZSc7XG5pbXBvcnQgZm9ybXMgZnJvbSAnLi4vY29tbW9uL21vZGVscy9mb3Jtcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcbiAgICBjb25zdHJ1Y3RvcigkcmV2aWV3Rm9ybSkge1xuICAgICAgICB0aGlzLnZhbGlkYXRvciA9IG5vZCh7XG4gICAgICAgICAgICBzdWJtaXQ6ICRyZXZpZXdGb3JtLmZpbmQoJ2lucHV0W3R5cGU9XCJzdWJtaXRcIl0nKSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4kcmV2aWV3c0NvbnRlbnQgPSAkKCcjcHJvZHVjdC1yZXZpZXdzJyk7XG4gICAgICAgIHRoaXMuJGNvbGxhcHNpYmxlID0gJCgnW2RhdGEtY29sbGFwc2libGVdJywgdGhpcy4kcmV2aWV3c0NvbnRlbnQpO1xuXG4gICAgICAgIHRoaXMuaW5pdExpbmtCaW5kKCk7XG4gICAgICAgIHRoaXMuaW5qZWN0UGFnaW5hdGlvbkxpbmsoKTtcbiAgICAgICAgdGhpcy5jb2xsYXBzZVJldmlld3MoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBPbiBpbml0aWFsIHBhZ2UgbG9hZCwgdGhlIHVzZXIgY2xpY2tzIG9uIFwiKDEyIFJldmlld3MpXCIgbGlua1xuICAgICAqIFRoZSBicm93c2VyIGp1bXBzIHRvIHRoZSByZXZpZXcgcGFnZSBhbmQgc2hvdWxkIGV4cGFuZCB0aGUgcmV2aWV3cyBzZWN0aW9uXG4gICAgICovXG4gICAgaW5pdExpbmtCaW5kKCkge1xuICAgICAgICBjb25zdCAkY29udGVudCA9ICQoJyNwcm9kdWN0UmV2aWV3cy1jb250ZW50JywgdGhpcy4kcmV2aWV3c0NvbnRlbnQpO1xuXG4gICAgICAgICQoJy5wcm9kdWN0Vmlldy1yZXZpZXdMaW5rJykub24oJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgJCgnLnByb2R1Y3RWaWV3LXJldmlld1RhYkxpbmsnKS50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICAgICAgaWYgKCEkY29udGVudC5oYXNDbGFzcygnaXMtb3BlbicpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kY29sbGFwc2libGUudHJpZ2dlcihDb2xsYXBzaWJsZUV2ZW50cy5jbGljayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbGxhcHNlUmV2aWV3cygpIHtcbiAgICAgICAgLy8gV2UncmUgaW4gcGFnaW5hdGluZyBzdGF0ZSwgZG8gbm90IGNvbGxhcHNlXG4gICAgICAgIGlmICh3aW5kb3cubG9jYXRpb24uaGFzaCAmJiB3aW5kb3cubG9jYXRpb24uaGFzaC5pbmRleE9mKCcjcHJvZHVjdC1yZXZpZXdzJykgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGZvcmNlIGNvbGxhcHNlIG9uIHBhZ2UgbG9hZFxuICAgICAgICB0aGlzLiRjb2xsYXBzaWJsZS50cmlnZ2VyKENvbGxhcHNpYmxlRXZlbnRzLmNsaWNrKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbmplY3QgSUQgaW50byB0aGUgcGFnaW5hdGlvbiBsaW5rXG4gICAgICovXG4gICAgaW5qZWN0UGFnaW5hdGlvbkxpbmsoKSB7XG4gICAgICAgIGNvbnN0ICRuZXh0TGluayA9ICQoJy5wYWdpbmF0aW9uLWl0ZW0tLW5leHQgLnBhZ2luYXRpb24tbGluaycsIHRoaXMuJHJldmlld3NDb250ZW50KTtcbiAgICAgICAgY29uc3QgJHByZXZMaW5rID0gJCgnLnBhZ2luYXRpb24taXRlbS0tcHJldmlvdXMgLnBhZ2luYXRpb24tbGluaycsIHRoaXMuJHJldmlld3NDb250ZW50KTtcblxuICAgICAgICBpZiAoJG5leHRMaW5rLmxlbmd0aCkge1xuICAgICAgICAgICAgJG5leHRMaW5rLmF0dHIoJ2hyZWYnLCBgJHskbmV4dExpbmsuYXR0cignaHJlZicpfSAjcHJvZHVjdC1yZXZpZXdzYCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJHByZXZMaW5rLmxlbmd0aCkge1xuICAgICAgICAgICAgJHByZXZMaW5rLmF0dHIoJ2hyZWYnLCBgJHskcHJldkxpbmsuYXR0cignaHJlZicpfSAjcHJvZHVjdC1yZXZpZXdzYCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZWdpc3RlclZhbGlkYXRpb24oY29udGV4dCkge1xuICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICB0aGlzLnZhbGlkYXRvci5hZGQoW3tcbiAgICAgICAgICAgIHNlbGVjdG9yOiAnW25hbWU9XCJyZXZyYXRpbmdcIl0nLFxuICAgICAgICAgICAgdmFsaWRhdGU6ICdwcmVzZW5jZScsXG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6IHRoaXMuY29udGV4dC5yZXZpZXdSYXRpbmcsXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHNlbGVjdG9yOiAnW25hbWU9XCJyZXZ0aXRsZVwiXScsXG4gICAgICAgICAgICB2YWxpZGF0ZTogJ3ByZXNlbmNlJyxcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogdGhpcy5jb250ZXh0LnJldmlld1N1YmplY3QsXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHNlbGVjdG9yOiAnW25hbWU9XCJyZXZ0ZXh0XCJdJyxcbiAgICAgICAgICAgIHZhbGlkYXRlOiAncHJlc2VuY2UnLFxuICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiB0aGlzLmNvbnRleHQucmV2aWV3Q29tbWVudCxcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgc2VsZWN0b3I6ICdbbmFtZT1cImVtYWlsXCJdJyxcbiAgICAgICAgICAgIHZhbGlkYXRlOiAoY2IsIHZhbCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGZvcm1zLmVtYWlsKHZhbCk7XG4gICAgICAgICAgICAgICAgY2IocmVzdWx0KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6IHRoaXMuY29udGV4dC5yZXZpZXdFbWFpbCxcbiAgICAgICAgfV0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnZhbGlkYXRvcjtcbiAgICB9XG5cbiAgICB2YWxpZGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsaWRhdG9yLnBlcmZvcm1DaGVjaygpO1xuICAgIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBWaWRlb0dhbGxlcnkge1xuICAgIGNvbnN0cnVjdG9yKCRlbGVtZW50KSB7XG4gICAgICAgIHRoaXMuJHBsYXllciA9ICRlbGVtZW50LmZpbmQoJ1tkYXRhLXZpZGVvLXBsYXllcl0nKTtcbiAgICAgICAgdGhpcy4kdmlkZW9zID0gJGVsZW1lbnQuZmluZCgnW2RhdGEtdmlkZW8taXRlbV0nKTtcbiAgICAgICAgdGhpcy5jdXJyZW50VmlkZW8gPSB7fTtcbiAgICAgICAgdGhpcy5iaW5kRXZlbnRzKCk7XG4gICAgfVxuXG4gICAgc2VsZWN0TmV3VmlkZW8oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgY29uc3QgJHRhcmdldCA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcblxuICAgICAgICB0aGlzLmN1cnJlbnRWaWRlbyA9IHtcbiAgICAgICAgICAgIGlkOiAkdGFyZ2V0LmRhdGEoJ3ZpZGVvSWQnKSxcbiAgICAgICAgICAgICRzZWxlY3RlZFRodW1iOiAkdGFyZ2V0LFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuc2V0TWFpblZpZGVvKCk7XG4gICAgICAgIHRoaXMuc2V0QWN0aXZlVGh1bWIoKTtcbiAgICB9XG5cbiAgICBzZXRNYWluVmlkZW8oKSB7XG4gICAgICAgIHRoaXMuJHBsYXllci5hdHRyKCdzcmMnLCBgLy93d3cueW91dHViZS5jb20vZW1iZWQvJHt0aGlzLmN1cnJlbnRWaWRlby5pZH1gKTtcbiAgICB9XG5cbiAgICBzZXRBY3RpdmVUaHVtYigpIHtcbiAgICAgICAgdGhpcy4kdmlkZW9zLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgdGhpcy5jdXJyZW50VmlkZW8uJHNlbGVjdGVkVGh1bWIuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgIH1cblxuICAgIGJpbmRFdmVudHMoKSB7XG4gICAgICAgIHRoaXMuJHZpZGVvcy5vbignY2xpY2snLCB0aGlzLnNlbGVjdE5ld1ZpZGVvLmJpbmQodGhpcykpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdmlkZW9HYWxsZXJ5KCkge1xuICAgIGNvbnN0IHBsdWdpbktleSA9ICd2aWRlby1nYWxsZXJ5JztcbiAgICBjb25zdCAkdmlkZW9HYWxsZXJ5ID0gJChgW2RhdGEtJHtwbHVnaW5LZXl9XWApO1xuXG4gICAgJHZpZGVvR2FsbGVyeS5lYWNoKChpbmRleCwgZWxlbWVudCkgPT4ge1xuICAgICAgICBjb25zdCAkZWwgPSAkKGVsZW1lbnQpO1xuICAgICAgICBjb25zdCBpc0luaXRpYWxpemVkID0gJGVsLmRhdGEocGx1Z2luS2V5KSBpbnN0YW5jZW9mIFZpZGVvR2FsbGVyeTtcblxuICAgICAgICBpZiAoaXNJbml0aWFsaXplZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgJGVsLmRhdGEocGx1Z2luS2V5LCBuZXcgVmlkZW9HYWxsZXJ5KCRlbCkpO1xuICAgIH0pO1xufVxuIiwiLy8gMTkuMS4yLjkgT2JqZWN0LmdldFByb3RvdHlwZU9mKE8pXG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciAkZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCcuL19vYmplY3QtZ3BvJyk7XG5cbnJlcXVpcmUoJy4vX29iamVjdC1zYXAnKSgnZ2V0UHJvdG90eXBlT2YnLCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBmdW5jdGlvbiBnZXRQcm90b3R5cGVPZihpdCkge1xuICAgIHJldHVybiAkZ2V0UHJvdG90eXBlT2YodG9PYmplY3QoaXQpKTtcbiAgfTtcbn0pO1xuIiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtb2JqZWN0LXZhbHVlcy1lbnRyaWVzXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyICRlbnRyaWVzID0gcmVxdWlyZSgnLi9fb2JqZWN0LXRvLWFycmF5JykodHJ1ZSk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnT2JqZWN0Jywge1xuICBlbnRyaWVzOiBmdW5jdGlvbiBlbnRyaWVzKGl0KSB7XG4gICAgcmV0dXJuICRlbnRyaWVzKGl0KTtcbiAgfVxufSk7XG4iXSwibmFtZXMiOlsibm9kIiwiZm9ybXMiLCJpbnB1dFRhZ05hbWVzIiwiY2xhc3NpZnlJbnB1dCIsImlucHV0IiwiZm9ybUZpZWxkQ2xhc3MiLCIkaW5wdXQiLCIkIiwiJGZvcm1GaWVsZCIsInBhcmVudCIsInRhZ05hbWUiLCJwcm9wIiwidG9Mb3dlckNhc2UiLCJjbGFzc05hbWUiLCJzcGVjaWZpY0NsYXNzTmFtZSIsImlucHV0VHlwZSIsIl9pbmNsdWRlcyIsIl9jYW1lbENhc2UiLCJfY2FwaXRhbGl6ZSIsImFkZENsYXNzIiwiY2xhc3NpZnlGb3JtIiwiZm9ybVNlbGVjdG9yIiwib3B0aW9ucyIsIiRmb3JtIiwiJGlucHV0cyIsImZpbmQiLCJqb2luIiwiX29wdGlvbnMiLCJfb3B0aW9ucyRmb3JtRmllbGRDbGEiLCJlYWNoIiwiX18iLCJnZXRGaWVsZElkIiwiJGZpZWxkIiwiZmllbGRJZCIsIm1hdGNoIiwibGVuZ3RoIiwiaW5zZXJ0U3RhdGVIaWRkZW5GaWVsZCIsIiRzdGF0ZUZpZWxkIiwic3RhdGVGaWVsZEF0dHJzIiwidHlwZSIsIm5hbWUiLCJ2YWx1ZSIsImFmdGVyIiwiVmFsaWRhdG9ycyIsInNldEVtYWlsVmFsaWRhdGlvbiIsInZhbGlkYXRvciIsImZpZWxkIiwiYWRkIiwic2VsZWN0b3IiLCJ2YWxpZGF0ZSIsImNiIiwidmFsIiwicmVzdWx0IiwiZW1haWwiLCJlcnJvck1lc3NhZ2UiLCJzZXRQYXNzd29yZFZhbGlkYXRpb24iLCJwYXNzd29yZFNlbGVjdG9yIiwicGFzc3dvcmQyU2VsZWN0b3IiLCJyZXF1aXJlbWVudHMiLCJpc09wdGlvbmFsIiwiJHBhc3N3b3JkIiwicGFzc3dvcmRWYWxpZGF0aW9ucyIsIlJlZ0V4cCIsImFscGhhIiwibnVtZXJpYyIsIm1pbmxlbmd0aCIsImVycm9yIiwic2V0TWluTWF4UHJpY2VWYWxpZGF0aW9uIiwic2VsZWN0b3JzIiwiZXJyb3JTZWxlY3RvciIsImZpZWxkc2V0U2VsZWN0b3IiLCJtYXhQcmljZVNlbGVjdG9yIiwibWluUHJpY2VTZWxlY3RvciIsImNvbmZpZ3VyZSIsImZvcm0iLCJwcmV2ZW50U3VibWl0Iiwic3VjY2Vzc0NsYXNzIiwic2V0TWVzc2FnZU9wdGlvbnMiLCJlcnJvclNwYW4iLCJzZXRTdGF0ZUNvdW50cnlWYWxpZGF0aW9uIiwiY2xlYW5VcFN0YXRlVmFsaWRhdGlvbiIsIiRmaWVsZENsYXNzRWxlbWVudCIsImRhdGEiLCJPYmplY3QiLCJrZXlzIiwiY2xhc3NlcyIsImZvckVhY2giLCJoYXNDbGFzcyIsInJlbW92ZUNsYXNzIiwiUGFnZU1hbmFnZXIiLCJSZXZpZXciLCJjb2xsYXBzaWJsZUZhY3RvcnkiLCJQcm9kdWN0RGV0YWlscyIsInZpZGVvR2FsbGVyeSIsIlBEUFNoaXBwaW5nQ2FsY3VsYXRvciIsIlByb2R1Y3QiLCJfUGFnZU1hbmFnZXIiLCJjb250ZXh0IiwiX3RoaXMiLCJjYWxsIiwidXJsIiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwiJHJldmlld0xpbmsiLCIkYnVsa1ByaWNpbmdMaW5rIiwiX2luaGVyaXRzTG9vc2UiLCJfcHJvdG8iLCJwcm90b3R5cGUiLCJvblJlYWR5IiwiX3RoaXMyIiwiZG9jdW1lbnQiLCJvbiIsImluZGV4T2YiLCJoaXN0b3J5IiwicmVwbGFjZVN0YXRlIiwidGl0bGUiLCJwYXRobmFtZSIsInByb2R1Y3REZXRhaWxzIiwiQkNEYXRhIiwicHJvZHVjdF9hdHRyaWJ1dGVzIiwic2V0UHJvZHVjdFZhcmlhbnQiLCIkcmV2aWV3Rm9ybSIsInJldmlldyIsInJlZ2lzdGVyVmFsaWRhdGlvbiIsInBlcmZvcm1DaGVjayIsImFyZUFsbCIsIiRzaGlwcGluZ0NhbGMiLCJzaGlwcGluZ0NhbGN1bGF0b3IiLCJwcm9kdWN0UmV2aWV3SGFuZGxlciIsImJ1bGtQcmljaW5nSGFuZGxlciIsInRyaWdnZXIiLCJkZWZhdWx0IiwiZSIsInQiLCJyIiwiU3ltYm9sIiwibiIsIml0ZXJhdG9yIiwibyIsInRvU3RyaW5nVGFnIiwiaSIsImMiLCJHZW5lcmF0b3IiLCJ1IiwiY3JlYXRlIiwiX3JlZ2VuZXJhdG9yRGVmaW5lMiIsImYiLCJwIiwieSIsIkciLCJ2IiwiYSIsImQiLCJiaW5kIiwibCIsIlR5cGVFcnJvciIsImRvbmUiLCJyZXR1cm4iLCJHZW5lcmF0b3JGdW5jdGlvbiIsIkdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlIiwiZ2V0UHJvdG90eXBlT2YiLCJzZXRQcm90b3R5cGVPZiIsIl9fcHJvdG9fXyIsImRpc3BsYXlOYW1lIiwiX3JlZ2VuZXJhdG9yIiwidyIsIm0iLCJkZWZpbmVQcm9wZXJ0eSIsIl9yZWdlbmVyYXRvckRlZmluZSIsIl9pbnZva2UiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJhc3luY0dlbmVyYXRvclN0ZXAiLCJQcm9taXNlIiwicmVzb2x2ZSIsInRoZW4iLCJfYXN5bmNUb0dlbmVyYXRvciIsImFyZ3VtZW50cyIsImFwcGx5IiwiX25leHQiLCJfdGhyb3ciLCJ1dGlscyIsIlNISVBQSU5HX0xPQ0FUSU9OX0tFWSIsIlVTX1NUQVRFUyIsImlkIiwiYWJiciIsIiRjb250YWluZXIiLCJwcm9kdWN0SWQiLCJtaW5RdHkiLCJwYXJzZUludCIsImlzRWRpdGluZyIsImlzTG9hZGluZyIsInNlbGVjdGVkU3RhdGUiLCJ6aXBDb2RlIiwicXVvdGVzIiwicmVjYWxjVGltZXIiLCIkdGl0bGUiLCIkZWRpdEJ0biIsIiRzdGF0ZVNlbGVjdCIsIiR6aXBJbnB1dCIsIiRzdWJtaXRCdG4iLCIkZXJyb3IiLCIkbG9hZGluZyIsIiRyZXN1bHRzIiwiJGVtcHR5IiwicG9wdWxhdGVTdGF0ZU9wdGlvbnMiLCJiaW5kRXZlbnRzIiwibG9hZFNhdmVkTG9jYXRpb24iLCJmcmFnbWVudCIsImNyZWF0ZURvY3VtZW50RnJhZ21lbnQiLCJzdGF0ZSIsIm9wdCIsImNyZWF0ZUVsZW1lbnQiLCJ0ZXh0Q29udGVudCIsImFwcGVuZENoaWxkIiwiYXBwZW5kIiwicHJldmVudERlZmF1bHQiLCJzdG9wUHJvcGFnYXRpb24iLCJjYW5TdWJtaXQiLCJjYWxjdWxhdGVTaGlwcGluZyIsInNob3dGb3JtIiwiY2xlYXJFcnJvciIsInVwZGF0ZVN1Ym1pdFN0YXRlIiwicmVwbGFjZSIsInNsaWNlIiwidG9nZ2xlQ2xhc3MiLCJpc1ZhbGlkWmlwIiwia2V5Iiwib25PcHRpb25zQ2hhbmdlZCIsInNhdmVkIiwiZ2V0U2F2ZWRTaGlwcGluZ0xvY2F0aW9uIiwic3RhdGVJZCIsInppcCIsInRvU3RyaW5nIiwiY2xlYXJUaW1lb3V0Iiwic2V0VGltZW91dCIsInRlc3QiLCJnZXRTdGF0ZU5hbWUiLCJzIiwiZ2V0T3B0aW9uU2VsZWN0aW9ucyIsIl8iLCJlbCIsIiRlbCIsImF0dHIiLCJhdHRySWQiLCJpcyIsInVuZGVmaW5lZCIsIl9jYWxjdWxhdGVTaGlwcGluZyIsIl9jYWxsZWUiLCJzaG91bGRTYXZlIiwiZm9ybURhdGEiLCJhZGRSZXN1bHQiLCJjYXJ0SXRlbUlkIiwic2hpcHBpbmdQYXJhbXMiLCJxdW90ZXNSZXN1bHQiLCJzdGF0ZU9iaiIsIl90IiwiX2NvbnRleHQiLCJzaG93TG9hZGluZyIsIkZvcm1EYXRhIiwiZW50cmllcyIsIl9yZWYiLCJvcHRpb25JZCIsInJlamVjdCIsImFwaSIsImNhcnQiLCJpdGVtQWRkIiwiZXJyIiwicmVzcG9uc2UiLCJFcnJvciIsIm1lc3NhZ2UiLCJjYXJ0X2l0ZW0iLCJjb3VudHJ5X2lkIiwic3RhdGVfaWQiLCJ6aXBfY29kZSIsImdldFNoaXBwaW5nUXVvdGVzIiwiaXRlbVJlbW92ZSIsInBhcnNlU2hpcHBpbmdRdW90ZXMiLCJjb250ZW50Iiwic2F2ZVNoaXBwaW5nTG9jYXRpb24iLCJoaWRlRm9ybSIsInJlbmRlclF1b3RlcyIsImNvbnNvbGUiLCJzaG93RXJyb3IiLCJoaWRlUmVzdWx0cyIsImhpZGVMb2FkaW5nIiwiX3giLCJfeDIiLCJfeDMiLCJodG1sQ29udGVudCIsInBhcnNlciIsIkRPTVBhcnNlciIsImRvYyIsInBhcnNlRnJvbVN0cmluZyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJpdGVtIiwibGFiZWxFbCIsInF1ZXJ5U2VsZWN0b3IiLCJwcmljZUVsIiwiaW5wdXRFbCIsInRyaW0iLCJwcmljZSIsInB1c2giLCJ0ZXh0IiwiYm9keSIsInByaWNlTWF0Y2hlcyIsIl90aGlzMyIsImVtcHR5IiwiaGlkZSIsInNob3ciLCJxdW90ZSIsIiRvcHRpb24iLCJ1cGRhdGVUaXRsZSIsImh0bWwiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwicGFyc2VkIiwiSlNPTiIsInBhcnNlIiwic2V0SXRlbSIsInN0cmluZ2lmeSIsInRpbWVzdGFtcCIsIkRhdGUiLCJub3ciLCJDb2xsYXBzaWJsZUV2ZW50cyIsIl9kZWZhdWx0Iiwic3VibWl0IiwiJHJldmlld3NDb250ZW50IiwiJGNvbGxhcHNpYmxlIiwiaW5pdExpbmtCaW5kIiwiaW5qZWN0UGFnaW5hdGlvbkxpbmsiLCJjb2xsYXBzZVJldmlld3MiLCIkY29udGVudCIsImNsaWNrIiwiaGFzaCIsIiRuZXh0TGluayIsIiRwcmV2TGluayIsInJldmlld1JhdGluZyIsInJldmlld1N1YmplY3QiLCJyZXZpZXdDb21tZW50IiwicmV2aWV3RW1haWwiLCJWaWRlb0dhbGxlcnkiLCIkZWxlbWVudCIsIiRwbGF5ZXIiLCIkdmlkZW9zIiwiY3VycmVudFZpZGVvIiwic2VsZWN0TmV3VmlkZW8iLCIkdGFyZ2V0IiwiY3VycmVudFRhcmdldCIsIiRzZWxlY3RlZFRodW1iIiwic2V0TWFpblZpZGVvIiwic2V0QWN0aXZlVGh1bWIiLCJwbHVnaW5LZXkiLCIkdmlkZW9HYWxsZXJ5IiwiaW5kZXgiLCJlbGVtZW50IiwiaXNJbml0aWFsaXplZCJdLCJzb3VyY2VSb290IjoiIn0=