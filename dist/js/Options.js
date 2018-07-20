"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Options = function (_React$Component) {
  _inherits(Options, _React$Component);

  function Options() {
    _classCallCheck(this, Options);

    return _possibleConstructorReturn(this, (Options.__proto__ || Object.getPrototypeOf(Options)).apply(this, arguments));
  }

  _createClass(Options, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "options" },
        React.createElement(DateFilter, { filters: this.props.filters, setFilter: this.props.setFilter }),
        React.createElement(PriorityFilter, { filters: this.props.filters, setFilter: this.props.setFilter }),
        React.createElement(ContentTypeFilter, { filters: this.props.filters, setFilter: this.props.setFilter })
      );
      // language, lenght, created
    }
  }]);

  return Options;
}(React.Component);

var Sorting = function (_React$Component2) {
  _inherits(Sorting, _React$Component2);

  function Sorting() {
    _classCallCheck(this, Sorting);

    return _possibleConstructorReturn(this, (Sorting.__proto__ || Object.getPrototypeOf(Sorting)).apply(this, arguments));
  }

  _createClass(Sorting, [{
    key: "setSorting",
    value: function setSorting(e) {

      var selectedValue = e.target.value;

      if (selectedValue === "") {

        this.props.setSorting();
        return;
      }

      this.props.setSorting(selectedValue);
    }
  }, {
    key: "render",
    value: function render() {

      return React.createElement(
        "select",
        { onChange: this.setSorting.bind(this) },
        React.createElement(
          "option",
          { value: "" },
          "Sort by..."
        ),
        React.createElement(
          "option",
          { value: "title" },
          "Title"
        ),
        React.createElement(
          "option",
          { value: "contentLengthInCharacters" },
          "Content length"
        ),
        React.createElement(
          "option",
          { value: "-createdAt" },
          "Date added"
        )
      );
    }
  }]);

  return Sorting;
}(React.Component);

var HostFilter = function (_React$Component3) {
  _inherits(HostFilter, _React$Component3);

  function HostFilter(props) {
    _classCallCheck(this, HostFilter);

    var _this3 = _possibleConstructorReturn(this, (HostFilter.__proto__ || Object.getPrototypeOf(HostFilter)).call(this, props));

    _this3.state = {};
    return _this3;
  }

  _createClass(HostFilter, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this4 = this;

      myGlobals.hostsCollection.getAll().then(function (response) {
        _this4.setState({ hosts: response.body(), loaded: true });
      });
    }
  }, {
    key: "setFilter",
    value: function setFilter(e) {

      console.log('HostFilter');
      var value = e.target.value === "" ? undefined : e.target.value;
      this.props.setFilter({ hostId: value });
    }
  }, {
    key: "render",
    value: function render() {

      if (!this.state.loaded) {

        return React.createElement(
          "option",
          null,
          "Loading..."
        );
      }

      var sortedHosts = this.state.hosts.sort(function (a, b) {
        var aData = a.data();
        var bData = b.data();
        return aData.hostname.localeCompare(bData.hostname);
      });
      var hostElements = sortedHosts.map(function (host) {

        return React.createElement(
          "option",
          { key: host.data().id, value: host.data().id },
          host.data().hostname
        );
      });

      return React.createElement(
        "select",
        { onChange: this.setFilter.bind(this) },
        React.createElement(
          "option",
          { value: "" },
          "Filter by hostname..."
        ),
        hostElements
      );
    }
  }]);

  return HostFilter;
}(React.Component);

var LanguageFilter = function (_React$Component4) {
  _inherits(LanguageFilter, _React$Component4);

  function LanguageFilter(props) {
    _classCallCheck(this, LanguageFilter);

    var _this5 = _possibleConstructorReturn(this, (LanguageFilter.__proto__ || Object.getPrototypeOf(LanguageFilter)).call(this, props));

    _this5.state = {};
    return _this5;
  }

  _createClass(LanguageFilter, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this6 = this;

      myGlobals.languageCollection.getAll().then(function (response) {
        _this6.setState({ items: response.body(), loaded: true });
      });
    }
  }, {
    key: "setFilter",
    value: function setFilter(e) {

      var value = e.target.value === "" ? undefined : e.target.value;
      this.props.setFilter({ languageCode: value });
    }
  }, {
    key: "render",
    value: function render() {

      if (!this.state.loaded) {

        return React.createElement(
          "option",
          null,
          "Loading..."
        );
      }

      var sortedItems = this.state.items.sort(function (a, b) {
        return a.data().priorityValue - b.data().priorityValue;
      });
      var elements = sortedItems.map(function (item) {

        return React.createElement(
          "option",
          { key: item.data().code, value: item.data().code },
          item.data().code
        );
      });

      return React.createElement(
        "select",
        { onChange: this.setFilter.bind(this) },
        React.createElement(
          "option",
          { value: "" },
          "Filter by language..."
        ),
        elements
      );
    }
  }]);

  return LanguageFilter;
}(React.Component);

