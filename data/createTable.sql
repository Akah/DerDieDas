CREATE TABLE "nouns" (
       "index" 	     INTEGER UNIQUE,
       "noun"  	     TEXT,
       "gender"	     TEXT,
       "gender2"     TEXT,
       "gender3"     TEXT,
       "frequency"   INTEGER,
       PRIMARY KEY("index", AUTOINCREMENT)
);
