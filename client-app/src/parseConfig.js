import Parse from 'parse';

Parse.initialize('myAppId', '', 'myMasterKey');
Parse.serverURL = 'http://localhost:1337/parse';

export default Parse;
