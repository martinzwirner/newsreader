"use strict";

class PocketBookmark {

  constructor(url, timeAdded, isViewed) {

    this.url = url;
    this.timeAdded = timeAdded;
    this.isViewed = isViewed;
  }
}

module.exports = PocketBookmark;