/*
 * 
 */
/*global
 define, console
 */
/*jslint
 browser: true,
 white: true
 */
/* DOC: sample pure object widget with interface
 */
define([
    'bluebird',    
    'kb/common/dom'
],
    function (Promise, DOM) {
        "use strict";
        return Object.create({}, {
            
            init: {
                value: function (cfg) {
                    return new Promise(function (resolve) {
                        resolve();
                    }.bind(this));
                }
            },
            
            attach: {
                value: function (node) {
                    return new Promise(function (resolve) {
                        this.mount = node;
                        this.container = DOM.createElement('div');
                        DOM.append(this.mount, this.container);
                        resolve();
                    }.bind(this));
                }
            },
            
            start: {
                value: function (params) {
                    return new Promise(function (resolve) {
                        DOM.setHTML(this.container, 'Hello, I am an object widget which implements the widget interface.');
                        resolve();
                    }.bind(this));
                }
            },
            
            run: {
                value: function (params) {
                    return new Promise(function (resolve) {
                        resolve();
                    }.bind(this));
                }
            },
            
            
            stop: {
                value: function () {
                    return new Promise(function (resolve) {
                        resolve();
                    }.bind(this));
                }
            },
            
            detach: {
                value: function () {
                    return new Promise(function (resolve) {
                        resolve();
                    }.bind(this));
                }
            },
            
            destroy: {
                value: function () {
                    return new Promise(function (resolve) {
                        resolve();
                    }.bind(this));
                }
            }
    });
});