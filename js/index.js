"use strict";

window.Route = ReactRouter.Route;
window.BrowserRouter = ReactRouterDOM.BrowserRouter; // indicates server is able to serve routes as well
window.MemoryRouter = ReactRouter.MemoryRouter; // does not change URL at all
window.HashRouter = ReactRouterDOM.HashRouter; // appends route as hash to URL
window.Link = ReactRouterDOM.Link;
window.Switch = ReactRouterDOM.Switch;

const api = restful('http://localhost:8080/api', fetchBackend(fetch));

window.myGlobals = {};
myGlobals.bookmarksCollection = api.all('bookmarks');
myGlobals.hostsCollection = api.all('hosts');
myGlobals.languageCollection = api.all('languages');

document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(
    <HashRouter>
      <App/>
    </HashRouter>,
    document.getElementById('root')
  );
});
