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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWUtYnVuZGxlLmNodW5rLmFzc2V0c19qc190aGVtZV9wcm9kdWN0X2pzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUN3QjtBQUNXO0FBRW5DLElBQU1FLGFBQWEsR0FBRyxDQUNsQixPQUFPLEVBQ1AsUUFBUSxFQUNSLFVBQVUsQ0FDYjs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTQyxhQUFhQSxDQUFDQyxLQUFLLEVBQUVDLGNBQWMsRUFBRTtFQUMxQyxJQUFNQyxNQUFNLEdBQUdDLENBQUMsQ0FBQ0gsS0FBSyxDQUFDO0VBQ3ZCLElBQU1JLFVBQVUsR0FBR0YsTUFBTSxDQUFDRyxNQUFNLE9BQUtKLGNBQWdCLENBQUM7RUFDdEQsSUFBTUssT0FBTyxHQUFHSixNQUFNLENBQUNLLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQ0MsV0FBVyxDQUFDLENBQUM7RUFFcEQsSUFBSUMsU0FBUyxHQUFNUixjQUFjLFVBQUtLLE9BQVM7RUFDL0MsSUFBSUksaUJBQWlCOztFQUVyQjtFQUNBLElBQUlKLE9BQU8sS0FBSyxPQUFPLEVBQUU7SUFDckIsSUFBTUssU0FBUyxHQUFHVCxNQUFNLENBQUNLLElBQUksQ0FBQyxNQUFNLENBQUM7SUFFckMsSUFBSUssc0RBQUEsQ0FBVyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLEVBQUVELFNBQVMsQ0FBQyxFQUFFO01BQ3hEO01BQ0FGLFNBQVMsR0FBTVIsY0FBYyxVQUFLWSx1REFBQSxDQUFZRixTQUFTLENBQUc7SUFDOUQsQ0FBQyxNQUFNO01BQ0g7TUFDQUQsaUJBQWlCLFFBQU1ELFNBQVMsR0FBR0ssd0RBQUEsQ0FBYUgsU0FBUyxDQUFHO0lBQ2hFO0VBQ0o7O0VBRUE7RUFDQSxPQUFPUCxVQUFVLENBQ1pXLFFBQVEsQ0FBQ04sU0FBUyxDQUFDLENBQ25CTSxRQUFRLENBQUNMLGlCQUFpQixDQUFDO0FBQ3BDOztBQUVB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d2VicGFjazovL2xvbmVzdGFydGVtcGxhdGVzLXBhcnRzd2FyZWhvdXNlLy4vYXNzZXRzL2pzL3RoZW1lL2NvbW1vbi9mb3JtLXV0aWxzLmpzIiwid2VicGFjazovL2xvbmVzdGFydGVtcGxhdGVzLXBhcnRzd2FyZWhvdXNlLy4vYXNzZXRzL2pzL3RoZW1lL3Byb2R1Y3QuanMiLCJ3ZWJwYWNrOi8vbG9uZXN0YXJ0ZW1wbGF0ZXMtcGFydHN3YXJlaG91c2UvLi9hc3NldHMvanMvdGhlbWUvcHJvZHVjdC9wZHAtc2hpcHBpbmctY2FsY3VsYXRvci5qcyIsIndlYnBhY2s6Ly9sb25lc3RhcnRlbXBsYXRlcy1wYXJ0c3dhcmVob3VzZS8uL2Fzc2V0cy9qcy90aGVtZS9wcm9kdWN0L3Jldmlld3MuanMiLCJ3ZWJwYWNrOi8vbG9uZXN0YXJ0ZW1wbGF0ZXMtcGFydHN3YXJlaG91c2UvLi9hc3NldHMvanMvdGhlbWUvcHJvZHVjdC92aWRlby1nYWxsZXJ5LmpzIiwid2VicGFjazovL2xvbmVzdGFydGVtcGxhdGVzLXBhcnRzd2FyZWhvdXNlLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczcub2JqZWN0LmVudHJpZXMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBub2QgZnJvbSAnLi9ub2QnO1xuaW1wb3J0IGZvcm1zIGZyb20gJy4vbW9kZWxzL2Zvcm1zJztcblxuY29uc3QgaW5wdXRUYWdOYW1lcyA9IFtcbiAgICAnaW5wdXQnLFxuICAgICdzZWxlY3QnLFxuICAgICd0ZXh0YXJlYScsXG5dO1xuXG4vKipcbiAqIEFwcGx5IGNsYXNzIG5hbWUgdG8gYW4gaW5wdXQgZWxlbWVudCBvbiBpdHMgdHlwZVxuICogQHBhcmFtIHtvYmplY3R9IGlucHV0XG4gKiBAcGFyYW0ge3N0cmluZ30gZm9ybUZpZWxkQ2xhc3NcbiAqIEByZXR1cm4ge29iamVjdH0gRWxlbWVudCBpdHNlbGZcbiAqL1xuZnVuY3Rpb24gY2xhc3NpZnlJbnB1dChpbnB1dCwgZm9ybUZpZWxkQ2xhc3MpIHtcbiAgICBjb25zdCAkaW5wdXQgPSAkKGlucHV0KTtcbiAgICBjb25zdCAkZm9ybUZpZWxkID0gJGlucHV0LnBhcmVudChgLiR7Zm9ybUZpZWxkQ2xhc3N9YCk7XG4gICAgY29uc3QgdGFnTmFtZSA9ICRpbnB1dC5wcm9wKCd0YWdOYW1lJykudG9Mb3dlckNhc2UoKTtcblxuICAgIGxldCBjbGFzc05hbWUgPSBgJHtmb3JtRmllbGRDbGFzc30tLSR7dGFnTmFtZX1gO1xuICAgIGxldCBzcGVjaWZpY0NsYXNzTmFtZTtcblxuICAgIC8vIElucHV0IGNhbiBiZSB0ZXh0L2NoZWNrYm94L3JhZGlvIGV0Yy4uLlxuICAgIGlmICh0YWdOYW1lID09PSAnaW5wdXQnKSB7XG4gICAgICAgIGNvbnN0IGlucHV0VHlwZSA9ICRpbnB1dC5wcm9wKCd0eXBlJyk7XG5cbiAgICAgICAgaWYgKF8uaW5jbHVkZXMoWydyYWRpbycsICdjaGVja2JveCcsICdzdWJtaXQnXSwgaW5wdXRUeXBlKSkge1xuICAgICAgICAgICAgLy8gaWU6IC5mb3JtLWZpZWxkLS1jaGVja2JveCwgLmZvcm0tZmllbGQtLXJhZGlvXG4gICAgICAgICAgICBjbGFzc05hbWUgPSBgJHtmb3JtRmllbGRDbGFzc30tLSR7Xy5jYW1lbENhc2UoaW5wdXRUeXBlKX1gO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gaWU6IC5mb3JtLWZpZWxkLS1pbnB1dCAuZm9ybS1maWVsZC0taW5wdXRUZXh0XG4gICAgICAgICAgICBzcGVjaWZpY0NsYXNzTmFtZSA9IGAke2NsYXNzTmFtZX0ke18uY2FwaXRhbGl6ZShpbnB1dFR5cGUpfWA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBcHBseSBjbGFzcyBtb2RpZmllclxuICAgIHJldHVybiAkZm9ybUZpZWxkXG4gICAgICAgIC5hZGRDbGFzcyhjbGFzc05hbWUpXG4gICAgICAgIC5hZGRDbGFzcyhzcGVjaWZpY0NsYXNzTmFtZSk7XG59XG5cbi8qKlxuICogQXBwbHkgY2xhc3MgbmFtZSB0byBlYWNoIGlucHV0IGVsZW1lbnQgaW4gYSBmb3JtIGJhc2VkIG9uIGl0cyB0eXBlXG4gKiBAZXhhbXBsZVxuICogLy8gQmVmb3JlXG4gKiA8Zm9ybSBpZD1cImZvcm1cIj5cbiAqICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1maWVsZFwiPlxuICogICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIj5cbiAqICAgICA8L2Rpdj5cbiAqICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1maWVsZFwiPlxuICogICAgICAgICA8c2VsZWN0Pi4uLjwvc2VsZWN0PlxuICogICAgIDwvZGl2PlxuICogPC9mb3JtPlxuICpcbiAqIGNsYXNzaWZ5Rm9ybSgnI2Zvcm0nLCB7IGZvcm1GaWVsZENsYXNzOiAnZm9ybS1maWVsZCcgfSk7XG4gKlxuICogLy8gQWZ0ZXJcbiAqIDxkaXYgY2xhc3M9XCJmb3JtLWZpZWxkIGZvcm0tZmllbGQtLWlucHV0IGZvcm0tZmllbGQtLWlucHV0VGV4dFwiPi4uLjwvZGl2PlxuICogPGRpdiBjbGFzcz1cImZvcm0tZmllbGQgZm9ybS1maWVsZC0tc2VsZWN0XCI+Li4uPC9kaXY+XG4gKlxuICogQHBhcmFtIHtzdHJpbmd8b2JqZWN0fSBmb3JtU2VsZWN0b3IgLSBzZWxlY3RvciBvciBlbGVtZW50XG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7alF1ZXJ5fSBFbGVtZW50IGl0c2VsZlxuICovXG5leHBvcnQgZnVuY3Rpb24gY2xhc3NpZnlGb3JtKGZvcm1TZWxlY3Rvciwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgJGZvcm0gPSAkKGZvcm1TZWxlY3Rvcik7XG4gICAgY29uc3QgJGlucHV0cyA9ICRmb3JtLmZpbmQoaW5wdXRUYWdOYW1lcy5qb2luKCcsICcpKTtcblxuICAgIC8vIE9idGFpbiBvcHRpb25zXG4gICAgY29uc3QgeyBmb3JtRmllbGRDbGFzcyA9ICdmb3JtLWZpZWxkJyB9ID0gb3B0aW9ucztcblxuICAgIC8vIENsYXNzaWZ5IGVhY2ggaW5wdXQgaW4gYSBmb3JtXG4gICAgJGlucHV0cy5lYWNoKChfXywgaW5wdXQpID0+IHtcbiAgICAgICAgY2xhc3NpZnlJbnB1dChpbnB1dCwgZm9ybUZpZWxkQ2xhc3MpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuICRmb3JtO1xufVxuXG4vKipcbiAqIEdldCBpZCBmcm9tIGdpdmVuIGZpZWxkXG4gKiBAcGFyYW0ge29iamVjdH0gJGZpZWxkIEpRdWVyeSBmaWVsZCBvYmplY3RcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gZ2V0RmllbGRJZCgkZmllbGQpIHtcbiAgICBjb25zdCBmaWVsZElkID0gJGZpZWxkLnByb3AoJ25hbWUnKS5tYXRjaCgvKFxcWy4qXFxdKS8pO1xuXG4gICAgaWYgKGZpZWxkSWQgJiYgZmllbGRJZC5sZW5ndGggIT09IDApIHtcbiAgICAgICAgcmV0dXJuIGZpZWxkSWRbMF07XG4gICAgfVxuXG4gICAgcmV0dXJuICcnO1xufVxuXG4vKipcbiAqIEluc2VydCBoaWRkZW4gZmllbGQgYWZ0ZXIgU3RhdGUvUHJvdmluY2UgZmllbGRcbiAqIEBwYXJhbSB7b2JqZWN0fSAkc3RhdGVGaWVsZCBKUXVlcnkgZmllbGQgb2JqZWN0XG4gKi9cbmZ1bmN0aW9uIGluc2VydFN0YXRlSGlkZGVuRmllbGQoJHN0YXRlRmllbGQpIHtcbiAgICBjb25zdCBmaWVsZElkID0gZ2V0RmllbGRJZCgkc3RhdGVGaWVsZCk7XG4gICAgY29uc3Qgc3RhdGVGaWVsZEF0dHJzID0ge1xuICAgICAgICB0eXBlOiAnaGlkZGVuJyxcbiAgICAgICAgbmFtZTogYEZvcm1GaWVsZElzVGV4dCR7ZmllbGRJZH1gLFxuICAgICAgICB2YWx1ZTogJzEnLFxuICAgIH07XG5cbiAgICAkc3RhdGVGaWVsZC5hZnRlcigkKCc8aW5wdXQgLz4nLCBzdGF0ZUZpZWxkQXR0cnMpKTtcbn1cblxuY29uc3QgVmFsaWRhdG9ycyA9IHtcbiAgICAvKipcbiAgICAgKiBTZXRzIHVwIGEgbmV3IHZhbGlkYXRpb24gd2hlbiB0aGUgZm9ybSBpcyBkaXJ0eVxuICAgICAqIEBwYXJhbSB2YWxpZGF0b3JcbiAgICAgKiBAcGFyYW0gZmllbGRcbiAgICAgKi9cbiAgICBzZXRFbWFpbFZhbGlkYXRpb246ICh2YWxpZGF0b3IsIGZpZWxkKSA9PiB7XG4gICAgICAgIGlmIChmaWVsZCkge1xuICAgICAgICAgICAgdmFsaWRhdG9yLmFkZCh7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6IGZpZWxkLFxuICAgICAgICAgICAgICAgIHZhbGlkYXRlOiAoY2IsIHZhbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBmb3Jtcy5lbWFpbCh2YWwpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNiKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2U6ICdZb3UgbXVzdCBlbnRlciBhIHZhbGlkIGVtYWlsLicsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBWYWxpZGF0ZSBwYXNzd29yZCBmaWVsZHNcbiAgICAgKiBAcGFyYW0gdmFsaWRhdG9yXG4gICAgICogQHBhcmFtIHBhc3N3b3JkU2VsZWN0b3JcbiAgICAgKiBAcGFyYW0gcGFzc3dvcmQyU2VsZWN0b3JcbiAgICAgKiBAcGFyYW0gcmVxdWlyZW1lbnRzXG4gICAgICogQHBhcmFtIGlzT3B0aW9uYWxcbiAgICAgKi9cbiAgICBzZXRQYXNzd29yZFZhbGlkYXRpb246ICh2YWxpZGF0b3IsIHBhc3N3b3JkU2VsZWN0b3IsIHBhc3N3b3JkMlNlbGVjdG9yLCByZXF1aXJlbWVudHMsIGlzT3B0aW9uYWwpID0+IHtcbiAgICAgICAgY29uc3QgJHBhc3N3b3JkID0gJChwYXNzd29yZFNlbGVjdG9yKTtcbiAgICAgICAgY29uc3QgcGFzc3dvcmRWYWxpZGF0aW9ucyA9IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RvcjogcGFzc3dvcmRTZWxlY3RvcixcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZTogKGNiLCB2YWwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gdmFsLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNPcHRpb25hbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNiKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY2IocmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZTogJ1lvdSBtdXN0IGVudGVyIGEgcGFzc3dvcmQuJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6IHBhc3N3b3JkU2VsZWN0b3IsXG4gICAgICAgICAgICAgICAgdmFsaWRhdGU6IChjYiwgdmFsKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHZhbC5tYXRjaChuZXcgUmVnRXhwKHJlcXVpcmVtZW50cy5hbHBoYSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiB2YWwubWF0Y2gobmV3IFJlZ0V4cChyZXF1aXJlbWVudHMubnVtZXJpYykpXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiB2YWwubGVuZ3RoID49IHJlcXVpcmVtZW50cy5taW5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgb3B0aW9uYWwgYW5kIG5vdGhpbmcgZW50ZXJlZCwgaXQgaXMgdmFsaWRcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzT3B0aW9uYWwgJiYgdmFsLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNiKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY2IocmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZTogcmVxdWlyZW1lbnRzLmVycm9yLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RvcjogcGFzc3dvcmQyU2VsZWN0b3IsXG4gICAgICAgICAgICAgICAgdmFsaWRhdGU6IChjYiwgdmFsKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHZhbC5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzT3B0aW9uYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYih0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNiKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2U6ICdZb3UgbXVzdCBlbnRlciBhIHBhc3N3b3JkLicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiBwYXNzd29yZDJTZWxlY3RvcixcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZTogKGNiLCB2YWwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gdmFsID09PSAkcGFzc3dvcmQudmFsKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgY2IocmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZTogJ1lvdXIgcGFzc3dvcmRzIGRvIG5vdCBtYXRjaC4nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgXTtcblxuICAgICAgICB2YWxpZGF0b3IuYWRkKHBhc3N3b3JkVmFsaWRhdGlvbnMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBWYWxpZGF0ZSBwYXNzd29yZCBmaWVsZHNcbiAgICAgKiBAcGFyYW0ge05vZH0gdmFsaWRhdG9yXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHNlbGVjdG9yc1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvcnMuZXJyb3JTZWxlY3RvclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvcnMuZmllbGRzZXRTZWxlY3RvclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvcnMuZm9ybVNlbGVjdG9yXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9ycy5tYXhQcmljZVNlbGVjdG9yXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9ycy5taW5QcmljZVNlbGVjdG9yXG4gICAgICovXG4gICAgc2V0TWluTWF4UHJpY2VWYWxpZGF0aW9uOiAodmFsaWRhdG9yLCBzZWxlY3RvcnMpID0+IHtcbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgICAgZXJyb3JTZWxlY3RvcixcbiAgICAgICAgICAgIGZpZWxkc2V0U2VsZWN0b3IsXG4gICAgICAgICAgICBmb3JtU2VsZWN0b3IsXG4gICAgICAgICAgICBtYXhQcmljZVNlbGVjdG9yLFxuICAgICAgICAgICAgbWluUHJpY2VTZWxlY3RvcixcbiAgICAgICAgfSA9IHNlbGVjdG9ycztcblxuICAgICAgICB2YWxpZGF0b3IuY29uZmlndXJlKHtcbiAgICAgICAgICAgIGZvcm06IGZvcm1TZWxlY3RvcixcbiAgICAgICAgICAgIHByZXZlbnRTdWJtaXQ6IHRydWUsXG4gICAgICAgICAgICBzdWNjZXNzQ2xhc3M6ICdfJywgLy8gS0xVREdFOiBEb24ndCBhcHBseSBzdWNjZXNzIGNsYXNzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhbGlkYXRvci5hZGQoe1xuICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiAnTWluIHByaWNlIG11c3QgYmUgbGVzcyB0aGFuIG1heC4gcHJpY2UuJyxcbiAgICAgICAgICAgIHNlbGVjdG9yOiBtaW5QcmljZVNlbGVjdG9yLFxuICAgICAgICAgICAgdmFsaWRhdGU6IGBtaW4tbWF4OiR7bWluUHJpY2VTZWxlY3Rvcn06JHttYXhQcmljZVNlbGVjdG9yfWAsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhbGlkYXRvci5hZGQoe1xuICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiAnTWluIHByaWNlIG11c3QgYmUgbGVzcyB0aGFuIG1heC4gcHJpY2UuJyxcbiAgICAgICAgICAgIHNlbGVjdG9yOiBtYXhQcmljZVNlbGVjdG9yLFxuICAgICAgICAgICAgdmFsaWRhdGU6IGBtaW4tbWF4OiR7bWluUHJpY2VTZWxlY3Rvcn06JHttYXhQcmljZVNlbGVjdG9yfWAsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhbGlkYXRvci5hZGQoe1xuICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiAnTWF4LiBwcmljZSBpcyByZXF1aXJlZC4nLFxuICAgICAgICAgICAgc2VsZWN0b3I6IG1heFByaWNlU2VsZWN0b3IsXG4gICAgICAgICAgICB2YWxpZGF0ZTogJ3ByZXNlbmNlJyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFsaWRhdG9yLmFkZCh7XG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6ICdNaW4uIHByaWNlIGlzIHJlcXVpcmVkLicsXG4gICAgICAgICAgICBzZWxlY3RvcjogbWluUHJpY2VTZWxlY3RvcixcbiAgICAgICAgICAgIHZhbGlkYXRlOiAncHJlc2VuY2UnLFxuICAgICAgICB9KTtcblxuICAgICAgICB2YWxpZGF0b3IuYWRkKHtcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogJ0lucHV0IG11c3QgYmUgZ3JlYXRlciB0aGFuIDAuJyxcbiAgICAgICAgICAgIHNlbGVjdG9yOiBbbWluUHJpY2VTZWxlY3RvciwgbWF4UHJpY2VTZWxlY3Rvcl0sXG4gICAgICAgICAgICB2YWxpZGF0ZTogJ21pbi1udW1iZXI6MCcsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhbGlkYXRvci5zZXRNZXNzYWdlT3B0aW9ucyh7XG4gICAgICAgICAgICBzZWxlY3RvcjogW21pblByaWNlU2VsZWN0b3IsIG1heFByaWNlU2VsZWN0b3JdLFxuICAgICAgICAgICAgcGFyZW50OiBmaWVsZHNldFNlbGVjdG9yLFxuICAgICAgICAgICAgZXJyb3JTcGFuOiBlcnJvclNlbGVjdG9yLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0cyB1cCBhIG5ldyB2YWxpZGF0aW9uIHdoZW4gdGhlIGZvcm0gaXMgZGlydHlcbiAgICAgKiBAcGFyYW0gdmFsaWRhdG9yXG4gICAgICogQHBhcmFtIGZpZWxkXG4gICAgICovXG4gICAgc2V0U3RhdGVDb3VudHJ5VmFsaWRhdGlvbjogKHZhbGlkYXRvciwgZmllbGQpID0+IHtcbiAgICAgICAgaWYgKGZpZWxkKSB7XG4gICAgICAgICAgICB2YWxpZGF0b3IuYWRkKHtcbiAgICAgICAgICAgICAgICBzZWxlY3RvcjogZmllbGQsXG4gICAgICAgICAgICAgICAgdmFsaWRhdGU6ICdwcmVzZW5jZScsXG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiAnVGhlIFxcJ1N0YXRlL1Byb3ZpbmNlXFwnIGZpZWxkIGNhbm5vdCBiZSBibGFuay4nLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBjbGFzc2VzIGZyb20gZGlydHkgZm9ybSBpZiBwcmV2aW91c2x5IGNoZWNrZWRcbiAgICAgKiBAcGFyYW0gZmllbGRcbiAgICAgKi9cbiAgICBjbGVhblVwU3RhdGVWYWxpZGF0aW9uOiAoZmllbGQpID0+IHtcbiAgICAgICAgY29uc3QgJGZpZWxkQ2xhc3NFbGVtZW50ID0gJCgoYFtkYXRhLXR5cGU9XCIke2ZpZWxkLmRhdGEoJ2ZpZWxkVHlwZScpfVwiXWApKTtcblxuICAgICAgICBPYmplY3Qua2V5cyhub2QuY2xhc3NlcykuZm9yRWFjaCgodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGlmICgkZmllbGRDbGFzc0VsZW1lbnQuaGFzQ2xhc3Mobm9kLmNsYXNzZXNbdmFsdWVdKSkge1xuICAgICAgICAgICAgICAgICRmaWVsZENsYXNzRWxlbWVudC5yZW1vdmVDbGFzcyhub2QuY2xhc3Nlc1t2YWx1ZV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxufTtcblxuZXhwb3J0IHsgVmFsaWRhdG9ycywgaW5zZXJ0U3RhdGVIaWRkZW5GaWVsZCB9O1xuIiwiLypcbiBJbXBvcnQgYWxsIHByb2R1Y3Qgc3BlY2lmaWMganNcbiAqL1xuaW1wb3J0IFBhZ2VNYW5hZ2VyIGZyb20gJy4vcGFnZS1tYW5hZ2VyJztcbmltcG9ydCBSZXZpZXcgZnJvbSAnLi9wcm9kdWN0L3Jldmlld3MnO1xuaW1wb3J0IGNvbGxhcHNpYmxlRmFjdG9yeSBmcm9tICcuL2NvbW1vbi9jb2xsYXBzaWJsZSc7XG5pbXBvcnQgUHJvZHVjdERldGFpbHMgZnJvbSAnLi9jb21tb24vcHJvZHVjdC1kZXRhaWxzJztcbmltcG9ydCB2aWRlb0dhbGxlcnkgZnJvbSAnLi9wcm9kdWN0L3ZpZGVvLWdhbGxlcnknO1xuaW1wb3J0IHsgY2xhc3NpZnlGb3JtIH0gZnJvbSAnLi9jb21tb24vZm9ybS11dGlscyc7XG5pbXBvcnQgJ0BmYW5jeWFwcHMvZmFuY3lib3gnO1xuaW1wb3J0IFBEUFNoaXBwaW5nQ2FsY3VsYXRvciBmcm9tICcuL3Byb2R1Y3QvcGRwLXNoaXBwaW5nLWNhbGN1bGF0b3InO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcm9kdWN0IGV4dGVuZHMgUGFnZU1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yKGNvbnRleHQpIHtcbiAgICAgICAgc3VwZXIoY29udGV4dCk7XG4gICAgICAgIHRoaXMudXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gICAgICAgIHRoaXMuJHJldmlld0xpbmsgPSAkKCdbZGF0YS1yZXZlYWwtaWQ9XCJtb2RhbC1yZXZpZXctZm9ybVwiXScpO1xuICAgICAgICB0aGlzLiRidWxrUHJpY2luZ0xpbmsgPSAkKCdbZGF0YS1yZXZlYWwtaWQ9XCJtb2RhbC1idWxrLXByaWNpbmdcIl0nKTtcbiAgICB9XG5cbiAgICBvblJlYWR5KCkge1xuICAgICAgICAvLyBMaXN0ZW4gZm9yIGZvdW5kYXRpb24gbW9kYWwgY2xvc2UgZXZlbnRzIHRvIHNhbml0aXplIFVSTCBhZnRlciByZXZpZXcuXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbG9zZS5mbmR0bi5yZXZlYWwnLCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy51cmwuaW5kZXhPZignI3dyaXRlX3JldmlldycpICE9PSAtMSAmJiB0eXBlb2Ygd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKG51bGwsIGRvY3VtZW50LnRpdGxlLCB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgdmFsaWRhdG9yO1xuXG4gICAgICAgIC8vIEluaXQgY29sbGFwc2libGVcbiAgICAgICAgY29sbGFwc2libGVGYWN0b3J5KCk7XG5cbiAgICAgICAgdGhpcy5wcm9kdWN0RGV0YWlscyA9IG5ldyBQcm9kdWN0RGV0YWlscygkKCcucHJvZHVjdFZpZXcnKSwgdGhpcy5jb250ZXh0LCB3aW5kb3cuQkNEYXRhLnByb2R1Y3RfYXR0cmlidXRlcyk7XG4gICAgICAgIHRoaXMucHJvZHVjdERldGFpbHMuc2V0UHJvZHVjdFZhcmlhbnQoKTtcblxuICAgICAgICB2aWRlb0dhbGxlcnkoKTtcblxuICAgICAgICBjb25zdCAkcmV2aWV3Rm9ybSA9IGNsYXNzaWZ5Rm9ybSgnLndyaXRlUmV2aWV3LWZvcm0nKTtcbiAgICAgICAgY29uc3QgcmV2aWV3ID0gbmV3IFJldmlldygkcmV2aWV3Rm9ybSk7XG5cbiAgICAgICAgJCgnYm9keScpLm9uKCdjbGljaycsICdbZGF0YS1yZXZlYWwtaWQ9XCJtb2RhbC1yZXZpZXctZm9ybVwiXScsICgpID0+IHtcbiAgICAgICAgICAgIHZhbGlkYXRvciA9IHJldmlldy5yZWdpc3RlclZhbGlkYXRpb24odGhpcy5jb250ZXh0KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHJldmlld0Zvcm0ub24oJ3N1Ym1pdCcsICgpID0+IHtcbiAgICAgICAgICAgIGlmICh2YWxpZGF0b3IpIHtcbiAgICAgICAgICAgICAgICB2YWxpZGF0b3IucGVyZm9ybUNoZWNrKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbGlkYXRvci5hcmVBbGwoJ3ZhbGlkJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgJHNoaXBwaW5nQ2FsYyA9ICQoJ1tkYXRhLXBkcC1zaGlwcGluZy1jYWxjXScpO1xuICAgICAgICBpZiAoJHNoaXBwaW5nQ2FsYy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuc2hpcHBpbmdDYWxjdWxhdG9yID0gbmV3IFBEUFNoaXBwaW5nQ2FsY3VsYXRvcigkc2hpcHBpbmdDYWxjLCB0aGlzLmNvbnRleHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5wcm9kdWN0UmV2aWV3SGFuZGxlcigpO1xuICAgICAgICB0aGlzLmJ1bGtQcmljaW5nSGFuZGxlcigpO1xuICAgIH1cblxuICAgIHByb2R1Y3RSZXZpZXdIYW5kbGVyKCkge1xuICAgICAgICBpZiAodGhpcy51cmwuaW5kZXhPZignI3dyaXRlX3JldmlldycpICE9PSAtMSkge1xuICAgICAgICAgICAgdGhpcy4kcmV2aWV3TGluay50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYnVsa1ByaWNpbmdIYW5kbGVyKCkge1xuICAgICAgICBpZiAodGhpcy51cmwuaW5kZXhPZignI2J1bGtfcHJpY2luZycpICE9PSAtMSkge1xuICAgICAgICAgICAgdGhpcy4kYnVsa1ByaWNpbmdMaW5rLnRyaWdnZXIoJ2NsaWNrJyk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgdXRpbHMgZnJvbSAnQGJpZ2NvbW1lcmNlL3N0ZW5jaWwtdXRpbHMnO1xuXG5jb25zdCBTSElQUElOR19MT0NBVElPTl9LRVkgPSAndHB1X3NoaXBwaW5nX2xvY2F0aW9uJztcblxuY29uc3QgVVNfU1RBVEVTID0gW1xuICAgIHsgaWQ6IDEsIG5hbWU6ICdBbGFiYW1hJywgYWJicjogJ0FMJyB9LFxuICAgIHsgaWQ6IDIsIG5hbWU6ICdBbGFza2EnLCBhYmJyOiAnQUsnIH0sXG4gICAgeyBpZDogNCwgbmFtZTogJ0FyaXpvbmEnLCBhYmJyOiAnQVonIH0sXG4gICAgeyBpZDogNSwgbmFtZTogJ0Fya2Fuc2FzJywgYWJicjogJ0FSJyB9LFxuICAgIHsgaWQ6IDEyLCBuYW1lOiAnQ2FsaWZvcm5pYScsIGFiYnI6ICdDQScgfSxcbiAgICB7IGlkOiAxMywgbmFtZTogJ0NvbG9yYWRvJywgYWJicjogJ0NPJyB9LFxuICAgIHsgaWQ6IDE0LCBuYW1lOiAnQ29ubmVjdGljdXQnLCBhYmJyOiAnQ1QnIH0sXG4gICAgeyBpZDogMTUsIG5hbWU6ICdEZWxhd2FyZScsIGFiYnI6ICdERScgfSxcbiAgICB7IGlkOiAxNiwgbmFtZTogJ0Rpc3RyaWN0IG9mIENvbHVtYmlhJywgYWJicjogJ0RDJyB9LFxuICAgIHsgaWQ6IDE4LCBuYW1lOiAnRmxvcmlkYScsIGFiYnI6ICdGTCcgfSxcbiAgICB7IGlkOiAxOSwgbmFtZTogJ0dlb3JnaWEnLCBhYmJyOiAnR0EnIH0sXG4gICAgeyBpZDogMjEsIG5hbWU6ICdIYXdhaWknLCBhYmJyOiAnSEknIH0sXG4gICAgeyBpZDogMjIsIG5hbWU6ICdJZGFobycsIGFiYnI6ICdJRCcgfSxcbiAgICB7IGlkOiAyMywgbmFtZTogJ0lsbGlub2lzJywgYWJicjogJ0lMJyB9LFxuICAgIHsgaWQ6IDI0LCBuYW1lOiAnSW5kaWFuYScsIGFiYnI6ICdJTicgfSxcbiAgICB7IGlkOiAyNSwgbmFtZTogJ0lvd2EnLCBhYmJyOiAnSUEnIH0sXG4gICAgeyBpZDogMjYsIG5hbWU6ICdLYW5zYXMnLCBhYmJyOiAnS1MnIH0sXG4gICAgeyBpZDogMjcsIG5hbWU6ICdLZW50dWNreScsIGFiYnI6ICdLWScgfSxcbiAgICB7IGlkOiAyOCwgbmFtZTogJ0xvdWlzaWFuYScsIGFiYnI6ICdMQScgfSxcbiAgICB7IGlkOiAyOSwgbmFtZTogJ01haW5lJywgYWJicjogJ01FJyB9LFxuICAgIHsgaWQ6IDMxLCBuYW1lOiAnTWFyeWxhbmQnLCBhYmJyOiAnTUQnIH0sXG4gICAgeyBpZDogMzIsIG5hbWU6ICdNYXNzYWNodXNldHRzJywgYWJicjogJ01BJyB9LFxuICAgIHsgaWQ6IDMzLCBuYW1lOiAnTWljaGlnYW4nLCBhYmJyOiAnTUknIH0sXG4gICAgeyBpZDogMzQsIG5hbWU6ICdNaW5uZXNvdGEnLCBhYmJyOiAnTU4nIH0sXG4gICAgeyBpZDogMzUsIG5hbWU6ICdNaXNzaXNzaXBwaScsIGFiYnI6ICdNUycgfSxcbiAgICB7IGlkOiAzNiwgbmFtZTogJ01pc3NvdXJpJywgYWJicjogJ01PJyB9LFxuICAgIHsgaWQ6IDM3LCBuYW1lOiAnTW9udGFuYScsIGFiYnI6ICdNVCcgfSxcbiAgICB7IGlkOiAzOCwgbmFtZTogJ05lYnJhc2thJywgYWJicjogJ05FJyB9LFxuICAgIHsgaWQ6IDM5LCBuYW1lOiAnTmV2YWRhJywgYWJicjogJ05WJyB9LFxuICAgIHsgaWQ6IDQwLCBuYW1lOiAnTmV3IEhhbXBzaGlyZScsIGFiYnI6ICdOSCcgfSxcbiAgICB7IGlkOiA0MSwgbmFtZTogJ05ldyBKZXJzZXknLCBhYmJyOiAnTkonIH0sXG4gICAgeyBpZDogNDIsIG5hbWU6ICdOZXcgTWV4aWNvJywgYWJicjogJ05NJyB9LFxuICAgIHsgaWQ6IDQzLCBuYW1lOiAnTmV3IFlvcmsnLCBhYmJyOiAnTlknIH0sXG4gICAgeyBpZDogNDQsIG5hbWU6ICdOb3J0aCBDYXJvbGluYScsIGFiYnI6ICdOQycgfSxcbiAgICB7IGlkOiA0NSwgbmFtZTogJ05vcnRoIERha290YScsIGFiYnI6ICdORCcgfSxcbiAgICB7IGlkOiA0NywgbmFtZTogJ09oaW8nLCBhYmJyOiAnT0gnIH0sXG4gICAgeyBpZDogNDgsIG5hbWU6ICdPa2xhaG9tYScsIGFiYnI6ICdPSycgfSxcbiAgICB7IGlkOiA0OSwgbmFtZTogJ09yZWdvbicsIGFiYnI6ICdPUicgfSxcbiAgICB7IGlkOiA1MSwgbmFtZTogJ1Blbm5zeWx2YW5pYScsIGFiYnI6ICdQQScgfSxcbiAgICB7IGlkOiA1MywgbmFtZTogJ1Job2RlIElzbGFuZCcsIGFiYnI6ICdSSScgfSxcbiAgICB7IGlkOiA1NCwgbmFtZTogJ1NvdXRoIENhcm9saW5hJywgYWJicjogJ1NDJyB9LFxuICAgIHsgaWQ6IDU1LCBuYW1lOiAnU291dGggRGFrb3RhJywgYWJicjogJ1NEJyB9LFxuICAgIHsgaWQ6IDU2LCBuYW1lOiAnVGVubmVzc2VlJywgYWJicjogJ1ROJyB9LFxuICAgIHsgaWQ6IDU3LCBuYW1lOiAnVGV4YXMnLCBhYmJyOiAnVFgnIH0sXG4gICAgeyBpZDogNTgsIG5hbWU6ICdVdGFoJywgYWJicjogJ1VUJyB9LFxuICAgIHsgaWQ6IDU5LCBuYW1lOiAnVmVybW9udCcsIGFiYnI6ICdWVCcgfSxcbiAgICB7IGlkOiA2MSwgbmFtZTogJ1ZpcmdpbmlhJywgYWJicjogJ1ZBJyB9LFxuICAgIHsgaWQ6IDYyLCBuYW1lOiAnV2FzaGluZ3RvbicsIGFiYnI6ICdXQScgfSxcbiAgICB7IGlkOiA2MywgbmFtZTogJ1dlc3QgVmlyZ2luaWEnLCBhYmJyOiAnV1YnIH0sXG4gICAgeyBpZDogNjQsIG5hbWU6ICdXaXNjb25zaW4nLCBhYmJyOiAnV0knIH0sXG4gICAgeyBpZDogNjUsIG5hbWU6ICdXeW9taW5nJywgYWJicjogJ1dZJyB9LFxuXTtcblxuLyoqXG4gKiBQRFBTaGlwcGluZ0NhbGN1bGF0b3IgLSBFc3RpbWF0ZSBzaGlwcGluZyBjb3N0cyBvbiB0aGUgUERQIGJ5IHN0YXRlIGFuZCBaSVAuXG4gKiBTaWxlbnRseSBhZGRzL3JlbW92ZXMgYSBjYXJ0IGl0ZW0gdG8gZmV0Y2ggQmlnQ29tbWVyY2Ugc2hpcHBpbmcgcXVvdGVzLlxuICogUGVyc2lzdHMgY2hvc2VuIGxvY2F0aW9uIHRvIGxvY2FsU3RvcmFnZSBmb3IgcmV1c2UgYWNyb3NzIHByb2R1Y3QgcGFnZXMuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBEUFNoaXBwaW5nQ2FsY3VsYXRvciB7XG4gICAgY29uc3RydWN0b3IoJGNvbnRhaW5lciwgY29udGV4dCkge1xuICAgICAgICB0aGlzLiRjb250YWluZXIgPSAkY29udGFpbmVyO1xuICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICB0aGlzLnByb2R1Y3RJZCA9ICQoJ2Zvcm1bZGF0YS1jYXJ0LWl0ZW0tYWRkXSBpbnB1dFtuYW1lPVwicHJvZHVjdF9pZFwiXScpLnZhbCgpO1xuICAgICAgICB0aGlzLm1pblF0eSA9IHBhcnNlSW50KCQoJ2Zvcm1bZGF0YS1jYXJ0LWl0ZW0tYWRkXSBpbnB1dFtuYW1lPVwicXR5W11cIl0nKS52YWwoKSwgMTApIHx8IDE7XG5cbiAgICAgICAgdGhpcy5pc0VkaXRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zZWxlY3RlZFN0YXRlID0gJyc7XG4gICAgICAgIHRoaXMuemlwQ29kZSA9ICcnO1xuICAgICAgICB0aGlzLnF1b3RlcyA9IG51bGw7XG4gICAgICAgIHRoaXMucmVjYWxjVGltZXIgPSBudWxsO1xuXG4gICAgICAgIHRoaXMuJHRpdGxlID0gJGNvbnRhaW5lci5maW5kKCdbZGF0YS1jYWxjLXRpdGxlXScpO1xuICAgICAgICB0aGlzLiRlZGl0QnRuID0gJGNvbnRhaW5lci5maW5kKCdbZGF0YS1jYWxjLWVkaXRdJyk7XG4gICAgICAgIHRoaXMuJGZvcm0gPSAkY29udGFpbmVyLmZpbmQoJ1tkYXRhLWNhbGMtZm9ybV0nKTtcbiAgICAgICAgdGhpcy4kc3RhdGVTZWxlY3QgPSAkY29udGFpbmVyLmZpbmQoJ1tkYXRhLWNhbGMtc3RhdGVdJyk7XG4gICAgICAgIHRoaXMuJHppcElucHV0ID0gJGNvbnRhaW5lci5maW5kKCdbZGF0YS1jYWxjLXppcF0nKTtcbiAgICAgICAgdGhpcy4kc3VibWl0QnRuID0gJGNvbnRhaW5lci5maW5kKCdbZGF0YS1jYWxjLXN1Ym1pdF0nKTtcbiAgICAgICAgdGhpcy4kZXJyb3IgPSAkY29udGFpbmVyLmZpbmQoJ1tkYXRhLWNhbGMtZXJyb3JdJyk7XG4gICAgICAgIHRoaXMuJGxvYWRpbmcgPSAkY29udGFpbmVyLmZpbmQoJ1tkYXRhLWNhbGMtbG9hZGluZ10nKTtcbiAgICAgICAgdGhpcy4kcmVzdWx0cyA9ICRjb250YWluZXIuZmluZCgnW2RhdGEtY2FsYy1yZXN1bHRzXScpO1xuICAgICAgICB0aGlzLiRlbXB0eSA9ICRjb250YWluZXIuZmluZCgnW2RhdGEtY2FsYy1lbXB0eV0nKTtcblxuICAgICAgICB0aGlzLnBvcHVsYXRlU3RhdGVPcHRpb25zKCk7XG4gICAgICAgIHRoaXMuYmluZEV2ZW50cygpO1xuICAgICAgICB0aGlzLmxvYWRTYXZlZExvY2F0aW9uKCk7XG4gICAgfVxuXG4gICAgcG9wdWxhdGVTdGF0ZU9wdGlvbnMoKSB7XG4gICAgICAgIGNvbnN0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgICAgICBVU19TVEFURVMuZm9yRWFjaChzdGF0ZSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgICAgICAgIG9wdC52YWx1ZSA9IHN0YXRlLmlkO1xuICAgICAgICAgICAgb3B0LnRleHRDb250ZW50ID0gc3RhdGUubmFtZTtcbiAgICAgICAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKG9wdCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLiRzdGF0ZVNlbGVjdC5hcHBlbmQoZnJhZ21lbnQpO1xuICAgIH1cblxuICAgIGJpbmRFdmVudHMoKSB7XG4gICAgICAgIHRoaXMuJHN1Ym1pdEJ0bi5vbignY2xpY2snLCBlID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBpZiAodGhpcy5jYW5TdWJtaXQoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlU2hpcHBpbmcodGhpcy5zZWxlY3RlZFN0YXRlLCB0aGlzLnppcENvZGUsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiRlZGl0QnRuLm9uKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2hvd0Zvcm0oKTtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJFcnJvcigpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiRzdGF0ZVNlbGVjdC5vbignY2hhbmdlJywgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFN0YXRlID0gdGhpcy4kc3RhdGVTZWxlY3QudmFsKCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVN1Ym1pdFN0YXRlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuJHppcElucHV0Lm9uKCdpbnB1dCcsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuemlwQ29kZSA9IHRoaXMuJHppcElucHV0LnZhbCgpLnJlcGxhY2UoL1xcRC9nLCAnJykuc2xpY2UoMCwgNSk7XG4gICAgICAgICAgICB0aGlzLiR6aXBJbnB1dC52YWwodGhpcy56aXBDb2RlKTtcbiAgICAgICAgICAgIHRoaXMuJHppcElucHV0LnRvZ2dsZUNsYXNzKCdoYXMtZXJyb3InLCB0aGlzLnppcENvZGUubGVuZ3RoID4gMCAmJiAhdGhpcy5pc1ZhbGlkWmlwKCkpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVTdWJtaXRTdGF0ZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiR6aXBJbnB1dC5vbigna2V5ZG93bicsIGUgPT4ge1xuICAgICAgICAgICAgaWYgKGUua2V5ID09PSAnRW50ZXInKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2FuU3VibWl0KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVTaGlwcGluZyh0aGlzLnNlbGVjdGVkU3RhdGUsIHRoaXMuemlwQ29kZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAkKCdib2R5Jykub24oJ3NoaXBwaW5nQ2FsYzpvcHRpb25zQ2hhbmdlZCcsICgpID0+IHRoaXMub25PcHRpb25zQ2hhbmdlZCgpKTtcbiAgICB9XG5cbiAgICBsb2FkU2F2ZWRMb2NhdGlvbigpIHtcbiAgICAgICAgY29uc3Qgc2F2ZWQgPSBnZXRTYXZlZFNoaXBwaW5nTG9jYXRpb24oKTtcbiAgICAgICAgaWYgKHNhdmVkICYmIHNhdmVkLnN0YXRlSWQgJiYgc2F2ZWQuemlwKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkU3RhdGUgPSBzYXZlZC5zdGF0ZUlkLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB0aGlzLnppcENvZGUgPSBzYXZlZC56aXA7XG4gICAgICAgICAgICB0aGlzLiRzdGF0ZVNlbGVjdC52YWwodGhpcy5zZWxlY3RlZFN0YXRlKTtcbiAgICAgICAgICAgIHRoaXMuJHppcElucHV0LnZhbCh0aGlzLnppcENvZGUpO1xuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVTaGlwcGluZyhzYXZlZC5zdGF0ZUlkLCBzYXZlZC56aXAsIGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2hvd0Zvcm0oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uT3B0aW9uc0NoYW5nZWQoKSB7XG4gICAgICAgIHRoaXMuY2xlYXJFcnJvcigpO1xuXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkU3RhdGUgJiYgdGhpcy56aXBDb2RlICYmIHRoaXMuaXNWYWxpZFppcCgpKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5yZWNhbGNUaW1lcik7XG4gICAgICAgICAgICB0aGlzLnJlY2FsY1RpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVTaGlwcGluZyh0aGlzLnNlbGVjdGVkU3RhdGUsIHRoaXMuemlwQ29kZSwgZmFsc2UpO1xuICAgICAgICAgICAgfSwgNTAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIC0tLSBWYWxpZGF0aW9uIGhlbHBlcnMgLS0tXG5cbiAgICBpc1ZhbGlkWmlwKCkge1xuICAgICAgICByZXR1cm4gL15cXGR7NX0kLy50ZXN0KHRoaXMuemlwQ29kZSk7XG4gICAgfVxuXG4gICAgY2FuU3VibWl0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZFN0YXRlICYmIHRoaXMuaXNWYWxpZFppcCgpICYmICF0aGlzLmlzTG9hZGluZztcbiAgICB9XG5cbiAgICB1cGRhdGVTdWJtaXRTdGF0ZSgpIHtcbiAgICAgICAgdGhpcy4kc3VibWl0QnRuLnByb3AoJ2Rpc2FibGVkJywgIXRoaXMuY2FuU3VibWl0KCkpO1xuICAgIH1cblxuICAgIGdldFN0YXRlTmFtZShzdGF0ZUlkKSB7XG4gICAgICAgIGNvbnN0IHN0YXRlID0gVVNfU1RBVEVTLmZpbmQocyA9PiBzLmlkLnRvU3RyaW5nKCkgPT09IHN0YXRlSWQ/LnRvU3RyaW5nKCkpO1xuICAgICAgICByZXR1cm4gc3RhdGUgPyBzdGF0ZS5hYmJyIDogJyc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVhZCBjdXJyZW50IHByb2R1Y3Qgb3B0aW9uIHNlbGVjdGlvbnMgZnJvbSB0aGUgYWRkLXRvLWNhcnQgZm9ybS5cbiAgICAgKiBSZXR1cm5zIGFuIG9iamVjdCBvZiB7IGF0dHJpYnV0ZUlkOiB2YWx1ZSB9IHBhaXJzLlxuICAgICAqL1xuICAgIGdldE9wdGlvblNlbGVjdGlvbnMoKSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7fTtcbiAgICAgICAgY29uc3QgJGZvcm0gPSAkKCdmb3JtW2RhdGEtY2FydC1pdGVtLWFkZF0nKTtcbiAgICAgICAgJGZvcm0uZmluZCgnW25hbWVePVwiYXR0cmlidXRlW1wiXScpLmVhY2goKF8sIGVsKSA9PiB7XG4gICAgICAgICAgICBjb25zdCAkZWwgPSAkKGVsKTtcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSAkZWwuYXR0cignbmFtZScpO1xuICAgICAgICAgICAgY29uc3QgbWF0Y2ggPSBuYW1lLm1hdGNoKC9hdHRyaWJ1dGVcXFsoXFxkKylcXF0vKTtcbiAgICAgICAgICAgIGlmICghbWF0Y2gpIHJldHVybjtcblxuICAgICAgICAgICAgY29uc3QgYXR0cklkID0gbWF0Y2hbMV07XG4gICAgICAgICAgICBpZiAoJGVsLmlzKCc6cmFkaW8nKSB8fCAkZWwuaXMoJzpjaGVja2JveCcpKSB7XG4gICAgICAgICAgICAgICAgaWYgKCRlbC5pcygnOmNoZWNrZWQnKSkge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zW2F0dHJJZF0gPSAkZWwudmFsKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWwgPSAkZWwudmFsKCk7XG4gICAgICAgICAgICAgICAgaWYgKHZhbCAhPT0gdW5kZWZpbmVkICYmIHZhbCAhPT0gbnVsbCAmJiB2YWwgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnNbYXR0cklkXSA9IHZhbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gb3B0aW9ucztcbiAgICB9XG5cbiAgICAvLyAtLS0gQ29yZSBBUEkgZmxvdyAtLS1cblxuICAgIC8qKlxuICAgICAqIFRocmVlLXN0ZXAgZmxvdzogYWRkIHRlbXAgY2FydCBpdGVtIC0+IGZldGNoIHF1b3RlcyAtPiByZW1vdmUgdGVtcCBpdGVtLlxuICAgICAqIEtlZXBzIHRoZSByZWFsIGNhcnQgdW5hZmZlY3RlZC5cbiAgICAgKi9cbiAgICBhc3luYyBjYWxjdWxhdGVTaGlwcGluZyhzdGF0ZUlkLCB6aXAsIHNob3VsZFNhdmUgPSB0cnVlKSB7XG4gICAgICAgIGlmICghdGhpcy5wcm9kdWN0SWQpIHJldHVybjtcblxuICAgICAgICB0aGlzLmlzTG9hZGluZyA9IHRydWU7XG4gICAgICAgIHRoaXMuc2hvd0xvYWRpbmcoKTtcbiAgICAgICAgdGhpcy5jbGVhckVycm9yKCk7XG4gICAgICAgIHRoaXMudXBkYXRlU3VibWl0U3RhdGUoKTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuZ2V0T3B0aW9uU2VsZWN0aW9ucygpO1xuXG4gICAgICAgICAgICAvLyBCdWlsZCBmb3JtIGRhdGEgbWF0Y2hpbmcgc3RlbmNpbC11dGlscyBleHBlY3RhdGlvbnNcbiAgICAgICAgICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoJ2FjdGlvbicsICdhZGQnKTtcbiAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZCgncHJvZHVjdF9pZCcsIHRoaXMucHJvZHVjdElkKTtcbiAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZCgncXR5W10nLCB0aGlzLm1pblF0eSk7XG5cbiAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKG9wdGlvbnMpLmZvckVhY2goKFtvcHRpb25JZCwgdmFsdWVdKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChgYXR0cmlidXRlWyR7b3B0aW9uSWR9XWAsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gU3RlcCAxOiBhZGQgcHJvZHVjdCB0byBjYXJ0XG4gICAgICAgICAgICBjb25zdCBhZGRSZXN1bHQgPSBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgdXRpbHMuYXBpLmNhcnQuaXRlbUFkZChmb3JtRGF0YSwgKGVyciwgcmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycikgcmV0dXJuIHJlamVjdChuZXcgRXJyb3IoZXJyLm1lc3NhZ2UgfHwgJ0ZhaWxlZCB0byBhZGQgaXRlbScpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlICYmIHJlc3BvbnNlLmRhdGEgJiYgcmVzcG9uc2UuZGF0YS5lcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdChuZXcgRXJyb3IocmVzcG9uc2UuZGF0YS5lcnJvcikpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGNhcnRJdGVtSWQgPSBhZGRSZXN1bHQgJiYgYWRkUmVzdWx0LmRhdGEgJiYgYWRkUmVzdWx0LmRhdGEuY2FydF9pdGVtXG4gICAgICAgICAgICAgICAgPyBhZGRSZXN1bHQuZGF0YS5jYXJ0X2l0ZW0uaWRcbiAgICAgICAgICAgICAgICA6IG51bGw7XG5cbiAgICAgICAgICAgIC8vIFN0ZXAgMjogZ2V0IHNoaXBwaW5nIHF1b3Rlc1xuICAgICAgICAgICAgY29uc3Qgc2hpcHBpbmdQYXJhbXMgPSB7XG4gICAgICAgICAgICAgICAgY291bnRyeV9pZDogMjI2LFxuICAgICAgICAgICAgICAgIHN0YXRlX2lkOiBzdGF0ZUlkLFxuICAgICAgICAgICAgICAgIHppcF9jb2RlOiB6aXAsXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCBxdW90ZXNSZXN1bHQgPSBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgdXRpbHMuYXBpLmNhcnQuZ2V0U2hpcHBpbmdRdW90ZXMoc2hpcHBpbmdQYXJhbXMsICdjYXJ0L3NoaXBwaW5nLXF1b3RlcycsIChlcnIsIHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHJldHVybiByZWplY3QobmV3IEVycm9yKCdGYWlsZWQgdG8gZ2V0IHNoaXBwaW5nIHF1b3RlcycpKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gU3RlcCAzOiByZW1vdmUgdGVtcCBjYXJ0IGl0ZW1cbiAgICAgICAgICAgIGlmIChjYXJ0SXRlbUlkKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHV0aWxzLmFwaS5jYXJ0Lml0ZW1SZW1vdmUoY2FydEl0ZW1JZCwgKCkgPT4gcmVzb2x2ZSgpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgcXVvdGVzID0gdGhpcy5wYXJzZVNoaXBwaW5nUXVvdGVzKFxuICAgICAgICAgICAgICAgIChxdW90ZXNSZXN1bHQgJiYgcXVvdGVzUmVzdWx0LmNvbnRlbnQpIHx8IHF1b3Rlc1Jlc3VsdCxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLnF1b3RlcyA9IHF1b3RlcztcblxuICAgICAgICAgICAgaWYgKHNob3VsZFNhdmUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdGF0ZU9iaiA9IFVTX1NUQVRFUy5maW5kKHMgPT4gcy5pZC50b1N0cmluZygpID09PSBzdGF0ZUlkPy50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICBzYXZlU2hpcHBpbmdMb2NhdGlvbih7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlOiBzdGF0ZU9iaiA/IHN0YXRlT2JqLm5hbWUgOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVJZDogcGFyc2VJbnQoc3RhdGVJZCwgMTApLFxuICAgICAgICAgICAgICAgICAgICB6aXAsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuaGlkZUZvcm0oKTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyUXVvdGVzKHF1b3Rlcyk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignW1NoaXBwaW5nQ2FsY10gRXJyb3I6JywgZXJyKTtcbiAgICAgICAgICAgIHRoaXMuc2hvd0Vycm9yKGVyci5tZXNzYWdlIHx8ICdVbmFibGUgdG8gY2FsY3VsYXRlIHNoaXBwaW5nJyk7XG4gICAgICAgICAgICB0aGlzLnF1b3RlcyA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmhpZGVSZXN1bHRzKCk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5oaWRlTG9hZGluZygpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVTdWJtaXRTdGF0ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGFyc2UgdGhlIEJpZ0NvbW1lcmNlIHNoaXBwaW5nLXF1b3RlcyBIVE1MIGludG8gYSBzaW1wbGUgYXJyYXkuXG4gICAgICovXG4gICAgcGFyc2VTaGlwcGluZ1F1b3RlcyhodG1sQ29udGVudCkge1xuICAgICAgICBpZiAoIWh0bWxDb250ZW50KSByZXR1cm4gW107XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBET01QYXJzZXIoKTtcbiAgICAgICAgICAgIGNvbnN0IGRvYyA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcoaHRtbENvbnRlbnQsICd0ZXh0L2h0bWwnKTtcbiAgICAgICAgICAgIGNvbnN0IHF1b3RlcyA9IFtdO1xuXG4gICAgICAgICAgICBkb2MucXVlcnlTZWxlY3RvckFsbCgnLmVzdGltYXRvci1mb3JtLXJvdywgbGknKS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxhYmVsRWwgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5lc3RpbWF0b3ItZm9ybS1sYWJlbC10ZXh0LCBsYWJlbCcpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHByaWNlRWwgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5lc3RpbWF0b3ItZm9ybS1pbnB1dC0tcHJpY2UgYiwgLnByaWNlJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5wdXRFbCA9IGl0ZW0ucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cInJhZGlvXCJdJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAobGFiZWxFbCAmJiBwcmljZUVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSAobGFiZWxFbC50ZXh0Q29udGVudCB8fCAnJykudHJpbSgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwcmljZSA9IChwcmljZUVsLnRleHRDb250ZW50IHx8ICcnKS50cmltKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gaW5wdXRFbCA/IGlucHV0RWwudmFsdWUgOiAnJztcblxuICAgICAgICAgICAgICAgICAgICBpZiAobmFtZSAmJiBwcmljZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcXVvdGVzLnB1c2goeyBpZCwgbmFtZSwgcHJpY2UgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKHF1b3Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXh0ID0gKGRvYy5ib2R5ICYmIGRvYy5ib2R5LnRleHRDb250ZW50KSB8fCAnJztcbiAgICAgICAgICAgICAgICBjb25zdCBwcmljZU1hdGNoZXMgPSB0ZXh0Lm1hdGNoKC9cXCRbXFxkLC5dKy9nKTtcbiAgICAgICAgICAgICAgICBpZiAocHJpY2VNYXRjaGVzICYmIHByaWNlTWF0Y2hlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHF1b3Rlcy5wdXNoKHsgaWQ6ICdmYWxsYmFjaycsIG5hbWU6ICdTaGlwcGluZycsIHByaWNlOiBwcmljZU1hdGNoZXNbMF0gfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcXVvdGVzO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tTaGlwcGluZ0NhbGNdIFBhcnNlIGVycm9yOicsIGVycik7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyAtLS0gRE9NIG1hbmlwdWxhdGlvbiAtLS1cblxuICAgIHJlbmRlclF1b3RlcyhxdW90ZXMpIHtcbiAgICAgICAgdGhpcy4kcmVzdWx0cy5lbXB0eSgpO1xuICAgICAgICB0aGlzLiRlbXB0eS5oaWRlKCk7XG5cbiAgICAgICAgaWYgKHF1b3Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuJHJlc3VsdHMuaGlkZSgpO1xuICAgICAgICAgICAgdGhpcy4kZW1wdHkuc2hvdygpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcXVvdGVzLmZvckVhY2gocXVvdGUgPT4ge1xuICAgICAgICAgICAgY29uc3QgJG9wdGlvbiA9ICQoXG4gICAgICAgICAgICAgICAgYDxkaXYgY2xhc3M9XCJwZHAtc2hpcHBpbmctY2FsY19fb3B0aW9uXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicGRwLXNoaXBwaW5nLWNhbGNfX29wdGlvbi1uYW1lXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInBkcC1zaGlwcGluZy1jYWxjX19vcHRpb24tcHJpY2VcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9kaXY+YCxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICAkb3B0aW9uLmZpbmQoJy5wZHAtc2hpcHBpbmctY2FsY19fb3B0aW9uLW5hbWUnKS50ZXh0KHF1b3RlLm5hbWUpO1xuICAgICAgICAgICAgJG9wdGlvbi5maW5kKCcucGRwLXNoaXBwaW5nLWNhbGNfX29wdGlvbi1wcmljZScpLnRleHQocXVvdGUucHJpY2UpO1xuICAgICAgICAgICAgdGhpcy4kcmVzdWx0cy5hcHBlbmQoJG9wdGlvbik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuJHJlc3VsdHMuc2hvdygpO1xuICAgICAgICB0aGlzLnVwZGF0ZVRpdGxlKCk7XG4gICAgfVxuXG4gICAgdXBkYXRlVGl0bGUoKSB7XG4gICAgICAgIGlmICghdGhpcy5pc0VkaXRpbmcgJiYgdGhpcy5xdW90ZXMgJiYgdGhpcy5zZWxlY3RlZFN0YXRlICYmIHRoaXMuemlwQ29kZSkge1xuICAgICAgICAgICAgY29uc3QgYWJiciA9IHRoaXMuZ2V0U3RhdGVOYW1lKHRoaXMuc2VsZWN0ZWRTdGF0ZSk7XG4gICAgICAgICAgICB0aGlzLiR0aXRsZS5odG1sKGBTaGlwcGluZyB0byA8c3Ryb25nPiR7YWJicn0gJHt0aGlzLnppcENvZGV9PC9zdHJvbmc+YCk7XG4gICAgICAgICAgICB0aGlzLiRlZGl0QnRuLnNob3coKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuJHRpdGxlLnRleHQoJ0NhbGN1bGF0ZSBTaGlwcGluZycpO1xuICAgICAgICAgICAgdGhpcy4kZWRpdEJ0bi5oaWRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzaG93Rm9ybSgpIHtcbiAgICAgICAgdGhpcy5pc0VkaXRpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLiRmb3JtLnNob3coKTtcbiAgICAgICAgdGhpcy51cGRhdGVUaXRsZSgpO1xuICAgICAgICB0aGlzLnVwZGF0ZVN1Ym1pdFN0YXRlKCk7XG4gICAgfVxuXG4gICAgaGlkZUZvcm0oKSB7XG4gICAgICAgIHRoaXMuaXNFZGl0aW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuJGZvcm0uaGlkZSgpO1xuICAgICAgICB0aGlzLnVwZGF0ZVRpdGxlKCk7XG4gICAgfVxuXG4gICAgc2hvd0xvYWRpbmcoKSB7XG4gICAgICAgIGlmICghdGhpcy5pc0VkaXRpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuJGxvYWRpbmcuc2hvdygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuJHN1Ym1pdEJ0bi5maW5kKCdbZGF0YS1jYWxjLWJ0bi10ZXh0XScpLnRleHQoJycpO1xuICAgICAgICB0aGlzLiRzdWJtaXRCdG4uZmluZCgnW2RhdGEtY2FsYy1idG4tc3Bpbm5lcl0nKS5zaG93KCk7XG4gICAgfVxuXG4gICAgaGlkZUxvYWRpbmcoKSB7XG4gICAgICAgIHRoaXMuJGxvYWRpbmcuaGlkZSgpO1xuICAgICAgICB0aGlzLiRzdWJtaXRCdG4uZmluZCgnW2RhdGEtY2FsYy1idG4tdGV4dF0nKS50ZXh0KCdHZXQgUmF0ZXMnKTtcbiAgICAgICAgdGhpcy4kc3VibWl0QnRuLmZpbmQoJ1tkYXRhLWNhbGMtYnRuLXNwaW5uZXJdJykuaGlkZSgpO1xuICAgIH1cblxuICAgIHNob3dFcnJvcihtZXNzYWdlKSB7XG4gICAgICAgIHRoaXMuJGVycm9yLnRleHQobWVzc2FnZSkuc2hvdygpO1xuICAgIH1cblxuICAgIGNsZWFyRXJyb3IoKSB7XG4gICAgICAgIHRoaXMuJGVycm9yLnRleHQoJycpLmhpZGUoKTtcbiAgICB9XG5cbiAgICBoaWRlUmVzdWx0cygpIHtcbiAgICAgICAgdGhpcy4kcmVzdWx0cy5oaWRlKCk7XG4gICAgICAgIHRoaXMuJGVtcHR5LmhpZGUoKTtcbiAgICB9XG59XG5cbi8vIC0tLSBsb2NhbFN0b3JhZ2UgaGVscGVycyAtLS1cblxuZnVuY3Rpb24gZ2V0U2F2ZWRTaGlwcGluZ0xvY2F0aW9uKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHNhdmVkID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oU0hJUFBJTkdfTE9DQVRJT05fS0VZKTtcbiAgICAgICAgaWYgKCFzYXZlZCkgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgY29uc3QgcGFyc2VkID0gSlNPTi5wYXJzZShzYXZlZCk7XG4gICAgICAgIGlmICghcGFyc2VkLnN0YXRlSWQgfHwgIXBhcnNlZC56aXApIHJldHVybiBudWxsO1xuXG4gICAgICAgIHJldHVybiBwYXJzZWQ7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gc2F2ZVNoaXBwaW5nTG9jYXRpb24obG9jYXRpb24pIHtcbiAgICB0cnkge1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShTSElQUElOR19MT0NBVElPTl9LRVksIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHN0YXRlOiBsb2NhdGlvbi5zdGF0ZSB8fCAnJyxcbiAgICAgICAgICAgIHN0YXRlSWQ6IGxvY2F0aW9uLnN0YXRlSWQsXG4gICAgICAgICAgICB6aXA6IGxvY2F0aW9uLnppcCxcbiAgICAgICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgICAgICAgfSkpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAvLyBsb2NhbFN0b3JhZ2UgbWF5IGJlIHVuYXZhaWxhYmxlXG4gICAgfVxufVxuIiwiaW1wb3J0IG5vZCBmcm9tICcuLi9jb21tb24vbm9kJztcbmltcG9ydCB7IENvbGxhcHNpYmxlRXZlbnRzIH0gZnJvbSAnLi4vY29tbW9uL2NvbGxhcHNpYmxlJztcbmltcG9ydCBmb3JtcyBmcm9tICcuLi9jb21tb24vbW9kZWxzL2Zvcm1zJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICAgIGNvbnN0cnVjdG9yKCRyZXZpZXdGb3JtKSB7XG4gICAgICAgIHRoaXMudmFsaWRhdG9yID0gbm9kKHtcbiAgICAgICAgICAgIHN1Ym1pdDogJHJldmlld0Zvcm0uZmluZCgnaW5wdXRbdHlwZT1cInN1Ym1pdFwiXScpLFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiRyZXZpZXdzQ29udGVudCA9ICQoJyNwcm9kdWN0LXJldmlld3MnKTtcbiAgICAgICAgdGhpcy4kY29sbGFwc2libGUgPSAkKCdbZGF0YS1jb2xsYXBzaWJsZV0nLCB0aGlzLiRyZXZpZXdzQ29udGVudCk7XG5cbiAgICAgICAgdGhpcy5pbml0TGlua0JpbmQoKTtcbiAgICAgICAgdGhpcy5pbmplY3RQYWdpbmF0aW9uTGluaygpO1xuICAgICAgICB0aGlzLmNvbGxhcHNlUmV2aWV3cygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE9uIGluaXRpYWwgcGFnZSBsb2FkLCB0aGUgdXNlciBjbGlja3Mgb24gXCIoMTIgUmV2aWV3cylcIiBsaW5rXG4gICAgICogVGhlIGJyb3dzZXIganVtcHMgdG8gdGhlIHJldmlldyBwYWdlIGFuZCBzaG91bGQgZXhwYW5kIHRoZSByZXZpZXdzIHNlY3Rpb25cbiAgICAgKi9cbiAgICBpbml0TGlua0JpbmQoKSB7XG4gICAgICAgIGNvbnN0ICRjb250ZW50ID0gJCgnI3Byb2R1Y3RSZXZpZXdzLWNvbnRlbnQnLCB0aGlzLiRyZXZpZXdzQ29udGVudCk7XG5cbiAgICAgICAgJCgnLnByb2R1Y3RWaWV3LXJldmlld0xpbmsnKS5vbignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICAkKCcucHJvZHVjdFZpZXctcmV2aWV3VGFiTGluaycpLnRyaWdnZXIoJ2NsaWNrJyk7XG4gICAgICAgICAgICBpZiAoISRjb250ZW50Lmhhc0NsYXNzKCdpcy1vcGVuJykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLiRjb2xsYXBzaWJsZS50cmlnZ2VyKENvbGxhcHNpYmxlRXZlbnRzLmNsaWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29sbGFwc2VSZXZpZXdzKCkge1xuICAgICAgICAvLyBXZSdyZSBpbiBwYWdpbmF0aW5nIHN0YXRlLCBkbyBub3QgY29sbGFwc2VcbiAgICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5oYXNoICYmIHdpbmRvdy5sb2NhdGlvbi5oYXNoLmluZGV4T2YoJyNwcm9kdWN0LXJldmlld3MnKSA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZm9yY2UgY29sbGFwc2Ugb24gcGFnZSBsb2FkXG4gICAgICAgIHRoaXMuJGNvbGxhcHNpYmxlLnRyaWdnZXIoQ29sbGFwc2libGVFdmVudHMuY2xpY2spO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluamVjdCBJRCBpbnRvIHRoZSBwYWdpbmF0aW9uIGxpbmtcbiAgICAgKi9cbiAgICBpbmplY3RQYWdpbmF0aW9uTGluaygpIHtcbiAgICAgICAgY29uc3QgJG5leHRMaW5rID0gJCgnLnBhZ2luYXRpb24taXRlbS0tbmV4dCAucGFnaW5hdGlvbi1saW5rJywgdGhpcy4kcmV2aWV3c0NvbnRlbnQpO1xuICAgICAgICBjb25zdCAkcHJldkxpbmsgPSAkKCcucGFnaW5hdGlvbi1pdGVtLS1wcmV2aW91cyAucGFnaW5hdGlvbi1saW5rJywgdGhpcy4kcmV2aWV3c0NvbnRlbnQpO1xuXG4gICAgICAgIGlmICgkbmV4dExpbmsubGVuZ3RoKSB7XG4gICAgICAgICAgICAkbmV4dExpbmsuYXR0cignaHJlZicsIGAkeyRuZXh0TGluay5hdHRyKCdocmVmJyl9ICNwcm9kdWN0LXJldmlld3NgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkcHJldkxpbmsubGVuZ3RoKSB7XG4gICAgICAgICAgICAkcHJldkxpbmsuYXR0cignaHJlZicsIGAkeyRwcmV2TGluay5hdHRyKCdocmVmJyl9ICNwcm9kdWN0LXJldmlld3NgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlZ2lzdGVyVmFsaWRhdGlvbihjb250ZXh0KSB7XG4gICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgIHRoaXMudmFsaWRhdG9yLmFkZChbe1xuICAgICAgICAgICAgc2VsZWN0b3I6ICdbbmFtZT1cInJldnJhdGluZ1wiXScsXG4gICAgICAgICAgICB2YWxpZGF0ZTogJ3ByZXNlbmNlJyxcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogdGhpcy5jb250ZXh0LnJldmlld1JhdGluZyxcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgc2VsZWN0b3I6ICdbbmFtZT1cInJldnRpdGxlXCJdJyxcbiAgICAgICAgICAgIHZhbGlkYXRlOiAncHJlc2VuY2UnLFxuICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiB0aGlzLmNvbnRleHQucmV2aWV3U3ViamVjdCxcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgc2VsZWN0b3I6ICdbbmFtZT1cInJldnRleHRcIl0nLFxuICAgICAgICAgICAgdmFsaWRhdGU6ICdwcmVzZW5jZScsXG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6IHRoaXMuY29udGV4dC5yZXZpZXdDb21tZW50LFxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBzZWxlY3RvcjogJ1tuYW1lPVwiZW1haWxcIl0nLFxuICAgICAgICAgICAgdmFsaWRhdGU6IChjYiwgdmFsKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gZm9ybXMuZW1haWwodmFsKTtcbiAgICAgICAgICAgICAgICBjYihyZXN1bHQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogdGhpcy5jb250ZXh0LnJldmlld0VtYWlsLFxuICAgICAgICB9XSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMudmFsaWRhdG9yO1xuICAgIH1cblxuICAgIHZhbGlkYXRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy52YWxpZGF0b3IucGVyZm9ybUNoZWNrKCk7XG4gICAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFZpZGVvR2FsbGVyeSB7XG4gICAgY29uc3RydWN0b3IoJGVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy4kcGxheWVyID0gJGVsZW1lbnQuZmluZCgnW2RhdGEtdmlkZW8tcGxheWVyXScpO1xuICAgICAgICB0aGlzLiR2aWRlb3MgPSAkZWxlbWVudC5maW5kKCdbZGF0YS12aWRlby1pdGVtXScpO1xuICAgICAgICB0aGlzLmN1cnJlbnRWaWRlbyA9IHt9O1xuICAgICAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgICB9XG5cbiAgICBzZWxlY3ROZXdWaWRlbyhlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBjb25zdCAkdGFyZ2V0ID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuXG4gICAgICAgIHRoaXMuY3VycmVudFZpZGVvID0ge1xuICAgICAgICAgICAgaWQ6ICR0YXJnZXQuZGF0YSgndmlkZW9JZCcpLFxuICAgICAgICAgICAgJHNlbGVjdGVkVGh1bWI6ICR0YXJnZXQsXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5zZXRNYWluVmlkZW8oKTtcbiAgICAgICAgdGhpcy5zZXRBY3RpdmVUaHVtYigpO1xuICAgIH1cblxuICAgIHNldE1haW5WaWRlbygpIHtcbiAgICAgICAgdGhpcy4kcGxheWVyLmF0dHIoJ3NyYycsIGAvL3d3dy55b3V0dWJlLmNvbS9lbWJlZC8ke3RoaXMuY3VycmVudFZpZGVvLmlkfWApO1xuICAgIH1cblxuICAgIHNldEFjdGl2ZVRodW1iKCkge1xuICAgICAgICB0aGlzLiR2aWRlb3MucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICB0aGlzLmN1cnJlbnRWaWRlby4kc2VsZWN0ZWRUaHVtYi5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgfVxuXG4gICAgYmluZEV2ZW50cygpIHtcbiAgICAgICAgdGhpcy4kdmlkZW9zLm9uKCdjbGljaycsIHRoaXMuc2VsZWN0TmV3VmlkZW8uYmluZCh0aGlzKSk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB2aWRlb0dhbGxlcnkoKSB7XG4gICAgY29uc3QgcGx1Z2luS2V5ID0gJ3ZpZGVvLWdhbGxlcnknO1xuICAgIGNvbnN0ICR2aWRlb0dhbGxlcnkgPSAkKGBbZGF0YS0ke3BsdWdpbktleX1dYCk7XG5cbiAgICAkdmlkZW9HYWxsZXJ5LmVhY2goKGluZGV4LCBlbGVtZW50KSA9PiB7XG4gICAgICAgIGNvbnN0ICRlbCA9ICQoZWxlbWVudCk7XG4gICAgICAgIGNvbnN0IGlzSW5pdGlhbGl6ZWQgPSAkZWwuZGF0YShwbHVnaW5LZXkpIGluc3RhbmNlb2YgVmlkZW9HYWxsZXJ5O1xuXG4gICAgICAgIGlmIChpc0luaXRpYWxpemVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAkZWwuZGF0YShwbHVnaW5LZXksIG5ldyBWaWRlb0dhbGxlcnkoJGVsKSk7XG4gICAgfSk7XG59XG4iLCIvLyBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1vYmplY3QtdmFsdWVzLWVudHJpZXNcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgJGVudHJpZXMgPSByZXF1aXJlKCcuL19vYmplY3QtdG8tYXJyYXknKSh0cnVlKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdPYmplY3QnLCB7XG4gIGVudHJpZXM6IGZ1bmN0aW9uIGVudHJpZXMoaXQpIHtcbiAgICByZXR1cm4gJGVudHJpZXMoaXQpO1xuICB9XG59KTtcbiJdLCJuYW1lcyI6WyJub2QiLCJmb3JtcyIsImlucHV0VGFnTmFtZXMiLCJjbGFzc2lmeUlucHV0IiwiaW5wdXQiLCJmb3JtRmllbGRDbGFzcyIsIiRpbnB1dCIsIiQiLCIkZm9ybUZpZWxkIiwicGFyZW50IiwidGFnTmFtZSIsInByb3AiLCJ0b0xvd2VyQ2FzZSIsImNsYXNzTmFtZSIsInNwZWNpZmljQ2xhc3NOYW1lIiwiaW5wdXRUeXBlIiwiX2luY2x1ZGVzIiwiX2NhbWVsQ2FzZSIsIl9jYXBpdGFsaXplIiwiYWRkQ2xhc3MiLCJjbGFzc2lmeUZvcm0iLCJmb3JtU2VsZWN0b3IiLCJvcHRpb25zIiwiJGZvcm0iLCIkaW5wdXRzIiwiZmluZCIsImpvaW4iLCJfb3B0aW9ucyIsIl9vcHRpb25zJGZvcm1GaWVsZENsYSIsImVhY2giLCJfXyIsImdldEZpZWxkSWQiLCIkZmllbGQiLCJmaWVsZElkIiwibWF0Y2giLCJsZW5ndGgiLCJpbnNlcnRTdGF0ZUhpZGRlbkZpZWxkIiwiJHN0YXRlRmllbGQiLCJzdGF0ZUZpZWxkQXR0cnMiLCJ0eXBlIiwibmFtZSIsInZhbHVlIiwiYWZ0ZXIiLCJWYWxpZGF0b3JzIiwic2V0RW1haWxWYWxpZGF0aW9uIiwidmFsaWRhdG9yIiwiZmllbGQiLCJhZGQiLCJzZWxlY3RvciIsInZhbGlkYXRlIiwiY2IiLCJ2YWwiLCJyZXN1bHQiLCJlbWFpbCIsImVycm9yTWVzc2FnZSIsInNldFBhc3N3b3JkVmFsaWRhdGlvbiIsInBhc3N3b3JkU2VsZWN0b3IiLCJwYXNzd29yZDJTZWxlY3RvciIsInJlcXVpcmVtZW50cyIsImlzT3B0aW9uYWwiLCIkcGFzc3dvcmQiLCJwYXNzd29yZFZhbGlkYXRpb25zIiwiUmVnRXhwIiwiYWxwaGEiLCJudW1lcmljIiwibWlubGVuZ3RoIiwiZXJyb3IiLCJzZXRNaW5NYXhQcmljZVZhbGlkYXRpb24iLCJzZWxlY3RvcnMiLCJlcnJvclNlbGVjdG9yIiwiZmllbGRzZXRTZWxlY3RvciIsIm1heFByaWNlU2VsZWN0b3IiLCJtaW5QcmljZVNlbGVjdG9yIiwiY29uZmlndXJlIiwiZm9ybSIsInByZXZlbnRTdWJtaXQiLCJzdWNjZXNzQ2xhc3MiLCJzZXRNZXNzYWdlT3B0aW9ucyIsImVycm9yU3BhbiIsInNldFN0YXRlQ291bnRyeVZhbGlkYXRpb24iLCJjbGVhblVwU3RhdGVWYWxpZGF0aW9uIiwiJGZpZWxkQ2xhc3NFbGVtZW50IiwiZGF0YSIsIk9iamVjdCIsImtleXMiLCJjbGFzc2VzIiwiZm9yRWFjaCIsImhhc0NsYXNzIiwicmVtb3ZlQ2xhc3MiLCJQYWdlTWFuYWdlciIsIlJldmlldyIsImNvbGxhcHNpYmxlRmFjdG9yeSIsIlByb2R1Y3REZXRhaWxzIiwidmlkZW9HYWxsZXJ5IiwiUERQU2hpcHBpbmdDYWxjdWxhdG9yIiwiUHJvZHVjdCIsIl9QYWdlTWFuYWdlciIsImNvbnRleHQiLCJfdGhpcyIsImNhbGwiLCJ1cmwiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhyZWYiLCIkcmV2aWV3TGluayIsIiRidWxrUHJpY2luZ0xpbmsiLCJfaW5oZXJpdHNMb29zZSIsIl9wcm90byIsInByb3RvdHlwZSIsIm9uUmVhZHkiLCJfdGhpczIiLCJkb2N1bWVudCIsIm9uIiwiaW5kZXhPZiIsImhpc3RvcnkiLCJyZXBsYWNlU3RhdGUiLCJ0aXRsZSIsInBhdGhuYW1lIiwicHJvZHVjdERldGFpbHMiLCJCQ0RhdGEiLCJwcm9kdWN0X2F0dHJpYnV0ZXMiLCJzZXRQcm9kdWN0VmFyaWFudCIsIiRyZXZpZXdGb3JtIiwicmV2aWV3IiwicmVnaXN0ZXJWYWxpZGF0aW9uIiwicGVyZm9ybUNoZWNrIiwiYXJlQWxsIiwiJHNoaXBwaW5nQ2FsYyIsInNoaXBwaW5nQ2FsY3VsYXRvciIsInByb2R1Y3RSZXZpZXdIYW5kbGVyIiwiYnVsa1ByaWNpbmdIYW5kbGVyIiwidHJpZ2dlciIsImRlZmF1bHQiLCJlIiwidCIsInIiLCJTeW1ib2wiLCJuIiwiaXRlcmF0b3IiLCJvIiwidG9TdHJpbmdUYWciLCJpIiwiYyIsIkdlbmVyYXRvciIsInUiLCJjcmVhdGUiLCJfcmVnZW5lcmF0b3JEZWZpbmUyIiwiZiIsInAiLCJ5IiwiRyIsInYiLCJhIiwiZCIsImJpbmQiLCJsIiwiVHlwZUVycm9yIiwiZG9uZSIsInJldHVybiIsIkdlbmVyYXRvckZ1bmN0aW9uIiwiR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUiLCJnZXRQcm90b3R5cGVPZiIsInNldFByb3RvdHlwZU9mIiwiX19wcm90b19fIiwiZGlzcGxheU5hbWUiLCJfcmVnZW5lcmF0b3IiLCJ3IiwibSIsImRlZmluZVByb3BlcnR5IiwiX3JlZ2VuZXJhdG9yRGVmaW5lIiwiX2ludm9rZSIsImVudW1lcmFibGUiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsImFzeW5jR2VuZXJhdG9yU3RlcCIsIlByb21pc2UiLCJyZXNvbHZlIiwidGhlbiIsIl9hc3luY1RvR2VuZXJhdG9yIiwiYXJndW1lbnRzIiwiYXBwbHkiLCJfbmV4dCIsIl90aHJvdyIsInV0aWxzIiwiU0hJUFBJTkdfTE9DQVRJT05fS0VZIiwiVVNfU1RBVEVTIiwiaWQiLCJhYmJyIiwiJGNvbnRhaW5lciIsInByb2R1Y3RJZCIsIm1pblF0eSIsInBhcnNlSW50IiwiaXNFZGl0aW5nIiwiaXNMb2FkaW5nIiwic2VsZWN0ZWRTdGF0ZSIsInppcENvZGUiLCJxdW90ZXMiLCJyZWNhbGNUaW1lciIsIiR0aXRsZSIsIiRlZGl0QnRuIiwiJHN0YXRlU2VsZWN0IiwiJHppcElucHV0IiwiJHN1Ym1pdEJ0biIsIiRlcnJvciIsIiRsb2FkaW5nIiwiJHJlc3VsdHMiLCIkZW1wdHkiLCJwb3B1bGF0ZVN0YXRlT3B0aW9ucyIsImJpbmRFdmVudHMiLCJsb2FkU2F2ZWRMb2NhdGlvbiIsImZyYWdtZW50IiwiY3JlYXRlRG9jdW1lbnRGcmFnbWVudCIsInN0YXRlIiwib3B0IiwiY3JlYXRlRWxlbWVudCIsInRleHRDb250ZW50IiwiYXBwZW5kQ2hpbGQiLCJhcHBlbmQiLCJwcmV2ZW50RGVmYXVsdCIsInN0b3BQcm9wYWdhdGlvbiIsImNhblN1Ym1pdCIsImNhbGN1bGF0ZVNoaXBwaW5nIiwic2hvd0Zvcm0iLCJjbGVhckVycm9yIiwidXBkYXRlU3VibWl0U3RhdGUiLCJyZXBsYWNlIiwic2xpY2UiLCJ0b2dnbGVDbGFzcyIsImlzVmFsaWRaaXAiLCJrZXkiLCJvbk9wdGlvbnNDaGFuZ2VkIiwic2F2ZWQiLCJnZXRTYXZlZFNoaXBwaW5nTG9jYXRpb24iLCJzdGF0ZUlkIiwiemlwIiwidG9TdHJpbmciLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwidGVzdCIsImdldFN0YXRlTmFtZSIsInMiLCJnZXRPcHRpb25TZWxlY3Rpb25zIiwiXyIsImVsIiwiJGVsIiwiYXR0ciIsImF0dHJJZCIsImlzIiwidW5kZWZpbmVkIiwiX2NhbGN1bGF0ZVNoaXBwaW5nIiwiX2NhbGxlZSIsInNob3VsZFNhdmUiLCJmb3JtRGF0YSIsImFkZFJlc3VsdCIsImNhcnRJdGVtSWQiLCJzaGlwcGluZ1BhcmFtcyIsInF1b3Rlc1Jlc3VsdCIsInN0YXRlT2JqIiwiX3QiLCJfY29udGV4dCIsInNob3dMb2FkaW5nIiwiRm9ybURhdGEiLCJlbnRyaWVzIiwiX3JlZiIsIm9wdGlvbklkIiwicmVqZWN0IiwiYXBpIiwiY2FydCIsIml0ZW1BZGQiLCJlcnIiLCJyZXNwb25zZSIsIkVycm9yIiwibWVzc2FnZSIsImNhcnRfaXRlbSIsImNvdW50cnlfaWQiLCJzdGF0ZV9pZCIsInppcF9jb2RlIiwiZ2V0U2hpcHBpbmdRdW90ZXMiLCJpdGVtUmVtb3ZlIiwicGFyc2VTaGlwcGluZ1F1b3RlcyIsImNvbnRlbnQiLCJzYXZlU2hpcHBpbmdMb2NhdGlvbiIsImhpZGVGb3JtIiwicmVuZGVyUXVvdGVzIiwiY29uc29sZSIsInNob3dFcnJvciIsImhpZGVSZXN1bHRzIiwiaGlkZUxvYWRpbmciLCJfeCIsIl94MiIsIl94MyIsImh0bWxDb250ZW50IiwicGFyc2VyIiwiRE9NUGFyc2VyIiwiZG9jIiwicGFyc2VGcm9tU3RyaW5nIiwicXVlcnlTZWxlY3RvckFsbCIsIml0ZW0iLCJsYWJlbEVsIiwicXVlcnlTZWxlY3RvciIsInByaWNlRWwiLCJpbnB1dEVsIiwidHJpbSIsInByaWNlIiwicHVzaCIsInRleHQiLCJib2R5IiwicHJpY2VNYXRjaGVzIiwiX3RoaXMzIiwiZW1wdHkiLCJoaWRlIiwic2hvdyIsInF1b3RlIiwiJG9wdGlvbiIsInVwZGF0ZVRpdGxlIiwiaHRtbCIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJwYXJzZWQiLCJKU09OIiwicGFyc2UiLCJzZXRJdGVtIiwic3RyaW5naWZ5IiwidGltZXN0YW1wIiwiRGF0ZSIsIm5vdyIsIkNvbGxhcHNpYmxlRXZlbnRzIiwiX2RlZmF1bHQiLCJzdWJtaXQiLCIkcmV2aWV3c0NvbnRlbnQiLCIkY29sbGFwc2libGUiLCJpbml0TGlua0JpbmQiLCJpbmplY3RQYWdpbmF0aW9uTGluayIsImNvbGxhcHNlUmV2aWV3cyIsIiRjb250ZW50IiwiY2xpY2siLCJoYXNoIiwiJG5leHRMaW5rIiwiJHByZXZMaW5rIiwicmV2aWV3UmF0aW5nIiwicmV2aWV3U3ViamVjdCIsInJldmlld0NvbW1lbnQiLCJyZXZpZXdFbWFpbCIsIlZpZGVvR2FsbGVyeSIsIiRlbGVtZW50IiwiJHBsYXllciIsIiR2aWRlb3MiLCJjdXJyZW50VmlkZW8iLCJzZWxlY3ROZXdWaWRlbyIsIiR0YXJnZXQiLCJjdXJyZW50VGFyZ2V0IiwiJHNlbGVjdGVkVGh1bWIiLCJzZXRNYWluVmlkZW8iLCJzZXRBY3RpdmVUaHVtYiIsInBsdWdpbktleSIsIiR2aWRlb0dhbGxlcnkiLCJpbmRleCIsImVsZW1lbnQiLCJpc0luaXRpYWxpemVkIl0sInNvdXJjZVJvb3QiOiIifQ==