var LengthFilter = function (_React$Component5) {
  _inherits(LengthFilter, _React$Component5);

  function LengthFilter(props) {
    _classCallCheck(this, LengthFilter);

    var _this7 = _possibleConstructorReturn(this, (LengthFilter.__proto__ || Object.getPrototypeOf(LengthFilter)).call(this, props));

    _this7.state = {};
    return _this7;
  }

  _createClass(LengthFilter, [{
    key: "setFilter",
    value: function setFilter(e) {

      var value = e.target.value;
      var minLength = void 0,
          maxLength = void 0;
      if (value !== "") {
        var parts = value.split('-');
        minLength = parts[0];
        maxLength = parts[1];
      }
      this.props.setFilter({ minLength: minLength, maxLength: maxLength });
    }
  }, {
    key: "render",
    value: function render() {

      return React.createElement(
        "select",
        { onChange: this.setFilter.bind(this) },
        React.createElement(
          "option",
          { value: "" },
          "Filter by length..."
        ),
        React.createElement(
          "option",
          { value: "0-2000" },
          "Short"
        ),
        React.createElement(
          "option",
          { value: "2001-7000" },
          "Middle"
        ),
        React.createElement(
          "option",
          { value: "7000" },
          "long"
        )
      );
    }
  }]);

  return LengthFilter;
}(React.Component);

var DateFilter = function (_React$Component6) {
  _inherits(DateFilter, _React$Component6);

  function DateFilter(props) {
    _classCallCheck(this, DateFilter);

    var _this8 = _possibleConstructorReturn(this, (DateFilter.__proto__ || Object.getPrototypeOf(DateFilter)).call(this, props));

    _this8.state = {};
    return _this8;
  }

  _createClass(DateFilter, [{
    key: "setDate",
    value: function setDate(prop, e) {

      var selectedValue = e.target.value;

      var ts = void 0;
      if (selectedValue === "") {
        ts = undefined;
      } else {
        ts = moment(selectedValue).startOf("day").toDate().toISOString();
      }

      var newValues = {};
      newValues[prop] = ts;
      this.props.setFilter(newValues);
    }
  }, {
    key: "render",
    value: function render() {

      var min = moment(this.props.filters.minCreatedAt).format('YYYY-MM-DD');

      return React.createElement(
        "span",
        null,
        "From: ",
        React.createElement("input", { type: "date", name: "minCreatedAt", value: min,
          onChange: this.setDate.bind(this, 'minCreatedAt') })
      );
    }
  }]);

  return DateFilter;
}(React.Component);

var PriorityFilter = function (_React$Component7) {
  _inherits(PriorityFilter, _React$Component7);

  function PriorityFilter(props) {
    _classCallCheck(this, PriorityFilter);

    var _this9 = _possibleConstructorReturn(this, (PriorityFilter.__proto__ || Object.getPrototypeOf(PriorityFilter)).call(this, props));

    _this9.state = {};
    return _this9;
  }

  _createClass(PriorityFilter, [{
    key: "setFilter",
    value: function setFilter(e) {

      var value = e.target.value === "" ? undefined : e.target.value;
      this.props.setFilter({ minPriority: value });
    }
  }, {
    key: "render",
    value: function render() {

      return React.createElement(
        "span",
        null,
        "Min prio:",
        React.createElement(
          "select",
          { value: this.props.filters.minPriority, onChange: this.setFilter.bind(this) },
          React.createElement(
            "option",
            { value: "" },
            "Min priority..."
          ),
          React.createElement(
            "option",
            { value: "20" },
            "Low"
          ),
          React.createElement(
            "option",
            { value: "15" },
            "Normal"
          ),
          React.createElement(
            "option",
            { value: "10" },
            "High"
          )
        )
      );
    }
  }]);

  return PriorityFilter;
}(React.Component);

var ContentTypeFilter = function (_React$Component8) {
  _inherits(ContentTypeFilter, _React$Component8);

  function ContentTypeFilter(props) {
    _classCallCheck(this, ContentTypeFilter);

    var _this10 = _possibleConstructorReturn(this, (ContentTypeFilter.__proto__ || Object.getPrototypeOf(ContentTypeFilter)).call(this, props));

    _this10.state = {};
    return _this10;
  }

  _createClass(ContentTypeFilter, [{
    key: "setFilter",
    value: function setFilter(e) {

      var value = e.target.value === "" ? undefined : e.target.value;
      this.props.setFilter({ contentType: value });
    }
  }, {
    key: "render",
    value: function render() {

      return React.createElement(
        "span",
        null,
        "Type:",
        React.createElement(
          "select",
          { value: this.props.filters.contentType, onChange: this.setFilter.bind(this) },
          React.createElement(
            "option",
            { value: "" },
            "Content type..."
          ),
          React.createElement(
            "option",
            { value: "" },
            "All"
          ),
          React.createElement(
            "option",
            { value: "text" },
            "Texts"
          ),
          React.createElement(
            "option",
            { value: "video" },
            "Videos"
          )
        )
      );
    }
  }]);

  return ContentTypeFilter;
}(React.Component);
//# sourceMappingURL=Options.js.map