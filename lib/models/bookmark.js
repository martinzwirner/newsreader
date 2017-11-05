"use strict";

class Bookmark {

  constructor(uri, priority) {

    // key
    this.id = undefined;

    // required fields
    this.uri = uri;
    this.priority = priority;

    // derived values
    this.domain = undefined;

    this.type = undefined;
    this.favicon = undefined;
    this.title = undefined;
    this.image = undefined;
    this.content = undefined;

    this.lengthWords = undefined;
    this.lengthSeconds = undefined;
    this.language = undefined;

    this.articledate = undefined;
    this.bookmarkdate = Date.now();

    this.isRead = false;
    this.isDelete = false;
  }
}

exports.module = Bookmark;