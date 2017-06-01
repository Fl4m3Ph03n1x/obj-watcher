"use strict";

const autobahn = require( "autobahn" );

const crossbarServer = () => {

    let connection;

    const connect = function ( connectOpts ) {
        return new Promise( resolve => {
            connection = new autobahn.Connection( connectOpts );
            connection.onopen = () => resolve();
            connection.open();
        } );
    };

    const disconnect = function () {
        return new Promise( resolve => {
            connection.onclose = () => resolve();
            connection.close();
        } );
    };

    const getSession = function () {
        return connection.session;
    };
    const getConnection = function () {
        return connection;
    };

    const registerRPCs = async function ( rpcList ) {
        for ( const rpc of rpcList ) {
            await connection.session.register( rpc.name, rpc.func )
                .catch( err => {
                    throw new Error( `Failed to register "${rpc.name}":
                      ${JSON.stringify(err)}` );
                } );
        }
    };

    return Object.freeze( {
        connect,
        disconnect,
        getSession,
        getConnection,
        registerRPCs
    } );
};

module.exports = crossbarServer;