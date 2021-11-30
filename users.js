const moment = require("moment");
const msal = require("@azure/msal-node");
const { conf } = require("./Config");
const { axios } = require("axios");
const request = require("request");
const link = "http://localhost:3000/new_user";
module.exports = class users {
  constructor() {
    get_admin_token().then((val) => {
      this.token = val;
      this.accounts = new Map();
      this.num = 0;
    });
  }
  add_user(token, id) {
    this.num++;
    console.log(token, id);
    const expire = moment().add(5, "minutes");
    this.accounts.set(id, { expire: expire, token: token });
    return { id: id, token: token, valid: expire };
  }
  async add_user_silent(token, id, token_expire) {
    this.num++;
    this.accounts.set(id, { expire: token_expire, token: token });
  }
  test_user(id, token) {
    const data = this.accounts.get(id);
    if (data == null) return "Not registered";
    else {
      if (data.expire < moment()) {
        return "expired";
      } else return { status: "ok", token: data.token };
    }
  }

  get_token(id) {
    return this.accounts.get(id).token;
  }
  admin_token() {
    return this.token;
  }
  generate_new_token() {
    return new Promise((resolve, reject) => {
      get_admin_token().then((val) => {
        this.token = val;
        resolve(true);
      });
    });
  }
};

function get_admin_token() {
  const endpoint = `https://login.microsoftonline.com/${"ff41217d-9ad8-48e2-a6f5-eac6b5de95a3"}/oauth2/v2.0/token`;
  const requestParams = {
    grant_type: "client_credentials",
    client_id: "ac4e325a-6c4f-408f-b6a9-393f0d84d38e",
    client_secret: "urU7Q~Ol5nfGoUUXk3BqrXdVBu4HKWmFdi3iB",
    scope: "https://graph.microsoft.com/.default",
  };

  return new Promise((resolve, reject) =>
    request.post({ url: endpoint, form: requestParams }, function (err, response, body) {
      if (err) {
        console.log("error");
      } else {
        let parsedBody = JSON.parse(body);
        if (parsedBody.error_description) {
          console.log("Error=" + parsedBody.error_description);
        } else {
          this.token = parsedBody.access_token;

          resolve(parsedBody.access_token);
        }
      }
    })
  );
}
