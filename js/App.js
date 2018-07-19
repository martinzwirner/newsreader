// EventableComponent provides event handling methods such as @listenTo and @stopListening
class App extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      filters: this.getEffectiveFilters(),
      sorting: "contentLengthInCharacters"
    };
  }

  getEffectiveFilters() {

    const effectiveFilters = {
      minPriority: 15 // normal
    };

    const userFilters = localStorage.filters ? JSON.parse(localStorage.filters) : null;

    Object.assign(effectiveFilters, userFilters);

    let daysToDisplay;
    if (userFilters) {
      const duration = moment.duration(moment(userFilters.maxCreatedAt).diff(moment(userFilters.minCreatedAt)));
      daysToDisplay = duration.asDays() + 1;
    } else {
      daysToDisplay = 2;
    }

    console.log('daysToDisplay is ' + daysToDisplay);
    const today = moment().startOf("day");
    effectiveFilters.maxCreatedAt = today.toDate().getTime(); // today
    effectiveFilters.minCreatedAt = today.subtract(daysToDisplay - 1, 'days').toDate().getTime(); // x days ago

    return effectiveFilters;
  }

  setFilter(change) {

    const newFilters = Object.assign({}, this.state.filters, change);
    this.setState({ filters: newFilters });
    localStorage.filters = JSON.stringify(newFilters);
  }

  setSorting(change) {

    this.setState({ sorting: change });
    localStorage.sorting = change;
  }

  render() {
    return (
      <div className='container'>
        <Options filters={this.state.filters}
                 sorting={this.state.sorting}
                 setFilter={this.setFilter.bind(this)}
                 setSorting={this.setSorting.bind(this)} />
        <Bookmarks data={this.state.filters} sorting={this.state.sorting} />
      </div>
    );
  }
}
