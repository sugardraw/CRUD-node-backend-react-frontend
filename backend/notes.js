const fs = require("fs");
const NOTES_STORAGE = "notes.json";

const fetchNotes = () => {
  try {
    const noteString = fs.readFileSync(NOTES_STORAGE);
    return JSON.parse(noteString);
  } catch (e) {
    return [];
  }
};

const saveNotes = notes => {
  fs.writeFileSync(NOTES_STORAGE, JSON.stringify(notes));
};

const addNote = (title, body, id) => {

  console.log(`Adding new note title: ${title}`)

  let notes = fetchNotes();
  let note = {
    title: title,
    body: body,
    id: id
  };

  const doubles = notes.filter(note => {
    return note.id === id;
  });

  if (doubles.length === 0) {
    notes.push(note);
    saveNotes(notes);
    return note;
  }
};

const removeNote = title => {
  const notes = fetchNotes();
  console.log(`Removing note: ${title}`);

  let indexToRemove = null;
  notes.forEach((note, i) => {
    if (note.title === title) {
      indexToRemove = i;
      return;
    }
  });

  notes.splice(indexToRemove, 1);
  fs.writeFileSync(NOTES_STORAGE, JSON.stringify(notes));
};

const updateNote = (title, body, id) => {
  console.log(`Updating note: ${title} body:${body} id: ${id}`);

  let notes = fetchNotes();
  const noteUpdated = {
    title: title,
    body: body,
    id: id
  };

  notes.filter(note => {
    if (note.id === id) {
      notes.splice(notes.indexOf(note), 1, noteUpdated);
    }
  });
  saveNotes(notes);
};

const getNote = title => {
  // console.log(`Getting note: ${title}`);
};

module.exports = {
  addNote,
  fetchNotes,
  getNote,
  removeNote,
  updateNote
};
