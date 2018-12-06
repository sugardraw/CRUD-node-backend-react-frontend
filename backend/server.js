const http = require("http");
const url = require("url");
const querystring = require("querystring");
const notes = require("./notes");

const server = http.createServer((request, response) => {
  const urlObject = url.parse(request.url);
  const data = querystring.parse(urlObject.query);
  let payload = {};

  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  response.setHeader("Content-Type", "application/json");

  switch (urlObject.pathname) {
    /**
     *
     * show all notes
     */

    case "/api/notes/list":
      payload = {
        endpoint: "list",
        description: "List all notes",
        data: notes.fetchNotes()
      };
      break;

    /**
     *
     * save a note
     */

    case "/api/notes/add":
      payload = {
        endpoint: "add",
        description: "Add a note"
      };
      if (data) {
        let note = notes.addNote(data.title, data.body, data.id);
        if (note) {
          payload["note"] = note;
        } else {
          payload["deleted"] = "Note was deleted";
          payload["data"]= notes.fetchNotes()
        }
      }
      break;

    case "/api/notes/delete":
      payload = {
        endpoint: "delete",
        description: "Delete a note"
      };
      if (data.title) {
        let note = notes.removeNote(data.title);
        if (note) {
          payload["note"] = note;
        } else {
          payload["deleted"] = "Note was deleted";
          payload["data"]= notes.fetchNotes()
        }
      }

      break;
    case "/api/notes/update":
      payload = {
        endpoint: "update",
        description: "update a note"
      };
      if (data) {
        let note = notes.updateNote(data.title, data.body, data.id);
        if (note) {
          payload["note"] = note;
        } else {
          payload["updated"] = "Note was updated";
          payload["data"]= notes.fetchNotes()
        }
      }

      break;
    default:
      payload = {
        api: "Notes 0.0.1",
        endpoints: "add, list, delete"
      };
  }

  response.end(JSON.stringify(payload));
});
server.listen(3001);
