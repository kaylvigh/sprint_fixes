//---------------------------------------

const fs = require("fs");
const path = require("path");

const logEvents = require("./logEvent");
const EventEmitter = require("events");

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

myEmitter.on("log", (event, level, msg) => logEvents(event, level, msg));

const crc32 = require("crc/crc32");
const { format, addDays } = require("date-fns");
const { tokentxt } = require("./template");

//-----------------------------------------------------------------------------------

function countToken() {
  if (DEBUG) console.log("token.countToken(): started\n");
  if (DEBUG) console.log(Args);

  if (fs.existsSync("./scripts/json/tokens.json")) {
    return new Promise(function (resolve, reject) {
      fs.readFile(__dirname + "/json/tokens.json", "utf-8", (error, data) => {
        if (!error) {
          let tokens = JSON.parse(data);
          let count = Object.keys(tokens).length;

          if (count === 0) {
            if (DEBUG)
              console.log(
                "token.json file exists but is currently empty. config --cat to reset to default"
              );
            myEmitter.emit(
              "log",
              "token.tokenCount()",
              "WARNING",
              `token.json is currently empty.`
            );
            resolve(count);
          } else if (count > 0) {
            console.log(`Current token count is ${count}.`);
            myEmitter.emit(
              "log",
              "token.tokenCount()",
              "INFO",
              `Current token count is ${count}.`
            );
            resolve(count);
          }
        } else {
          console.log(error);
          myEmitter.emit(
            "log",
            "token.countToken()",
            "ERROR",
            "failed to count tokens"
          );
        }
      });
    });
  } else {
    console.log("token.josn file doesnt exist");
    myEmitter.emit(
      "log",
      "token.countToken()",
      "ERROR",
      "token.json file doesnt exist"
    );
  }
}

//-----------------------------------------------------------------------------------

function listToken() {
  if (DEBUG) console.log("token.listToken(): started\n");
  if (DEBUG) console.log(Args);

  var tokenList = [];

  if (fs.existsSync("./scripts/json/tokens.json")) {
    return new Promise(function (resolve, reject) {
      fs.readFile(__dirname + "/json/tokens.json", "utf-8", (error, data) => {
        if (!error) {
          let tokens = JSON.parse(data);
          console.log("** User List **");
          tokens.forEach((obj) => {
            console.log(" * " + obj.username + ": " + obj.token);
            tokenList.push(obj);
          });
          myEmitter.emit(
            "log",
            "token.listToken()",
            "INFO",
            `Current token list was displayed.`
          );
          resolve(tokenList);
        } else {
          console.log(error);
          myEmitter.emit(
            "log",
            "token.listToken()",
            "ERROR",
            "failed to list tokens"
          );
        }
      });
    });
  } else {
    console.log("token.josn file doesnt exist");
    myEmitter.emit(
      "log",
      "token.countToken()",
      "ERROR",
      "token.json file doesnt exist"
    );
  }
}

//-----------------------------------------------------------------------------------

