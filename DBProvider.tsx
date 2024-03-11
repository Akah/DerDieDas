import React from 'react';
import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { useDB } from './db';

type DBContext = SQLiteDatabase | null

export const DBContext = React.createContext<DBContext>(null);

export const DBProvider: React.FC<React.PropsWithChildren> = (props) => {
    const db = useDB();
    return (
        <DBContext.Provider value={db}>
            {props.children}
        </DBContext.Provider>
    );
};

export function useDBContext(): DBContext {
    const context: DBContext = React.useContext(DBContext);
    /* if (context == null) {
*     throw new Error('useDBContext must be used within DBProvider');
* } */
    return context;
}
