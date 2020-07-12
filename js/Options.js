class Options extends React.Component {

  render() {
    return (
      <div className='options'>
        <DateFilter filters={this.props.filters} setFilter={this.props.setFilter} />
        <PriorityFilter filters={this.props.filters} setFilter={this.props.setFilter} />
        <ContentTypeFilter filters={this.props.filters} setFilter={this.props.setFilter} />
        <LengthFilter filters={this.props.filters} setFilter={this.props.setFilter} />
        <Sorting sorting={this.props.sorting} setSorting={this.props.setSorting} />
        <div>
          <IsViewedFilter filters={this.props.filters} setFilter={this.props.setFilter} />
          <View isExport={this.props.isExport} setIsExport={this.props.setIsExport} />
        </div>
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
      <div>
        <span className="label">Sorting</span>
        <select value={this.props.sorting} onChange={this.setSorting.bind(this)}>
          <option value="">Sort by...</option>
          <option value="title">Title</option>
          <option value="url">URL</option>
          <option value="contentLengthInCharacters">Content length</option>
          <option value="-createdAt">Date added</option>
          <option value="tagName">Tag</option>
        </select>
      </div>
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

  setMinFilter(e) {

    this.props.setFilter({ minLength: e.target.value });
  }

  setMaxFilter(e) {

    this.props.setFilter({ maxLength: e.target.value });
  }

  render() {

    return (
      <div>
        <span className="label">Length</span>
        Min length: <input type="text" className="minLength" value={this.props.filters.minLength} onChange={this.setMinFilter.bind(this)} />
        Max length: <input type="text" className="maxLength" value={this.props.filters.maxLength} onChange={this.setMaxFilter.bind(this)} />
      </div>
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
      <div>
        <span className="label">Date</span>
        From: <input type="date" name="minCreatedAt" value={min}
                     onChange={this.setDate.bind(this, 'minCreatedAt')} />
        To: <input type="date" name="maxCreatedAt" value={max}
                     onChange={this.setDate.bind(this, 'maxCreatedAt')} />
      </div>
    );
  }
}

class PriorityFilter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  setMinFilter(e) {

    const value = e.target.value === "" ? undefined : e.target.value;
    this.props.setFilter({ minPriority: value });
  }

  setMaxFilter(e) {

    const value = e.target.value === "" ? undefined : e.target.value;
    this.props.setFilter({ maxPriority: value });
  }

  render() {

    return (
      <div>
        <span className="label">Priority</span>
        Min prio:
        <select value={this.props.filters.minPriority} onChange={this.setMinFilter.bind(this)}>
          <option value="">Min priority...</option>
          <option value="20">Low</option>
          <option value="15">Normal</option>
          <option value="10">High</option>
          <option value="8">Higher</option>
          <option value="5">Urgent</option>
          <option value="4">Super urgent</option>
          <option value="2">Immediate</option>
        </select>
        Max prio:
        <select value={this.props.filters.maxPriority} onChange={this.setMaxFilter.bind(this)}>
          <option value="">Min priority...</option>
          <option value="20">Low</option>
          <option value="15">Normal</option>
          <option value="10">High</option>
          <option value="8">Higher</option>
          <option value="5">Urgent</option>
          <option value="4">Super urgent</option>
          <option value="2">Immediate</option>
        </select>
      </div>
    );
  }
}
class TagFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  setFilter(e) {
    const value = e.target.value === "" ? undefined : e.target.value;
    this.props.setFilter({ tagName: value });
  }
  render() {
    return (
      <div>
        <span className="label">Tag</span>
        <select value={this.props.filters.tagName} onChange={this.setFilter.bind(this)}>
            <option value="">-</option>
            <option value="Abschiebungen/Abschottung">Abschiebungen/Abschottung</option>
            <option value="Armut/Ungleichheit">Armut/Ungleichheit</option>
            <option value="Datenschutz/Privatsph�re">Datenschutz/Privatsph�re</option>
            <option value="Feminismus/Sexismus">Feminismus/Sexismus</option>
            <option value="Klimawandel">Klimawandel</option>
            <option value="Medien">Medien</option>
            <option value="Nachhaltigkeit/Umweltschutz">Nachhaltigkeit/Umweltschutz</option>
            <option value="Polizei/Geheimdienste">Polizei/Geheimdienste</option>
            <option value="Rassismus/Rechtsextremismus">Rassismus/Rechtsextremismus</option>
            <option value="Rechtsruck/Faschismus">Rechtsruck/Faschismus</option>
            <option value="Tierrechte/Veganismus">Tierrechte/Veganismus</option>
            <option value="Wissenschaft">Wissenschaft</option>
        </select>
      </div>
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
      <div>
        <span className="label">Content Type</span>
        <select value={this.props.filters.contentType} onChange={this.setFilter.bind(this)}>
          <option value="">Content type...</option>
          <option value="">All</option>
          <option value="text">Texts</option>
          <option value="video">Videos</option>
          <option value="audio">Audios</option>
        </select>
      </div>
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
class IsViewedFilter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  setFilter(e) {

    this.props.setFilter({ isViewed: e.target.checked });
  }

  render() {

    return (
      <span>
        <span className="label">Options</span>
        <input type="checkbox" checked={this.props.filters.isViewed} onChange={this.setFilter.bind(this)} />Show viewed items
      </span>
    );
  }
}

