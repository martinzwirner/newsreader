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

  setTag(evt) {

    this.setProperty('tagName', evt.target.value);
  }

  setTypeAndPriority(type, prio) {

    this.setProperty('contentType', type);
    this.setProperty('priorityValue', prio);
  }

  render() {

    const bookmark = this.props.data;
    const link = document.createElement('a');
    link.setAttribute('href', bookmark.data().url);

    const length = bookmark.data().contentLengthInCharacters;
    const lengthClass = length > 10000 ? "long" : (length > 5000 ? "middle" : "short");

    const cssClasses = ['bookmark'];
    cssClasses.push('prio' + bookmark.data().priorityValue);
    cssClasses.push(bookmark.data().contentType);
    return (
      <div className={cssClasses.join(' ')} key={bookmark.data().id}>
        <div className="favicon"><img src={"favicons/" + link.hostname + ".ico"} /></div>
        <div className="actions">
          <button className="markAsDone" onClick={this.setProperty.bind(this, 'isViewed', !bookmark.data().isViewed)}>done</button>

          <div className="line">
            <button className="text prio15" onClick={this.setTypeAndPriority.bind(this, 'text', 15)}>T N</button>
            <button className="text prio10" onClick={this.setTypeAndPriority.bind(this, 'text', 10)}>T H</button>
            <button className="text prio8" onClick={this.setTypeAndPriority.bind(this, 'text', 8)}>T HH</button>
            <button className="text prio5" onClick={this.setTypeAndPriority.bind(this, 'text', 5)}>T U</button>
            <button className="text prio4" onClick={this.setTypeAndPriority.bind(this, 'text', 4)}>T SU</button>
            <button className="text prio2" onClick={this.setTypeAndPriority.bind(this, 'text', 2)}>T I</button>
          </div>

          <div className="line">
            <button className="video prio15" onClick={this.setTypeAndPriority.bind(this, 'video', 15)}>V N</button>
            <button className="video prio10" onClick={this.setTypeAndPriority.bind(this, 'video', 10)}>V H</button>
            <button className="video prio8" onClick={this.setTypeAndPriority.bind(this, 'video', 8)}>V HH</button>
            <button className="video prio5" onClick={this.setTypeAndPriority.bind(this, 'video', 5)}>V U</button>
            <button className="video prio4" onClick={this.setTypeAndPriority.bind(this, 'video', 4)}>V SU</button>
            <button className="video prio2" onClick={this.setTypeAndPriority.bind(this, 'video', 2)}>V I</button>
          </div>

          <div className="line">
            <button className="audio prio15" onClick={this.setTypeAndPriority.bind(this, 'audio', 15)}>A N</button>
            <button className="audio prio10" onClick={this.setTypeAndPriority.bind(this, 'audio', 10)}>A H</button>
            <button className="audio prio8" onClick={this.setTypeAndPriority.bind(this, 'audio', 8)}>A HH</button>
            <button className="audio prio5" onClick={this.setTypeAndPriority.bind(this, 'audio', 5)}>A U</button>
            <button className="audio prio4" onClick={this.setTypeAndPriority.bind(this, 'audio', 4)}>A SU</button>
            <button className="audio prio2" onClick={this.setTypeAndPriority.bind(this, 'audio', 2)}>A I</button>
          </div>
        </div>
        <div className="link"><a href={bookmark.data().url}>{bookmark.data().title || bookmark.data().url}</a></div>
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