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

    const filters = props.data;
    filters.isProcessed = true;
    console.log('filters: ', filters);

    myGlobals.bookmarksCollection.getAll(filters)
    .then((response) => {
      const bookmarks = response.body();
      this.setState({bookmarks: bookmarks, loaded: true});
    });
  }

  render() {

    if (!this.state.loaded) {

      return (<span>Loading...</span>);
    }

    console.log('render');

    let sortedBookmarks = this.state.bookmarks.sort((a, b) => a.data().calculatedPriority - b.data().calculatedPriority);
    let bookmarkElements = sortedBookmarks.map((bookmark) => {

      return <Bookmark key={bookmark.data().id} data={bookmark} />;
    });

    return (
      <table>
        <thead>
        <tr>
          <th></th>
          <th>Title / Host</th>
          <th>Language</th>
          <th>Length</th>
          <th>Priority</th>
          <th>Created</th>
        </tr>
        </thead>
        <tbody>
          {bookmarkElements}
        </tbody>
      </table>
    );
  }
};
