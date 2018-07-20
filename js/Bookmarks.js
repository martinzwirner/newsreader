class Bookmarks extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {

    this.loadData(this.props);
  }

  componentWillReceiveProps(nextProps) {

    this.loadData(nextProps);
  }

  loadData(props) {

    const params = props.data;
    params.isProcessed = true;
    params.isViewed = false;
    params.orderby = props.sorting;
    console.log('params: ', params);

    myGlobals.bookmarksCollection.getAll(params)
    .then((response) => {
      const bookmarks = response.body();
      this.setState({bookmarks: bookmarks, loaded: true});
    });
  }

  updateList() {

    this.loadData(this.props);
  }

  render() {

    if (!this.state.loaded) {

      return (<span>Loading...</span>);
    }

    //let sortedBookmarks = this.state.bookmarks.sort((a, b) => a.data().calculatedPriority - b.data().calculatedPriority);
    let bookmarkElements = this.state.bookmarks.map((bookmark) => {
      return <Bookmark key={bookmark.data().id} data={bookmark} updateList={this.updateList.bind(this)} />;
    });

    return (
      <div className="bookmarks">
        <div className="stats">
          Displaying {this.state.bookmarks.length} bookmarks
        </div>
        {bookmarkElements}
      </div>
    );
  }
};
