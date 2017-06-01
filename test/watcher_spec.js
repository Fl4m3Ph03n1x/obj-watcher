"use strict";

const watcherFactory = require("../src/watcher.js");
const expect = require("chai")
    .expect;
const sinon = require("sinon");

describe("watcher", () => {

    const watcher = Object.assign({}, watcherFactory());
    const testObj = {
        online: false
    };
    const callback = () => {};

    beforeEach("reset map", () => watcher.reset());

    it("should watch an object", () => {
        watcher.watch("status", testObj);
        expect(watcher.get("status")).to.not.be.undefined;
    });

    it("should throw if we ask to watch a repeated object", () => {
        watcher.watch("status", testObj);
        expect(watcher.watch.bind(null, "status", testObj)).to.throw(Error);
    });

    it("should unwatch an object", () => {
        watcher.watch("status", testObj);
        watcher.unwatch("status");
        expect(watcher.get.bind(null, "status")).to.throw(Error);
    });

    it("should throw when unwatch an object that is not registered", () => {
        expect(watcher.unwatch.bind(null, "status")).to.throw(Error);
    });

    it("should get a copy of the watch object", () => {
        watcher.watch("status", testObj);
        const obj2 = watcher.get("status");

        expect(obj2 === testObj).to.be.false;
        expect(obj2).to.eql(testObj);
    });

    it("should throw when we 'get' an object not being watched", () => {
        expect(watcher.get.bind(null, "bananas")).to.throw(Error);
    });

    it("should change the saved object when we 'set' it", () => {
        watcher.watch("status", testObj);
        const newObj = {
            bananas: "fruit"
        };

        watcher.set("status", newObj);
        expect(watcher.get("status")).to.eql(newObj);
    });

    it("should throw if we try to 'set' an object not being watched", () => {
        expect(watcher.set.bind(null, "bananas", testObj)).to.throw(Error);
    });

    it("should 'set' the callback with the function we pass", () => {
        watcher.watch("status", testObj);
        const spy = sinon.spy(watcher, "setOnChange");

        watcher.setOnChange("status", callback);

        expect(spy.calledOnce).to.be.true;
        expect(spy.calledWith("status", callback)).to.be.true;
    });

    it("should throw if we try to'set' the callback for a non-watched object", () => {
        expect(watcher.setOnChange.bind(null, "bananas", callback)).to.throw(Error);
    });

    it("should throw if the callback parameter is not a function", () => {
        watcher.watch("status", testObj);
        expect(watcher.setOnChange.bind(null, "status", "notACallback!")).to.throw(Error);
    });

    it("should call the callback when the object changes via 'set'", () => {
        watcher.watch("status", testObj);
        const spy = sinon.spy();
        watcher.setOnChange("status", spy);
        watcher.set("status", {});

        expect(spy.called).to.be.true;
    });

    it("should reset", () => {
        watcher.reset();
        expect(watcher.get.bind(null, "status")).to.throw(Error);
    });
});
