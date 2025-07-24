"use strict";


/**
 * Initialisiert die IndexedDB-Datenbank.
 */
(async () => {

    await alasql( "CREATE INDEXEDDB DATABASE IF NOT EXISTS konfig_db"  );
    await alasql( "ATTACH INDEXEDDB DATABASE konfig_db" );
    await alasql( "USE konfig_db" );
    await alasql( `CREATE TABLE IF NOT EXISTS konfigurationen (
                     id INT IDENTITY PRIMARY KEY,
                     name STRING,
                     anzahl INT,
                     min1 INT,
                     min2 INT,
                     max1 INT,
                     max2 INT )`
                );
    console.log( "Datenbank initialisiert." );
})();


/**
 * Speichert eine neue Rechenaufgabe-Konfiguration in der Datenbank.
 *
 * @param {*} name Name der Rechenaufgabe-Konfiguration
 * @param {*} anzahl Anzahl zu erstellende Rechenaufgaben
 * @param {*} min1 Minimum für die erste Zahl
 * @param {*} min2 Minimum für die zweite Zahl
 * @param {*} max1 Maximum für die erste Zahl
 * @param {*} max2 Maximum für die zweite Zahl
 * @returns ID der gespeicherten Konfiguration
 */
async function speichereKonfiguration( name, anzahl, min1, min2, max1, max2 ) {

    const result = await alasql( `INSERT INTO konfigurationen
                                    (name, anzahl, min1, min2, max1, max2)
                                    VALUES (?, ?, ?, ?, ?, ?)`,
                                 [ name, anzahl, min1, min2, max1, max2 ] );

    const newId = result[0];
    console.log( `Konfiguration "${name}" gespeichert mit ID ${newId}.` );
    return newId;
}