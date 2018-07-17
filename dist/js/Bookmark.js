'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Bookmark = function (_React$Component) {
  _inherits(Bookmark, _React$Component);

  function Bookmark(props) {
    _classCallCheck(this, Bookmark);

    var _this = _possibleConstructorReturn(this, (Bookmark.__proto__ || Object.getPrototypeOf(Bookmark)).call(this, props));

    _this.state = {};
    return _this;
  }

  _createClass(Bookmark, [{
    key: 'markAsDone',
    value: function markAsDone() {

      var bookmark = this.props.data;
      bookmark.data().isViewed = true;
      bookmark.save();
      // TODO: remove from list!
    }
  }, {
    key: 'update',
    value: function update() {

      var bookmark = this.props.data;
      bookmark.data().isProcessed = false;
      bookmark.save();
    }
  }, {
    key: 'render',
    value: function render() {

      var bookmark = this.props.data;
      var link = document.createElement('a');
      link.setAttribute('href', bookmark.data().url);

      var length = bookmark.data().contentLengthInCharacters;
      var lengthClass = length > 10000 ? "long" : length > 5000 ? "middle" : "short";

      return React.createElement(
        'div',
        { className: 'bookmark', key: bookmark.data().id },
        React.createElement(
          'div',
          { className: 'favicon' },
          React.createElement('img', { src: "favicons/" + link.hostname + ".ico" })
        ),
        React.createElement(
          'div',
          { className: 'actions' },
          React.createElement(
            'button',
            { className: 'markAsDone', onClick: this.markAsDone.bind(this) },
            'r'
          ),
          React.createElement(
            'button',
            { className: 'update', onClick: this.update.bind(this) },
            'u'
          )
        ),
        React.createElement(
          'div',
          { className: 'link' },
          React.createElement(
            'a',
            { href: bookmark.data().url },
            bookmark.data().title || "(No title)"
          )
        ),
        React.createElement(
          'div',
          { className: 'metaData' },
          React.createElement(
            'div',
            { className: 'hostname' },
            link.hostname
          ),
          React.createElement(
            'div',
            { className: 'languageCode ' + bookmark.data().languageCode },
            bookmark.data().languageCode || "?"
          ),
          React.createElement(
            'div',
            { className: 'contentLength ' + lengthClass },
            bookmark.data().contentLengthInCharacters
          ),
          React.createElement(
            'div',
            { className: 'priority' },
            bookmark.data().priorityValue
          ),
          React.createElement(
            'div',
            { className: 'createdAt' },
            moment(bookmark.data().createdAt).format("DD.MM.YYYY")
          )
        )
      );
    }
  }]);

  return Bookmark;
}(React.Component);
//# sourceMappingURL=Bookmark.js.map