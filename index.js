import express from 'express';
import { ParseServer } from 'parse-server';
import path from 'path';
import cloud from './cloud/main.js';
const __dirname = path.resolve();
import http from 'http';
import cron from "node-cron";

export const config = {
  databaseURI:
    process.env.MONGODB_URI || 'mongodb://localhost:27017/',
  cloud,
  appId: 'myAppId',
  masterKey: 'myMasterKey',
  serverURL: 'http://localhost:1337/parse',
  liveQuery: {
    classNames: ['Tasks'],
  },
  encodeParseObjectInCloudFunction: true,
};

export const app = express();

app.set('trust proxy', true);

app.use('/public', express.static(path.join(__dirname, '/public')));

if (!process.env.TESTING) {
  const mountPath = process.env.PARSE_MOUNT || '/parse';
  const server = new ParseServer(config);
  await server.start();
  app.use(mountPath, server.app);
}

cron.schedule('******',function(){

})


app.get('/', function (req, res) {
  res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
});

app.get('/test', function (req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

if (!process.env.TESTING) {
  const port = process.env.PORT || 1337;
  const httpServer = http.createServer(app);
  httpServer.listen(port, function () {
    console.log('parse-server-example running on port ' + port + '.');
  });

  await ParseServer.createLiveQueryServer(httpServer);
}

