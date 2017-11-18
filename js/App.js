// EventableComponent provides event handling methods such as @listenTo and @stopListening
class App extends React.Component {

  render() {
    return (
      <div className='container'>
        <h1>Newsreader</h1>
        <Bookmarks />
      </div>
    );
  }
}
