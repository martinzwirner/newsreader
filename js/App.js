// EventableComponent provides event handling methods such as @listenTo and @stopListening
class App extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      filters: {
        hostname: undefined
      }
    };
  }

  setFilter(change) {

    //console.log('App.setFilter');
    this.setState({ filters: Object.assign({}, this.state.filters, change)});
  }

  render() {
    return (
      <div className='container'>
        <h1>Newsreader</h1>
        <Filters setFilter={this.setFilter.bind(this)} />
        <Bookmarks data={this.state.filters} />
      </div>
    );
  }
}
