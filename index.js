var express = require("express");
var cors = require("cors");
var ParseServer = require("parse-server").ParseServer;
var ParseDashboard = require("parse-dashboard");
var morgan = require("morgan");
var path = require("path");
require("dotenv").config();

const app = express();

// server listening  port and the parse url end point seted
// in our express server
// const serverURL = "http://192.168.3.249:1337/parse";
const serverURL = process.env.SERVER_URL;
const appId = process.env.APP_ID;
const masterKey = process.env.MASTER_KEY;

const api = new ParseServer({
  databaseURI: process.env.DATABASE_URI,
  serverURL: serverURL,
  appId: appId,
  masterKey: masterKey,
  cloud: "./cloud/main.js",
  liveQuery: {
    classNames: ["Notification"],
  },
});

var dashboard = new ParseDashboard(
  {
    apps: [
      {
        serverURL: serverURL,
        appId: appId,
        masterKey: masterKey,
        appName: "digius CRM",
      },
    ],
    users: [
      {
        user: "admin",
        pass: "@digius",
      },
    ],
  },
  { allowInsecureHTTP: true }
);

app.use(morgan("dev"));
app.use(cors({}));
app.use("/parse", api);
app.use("/dashboard", dashboard);

// app.use(express.static(path.join(__dirname, "..", "crm_web")));

// app.get("/*", (req, res) => {
//   res.sendFile(path.join(__dirname, "..", "crm_web", "index.html"));
// });

let httpServer = require("http").createServer(app);

httpServer.listen(process.env.PORT || 1337, "0.0.0.0");
var parseLiveQueryServer = ParseServer.createLiveQueryServer(httpServer);
