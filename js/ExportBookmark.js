class ExportBookmark extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {

    const bookmark = this.props.data;
    const link = document.createElement('a');
    link.setAttribute('href', bookmark.data().url);

    const length = bookmark.data().contentLengthInCharacters;
    const lengthClass = length > 10000 ? "long" : (length > 5000 ? "middle" : "short");

    return (
      <div key={bookmark.data().id}>
        <div>
          <img src={"favicons/" + link.hostname + ".ico"} width="32" height="32" />
          <a href={bookmark.data().url}>{bookmark.data().title || "(No title)"}</a>
        </div>
        <div className="metaData">
          <div className="hostname">{link.hostname}</div>
          <div className={'contentLength ' + lengthClass}>{bookmark.data().contentLengthInCharacters}</div>
        </div>
        <br />
      </div>
    );
  }
}