function newToken(username) {
  if (DEBUG) console.log("token.newToken(): started\n");
  if (DEBUG) console.log(Args);

  let now = new Date();

  let expiry = addDays(now, 3);

  var tokenToEnter = JSON.parse(`{
    "username": "example_username",
    "email": "user@example.com",
    "phone": "0000000000",
    "token": "example_token",
    "created": "1969-01-31 12:30:00",
    "expiry": "1969-02-03 12:30:00",
    "confirmed": "tbd",
    "status": "valid"
}`);

  tokenToEnter.created = `${format(now, "yyyy-MM-dd HH:mm:ss")}`;
  tokenToEnter.expiry = `${format(expiry, "yyyy-MM-dd HH:mm:ss")}`;
  tokenToEnter.username = username;
  tokenToEnter.token = crc32(username).toString(16);

  if (fs.existsSync("./scripts/json/tokens.json")) {
    fs.readFile(__dirname + "/json/tokens.json", "utf-8", (error, data) => {
      if (error) throw error;

      let tokens = JSON.parse(data);

      //-----------------------------------

      let userMatch = false;

      for (x of tokens) {
        if (x.username === tokenToEnter.username) {
          userMatch = true;
        }
      }

      if (!userMatch) {
        tokens.push(tokenToEnter);
        userTokens = JSON.stringify(tokens);

        fs.writeFile(__dirname + "/json/tokens.json", userTokens, (error) => {
          if (!error) {
            console.log(
              `New token ${tokenToEnter.token} was created for ${username}.`
            );
            myEmitter.emit(
              "log",
              "token.newToken()",
              "INFO",
              `New token ${tokenToEnter.token} was created for ${username}.`
            );
          } else {
            console.log(error);
            myEmitter.emit(
              "log",
              "token.newToken()",
              "ERROR",
              `failed to create token for ${username}`
            );
          }
        });
      } else {
        if (DEBUG) console.log("Error - Usersame is already taking");
        myEmitter.emit(
          "log",
          "token.newToken()",
          "ERROR",
          `username: ${username} is taking, failed to create new token.`
        );
      }
    });
  } else {
    console.log("token.josn file doesnt exist");
    myEmitter.emit(
      "log",
      "token.countToken()",
      "ERROR",
      "token.json file doesnt exist"
    );
  }

  return tokenToEnter.token;
}

//-----------------------------------------------------------------------------------

function updateToken() {
  if (DEBUG) console.log("token.updateToken(): started\n");
  if (DEBUG) console.log(Args);

  if (fs.existsSync("./scripts/json/tokens.json")) {
    fs.readFile(__dirname + "/json/tokens.json", "utf-8", (error, data) => {
      if (error) throw error;

      let tokens = JSON.parse(data);

      userFound = false;

      tokens.forEach((obj) => {
        if (obj.username === Args[3]) {
          userFound = true;
        }
      });

      if (userFound === true) {
        tokens.forEach((obj) => {
          if (obj.username === Args[3]) {
            if (DEBUG) console.log(obj);
            switch (Args[2]) {
              case "p":
              case "P":
              case "phone":
              case "Phone":
              case "PHONE":
                obj.phone = Args[4];
                addUpdate(obj);
                break;
              case "e":
              case "E":
              case "email":
              case "Email":
              case "EMAIL":
                obj.email = Args[4];
                addUpdate(obj);
                break;
              default:
                if (DEBUG) console.log(`unknow command ${Args[2]} was passed`);
                console.log(`try --token [username] [phone or email]`);
                myEmitter.emit(
                  "log",
                  "token.updateToken()",
                  "ERROR",
                  ` unknow command ${Args[2]} was passed.`
                );
            }
            if (DEBUG) console.log(obj);
          }
          function addUpdate(obj) {
            userTokens = JSON.stringify(tokens);
            fs.writeFile(__dirname + "/json/tokens.json", userTokens, (err) => {
              if (err) console.log(err);
              else {
                if (Args[2] === "e" || Args[2] === "email") {
                  console.log(
                    `email record for ${Args[3]} was updated with ${Args[4]}.`
                  );
                } else {
                  console.log(
                    `phone record for ${Args[3]} was updated with ${Args[4]}.`
                  );
                }
                myEmitter.emit(
                  "log",
                  "token.updateToken()",
                  "INFO",
                  `Token record for ${Args[3]} was updated with ${Args[4]}.`
                );
              }
            });
          }
        });
      } else if (userFound === false) {
        console.log(`username ${Args[3]} not found`);
        myEmitter.emit(
          "log",
          "token.updateToken()",
          "ERROR",
          `username ${Args[3]} not found`
        );
      }
    });
  } else {
    console.log("token.josn file doesnt exist");
    myEmitter.emit(
      "log",
      "token.updateToken()",
      "ERROR",
      "token.json file doesnt exist"
    );
  }
}

//-----------------------------------------------------------------------------------

