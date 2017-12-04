// EventableComponent provides event handling methods such as @listenTo and @stopListening
class App extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      filters: localStorage.filters ? JSON.parse(localStorage.filters) : {},
      sorting: localStorage.sorting || "createdAt"
    };
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
