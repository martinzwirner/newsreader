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

  setContentType(evt) {

    this.setProperty('contentType', evt.target.value);
  }

  setPriority(evt) {

    this.setProperty('priorityValue', evt.target.value);
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
          <select className="setPriority" value={bookmark.data().priorityValue} onChange={this.setPriority.bind(this)}>
            <option value="20" className="low">Low</option>
            <option value="15" className="normal">Normal</option>
            <option value="10" className="high">High</option>
          </select>
          <select className="setContentType" value={bookmark.data().contentType} onChange={this.setContentType.bind(this)}>
            <option value="text" className="text">Text</option>
            <option value="video" className="video">Video</option>
            <option value="audio" className="audio">Audio</option>
            <option value="image" className="image">Image</option>
          </select>
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