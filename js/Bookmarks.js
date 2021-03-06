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
    params.orderby = props.sorting;
    params.count = 500; // TODO: make configurable
    console.log('params: ', params);

    myGlobals.bookmarksCollection.getAll(params)
    .then((response) => {
      const range = response.headers()['content-range'];
      const bookmarks = response.body();
      this.setState({range: range, bookmarks: bookmarks, loaded: true});
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
      return this.props.isExport ?
        <ExportBookmark key={bookmark.data().id} data={bookmark} /> :
        <Bookmark key={bookmark.data().id} data={bookmark} updateList={this.updateList.bind(this)} />;
    });

    return (
      <div className='bookmarks'>
        <div className="stats">
          Displaying {this.state.range}
        </div>
        {bookmarkElements}
      </div>
    );
  }
};
