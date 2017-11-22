"use strict";

class factory {

  constructor() {

    this._instances = new Map();
  }

  getInstance(cls) {

    return this._instances.get(cls);
  }

  setInstance(cls, instance) {

    this._instances.set(cls, instance);
  }
}

module.exports = factory;