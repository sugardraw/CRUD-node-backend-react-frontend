const http = require('http');
const url = require('url');
const querystring = require('querystring');
const notes = require('./notes');

const server = http.createServer((request, response) => {
    const urlObject = url.parse(request.url);
    const data = querystring.parse(urlObject.query);
    let payload = {};

    response.setHeader('Content-Type', 'application/json');

    switch (urlObject.pathname) {
        case '/api/notes/list':
            payload = {
                endpoint: 'list',
                description: 'List all notes',
            };
        break;
        case '/api/notes/add':
            payload = {
                endpoint: 'add',
                description: 'Add a note',
            };

            if (data.title) {
                let note = notes.addNote(data.title, data.body);
                if (note) {
                    payload['note'] = note;
                } else {
                    payload['error'] = 'Note title already taken';
                }
            }
        break;
        case '/api/notes/delete':
            payload = {
                endpoint: 'delete',
                description: 'Delete a note',
            };
        break;
        default:
            payload = {
                api: 'Notes 0.0.1',
                endpoints: 'add, list, delete',
            };
    }

    response.end(JSON.stringify(payload));
});
server.listen(3001);
