class Options extends React.Component {

  render() {
    return (
      <div className='options'>
        <DateFilter filters={this.props.filters} setFilter={this.props.setFilter} />
        <PriorityFilter filters={this.props.filters} setFilter={this.props.setFilter} />
        <ContentTypeFilter filters={this.props.filters} setFilter={this.props.setFilter} />
        <LengthFilter filters={this.props.filters} setFilter={this.props.setFilter} /><br />
        <Sorting sorting={this.props.sorting} setSorting={this.props.setSorting} />
        <View isExport={this.props.isExport} setIsExport={this.props.setIsExport} />
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
      <span>Sort by:
        <select value={this.props.sorting} onChange={this.setSorting.bind(this)}>
          <option value="">Sort by...</option>
          <option value="title">Title</option>
          <option value="url">URL</option>
          <option value="contentLengthInCharacters">Content length</option>
          <option value="-createdAt">Date added</option>
          <option value="tagName">Tag</option>
        </select>
      </span>
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

    this.props.setFilter({ maxLength: e.target.value });
  }

  render() {

    return (
      <span>Max length: <input type="text" className="maxLength" value={this.props.filters.maxLength} onChange={this.setFilter.bind(this)} /></span>
    );
  }
}

class DateFilter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  setDate(prop, e) {

    const selectedValue = e.target.value;

    let ts;
    if (selectedValue === "") {
      ts = undefined;
    } else {
      ts = moment(selectedValue).startOf("day").toDate().toISOString();
    }

    const newValues = {};
    newValues[prop] = ts;
    this.props.setFilter(newValues);
  }

  render() {

    const min = moment(this.props.filters.minCreatedAt).format('YYYY-MM-DD');
    const max = moment(this.props.filters.maxCreatedAt).format('YYYY-MM-DD');

    return (
      <span>
        From: <input type="date" name="minCreatedAt" value={min}
                     onChange={this.setDate.bind(this, 'minCreatedAt')} />
        To: <input type="date" name="maxCreatedAt" value={max}
                     onChange={this.setDate.bind(this, 'maxCreatedAt')} />
      </span>
    );
  }
}

class PriorityFilter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  setFilter(e) {

    const value = e.target.value === "" ? undefined : e.target.value;
    this.props.setFilter({ minPriority: value });
  }

  render() {

    return (
      <span>
        Min prio:
        <select value={this.props.filters.minPriority} onChange={this.setFilter.bind(this)}>
          <option value="">Min priority...</option>
          <option value="20">Low</option>
          <option value="15">Normal</option>
          <option value="10">High</option>
        </select>
      </span>
    );
  }
}

class ContentTypeFilter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  setFilter(e) {

    const value = e.target.value === "" ? undefined : e.target.value;
    this.props.setFilter({ contentType: value });
  }

  render() {

    return (
      <span>
        Type:
        <select value={this.props.filters.contentType} onChange={this.setFilter.bind(this)}>
          <option value="">Content type...</option>
          <option value="">All</option>
          <option value="text">Texts</option>
          <option value="video">Videos</option>
        </select>
      </span>
    );
  }
}

class View extends React.Component {

  setIsExport(e) {

    this.props.setIsExport(e.target.checked);
  }

  render() {

    return (
      <span><input type="checkbox" defaultChecked={this.props.isExport}
                   onChange={this.setIsExport.bind(this)} /> Export</span>
    );
  }
}
