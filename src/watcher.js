"use strict";

const isFunction = require("lodash.isfunction");

const errorFactory = (name, message) => {
    const error = new Error();
    error.message = message;
    error.name = name;
    return error;
};

const ObjectNotWatched = objId =>
    errorFactory("ObjectNotWatched", `Not watching Object with name ${objId}`);

const ObjectAlreadyWatched = objId =>
    errorFactory("ObjectAlreadyWatched", `Already watching Object with name ${objId}`);

const CallbackNotAFunction = objId =>
    errorFactory("CallbackNotAFunction", `Provided callback for Object with name ${objId} is not a function`);

/**
 *  @public
 *  @author Pedro Miguel P. S. Martins
 *  @version 1.1.1
 *  @module watcher
 *  @desc   Watches over changes in objects and executes callbacks when those 
 *          changes happen.
 */
const watcherFactory = () => {

    const watchMap = new Map();

    /**
     *  @public 
     *  @func   watch
     *  @param  {Object} objId          The unique id of the object we want to 
     *                                  watch over. 
     *  @param  {Object} obj            The object that will be watched.
     *  @throws {ObjectAlreadyWatched}  If the watch list is already watching an 
     *                                  object with the given `objId`.
     * 
     *  @description    Adds the following object to the watchlist with the 
     *                  given id. Although `objId`can be anyting, including 
     *                  another object, it is recommended to use a Number or a 
     *                  String instead.
     */
    const watch = (objId, obj) => {
        if (isObjWatched(objId))
            throw ObjectAlreadyWatched(objId);

        watchMap.set(objId, {
            obj: obj,
            onChange: () => {}
        });
    };

    /**
     *  @public 
     *  @func   unwatch
     *  @param  {Object}    objId       The object that will be unwatched.
     *  @throws {ObjectNotWatched}      If the watch list does not contain any 
     *                                  object with the given `objId`.
     * 
     *  @description    Removes the object with the given `objId` from the watch
     *                  list. It also deletes all callbacks associated with it.
     */
    const unwatch = objId => {
        if (!isObjWatched(objId))
            throw ObjectNotWatched(objId);
        watchMap.delete(objId);
    };

    /**
     *  @public 
     *  @func       get
     *  @param      {Object}    objId   The unique id of the object we want to 
     *                                  get.
     *  @returns    {Object}            A clone of the object with the given id. 
     *  @throws {ObjectNotWatched}      If the watch list does not contain any 
     *                                  object with the given `objId`.
     * 
     *  @description    This function returns a **clone** of the object with the
     *                  given object id. This happens so as to minize side 
     *                  effects and prevents direct object manipulation to the 
     *                  object being watched.
     */
    const get = objId => {
        if (!isObjWatched(objId))
            throw ObjectNotWatched(objId);
        return Object.assign({}, watchMap.get(objId).obj);
    };

    /**
     *  @public 
     *  @function   set
     *  @param      {Object}    objId   The id of the object we want to replace.
     *  @param      {Object}    newObj  The new object that will replace the 
     *                                  current object with the id.
     *  @throws {ObjectNotWatched}      If the watch list does not contain any 
     *                                  object with the given `objId`.
     * 
     *  @description    Replaces the object currently being watched with the 
     *                  given one. If your code has references affecting the old
     *                  object (which is very unlikely given that you always 
     *                  work with clones) they will be lost. Calls the object's 
     *                  callback passing the new object as an argument.
     */
    const set = (objId, newObj) => {
        if (!isObjWatched(objId))
            throw ObjectNotWatched(objId);

        const entry = watchMap.get(objId);
        entry.obj = Object.assign({}, newObj);
        entry.onChange(entry.obj);
    };

    /**
     *  @public 
     *  @func   setOnChange
     *  @param  {Object}    objId       The id of the object to which we want to
     *                                  attach a callback.
     *  @param  {Function}  callback    The callback to be executed when the 
     *                                  object changes via the `set` method.
     *  @throws {ObjectNotWatched}      If the watch list does not contain any 
     *                                  object with the given `objId`.
     *  @throws {CallbackNotAFunction}  If the provided callback parameter is not
     *                                  a function.
     * 
     *  @description    Sets the callback for the given object. This callback 
     *                  will be executed everytime the object changes via 
     *                  the `set` method.
     */
    const setOnChange = (objId, callback) => {
        if (!isObjWatched(objId))
            throw ObjectNotWatched(objId);
        
        if(!isFunction(callback))
            throw CallbackNotAFunction(objId);
            
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
        setOnChange,
        get,
        set,
        reset
    });
};

module.exports = watcherFactory;