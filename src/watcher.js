"use strict";

const isFunction = require("lodash.isfunction");

const errors = require("./errors.js");
const callbackNotAFunction = errors.callbackNotAFunction;
const objectAlreadyWatched = errors.objectAlreadyWatched;
const objectNotWatched = errors.objectNotWatched;



/**
 * @callback module:watcher~onChangeCallback
 * @param {Object}  oldObj  The old object being watched. 
 * @param {Object}  newObj  The new object that is now being watched.
 */

/**
 *  @public
 *  @author Pedro Miguel P. S. Martins
 *  @version 2.0.2
 *  @module watcher
 *  @desc   Watches over changes in objects and executes callbacks when those 
 *          changes happen.
 */
const watcherFactory = () => {

    /**
     *  @typedef {Object}    Id The unique id of the object we want to  watch over.
     *                          Can be anything, althout I strongly recommend it to 
     *                          be a primitive type, such as a <code>string</code>, 
     *                          or a <code>number</code>.
     */

    const watchMap = new Map();

    /**
     *  @public 
     *  @func   watch
     *  @param  {module:watcher~Id} objId   The unique id of the object we want 
     *                                      to watch over. 
     *  @param  {Object} obj            The object that will be watched.
     *  @throws {ObjectAlreadyWatched}  If the watch list is already watching an 
     *                                  object with the given <code>objId</code>.
     * 
     *  @description    Adds the following object to the watchlist with the 
     *                  given id.
     */
    const watch = (objId, obj) => {
        if (isObjWatched(objId))
            throw objectAlreadyWatched(objId);

        watchMap.set(objId, {
            obj: obj,

            /**
             *  @private 
             *  @function   onChange
             *  
             *  @description    Default function that runs for every new watched 
             *                  object. Does nothing and is a place hodler.
             */
            onChange: () => {}
        });
    };

    /**
     *  @public 
     *  @func   unwatch
     *  @param  {module:watcher~Id}    objId    The object that will be 
     *                                          unwatched.
     *  @throws {ObjectNotWatched}      If the watch list does not contain any 
     *                                  object with the given <code>objId</code>.
     * 
     *  @description    Removes the object with the given <code>objId</code> from the watch
     *                  list. It also deletes all callbacks associated with it.
     */
    const unwatch = objId => {
        if (!isObjWatched(objId))
            throw objectNotWatched(objId);
        watchMap.delete(objId);
    };

    /**
     *  @public 
     *  @func       get
     *  @param      {module:watcher~Id} objId   The unique id of the object we 
     *                                          want to get.
     *  @returns    {Object}            
     *  @throws {ObjectNotWatched}      If the watch list does not contain any 
     *                                  object with the given <code>objId</code>.
     * 
     *  @description    This function returns a **clone** of the object with the
     *                  given object id. This happens so as to minize side 
     *                  effects and prevents direct object manipulation to the 
     *                  object being watched.
     */
    const get = objId => {
        if (!isObjWatched(objId))
            throw objectNotWatched(objId);
        return Object.assign({}, watchMap.get(objId).obj);
    };

    /**
     *  @public 
     *  @function   set
     *  @param      {module:watcher~Id} objId   The id of the object we want to 
     *                                          replace.
     *  @param      {Object}    newObj  The new object that will replace the 
     *                                  current object with the id.
     *  @throws {ObjectNotWatched}      If the watch list does not contain any 
     *                                  object with the given <code>objId</code>.
     * 
     *  @description    Replaces the object currently being watched with the 
     *                  given one. If your code has references affecting the old
     *                  object (which is very unlikely given that you always 
     *                  work with clones) they will be lost. Calls the object's 
     *                  callback passing the new object as an argument.
     */
    const set = (objId, newObj) => {
        if (!isObjWatched(objId))
            throw objectNotWatched(objId);

        const entry = watchMap.get(objId);
        const oldObj = Object.assign({}, entry.obj);
        entry.obj = Object.assign({}, newObj);
        entry.onChange(oldObj, entry.obj);
    };

    /**
     *  @public 
     *  @func   onChange
     *  @param  {module:watcher~Id}    objId    The id of the object to which we 
     *                                          want to attach a callback.
     *  @param  {module:watcher~onChangeCallback}  callback    The callback to be executed when 
     *                                          the object changes via the 
     *                                          <code>set</code> method.
     *  @throws {ObjectNotWatched}              If the watch list does not 
     *                                          contain any object with the 
     *                                          given <code>objId</code>.
     *  @throws {CallbackNotAFunction}          If the provided callback 
     *                                          parameter is not a function.
     * 
     *  @description    Sets the callback for the given object. This callback 
     *                  will be executed everytime the object changes via 
     *                  the <code>set</code> method.
     */
    const onChange = (objId, callback) => {
        if (!isObjWatched(objId))
            throw objectNotWatched(objId);

        if (!isFunction(callback))
            throw callbackNotAFunction(objId);

        const entry = watchMap.get(objId);
        entry.onChange = callback;
    };

    /**
     *  @public 
     *  @func   reset
     * 
     *  @description    Removes all the watched objects and all their associated
     *                  callbacks. Empties the watch list. 
     */
    const reset = () => {
        watchMap.clear();
    };

    const isObjWatched = objName => watchMap.has(objName);

    return Object.freeze({
        watch,
        unwatch,
        onChange,
        get,
        set,
        reset
    });
};

module.exports = watcherFactory();
