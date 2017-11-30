class Bookmark extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {

    const bookmark = this.props.data;
    const link = document.createElement('a');
    link.setAttribute('href', bookmark.data().url);

    return (
      <div className="bookmark" key={bookmark.data().id}>
        <div className="favicon"><img src={"favicons/" + link.hostname + ".ico"} /></div>
        <div className="link"><a href={bookmark.data().url}>{bookmark.data().title}</a></div>
        <div className="metaData">
          <div className="hostname">{link.hostname}</div>
          <div className={'languageCode ' + bookmark.data().languageCode}>{bookmark.data().languageCode || "?"}</div>
          <div className="contentLength">{bookmark.data().contentLengthInCharacters}</div>
          <div className="priority">{Math.round(bookmark.data().calculatedPriority)}</div>
          <div className="createdAt">{moment(bookmark.data().createdAt).format("DD.MM.YYYY")}</div>
        </div>
      </div>

    );
  }
}