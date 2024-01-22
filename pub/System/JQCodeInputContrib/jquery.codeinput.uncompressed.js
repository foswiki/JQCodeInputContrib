/*
 * jQuery CodeInput 1.03
 *
 * Copyright (c) 2018-2024 Michael Daum https://michaeldaumconsulting.com
 *
 * Foswiki - The Free and Open Source Wiki, http://foswiki.org/
 *
 * Copyright (C) 2018-2019 Foswiki Contributors. Foswiki Contributors
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
    separator: "",
    placeholder: "",
    group: 0,
    autoSubmit: false
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

    if (self.opts.group) {
      self.container.addClass("jqCodeInputGrouped"+self.opts.group);
    }

    len = parseInt(self.elem.attr("size"), 10);
    
    val = self.elem.val().split("");
    
    self.chars = [];
    for(i = 0; i < len; i++) {
      self.chars[i] = $("<input type='text' size='1' class='jqCodeInputChar' placeholder='"+self.opts.placeholder+"' />")
        .appendTo(self.container)
        .data("index", i)
        .val(val[i] === " " ? "" : val[i])
        .prop("autocomplete", "off")
        .on("keydown", function(ev) {
          return self.onKeyDown(ev, this);
        })
        .on("click dblclick", function() {
          var $this = $(this),
              index = $this.data("index");
          setTimeout(function() {
            self.select(index);
          });
        });

      if (i+1 < len) {
        self.container.append("<span class='jqCodeInputSeparator'>"+self.opts.separator+"</span>");
      }
    }

    if (typeof(self.opts.focusChar) !== 'undefined' && self.opts.focusChar >= 0 && self.opts.focusChar < len) {
      self.select(self.opts.focusChar);
    }
  };

  // 

  // updates the value of one char elem
  CodeInput.prototype.setVal = function(val, i) {
    var self = this;

    if (i < 0 || i > self.chars.length) {
      return;
    }
    self.chars[i].val(val);
    if (self.updateVal() && self.opts.autoSubmit && self.chars.length == i+1) {
      //console.log("auto-submitting ...");
      self.elem[0].form.submit();
    }
  };

  // select char elem i
  CodeInput.prototype.select = function(index) {
    var self = this,
        elem = self.chars[index];

    //console.log("focusing ",index);
    self.container.find(".jqCodeInputChar").removeClass("jqCodeInputCharFocused");
    elem.addClass("jqCodeInputCharFocused").focus();
  };

  // unselect all char elems
  CodeInput.prototype.unselectAll = function() {
    var self = this;

    self.container.find(".jqCodeInputChar").removeClass("jqCodeInputCharFocused").blur();
  };

  // updates the value of elem to the chars in the char elems
  CodeInput.prototype.updateVal = function(val) {
    var self = this, 
        i, ch, 
        complete = true,
        len = self.chars.length;

    if (typeof(val) === 'undefined') {
      val = "";
      for (i = 0; i < len; i++) {
        ch = self.chars[i].val();
        if (ch === "") {
          ch = " ";
          complete = false;
        }
        val += ch;
      }
    }

    self.elem.val(val);

    return complete;
  };

  // set the i

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
          self.setVal("", index);
          self.setVal("", index-1);
          nextIndex = index -1;
          preventDefault = true;
          break
        case 9: // tab
        case 13: // return
          break;
        case 32: // space
          self.setVal("", index);
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
          self.setVal("", index);
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
      return false;
    }
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
    $(".jqCodeInput").livequery(function() {
      $(this).codeInput();
    });
  });

})(jQuery);

