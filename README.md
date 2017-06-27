                        _     _                      _       _               
                       | |   (_)                    | |     | |              
                   ___ | |__  _ ________      ____ _| |_ ___| |__   ___ _ __
                  / _ \| '_ \| |______\ \ /\ / / _` | __/ __| '_ \ / _ \ '__|
                 | (_) | |_) | |       \ V  V / (_| | || (__| | | |  __/ |   
                  \___/|_.__/| |        \_/\_/ \__,_|\__\___|_| |_|\___|_|   
                            _/ |                                             
                           |__/                                              



[![NPM](https://nodei.co/npm/obj-watcher.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/obj-watcher/)

[![Build Status](https://travis-ci.org/Fl4m3Ph03n1x/obj-watcher.svg?branch=master)](https://travis-ci.org/Fl4m3Ph03n1x/obj-watcher)
[![codecov](https://codecov.io/gh/Fl4m3Ph03n1x/obj-watcher/branch/master/graph/badge.svg)](https://codecov.io/gh/Fl4m3Ph03n1x/obj-watcher)
[![Inline docs](http://inch-ci.org/github/Fl4m3Ph03n1x/obj-watcher.svg?branch=master)](http://inch-ci.org/github/Fl4m3Ph03n1x/obj-watcher)
[![JavaScript Style Guide: Good Parts](https://img.shields.io/badge/code%20style-goodparts-brightgreen.svg?style=flat)](https://github.com/dwyl/goodparts "JavaScript The Good Parts")

# What is `obj-watcher.js` ?

`watcher.js` is a small library that allows you to take action when a watched
variable changes and to execute callbacks when it happens.

# Why `obj-watcher.js` ?

With ECMA 2015 you can easily do this using a Proxy, however this approach has
some problems:

1. When you use a [Proxy](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
every time you change an object, the Proxy fires. This is good if you change the object one  property
at a time, but in cases were you change multiple properties at the same time, you get
spammed with repeated events and there is nothing you can do about it. Alternative
libraries exist which try to deal with this via timers, but the solution is overall
cluncky and error prone. `obj-watcher.js` makes sure that each time you modify an object,
no matter how many properties change, you only get one event fired.
2. To use Proxies you must change the variable directly. This is prone to having
a lot of [side effects](https://github.com/ryanmcdermott/clean-code-javascript#functions)
in your code. `obj-watcher.js` makes use of [getters and setters](https://github.com/ryanmcdermott/clean-code-javascript#objects-and-data-structures)
and it promotes a declarative programming style via `Object.assign`.
3. Once you create a Proxy for a variable, you no longer know about it. In fact,
you just forget the proxy exists, which makes debugging harder. `obj-watcher.js`
makes you aware that you are dealing with a watched object.

# How to use `obj-watcher.js` ?

## Install

Run:

 - `npm install obj-watcher --save`

## API

`obj-watcher.js` offers the following methods that you can use.

 - [watch](https://fl4m3ph03n1x.github.io/obj-watcher/module-watcher.html#~watch)
 - [unwatch](https://fl4m3ph03n1x.github.io/obj-watcher/module-watcher.html#~unwatch)
 - [setOnChange](https://fl4m3ph03n1x.github.io/obj-watcher/module-watcher.html#~setOnChange)
 - [get](https://fl4m3ph03n1x.github.io/obj-watcher/module-watcher.html#~get)
 - [set](https://fl4m3ph03n1x.github.io/obj-watcher/module-watcher.html#~set)
 - [reset](https://fl4m3ph03n1x.github.io/obj-watcher/module-watcher.html#~reset)

For more information about them you can read the documentation on the library's
[official page](https://fl4m3ph03n1x.github.io/obj-watcher/).

## Example

Watch an object and `console.log` a message when it changes:

        const watcher = require("obj-watcher");

        watcher.watch("food", {fruit: "bananas"}); //watch it!
        watcher.onChange("food", (oldObj, newObj) => console.log(`I like ${newObj.fruit} better!`));

        watcher.set("food", {fruit: "oranges"});
        //I like oranges better!

## Bugs and issues

If you have any trouble or find any issues with the package, feel free to let me
know in our issue tracker:

 - https://github.com/Fl4m3Ph03n1x/obj-watcher/issues
