class Options extends React.Component {

  render() {
    return (
      <div className='options'>
        <Sorting value={this.props.sorting} setSorting={this.props.setSorting} />
        <HostFilter filters={this.props.filters} setFilter={this.props.setFilter} />
        <LanguageFilter filters={this.props.filters} setFilter={this.props.setFilter} />
        <LengthFilter filters={this.props.filters} setFilter={this.props.setFilter} />
        <DateFilter filters={this.props.filters} setFilter={this.props.setFilter} />
      </div>
    );
    // language, lenght, created
  }
}

class Sorting extends React.Component {

  setSorting(e) {

    const selectedValue = e.target.value;

    if (selectedValue === "") {

      this.props.setSorting();
      return;
    }

    this.props.setSorting(selectedValue);
  }

  render() {

    return (
      <select onChange={this.setSorting.bind(this)}>
        <option value="">Sort by...</option>
        <option value="title">Title</option>
        <option value="contentLengthInCharacters">Content length</option>
        <option value="-createdAt">Date added</option>
      </select>
    );
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

    const value = e.target.value;
    let minLength, maxLength;
    if (value !== "") {
      const parts = value.split('-');
      minLength = parts[0];
      maxLength = parts[1]
    }
    this.props.setFilter({ minLength: minLength, maxLength: maxLength });
  }

  render() {

    return (
      <select onChange={this.setFilter.bind(this)}>
        <option value="">Filter by length...</option>
        <option value="0-2000">Short</option>
        <option value="2001-7000">Middle</option>
        <option value="7000">long</option>
      </select>
    );
  }
}

class DateFilter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  setFilter(e) {

    const selectedValue = e.target.value;

    if (selectedValue === "") {

      this.props.setFilter({ minCreatedAt: undefined });
      return;
    }

    const date = moment().startOf("days").subtract(selectedValue - 1, "days");
    const realdate = date.toDate();
    const timestamp = realdate.getTime();
    this.props.setFilter({ minCreatedAt: realdate });
  }

  render() {

    return (
      <select onChange={this.setFilter.bind(this)}>
        <option value="">Filter by age...</option>
        <option value="1">Today</option>
        <option value="2">Yesterday</option>
        <option value="7">This week</option>
        <option value="14">Two weeks</option>
        <option value="30">One month</option>
        <option value="60">Two months</option>
        <option value="9999">All time</option>
      </select>
    );
  }
}
