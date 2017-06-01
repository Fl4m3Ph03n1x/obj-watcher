# Watcher.js 

# What is `watcher.js` ?

`watcher.js` is a small library that allows you to take action when a watched 
variables changes and to execute callbacks when it happens.

# Why `watcher.js` ?

With ECMA 2015 you can easily do this using a Proxy, however this approach a few
problems:

1. When you use a [Proxy](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
every time you change an object, the Proxy fires. This is good if you change a property
at a time, but in cases were you change multiple proerties at the same time, you get
spammed with repeated events and there is nothing you can do abbout it. Alternative
libraries exists which try to deal with this via timers, but the solution is overall 
cluncky and error prone. `watcher.js` makes sure that each time you modify an object, 
not matter how many properties change, you only get one event fired.
2. To use proxies you must change the variable directly. This is prone to having 
a lot of [side effects](https://github.com/ryanmcdermott/clean-code-javascript#functions) 
in your code. `watcher.js` makes use of [getters and setters](https://github.com/ryanmcdermott/clean-code-javascript#objects-and-data-structures)
and it promotes a declarative programming style via `Object.assign`. 
3. Once you create a proxy for a variable, you no longer know about it. In fact, 
you just forget the proxy exists, which makes debugging harder. `watcher.js` 
makes you aware that you are dealing with a watched object.

# How to use `watcher.js` ?

## API

## Examples