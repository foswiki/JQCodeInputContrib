/*
 * jQuery CodeInput 1.0
 *
 * Copyright (c) 2018 Michael Daum https://michaeldaumconsulting.com
 *
 * Foswiki - The Free and Open Source Wiki, http://foswiki.org/
 *
 * Copyright (C) 2018 Foswiki Contributors. Foswiki Contributors
 * are listed in the AUTHORS file in the root of this distribution.
 * NOTE: Please extend that file, not this notice.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version. For
 * more details read LICENSE in the root of this distribution.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *
 * As per the GPL, removal of this notice is prohibited.
 *
 */

"use strict";
(function($) {

  // Create the defaults once
  var defaults = {
    focusChar: undefined,
    allowedChars: "0123456789",
    separator: ""
  };

  // The actual plugin constructor
  function CodeInput(elem, opts) {
    var self = this;

    self.elem = $(elem);

    // gather options by merging global defaults, plugin defaults and element defaults
    self.opts = $.extend({}, defaults, self.elem.data(), opts);
    self.init();
  }

  // init the dom
  CodeInput.prototype.init = function () {
    var self = this, i, len, val;

    self.container = $("<div class='jqCodeInputContainer' />").insertAfter(self.elem);
    self.elem.prop("type", "hidden").detach().appendTo(self.container);
    len = parseInt(self.elem.attr("size"), 10);
    
    val = self.elem.val().split("");
    
    self.chars = [];
    for(i = 0; i < len; i++) {
      self.chars[i] = $("<input type='text' size='1' class='jqCodeInputChar' />")
        .appendTo(self.container)
        .data("index", i)
        .val(val[i])
        .prop("autocomplete", "off")
        .on("keydown", function(ev) {
          return self.onKeyDown(ev, this);
        })
        .on("focus click dblclick", function() {
          var $this = $(this);
          setTimeout(function() {
            $this.select();
          }, 0);
        });

      if (i+1 < len) {
        self.container.append("<span class='jqCodeInputSeparator'>"+self.opts.separator+"</span>");
      }
    }

    if (typeof(self.opts.focusChar) !== 'undefined' && self.opts.focusChar >= 0 && self.opts.focusChar < len) {
      self.select(self.opts.focusChar);
    }
  };

  // updates the value of one char elem
  CodeInput.prototype.setVal = function(val, i) {
    var self = this;

    self.chars[i].val(val);
    self.updateVal();
  };

  // select char elem i
  CodeInput.prototype.select = function(i) {
    var self = this,
        elem = self.chars[i];

    console.log("focusing ",self.chars[0]);
    self.container.find(".jqCodeInputChar").removeClass("jqCodeInputCharFocused");
    elem.focus().addClass("jqCodeInputCharFocused");
  };

  // unselect all char elems
  CodeInput.prototype.unselectAll = function() {
    var self = this;

    self.container.find(".jqCodeInputChar").removeClass("jqCodeInputCharFocused").blur();
  };

  // updates the value of elem to the chars in the char elems
  CodeInput.prototype.updateVal = function(val) {
    var self = this, i, len = self.chars.length;

    if (typeof(val) === 'undefined') {
      val = "";
      for (i = 0; i < len; i++) {
        val += self.chars[i].val();
      }
    }

    self.elem.val(val);

    return val;
  };

  // handler of keyboard interaction
  CodeInput.prototype.onKeyDown = function(ev, charElem) {
    var self = this, 
        index = $(charElem).data("index"),
        nextIndex,
        preventDefault = false;

    if (self.opts.allowedChars.indexOf(ev.key) >= 0) {
      self.setVal(ev.key, index);
      nextIndex = index + 1;
      preventDefault = true;
    } else {
      switch(ev.keyCode) {
        case 8: // backspace */
          self.chars[index].val("");
          nextIndex = index -1;
          preventDefault = true;
          break
        case 9: // tab
        case 13: // return
          break;
        case 32: // space
          self.chars[index].val("");
          nextIndex = index +1;
          preventDefault = true;
          break;
        case 35: // end
          nextIndex = self.chars.length - 1;
          preventDefault = true;
          break;
        case 36: // pos1
          nextIndex = 0;
          preventDefault = true;
          break;
        case 37: // left
          nextIndex = index -1;
          break;
        case 39: // right
          nextIndex = index +1;
          break;
        case 46: // del
          self.chars[index].val("");
          preventDefault = true;
          break;
        default:
          preventDefault = true;
      }
    }

    if (typeof(nextIndex) !== 'undefined') {
      if (nextIndex >= self.chars.length) {
        nextIndex = self.chars.length - 1;
      }
      if (nextIndex < 0) {
        nextIndex = 0;
      }
      self.select(nextIndex);
    }

    //console.log("ev=",ev,"keyCode=",ev.keyCode, "index=",index,"nextIndex=",nextIndex,"preventDefault=",preventDefault);

    if (preventDefault) {
      ev.preventDefault()
    }

    return !preventDefault;
  };

  // A plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn.codeInput = function (opts) {
    return this.each(function () {
      if (!$.data(this, "CodeInput")) {
        $.data(this, "CodeInput", new CodeInput(this, opts));
      }
    });
  };

  // Enable declarative widget instanziation
  $(function() {
    $(".jqCodeInput:not(.jqCodeInputInited)").livequery(function() {
      $(this).addClass("jqCodeInputInited").codeInput();
    });
  });

})(jQuery);

