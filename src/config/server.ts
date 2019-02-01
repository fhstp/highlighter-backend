/**
 * @author Armin Kirchknopf mt151045
 * @description Hier wird die Servererstellung gehandelt. HTTPS, bzw. CORS Handling
 */
import * as express from 'express';
import https = require('https');
import * as bodyParser from 'body-parser';

require('dotenv').config();
import { AGBRestController } from '../rest';
//import { TreeRestController } from '../rest';

export default class Server
{
    private server: any;
    private app: any;
    private _fileReader = require ('fs');

    // SSL intro - Only need on live server and not for local development
    options: any = { 
    cert: this._fileReader.readFileSync('../ssl/online.domain.com-cert.pem'),
    key: this._fileReader.readFileSync('../ssl/online.domain.com-key.pem')
    }

    // Controllers
    private _agbRestController: AGBRestController;
    //private _treeRestController: TreeRestController;

    constructor()
    {
        this.app = express();
        this.server = new https.Server(this.options, this.app);
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        
        // CORS Handling see -> https://stackoverflow.com/questions/7067966/how-to-allow-cors and https://enable-cors.org/server_expressjs.html
        this.app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
          });


        this.app.get('/', function (req, res)
        {
            res.sendFile(process.env.NODE_PATH + '/src/assets/index.html');
        });        

        // Create Controller
        this._agbRestController = new AGBRestController(this.app);
        //this._treeRestController = new TreeRestController(this.app);

        this.app.listen(process.env.SERVER_PORT);
        console.log('Server runs on Port: ' + process.env.SERVER_PORT);
    }
}