function searchTokenByUsername(username) {
  if (DEBUG) console.log("token.searchToken(): started\n");
  if (DEBUG) console.log(Args);

  if (fs.existsSync("./scripts/json/tokens.json")) {
    fs.readFile(__dirname + "/json/tokens.json", "utf-8", (error, data) => {
      if (error) throw error;

      let tokens = JSON.parse(data);
      userFound = false;

      tokens.forEach((obj) => {
        if (obj.username === username) {
          userFound = true;
        }
      });

      if (userFound === true) {
        tokens.forEach((obj) => {
          if (obj.username === username) {
            if (DEBUG) console.log(`** Record for ${username} was found. **`);
            console.log(obj);
          }
        });
        myEmitter.emit(
          "log",
          "token.fetchRecord()",
          "INFO",
          `Token record for ${username} was displayed.`
        );
        if (DEBUG) console.log(`Record for ${username} was successfull`);
      } else if (userFound === false) {
        console.log(`the username entered was not found`);
        myEmitter.emit(
          "log",
          "token.searchToken()",
          "ERROR",
          `username ${username} not found`
        );
      }
    });
  } else {
    console.log("token.josn file doesnt exist");
    myEmitter.emit(
      "log",
      "token.searchToken()",
      "ERROR",
      "token.json file doesnt exist"
    );
  }
}

//-----------------------------------------------------------------------------------

function searchTokenByEmail(email) {
  if (DEBUG) console.log("token.searchToken(): started\n");
  if (DEBUG) console.log(Args);

  if (fs.existsSync("./scripts/json/tokens.json")) {
    fs.readFile(__dirname + "/json/tokens.json", "utf-8", (error, data) => {
      if (error) throw error;

      let tokens = JSON.parse(data);
      userFound = false;

      tokens.forEach((obj) => {
        if (obj.email === email) {
          userFound = true;
        }
      });

      if (userFound === true) {
        tokens.forEach((obj) => {
          if (obj.email === email) {
            if (DEBUG)
              console.log(`** Record with email ${email} was found. **`);
            console.log(obj);
          }
        });
        myEmitter.emit(
          "log",
          "token.fetchRecord()",
          "INFO",
          `Token record with email ${email} was displayed.`
        );
        if (DEBUG) console.log(`Record with email ${email} was successfull`);
      } else if (userFound === false) {
        console.log(`the email entered was not found`);
        myEmitter.emit(
          "log",
          "token.searchToken()",
          "ERROR",
          `the email ${email} not found`
        );
      }
    });
  } else {
    console.log("token.josn file doesnt exist");
    myEmitter.emit(
      "log",
      "token.searchToken()",
      "ERROR",
      "token.json file doesnt exist"
    );
  }
}

//-----------------------------------------------------------------------------------

function searchTokenByPhone(phone) {
  if (DEBUG) console.log("token.searchToken(): started\n");
  if (DEBUG) console.log(Args);

  if (fs.existsSync("./scripts/json/tokens.json")) {
    fs.readFile(__dirname + "/json/tokens.json", "utf-8", (error, data) => {
      if (error) throw error;

      let tokens = JSON.parse(data);
      userFound = false;

      tokens.forEach((obj) => {
        if (obj.phone === phone) {
          userFound = true;
        }
      });

      if (userFound === true) {
        tokens.forEach((obj) => {
          if (obj.phone === phone) {
            if (DEBUG)
              console.log(`** Record with phone number ${phone} was found. **`);
            console.log(obj);
          }
        });
        myEmitter.emit(
          "log",
          "token.fetchRecord()",
          "INFO",
          `Token record with phone number ${phone} was displayed.`
        );
        if (DEBUG)
          console.log(`Record with phone number ${phone} was successfull`);
      } else if (userFound === false) {
        console.log(`the phone number entered was not found`);
        myEmitter.emit(
          "log",
          "token.searchToken()",
          "ERROR",
          `the phone number ${phone} not found`
        );
      }
    });
  } else {
    console.log("token.josn file doesnt exist");
    myEmitter.emit(
      "log",
      "token.searchToken()",
      "ERROR",
      "token.json file doesnt exist"
    );
  }
}

