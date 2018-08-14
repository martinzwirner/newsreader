"use strict";

window.Route = ReactRouter.Route;
window.BrowserRouter = ReactRouterDOM.BrowserRouter; // indicates server is able to serve routes as well
window.MemoryRouter = ReactRouter.MemoryRouter; // does not change URL at all
window.HashRouter = ReactRouterDOM.HashRouter; // appends route as hash to URL
window.Link = ReactRouterDOM.Link;
window.Switch = ReactRouterDOM.Switch;

var api = restful('/api', fetchBackend(fetch));

window.myGlobals = {};
myGlobals.bookmarksCollection = api.all('bookmarks');
myGlobals.hostsCollection = api.all('hosts');
myGlobals.languageCollection = api.all('languages');

document.addEventListener('DOMContentLoaded', function () {
  ReactDOM.render(React.createElement(
    HashRouter,
    null,
    React.createElement(App, null)
  ), document.getElementById('root'));
});
//# sourceMappingURL=index.js.map