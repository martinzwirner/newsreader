class Filters extends React.Component {

  render() {
    return (
      <div className='filters'>
        <HostFilter setFilter={this.props.setFilter} />
        <LanguageFilter setFilter={this.props.setFilter} />
        <LengthFilter setFilter={this.props.setFilter} />
      </div>
    );
    // language, lenght, created
  }
}

class HostFilter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    myGlobals.hostsCollection.getAll()
    .then((response) => {
      this.setState({hosts: response.body(), loaded: true});
    });
  }

  setFilter(e) {

    console.log('HostFilter');
    const value = e.target.value === "" ? undefined : e.target.value;
    this.props.setFilter({ hostId: value });
  }

  render() {

    if (!this.state.loaded) {

      return (<option>Loading...</option>);
    }

    let sortedHosts = this.state.hosts.sort
    ((a, b) => {
      const aData = a.data();
      const bData = b.data();
      return aData.hostname.localeCompare(bData.hostname);
    });
    let hostElements = sortedHosts.map((host) => {

      return <option key={host.data().id} value={host.data().id}>{host.data().hostname}</option>;
    });

    return (
      <select onChange={this.setFilter.bind(this)}>
        <option value="">Filter by hostname...</option>
        {hostElements}
      </select>
    );
  }
}

class LanguageFilter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    myGlobals.languageCollection.getAll()
    .then((response) => {
      this.setState({items: response.body(), loaded: true});
    });
  }

  setFilter(e) {

    const value = e.target.value === "" ? undefined : e.target.value;
    this.props.setFilter({ languageCode: value });
  }

  render() {

    if (!this.state.loaded) {

      return (<option>Loading...</option>);
    }

    let sortedItems = this.state.items.sort((a, b) => a.data().priorityValue - b.data().priorityValue);
    let elements = sortedItems.map((item) => {

      return <option key={item.data().code} value={item.data().code}>{item.data().code}</option>;
    });

    return (
      <select onChange={this.setFilter.bind(this)}>
        <option value="">Filter by language...</option>
        {elements}
      </select>
    );
  }
}

class LengthFilter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  setFilter(e) {

    const value = e.target.value === "" ? undefined : e.target.value;
    this.props.setFilter({ contentLengthInCharacters: value });
  }

  render() {

    return (
      <span>
        Max Length: <input type="text" onChange={this.setFilter.bind(this)} />
      </span>
    );
  }
}