//----------------------------------------------------------------------------------

function checkExperyDate() {
  if (DEBUG) console.log("token.checkExperyDate(): started\n");
  if (DEBUG) console.log(Args);

  if (fs.existsSync("./scripts/json/tokens.json")) {
    return new Promise(function (resolve, reject) {
      fs.readFile(__dirname + "/json/tokens.json", "utf-8", (error, data) => {
        if (!error) {
          let tokens = JSON.parse(data);

          let now = new Date();

          console.log("** expired users **\n");

          let count = 0;

          let expiryList = [];

          tokens.forEach((obj) => {
            ex = new Date(obj.expiry);
            if (ex < now) {
              console.log(`- ${obj.username}'s token expired on ${obj.expiry}`);
              obj.status = "expired";
              count++;
              expiryList.push(obj);
            }
          });

          if (DEBUG) console.log(expiryList);
          console.log("");

          if (count > 0) {
            console.log(`Total tokens expired: ${count}`);
          } else {
            console.log("No tokens are currently expired.");
          }

          myEmitter.emit(
            "log",
            "token.checkExperyDate()",
            "INFO",
            `List of expired tokens displayed.`
          );

          resolve(expiryList);
        } else {
          console.log(error);
          myEmitter.emit(
            "log",
            "token.checkExperyDate()",
            "ERROR",
            "failed to list tokens"
          );
        }
      });
    });
  } else {
    console.log("token.josn file doesnt exist");
    myEmitter.emit(
      "log",
      "token.countToken()",
      "ERROR",
      "token.json file doesnt exist"
    );
  }
}

//-----------------------------------------------------------------------------------

const Args = process.argv.slice(2);

function tokenApp() {
  if (DEBUG) console.log("tokenApp()");
  switch (Args[1]) {
    case "--count":
      if (DEBUG) console.log("--count,  countToken()");
      myEmitter.emit("log", "token --count", "INFO", "count tokens.");
      countToken();
      break;
    case "--list":
      if (DEBUG) console.log("--list,  listToken()");
      myEmitter.emit("log", "token --list", "INFO", "display all tokens.");
      listToken();
      break;
    case "--new":
      if (Args.length !== 3) {
        console.log("invalid syntax. node myapp token --new [username]");
      } else {
        if (DEBUG) console.log("--new, newToken()");
        myEmitter.emit("log", "token --new", "INFO", "create new token.");
        newToken(Args[2]);
      }
      break;
    case "--update":
    case "--upd":
      if (DEBUG) console.log("--update,  updateToken()");
      myEmitter.emit("log", "token --update", "INFO", "update token.");
      updateToken();
      break;
    case "--expired":
      if (DEBUG) console.log("--expired  checkExperyDate()");
      myEmitter.emit(
        "log",
        "token --expired",
        "INFO",
        "display expired tokens."
      );
      checkExperyDate();
      break;
    case "--search":
      if (DEBUG) console.log("--search,  searchToken()");
      myEmitter.emit("log", "token --search", "INFO", "search token.");
      switch (Args[2]) {
        case "u":
          searchTokenByUsername(Args[3]);
          break;
        case "e":
          searchTokenByEmail(Args[3]);
          break;
        case "p":
          searchTokenByPhone(Args[3]);
          break;
        default:
          myEmitter.emit(
            "log",
            "token --search",
            "WARNING",
            "invalid --search syntax."
          );
          if (DEBUG)
            console.log(
              "invalid syntax. node myapp token --search [u] [username]"
            );
          if (DEBUG)
            console.log(
              "invalid syntax. node myapp token --search [e] [email]"
            );
          if (DEBUG)
            console.log(
              "invalid syntax. node myapp token --search [p] [phone]"
            );
      }
      break;
    case "--help":
    case "--h":
    default:
      console.log(tokentxt);
  }
}

module.exports = {
  tokenApp,
  countToken,
  newToken,
  updateToken,
  checkExperyDate,
  listToken,
};
