"use strict"
var sqlite = require('sqlite')

module.exports = {
  createUser: createUser,
  getUserByEmail: getUserByEmail,
  getSnippetById: getSnippetById,
  createSnippet: createSnippet,
}

const dbName = "./db.sqlite"

async function createUserSchema(){
  try {
        var db = await sqlite.open(dbName);
        await db.run("DROP TABLE IF EXISTS User");
        await db.run(`CREATE TABLE User(
                        email VARCHAR(100) PRIMARY KEY,
                        password VARCHAR(20) NOT NULL,
                        name VARCHAR(100) NOT NULL
                      )`);
        var as = await db.all("select * from User");
        db.close();
        console.log(as);
      } catch (e) { console.log(e); throw (e); }
}

async function createSnippetSchema(){
  try {
    var db = await sqlite.open(dbName);
    await db.run("DROP TABLE IF EXISTS Snippet");
    await db.run(`CREATE TABLE Snippet(
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    userEmail VARCHAR(150) NOT NULL,
                    code VARCHAR(4000) NOT NULL,
                    description VARCHAR(1000) NULL,
                    FOREIGN KEY (userEmail) REFERENCES User(email)
                  )`);
    db.close();
  } catch (e) { console.log(e); throw (e); }
}

async function createSnippet(userEmail, code, description){
  try {
    var db = await sqlite.open("./db.sqlite");
    await db.run("INSERT INTO Snippet(userEmail, code, description) Values(?, ?, ?)", [userEmail, state, title]);
    var as = await db.get("SELECT id FROM Snippet ORDER BY id DESC LIMIT 1");
    db.close();
    console.log(as);
    return as;
  } catch(e) {console.log(e); throw e; }
}

async function getSnippetById(id){
  try {
    var db = await sqlite.open(dbName);
    var as = await db.get("select * from Snippet where id = ?", [id]);
    db.close();
    console.log(as);
    return as;
  } catch(e) {console.log(e); throw e; }
}

async function createUser(email, password, name){
  try {
        var db = await sqlite.open(dbName);
        await db.run("INSERT INTO User(email, password, name) Values(?, ?, ?)", [email, password, name]);
      } catch (e) { console.log(e); throw e; }
}

async function getUserByEmail(email){
  try {
        var db = await sqlite.open(dbName);
        var as = await db.get("select * from User where email = ?", [email]);
        console.log(as);
        return as;
      } catch (e) { throw e; }
}
