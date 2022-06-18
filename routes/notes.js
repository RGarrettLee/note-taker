const notes = require('express').Router();
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { writeToFile, readAndAppend } = require('../helpers/fsUtils');

notes.get('/', (req, res) => {
    let data = fs.readFileSync(path.join(__dirname, '../db/db.json'));
    let json = JSON.parse(data);
    res.json(json);
});

notes.post('/', (req, res) => {
    const { title, text } = req.body;

    if (title && text) {
        let newNote = {
            id: uuidv4(),
            title: title,
            text: text
        }
        readAndAppend(newNote, path.join(__dirname, '../db/db.json'));
        res.json('post received')
    } else {
        res.json('Error with post');
    }
});

notes.delete('/:note_id', (req, res) => {
    let data = fs.readFileSync(path.join(__dirname, '../db/db.json'));
    let notes = JSON.parse(data);
    let index = 0;

    for (let i = 0; i < notes.length; i++) {
        console.info(notes[i].id);
        if (notes[i].id === req.params.note_id) {
            console.info(i);
            index = i;
            break;
        }
    }

    notes.splice(index, 1);

    writeToFile(path.join(__dirname, '../db/db.json'), notes);
    res.json('note deleted')
});

module.exports = notes;