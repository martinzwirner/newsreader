'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ExportBookmark = function (_React$Component) {
  _inherits(ExportBookmark, _React$Component);

  function ExportBookmark(props) {
    _classCallCheck(this, ExportBookmark);

    var _this = _possibleConstructorReturn(this, (ExportBookmark.__proto__ || Object.getPrototypeOf(ExportBookmark)).call(this, props));

    _this.state = {};
    return _this;
  }

  _createClass(ExportBookmark, [{
    key: 'render',
    value: function render() {

      var bookmark = this.props.data;
      var link = document.createElement('a');
      link.setAttribute('href', bookmark.data().url);

      var length = bookmark.data().contentLengthInCharacters;
      var lengthClass = length > 10000 ? "long" : length > 5000 ? "middle" : "short";

      return React.createElement(
        'div',
        { key: bookmark.data().id },
        React.createElement(
          'div',
          null,
          React.createElement('img', { src: "favicons/" + link.hostname + ".ico", width: '32', height: '32' }),
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
            { className: 'contentLength ' + lengthClass },
            bookmark.data().contentLengthInCharacters
          )
        ),
        React.createElement('br', null)
      );
    }
  }]);

  return ExportBookmark;
}(React.Component);
//# sourceMappingURL=ExportBookmark.js.map