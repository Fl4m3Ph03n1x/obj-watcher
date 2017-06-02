                        _     _                      _       _               
                       | |   (_)                    | |     | |              
                   ___ | |__  _ ________      ____ _| |_ ___| |__   ___ _ __ 
                  / _ \| '_ \| |______\ \ /\ / / _` | __/ __| '_ \ / _ \ '__|
                 | (_) | |_) | |       \ V  V / (_| | || (__| | | |  __/ |   
                  \___/|_.__/| |        \_/\_/ \__,_|\__\___|_| |_|\___|_|   
                            _/ |                                             
                           |__/                                              
                


# What is `obj-watcher.js` ?

`watcher.js` is a small library that allows you to take action when a watched 
variables changes and to execute callbacks when it happens.

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

## Usage Cases

Watch an object and `console.log` a message when it changes:

        const watcherFactory = require("obj-watcher");
        const watcher = watcherFactory();
        
        watcher.watch("food", {fruit: "bananas"}); //watch it!
        watcher.setOnChange("food", newObj => console.log(`I like ${newObj.fruit} better!`));
        
        watcher.set("food", {fruit: "oranges"});
        //I like oranges better!
        

Watch an object and `console.log` a message when it changes and then unwatch it:

        const watcherFactory = require("obj-watcher");
        const watcher = watcherFactory();
        
        watcher.watch("food", {fruit: "bananas"}); //watch it!
        watcher.setOnChange("food", newObj => console.log(`I like ${newObj.fruit} better!`));
        
        watcher.set("food", {fruit: "oranges"});
        //I like oranges better!
        
        watcher.unwatch("food");
        watcher.get("food");
        //throws error !
        
`obj-watcher` can also be used with testing libraries like [sinon](http://sinonjs.org/)
to test if objects were changed:
        
        const assert = require("assert");
        const sinon = require("sinon");
        const watcherFactory = require("obj-watcher");
        const watcher = watcherFactory();
        
        const spy = sinon.spy();
        watcher.watch("food", {fruit: "bananas"}); //watch it!
        watcher.setOnChange("food", spy);
        
        watcher.set("food", {fruit: "oranges"});
        //I like oranges better!
        
        assert.equal(spy.called, true);
        