'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Bookmarks = function (_React$Component) {
  _inherits(Bookmarks, _React$Component);

  function Bookmarks(props) {
    _classCallCheck(this, Bookmarks);

    var _this = _possibleConstructorReturn(this, (Bookmarks.__proto__ || Object.getPrototypeOf(Bookmarks)).call(this, props));

    _this.state = {};
    return _this;
  }

  _createClass(Bookmarks, [{
    key: 'componentDidMount',
    value: function componentDidMount() {

      this.loadData(this.props);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {

      this.loadData(nextProps);
    }
  }, {
    key: 'loadData',
    value: function loadData(props) {
      var _this2 = this;

      var params = props.data;
      params.isProcessed = true;
      params.isViewed = false;
      params.orderby = props.sorting;
      params.count = 500; // TODO: make configurable
      console.log('params: ', params);

      myGlobals.bookmarksCollection.getAll(params).then(function (response) {
        var range = response.headers()['content-range'];
        var bookmarks = response.body();
        _this2.setState({ range: range, bookmarks: bookmarks, loaded: true });
      });
    }
  }, {
    key: 'updateList',
    value: function updateList() {

      this.loadData(this.props);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      if (!this.state.loaded) {

        return React.createElement(
          'span',
          null,
          'Loading...'
        );
      }

      //let sortedBookmarks = this.state.bookmarks.sort((a, b) => a.data().calculatedPriority - b.data().calculatedPriority);
      var bookmarkElements = this.state.bookmarks.map(function (bookmark) {
        return _this3.props.isExport ? React.createElement(ExportBookmark, { key: bookmark.data().id, data: bookmark }) : React.createElement(Bookmark, { key: bookmark.data().id, data: bookmark, updateList: _this3.updateList.bind(_this3) });
      });

      return React.createElement(
        'div',
        { className: 'bookmarks' },
        React.createElement(
          'div',
          { className: 'stats' },
          'Displaying ',
          this.state.range
        ),
        bookmarkElements
      );
    }
  }]);

  return Bookmarks;
}(React.Component);

;
//# sourceMappingURL=Bookmarks.js.map