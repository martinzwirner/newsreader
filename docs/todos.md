# how to compile react files

./node_modules/.bin/babel js --out-dir dist/js --source-maps

# bugs

- bug: multiple filters at the same time
- items with length 0
- some urls are still imported as new

# code quality

- eslint

# backend

- **save original url** (2h)
- **detect videos** (1h)
- load data from 1000flies
- detect links to full text (2h)
- redirects without hostname
- add deletedAt column
- process urls in parallel
- save filter settings! local storage?
- tags importieren
- seiten typen erkennen (imdb, youtube etc.)
- load amp pages?
- use code from reading bookmarklet?
- format timestamps in log
- remove utm params in urls
- configure request timeout
- wiki-seiten erkennen
- use graphql?
- extract url from tweet
- save source tweet/newsfeed/person
- create missing directories

# frontend

- **filter by content type** (0.5h)
- **add item from frontend** (0.5h)
- **set bookmark priority** (1h)
- **import from frontend** (1h)
- **authentication**: (2h)
https://github.com/mweibel/connect-session-sequelize
passport?
- display import and DB stats
- improve state management
https://alligator.io/react/unstated/
- add repeatedly --> high prio
- show entry count above list
- add free text search
- boostrap?
https://blog.bitsrc.io/11-react-component-libraries-you-should-know-178eb1dd6aa4
- today as default filter?
- improve list layout
- save filters / provide preconfigured filters
- make fields editable

# other

"redmine for articles to read"
https://levelup.gitconnected.com/using-graphql-api-with-node-js-and-react-forms-8b13f4b26361
heroku? digital ocean?
- ide
delete webstorm 2016?
code?
- beyond compare?
alternatives: kdiff3, meld, freefilesync
