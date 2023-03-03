//

const configurationJson = {
  name: "AppConfigCLI",
  version: "1.0.0",
  description: "The Command Line Interface (CLI) for the MyApp.",
  main: "myapp.js",
  superuser: "adm1n",
  database: "exampledb",
};

const tokenJson = [
  {
    username: "example_username",
    email: "user@example.com",
    phone: "0000000000",
    token: "example_token",
    created: "1969-01-31 12:30:00",
    expiry: "1969-02-03 12:30:00",
    confirmed: "tbd",
    status: "valid",
  },
];

const folders = ["models", "views", "routes", "logHistory", "json"];

const usagetxt = `

index <command> <option>

Usage:

index --help                            displays all help options
index init --all                        creates all folders and files
index init --mk                         creates all folders
index init --cat                        creates the config file with default settings
index config --show                     displays a list of the current config settings
index config --reset                    resets the config file with default settings
index config --set                      sets a specific config setting
index token --count                     displays a count of the tokens created
index token --list                      list all the usernames with tokens
index token --new <username>            generates a token for a given username, saves tokens to the json file
index token --upd p <username> <phone>  updates the json entry with phone number
index token --upd e <username> <email>  updates the json entry with email
index token --search u <username>       searches a token for a given username
index token --search e <email>          searches a token for a given email
index token --search p <phone>          searches a token for a given phone number

`;

const inittxt = `

index init <command> <option>

Usage:

index init --all          displays all help options
index init --mk           creates all folders and files
index init --cat          creates all folders

`;

const configtxt = `

index <command> <option>

Usage:

index config --show     displays a list of the current config settings
index config --reset    resets the config file with default settings
index config --set      sets a specific config setting

`;

const tokentxt = `

index <command> <option>

Usage:

index token --count                     displays a count of the tokens created
index token --list                      list all the usernames with tokens
index token --new <username>            generates a token for a given username, saves tokens to the json file
index token --upd p <username> <phone>  updates the json entry with phone number
index token --upd e <username> <email>  updates the json entry with email
index token --search u <username>       searches a token for a given username
index token --search e <email>          searches a token for a given email
index token --search p <phone>          searches a token for a given phone number

`;

module.exports = {
  folders,
  configurationJson,
  tokenJson,
  usagetxt,
  inittxt,
  configtxt,
  tokentxt,
};
