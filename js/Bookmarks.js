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

    let sortedBookmarks = this.state.bookmarks.sort((a, b) => a.data().contentLengthInCharacters - b.data().contentLengthInCharacters);
    let bookmarkElements = sortedBookmarks.map((bookmark) => {
      return (
        <li className="bookmark" key={bookmark.data().id}>
          <img src={"http://" + bookmark.data().hostname + "/favicon.ico"} />
          <a href={bookmark.data().url}>{bookmark.data().title}</a> (Length: {bookmark.data().contentLengthInCharacters})</li>
      );
    });

    return (
      <ul>
        {bookmarkElements}
      </ul>
    );
  }
};
