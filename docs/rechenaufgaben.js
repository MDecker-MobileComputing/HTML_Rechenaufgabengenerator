"use strict";

let anzahlAufgaben = 10; 

let zahl1min = 9990;
let zahl1max = 999;

let zahl2min = 101;
let zahl2max = 199;


/**
 * Formatiert eine Zahl mit deutschen Tausendertrennpunkten.
 * 
 * @param {number} zahl - Die zu formatierende Zahl
 * 
 * @returns {string} Die formatierte Zahl, z.B. "1.234"
 */
function formatZahlMitTausendertrennpunkten( zahl ) {
    
    return zahl.toLocaleString( "de-DE" );
}


/**
 * Klasse für eine Rechenaufgabe. 
 */
class Rechenaufgabe {
    
    /**
     * Konstruktor für eine Rechenaufgabe.
     * 
     * @param {number} zahl1 - Die erste Zahl
     * 
     * @param {number} zahl2 - Die zweite Zahl
     * 
     * @param {string} operator - Der Operator (z.B. "+", "-", "*", "/")
     * 
     * @param {number} result - Das Ergebnis der Rechenaufgabe
     */
    constructor( zahl1, zahl2, operator, result ) {

        this.zahl1    = zahl1;
        this.zahl2    = zahl2;
        this.operator = operator;
        this.result   = result;
    }

    /**
     * Gibt die Rechenaufgabe ohne Ergebnis zurück
     * @returns {string} Die Aufgabe ohne Lösung, z.B. "1.234 + 567 = "
     */
    getAufgabeAlsString() {

        const zahl1Formatiert = formatZahlMitTausendertrennpunkten( this.zahl1 );
        const zahl2Formatiert = formatZahlMitTausendertrennpunkten( this.zahl2 );
        
        return `${zahl1Formatiert} ${this.operator} ${zahl2Formatiert} = `;
    }

    /**
     * Gibt die Rechenaufgabe als String mit dem Ergebnis zurück
     * @returns {string} Die Rechenaufgabe als String mit dem Ergebnis,
     *                   z.B. "1.234 + 567 = 1.801"
     */
    getLoesungAlsString() {

        const zahl1Formatiert = formatZahlMitTausendertrennpunkten( this.zahl1 );
        const zahl2Formatiert = formatZahlMitTausendertrennpunkten( this.zahl2 );
        const resultFormatiert = formatZahlMitTausendertrennpunkten( this.result );

        return `${zahl1Formatiert} ${this.operator} ${zahl2Formatiert} = ${resultFormatiert}`;
    }
}


/**
 * Event-Handler, der aufgerufen wird, wenn die Webseite geladen wurde.
 */
window.addEventListener( "load", async function () {

    const buttonRechenaufgabenErzeugen = this.document.getElementById( "buttonRechenaufgabenErzeugen" );
    buttonRechenaufgabenErzeugen.addEventListener( "click", onButtonRechenaufgabenErzeugen );
});


/**
 * Gibt eine zufällige Zahl in einem bestimmten Bereich zurück.
 * 
 * @param {number} min - Die untere Grenze (inklusive)
 * 
 * @param {number} max - Die obere Grenze (inklusive)
 * 
 * @returns {number} Eine zufällige Zahl im Bereich von `min` bis `max`
 */
function getZufallszahl( min, max ) {

    return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
}


/**
 * Event-Handler, der aufgerufen wird, wenn der Button "Rechenaufgaben erzeugen" geklickt wird.
 * Erzeugt Rechenaufgaben und schreibt sie dann in eine PDF-Datei.
 */
async function onButtonRechenaufgabenErzeugen() {

    let rechenaufgabenArray = [];

    for( let i = 0; i < anzahlAufgaben; i++ ) {

        // Zufällige Zahlen generieren
        let zahl1 = getZufallszahl( zahl1min, zahl1max );
        let zahl2 = getZufallszahl( zahl2min, zahl2max );

        // Zufälligen Operator wählen
        let operator = Math.random() < 0.5 ? "+" : "-";

        // Ergebnis berechnen
        let ergebnis;
        if ( operator === "+" ) {

            ergebnis = zahl1 + zahl2;

        } else {

            ergebnis = zahl1 - zahl2;
        }


        let rechenaufgabe = new Rechenaufgabe( zahl1, zahl2, operator, ergebnis );
        rechenaufgabenArray.push( rechenaufgabe );
    }

    writeRechenaufgabenToPDF( rechenaufgabenArray );
};


/**
 * Erstellt PDF mit den Rechenaufgaben.
 * 
 * @param {Array<Rechenaufgabe>} rechenaufgabenArray In PDF-Datei zu schreibende Rechenaufgaben
 */
function writeRechenaufgabenToPDF( rechenaufgabenArray ) {

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();


    doc.setFontSize( 20 );
    doc.text( "Rechenaufgaben", 105, 20, { align: "center" });

    // Tabellendaten vorbereiten
    const tabellenDaten = [];
    
    // Rechenaufgaben paarweise in Zeilen anordnen (2 Spalten)
    for ( let i = 0; i < rechenaufgabenArray.length; i += 2 ) {
        
        const aufgabe1 = rechenaufgabenArray[ i ].getAufgabeAlsString();
        const aufgabe2 = i + 1 < rechenaufgabenArray.length ? 
                                 rechenaufgabenArray[ i + 1 ].getAufgabeAlsString() : '';
        
        tabellenDaten.push( [ aufgabe1, aufgabe2 ] );
    }

    // Tabelle erstellen
    doc.autoTable({
        startY: 35,
        body: tabellenDaten,
        styles: {
            fontSize: 14,
            cellPadding: 3,
            halign: "left"
        },
        alternateRowStyles: {
            fillColor: [ 255, 255, 255 ] // Weiß für alle Zeilen
        },
        columnStyles: {
            0: { cellWidth: 90 },
            1: { cellWidth: 90 }
        },
        margin: { top: 35, left: 15, right: 15 }
    });

    // Footer hinzufügen
    writeFooterToPDF( doc );

    // PDF im Browser-Tab zur Vorschau öffnen
    const pdfBlob = doc.output( "blob");
    const pdfUrl = URL.createObjectURL( pdfBlob );
    window.open( pdfUrl, "_blank" );

    // Optional: PDF auch als Download anbieten
    // doc.save( "rechenaufgaben.pdf" );
}


/**
 * Schreibt den Footer mit aktuellem Datum, Wochentag und Uhrzeit in das PDF.
 * 
 * @param {jsPDF} doc - Das jsPDF-Dokument
 */
function writeFooterToPDF( doc ) {

    const currentDate = new Date();
    
    // Datum und Zeit separat formatieren
    const dateString = currentDate.toLocaleDateString( "de-DE", {
        year : "numeric",
        month: "2-digit",
        day  : "2-digit"
    });
    
    const timeString = currentDate.toLocaleTimeString( "de-DE", {
        hour  : "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
    
    // Wochentag auf Deutsch ermitteln
    const weekdays = [ "So", "Mo", "Di", "Mi", "Do", "Fr", "Sa" ];
    const weekday = weekdays[currentDate.getDay()];
    
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.text( `Erstellt am: ${dateString} (${weekday}), ${timeString} Uhr`, 15, pageHeight - 10 );
}
