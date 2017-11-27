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
      <tr className="bookmark" key={bookmark.data().id}>
        <td>
          <img src={"favicons/" + link.hostname + ".ico"} />
        </td>
        <td>
          <a href={bookmark.data().url}>{bookmark.data().title}</a><br />
          {link.hostname}
        </td>
        <td className={bookmark.data().languageCode}>
          {bookmark.data().languageCode}
        </td>
        <td>
          {bookmark.data().contentLengthInCharacters}
        </td>
        <td>
          {bookmark.data().calculatedPriority}
        </td>
        <td>
          {moment(bookmark.data().createdAt).format("DD.MM.YYYY")}
        </td>
      </tr>
    );
  }
}