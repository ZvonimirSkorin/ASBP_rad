const korisnici = require("./users");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const c = require("cors");

const msal = require("@azure/msal-node");
const { default: axios } = require("axios");
const { config, msalConfig } = require("./TwoConf");
const port = 3000;
const { parse_data } = require("./Parse");
var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(c(corsOptions));
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser());
const urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(function (req, res, next) {
  next();
});

const List = new korisnici();

const pca = new msal.PublicClientApplication(msalConfig);

//HTML
app.get("/", (req, res) => {
  res.status(200).sendFile("./StaticPages/main.html", { root: __dirname });
});
app.get("/create_user_html", (req, res) => {
  res.status(200).sendFile("./StaticPages/create_user.html", { root: __dirname });
});

//LoginLogic
app.post("/silent", urlencodedParser, (req, res) => {
  const user = List.test_user(req.body.id, req.body.token);

  if (user.status === "ok") {
    let options = {
      method: "GET",
      url: "https://graph.microsoft.com/v1.0/users/",
      headers: {
        authorization: `Bearer ${user.token}`,
      },
    };
    axios
      .request(options)
      .then((respon) => {
        res.send({ data: parse_data(respon.data) });
      })
      .catch((err) => {
        res.send({ err: "access" });
      });
  }
});
app.post("/loginUP", urlencodedParser, (req, res) => {
  const user = req.body;
  const usernamePasswordRequest = {
    client_secret: "PcZ7Q~bL8GrstKNTl7aSrVlw2A00Xebh7vfV2",

    scopes: ["user.read", "Directory.Read.All"],

    username: user.username,
    password: user.password,
  };
  pca
    .acquireTokenByUsernamePassword(usernamePasswordRequest)
    .then((response) => {
      let options = {
        method: "GET",
        url: "https://graph.microsoft.com/v1.0/users/",
        headers: {
          authorization: `Bearer ${response.accessToken}`,
        },
      };
      axios
        .request(options)
        .then((respon) => {
          const values = List.add_user(response.accessToken, response.account.localAccountId);
          axios.post("https://z73f7c904-z53c9780e-gtw.qovery.io/new_user", { token: values.token, id: values.id, expire: values.valid });

          res.send({ data: parse_data(respon.data), ASBPToken: values });
        })
        .catch((err) => {
          res.send({ err: "access" });
        });
    })
    .catch((err) => {
      res.send({ err: "UP" });
    });
});

app.post("/create_user", urlencodedParser, (req, res) => {
  const user = req.body;

  let headers = {
    headers: {
      authorization: `Bearer ${List.admin_token()}`,
    },
  };
  let options = {
    accountEnabled: true,
    displayName: user.username,
    mailNickname: user.username,
    givenName: user.username,
    userPrincipalName: user.mail,

    passwordProfile: {
      forceChangePasswordNextSignIn: false,
      password: user.password,
    },
  };
  axios
    .post("https://graph.microsoft.com/v1.0/users", options, headers)
    .then((respon) => {
      res.status(200).send({ success: true });
    })
    .catch((err) => {
      List.generate_new_token();
      res.send({ err: err });
    });
});

app.post("/new_user", urlencodedParser, (req, res) => {
  const user = req.body;
  List.add_user_silent(user.token, user.id, user.expire);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
