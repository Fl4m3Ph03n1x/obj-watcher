"use strict";

const errorFactory = ( name, message ) => {
    const error = new Error();
    error.message = message;
    error.name = name;
    return error;
};

const ObjectNotWatched = ( objName ) =>
    errorFactory("ObjectNotWatched", `Not watching Object with name ${objName}`);

const ObjectAlreadyWatched = ( objName ) =>
    errorFactory("ObjectAlreadyWatched", `Already watching Object with name ${objName}`);

const watcherFactory = () => {

    const watchMap = new Map();

    const watch = function ( objName, obj ) {
        if ( isObjWatched( objName ) )
            throw ObjectAlreadyWatched( objName );

        watchMap.set( objName, {
            obj: obj,
            onChange: () => {}
        } );
    };

    const unwatch = function ( objName ) {
        if ( !isObjWatched( objName ) )
            throw ObjectNotWatched( objName );
        watchMap.delete( objName );
    };

    const get = function ( objName ) {
        if ( !isObjWatched( objName ) )
            throw ObjectNotWatched( objName );
        return Object.assign( {}, watchMap.get( objName ).obj );
    };

    const set = function ( objName, newObj ) {
        if ( !isObjWatched( objName ) )
            throw ObjectNotWatched( objName );

        const entry = watchMap.get( objName );
        entry.obj = Object.assign( {}, newObj );
        entry.onChange( entry.obj );
    };

    const setOnChange = function ( objName, newFn ) {
        if ( !isObjWatched( objName ) )
            throw ObjectNotWatched( objName );

        const entry = watchMap.get( objName );
        entry.onChange = newFn;
    };

    const reset = function () {
        watchMap.clear();
    };

    const isObjWatched = objName => watchMap.has( objName );

    return Object.freeze( {
        watch,
        unwatch,
        setOnChange,
        get,
        set,
        reset
    } );
};

module.exports = watcherFactory;
module.exports.ObjAlreadyWatchedException = ObjectAlreadyWatched;
module.exports.ObjNotWatchedException = ObjectNotWatched;