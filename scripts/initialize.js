//-------------------------------------------------------------------------

const fs = require("fs");

const fsPromises = require("fs").promises;

const path = require("path");

const eventLogs = require("./logEvent");
const EventEmitter = require("events");
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

myEmitter.on("log", (event, level, msg) => eventLogs(event, level, msg));

//---------------------------------------------------------------------------

const {
  folders,
  configurationJson,
  tokenJson,
  usagetxt,
  inittxt,
  configtxt,
  tokentxt,
} = require("./template");

function createFolders() {
  if (DEBUG) console.log("createFolders(): started\n");

  let count = 0;
  let match = 0;

  if (DEBUG) console.log("List of all Folders:");

  folders.forEach((ele) => {
    if (DEBUG) console.log(ele);
    try {
      if (!fs.existsSync(path.join(__dirname, ele))) {
        fsPromises.mkdir(path.join(__dirname, ele));
        count++;
      } else if (fs.existsSync(path.join(__dirname, ele))) {
        match++;
      }
    } catch (err) {
      console.log(err);
    }
  });

  if (DEBUG) console.log(`${match} folders found that already exist`);

  if (count === 0) {
    console.log("** all folder alreadys exist **\n");
    myEmitter.emit(
      "log",
      "init.createFolders()",
      "INFO",
      "All folders already existed."
    );
  } else if (count < folders.length && match > 0) {
    if (DEBUG)
      console.log(`** ${count} of ${folders.length} folders were created **\n`);
    console.log("** All folders successfully created **\n");
    myEmitter.emit(
      "log",
      "init.createFolders()",
      "INFO",
      count + " of " + folders.length + " folders were created."
    );
  } else if (match === 0) {
    console.log("** All folders successfully created **\n");
    myEmitter.emit(
      "log",
      "init.createFolders()",
      "INFO",
      "All folders successfully created."
    );
  }
}

//---------------------------------------------------------------------------------------

