import React from 'react';
import { SQLError, SQLiteDatabase, enablePromise, openDatabase } from 'react-native-sqlite-storage';

import * as nouns from './data/nouns.json';

export type Gender = 'm' | 'f' | 'n';

export interface Noun {
    index: number,
    noun: string,
    gender: Gender | null,
    gender2: Gender | null,
    gender3: Gender | null,
    frequency: number | null,
}

class Logger {
    static overwritePreviousLine(message: string) {
        console.debug('\x1b[1A\x1b[K' + message);
    }
}

enablePromise(true);

async function onSuccess(db: SQLiteDatabase): Promise<void> {
    console.log('successfully connected to database');
    const tables = await getTableNames(db);
    console.log(tables);
    if (!tables.includes('nouns')) {
        console.debug('creating table');
        await createNounTable(db);
    } else {
        console.debug('not creating table');
    }
    const count = await countTable(db);
    console.debug('size', count);
    if (count > 0) {
        return;
    }
    await insertData(db);
}

function onError(error: SQLError): void {
    console.error(error);
    throw Error('Could not connect to database');
}

export const connectToDatabase = async () => {
    const db = openDatabase(
        {
	    name: 'dictionary.db',
	    createFromLocation: 1,
        },
        onSuccess,
        onError,
    );
    return db;
};

export const dropTable = async (db: SQLiteDatabase) => {
    const statement = 'DROP TABLE IF EXISTS nouns';
    const results = await db.executeSql(statement);
    console.debug('dropped table');
    return results[0].rows.item(0);
};

export async function countTable(db: SQLiteDatabase): Promise<number> {
    const statement = 'SELECT count(*) as count from nouns';
    const start = Date.now();
    const results = await db.executeSql(statement);
    const end = Date.now();
    console.debug(statement, end - start, 'ms');
    return results[0].rows.item(0).count;
}

export const createNounTable = async (db: SQLiteDatabase) => {
    const statement =
	`CREATE TABLE "nouns" (
 	    "index"	INTEGER UNIQUE,
 	    "noun"	TEXT,
 	    "gender"	TEXT,
 	    "gender2"	TEXT,
 	    "gender3"	TEXT,
 	    "frequency"	INTEGER,
 	    PRIMARY KEY("index" AUTOINCREMENT)
         )`;
    db.executeSql(statement);
};

export const getTableNames = async (db: SQLiteDatabase): Promise<string[]> => {
    try {
        const tableNames: string[] = [];
        const results = await db.executeSql(
	    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
        );
        results?.forEach((result) => {
	    for (let index = 0; index < result.rows.length; index++) {
                tableNames.push(result.rows.item(index).name);
	    }
        });
        return tableNames;
    } catch (error) {
        console.error(error);
        throw Error('Failed to get table names from database');
    }
};

export const insertData = async (db: SQLiteDatabase) => {
    const data = nouns as Array<Noun>;
    const batchSize = 500;
    const max = 110000;

    const start = Date.now();
    console.debug('');
    try {
        let i = 0;
        for (; i < max; i++) {
            const noun: Noun = data[i];
            if (!noun) {continue;}

            if (i > 0 && i % batchSize === 0) {
                Logger.overwritePreviousLine(`${i}/${max}`);
                await executeBatch(db);
            }

            const valuesString = `("${noun.noun}", '${noun.gender}', '${noun.gender2}', '${noun.gender3}', '${noun.frequency}')`;
            batch.push(valuesString);
        }

        if (batch.length > 0) {
            Logger.overwritePreviousLine(`${i}/${max}`);
            await executeBatch(db);
        }
        const end = Date.now();
        console.debug('finished inserting');
        console.debug('time taken =', (end - start) / 1000, 's');
    } catch (error) {
        console.error('insertData Error:', error);
    }
};

async function executeBatch(db: SQLiteDatabase) {
    const valuesString = batch.join(', ');
    batch = []; // Reset the batch
    await db.executeSql(`
        INSERT INTO nouns (noun, gender, gender2, gender3, frequency) VALUES ${valuesString};
    `);
}

let batch: Array<string> = [];


export const removeData = async (db: SQLiteDatabase, index: number) => {
    try {
        return db.executeSql(`DELETE FROM nouns WHERE \`index\` = ${index};`);
    } catch (error) {
        console.error('insertData Error:', error);
    }
};

function testNull<T>(value: T): T | null {
    return value === 'null' ? null : value;
}

function resultToNoun(result: any): Noun {
    return {
        frequency: testNull(result.frequency),
        noun: testNull(result.noun),
        index: testNull(result.index),
        gender: testNull(result.gender),
        gender2: testNull(result.gender2),
        gender3: testNull(result.gender3),
    };
}

export const read: (db: SQLiteDatabase, limit?: number) => Promise<Array<Noun>> = async (db) => {
    const nouns: Array<Noun> = [];
    try {
        const results = await db.executeSql('SELECT * FROM nouns LIMIT 100');
        // console.log(results);
        results?.forEach((result) => {
	    for (let index = 0; index < result.rows.length; index++) {
                const noun: Noun = resultToNoun(result.rows.item(index));
                nouns.push(noun);
            }
        });
        // console.log('nouns', nouns);
    } catch (error) {
        // console.error('readAll error:', error);
    } finally {
        return nouns;
    }
};

export function useDB(): SQLiteDatabase | null {
    const [ db, setDB ] = React.useState<SQLiteDatabase| null>(null);
    React.useEffect(
        () => {
	    const connect = async () => {
                const timeStart = Date.now();
                console.debug('connecting to db...');
                const connection = await connectToDatabase();
                setDB(connection);
                const timeEnd = Date.now();
                console.debug('connected to db after', timeEnd - timeStart, 'ms');
	    };
	    connect();
	    return () => { db?.close(); };
        },
        []
    );
    return db;
}

export function useDictionary(db: SQLiteDatabase): Array<Noun> | null {
    const [ dictionary, setDictionary ] = React.useState<Array<Noun>|null>(null);

    React.useEffect(
        () => {
	    const foo = async () => {
                if (db != null) {
		    const result = await read(db);
		    setDictionary(result);
                }
	    };
	    foo();
        },
        [ db ]
    );
    // console.debug('dictionary', dictionary?.length);
    return dictionary;
}
