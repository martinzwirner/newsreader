class Bookmarks extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    myGlobals.bookmarksCollection.getAll()
    .then((response) => {
      const bookmarks = response.body();
      this.setState({bookmarks: bookmarks, loaded: true});
    });
  }

  render() {

    if (!this.state.loaded) {

      return (<span>Loading...</span>);
    }

    let bookmarks = this.state.bookmarks.map((bookmark) => {
      return (
        <li className="bookmark" key={bookmark.data().id}>
          <a href={bookmark.data().uri}>{bookmark.data().uri}</a></li>
      );
    });

    return (
      <ul>
        {bookmarks}
      </ul>
    );
  }
};