function createFiles() {
  if (DEBUG) console.log("createFiles(): started\n");

  if (fs.existsSync("./scripts/json")) {
    try {
      let configdata = JSON.stringify(configurationJson, null, 2);

      if (!fs.existsSync(path.join(__dirname, "./scripts/json/config.json"))) {
        if (fs.existsSync("./scripts/json/config.json")) {
          if (DEBUG) console.log("config.json file already exists");
          myEmitter.emit(
            "log",
            "init.createFiles()",
            "INFO",
            "config.json already exists."
          );
        } else {
          fs.writeFile("./scripts/json/config.json", configdata, (err) => {
            if (err) {
              console.log(err);
              myEmitter.emit(
                "log",
                "init.createFiles()",
                "ERROR",
                "config.json creation was unsuccessful."
              );
            } else {
              console.log("config.json file was created");
              myEmitter.emit(
                "log",
                "init.createFiles()",
                "INFO",
                "config.json successfully created."
              );
            }
          });
        }
      }

      let tokendata = JSON.stringify(tokenJson, null, 2);

      if (!fs.existsSync(path.join(__dirname, "./scripts/json/tokens.json"))) {
        if (fs.existsSync("./scripts/json/tokens.json")) {
          if (DEBUG) console.log("tokens.json file already exists");
          myEmitter.emit(
            "log",
            "init.createFiles()",
            "INFO",
            "token.json already exists."
          );
        } else {
          fs.writeFile("./scripts/json/tokens.json", tokendata, (err) => {
            if (err) {
              console.log(err);
              myEmitter.emit(
                "log",
                "init.createFiles()",
                "ERROR",
                "token.json creation was unsuccessful."
              );
            } else {
              console.log("token.json file was created");
              myEmitter.emit(
                "log",
                "init.createFiles()",
                "INFO",
                "token.json successfully created."
              );
            }
          });
        }
      }

      if (fs.existsSync("./scripts/views")) {
        try {
          if (
            !fs.existsSync(path.join(__dirname, "./scripts/views/usagetxt"))
          ) {
            if (fs.existsSync("./scripts/views/usagetxt")) {
              if (DEBUG) console.log("usage.txt file already exists");
              myEmitter.emit(
                "log",
                "init.createFiles()",
                "INFO",
                "usage.txt already exists."
              );
            } else {
              fs.writeFile("./scripts/views/usagetxt", usagetxt, (err) => {
                if (err) {
                  console.log(err);
                  myEmitter.emit(
                    "log",
                    "init.createFiles()",
                    "ERROR",
                    "usage.txt creation was unsuccessful."
                  );
                } else {
                  console.log("usage.txt file was created");
                  myEmitter.emit(
                    "log",
                    "init.createFiles()",
                    "INFO",
                    "usage.txt file was successfully created."
                  );
                }
              });
            }
          }

          if (!fs.existsSync(path.join(__dirname, "./scripts/views/inittxt"))) {
            if (fs.existsSync("./scripts/views/inittxt")) {
              if (DEBUG) console.log("init.txt file already exists");
              myEmitter.emit(
                "log",
                "init.createFiles()",
                "INFO",
                "init.txt already exists."
              );
            } else {
              fs.writeFile("./scripts/views/inittxt", inittxt, (err) => {
                if (err) {
                  console.log(err);
                  myEmitter.emit(
                    "log",
                    "init.createFiles()",
                    "ERROR",
                    "init.txt creation was unsuccessful."
                  );
                } else {
                  console.log("init.txt file was created");
                  myEmitter.emit(
                    "log",
                    "init.createFiles()",
                    "INFO",
                    "init.txt file was successfully created."
                  );
                }
              });
            }
          }

          if (
            !fs.existsSync(path.join(__dirname, "./scripts/views/configtxt"))
          ) {
            if (fs.existsSync("./scripts/views/configtxt")) {
              if (DEBUG) console.log("config.txt file already exists");
              myEmitter.emit(
                "log",
                "init.createFiles()",
                "INFO",
                "config.txt already exists."
              );
            } else {
              fs.writeFile("./scripts/views/configtxt", configtxt, (err) => {
                if (err) {
                  console.log(err);
                  myEmitter.emit(
                    "log",
                    "init.createFiles()",
                    "ERROR",
                    "config.txt creation was unsuccessful."
                  );
                } else {
                  console.log("config.txt file was created");
                  myEmitter.emit(
                    "log",
                    "init.createFiles()",
                    "INFO",
                    "config.txt file was successfully created."
                  );
                }
              });
            }
          }

          if (
            !fs.existsSync(path.join(__dirname, "./scripts/views/tokentxt"))
          ) {
            if (fs.existsSync("./scripts/views/tokentxt")) {
              if (DEBUG) console.log("token.txt file already exists");
              myEmitter.emit(
                "log",
                "init.createFiles()",
                "INFO",
                "token.txt already exists."
              );
            } else {
              fs.writeFile("./scripts/views/tokentxt", tokentxt, (err) => {
                if (err) {
                  console.log(err);
                  myEmitter.emit(
                    "log",
                    "init.createFiles()",
                    "ERROR",
                    "token.txt creation was unsuccessful."
                  );
                } else {
                  console.log("token.txt was created");
                  myEmitter.emit(
                    "log",
                    "init.createFiles()",
                    "INFO",
                    "token.txt file was successfully created."
                  );
                }
              });
            }
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        console.log("some folders needed doesn't exist, try --mk before --cat");
        myEmitter.emit(
          "log",
          "init.createFiles()",
          "ERROR",
          "views folder not found."
        );
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    console.log("some folders needed doesn't exist, try --mk before --cat");
    myEmitter.emit(
      "log",
      "init.createFiles()",
      "ERROR",
      "json folder not found."
    );
  }
}

//---------------------------------------------------------------------------------------

const myArgs = process.argv.slice(2);

function initializeApp() {
  if (DEBUG) console.log("initailizinApp()");

  switch (myArgs[1]) {
    case "--all":
      if (DEBUG) console.log("--all, createFolders() & createFiles()");
      myEmitter.emit(
        "log",
        "init --all",
        "INFO",
        "create all folders and files."
      );
      createFolders();
      createFiles();
      break;
    case "--mk":
      if (DEBUG) console.log("--mk, createFolders()\n");
      myEmitter.emit("log", "init --mk", "INFO", "create all folders.");
      createFolders();
      break;
    case "--cat":
    case "--c":
      if (DEBUG) console.log("--cat, createFiles()\n");
      myEmitter.emit("log", "init --cat", "INFO", "Create all files.");
      createFiles();
      break;
    case "--help":
    case "--h":
    default:
      console.log(inittxt);
  }
}

module.exports = {
  initializeApp,
};
