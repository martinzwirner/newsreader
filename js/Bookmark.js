class Bookmark extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  setProperty(prop, value) {

    const bookmark = this.props.data;
    bookmark.data()[prop] = value;
    bookmark.save();

    setTimeout(this.props.updateList, 100); // TODO: reload list after update was executed
  }

  render() {

    const bookmark = this.props.data;
    const link = document.createElement('a');
    link.setAttribute('href', bookmark.data().url);

    const length = bookmark.data().contentLengthInCharacters;
    const lengthClass = length > 10000 ? "long" : (length > 5000 ? "middle" : "short");

    return (
      <div className="bookmark" key={bookmark.data().id}>
        <div className="favicon"><img src={"favicons/" + link.hostname + ".ico"} /></div>
        <div className="actions">
          <button className="markAsLowPrio" onClick={this.setProperty.bind(this, 'priorityValue', 20)}>lowprio</button>
          <button className="markAsVideo" onClick={this.setProperty.bind(this, 'contentType', 'video')}>video</button>
          <button className="markAsDone" onClick={this.setProperty.bind(this, 'isViewed', true)}>done</button>
        </div>
        <div className="link"><a href={bookmark.data().url}>{bookmark.data().title || "(No title)"}</a></div>
        <div className="metaData">
          <div className="hostname">{link.hostname}</div>
          <div className={'languageCode ' + bookmark.data().languageCode}>{bookmark.data().languageCode || "?"}</div>
          <div className={'contentLength ' + lengthClass}>{bookmark.data().contentLengthInCharacters}</div>
          <div className="priority">{bookmark.data().priorityValue}</div>
          <div className="createdAt">{moment(bookmark.data().createdAt).format("DD.MM.YYYY")}</div>
        </div>
      </div>
    );
  }
}