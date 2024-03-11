const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

fs.readFile('/home/rob/code/DerDieDas/10000.txt', 'utf8', (err, data) => {
    if (err) {
	return console.error(err.message);
    }
    const words = data.split('\n');
    
    const db = new sqlite3.Database('/home/rob/dictionary', (err) => {
	if (err) {
	    return console.error(err.message);
	}
	console.log('connected to db');
    });
    
    db.serialize(() => {
	console.log(words.length, 'words');
	words.forEach((word, index) => {
	    db.run(`update nouns set frequency = ${index} where noun = '${word}'`, (err) => {
		if (err) {
		    return console.error(err.message);
		}
	    });
	    /* db.each(`SELECT * FROM nouns WHERE noun = "${word}"`, (err, row) => {
		if (err) {
		    console.log(`error with word ${word}`);
		    return console.error(err.message);
		}
		console.log(row.index + "\t" + index, "\t" + row.noun);
	    }); */
	});
    });
    
    db.close((err) => {
	if (err) {
	    return console.error(err.message);
	}
	console.log('closed the database');
    });
});
