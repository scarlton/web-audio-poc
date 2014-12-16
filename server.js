var connect   = require('connect'),
    serveStatic = require('serve-static'),
    staticDir = 'app';

var app = connect();

app.use(serveStatic(staticDir));
app.listen(8080);