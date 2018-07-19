"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// EventableComponent provides event handling methods such as @listenTo and @stopListening
var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _this.state = {
      filters: _this.getEffectiveFilters(),
      sorting: "contentLengthInCharacters"
    };
    return _this;
  }

  _createClass(App, [{
    key: "getEffectiveFilters",
    value: function getEffectiveFilters() {

      var effectiveFilters = {
        minPriority: 15 // normal
      };

      var userFilters = localStorage.filters ? JSON.parse(localStorage.filters) : null;

      Object.assign(effectiveFilters, userFilters);

      var daysToDisplay = void 0;
      if (userFilters) {
        var duration = moment.duration(moment(userFilters.maxCreatedAt).diff(moment(userFilters.minCreatedAt)));
        daysToDisplay = duration.asDays() + 1;
      } else {
        daysToDisplay = 2;
      }

      console.log('daysToDisplay is ' + daysToDisplay);
      var today = moment().startOf("day");
      effectiveFilters.maxCreatedAt = today.toDate().getTime(); // today
      effectiveFilters.minCreatedAt = today.subtract(daysToDisplay - 1, 'days').toDate().getTime(); // x days ago

      return effectiveFilters;
    }
  }, {
    key: "setFilter",
    value: function setFilter(change) {

      var newFilters = Object.assign({}, this.state.filters, change);
      this.setState({ filters: newFilters });
      localStorage.filters = JSON.stringify(newFilters);
    }
  }, {
    key: "setSorting",
    value: function setSorting(change) {

      this.setState({ sorting: change });
      localStorage.sorting = change;
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "container" },
        React.createElement(Options, { filters: this.state.filters,
          sorting: this.state.sorting,
          setFilter: this.setFilter.bind(this),
          setSorting: this.setSorting.bind(this) }),
        React.createElement(Bookmarks, { data: this.state.filters, sorting: this.state.sorting })
      );
    }
  }]);

  return App;
}(React.Component);
//# sourceMappingURL=App.js.map