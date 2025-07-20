"use strict";

let anzahlAufgaben = 84; 

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

        const zahl1Formatiert  = formatZahlMitTausendertrennpunkten( this.zahl1  );
        const zahl2Formatiert  = formatZahlMitTausendertrennpunkten( this.zahl2  );
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

    // PDF-Metadaten hinzufügen
    doc.setProperties({
        title: "Rechenaufgaben",
        subject: `Anzahl Rechenaufgaben: ${anzahlAufgaben}, Zahl1: ${zahl1min}-${zahl1max}, Zahl2: ${zahl2min}-${zahl2max}`,
        author: "Rechenaufgabengenerator (Clientseitige Web-App)"
    });

    // Rechenaufgaben paarweise in Zeilen anordnen (2 Spalten)
    const tabellenDaten = [];
    
    for ( let i = 0; i < rechenaufgabenArray.length; i += 2 ) {
        
        const aufgabe1 = rechenaufgabenArray[ i ].getAufgabeAlsString();
        const aufgabe2 = i + 1 < rechenaufgabenArray.length ? 
                                 rechenaufgabenArray[ i + 1 ].getAufgabeAlsString() : '';
        
        tabellenDaten.push( [ aufgabe1, aufgabe2 ] );
    }

    // Tabelle erstellen
    doc.autoTable({
        startY: 20,
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

    // Anzahl der Aufgabenseiten vor dem Hinzufügen der Lösungsseiten merken
    const aufgabenSeiten = doc.internal.getNumberOfPages();

    // Neue Seite für Musterlösung hinzufügen
    doc.addPage();

    // Lösungsdaten vorbereiten (mit Ergebnissen)
    const loesungsDaten = [];
    
    for ( let i = 0; i < rechenaufgabenArray.length; i += 2 ) {
        
        const loesung1 = rechenaufgabenArray[ i ].getLoesungAlsString();
        const loesung2 = i + 1 < rechenaufgabenArray.length ? 
                                 rechenaufgabenArray[ i + 1 ].getLoesungAlsString() : '';
        
        loesungsDaten.push( [ loesung1, loesung2 ] );
    }

    // Lösungstabelle erstellen
    doc.autoTable({
        startY: 20,
        body: loesungsDaten,
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

    // Seitentitel zu allen Seiten hinzufügen
    addPageTitles( doc, aufgabenSeiten );

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
 * Fügt Seitentitel mit Seitenzahlen zu allen Seiten des PDFs hinzu.
 * 
 * @param {jsPDF} doc - Das jsPDF-Dokument
 * @param {number} aufgabenSeiten - Anzahl der Seiten mit Rechenaufgaben
 */
function addPageTitles( doc, aufgabenSeiten ) {

    const pageCount = doc.internal.getNumberOfPages();
    const loesungsSeiten = pageCount - aufgabenSeiten;
    
    for ( let i = 1; i <= pageCount; i++ ) {

        doc.setPage( i );
        doc.setFontSize( 20 );
        
        if ( i <= aufgabenSeiten ) {
            // Seiten mit Rechenaufgaben
            doc.text( `Rechenaufgaben (${i} von ${aufgabenSeiten})`, 105, 15, { align: "center" });
        } else {
            // Seiten mit Musterlösungen
            const loesungsSeiteNummer = i - aufgabenSeiten;
            doc.text( `Musterlösung (Seite ${loesungsSeiteNummer} von ${loesungsSeiten})`, 105, 15, { align: "center" });
        }
    }
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
    const wochentageArray = [ "So", "Mo", "Di", "Mi", "Do", "Fr", "Sa" ];
    const wochentag       = wochentageArray[ currentDate.getDay() ];
    
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    doc.setFontSize(10);
    
    // Seitenzahl und Datum/Zeit für jede Seite hinzufügen
    const pageCount = doc.internal.getNumberOfPages();
    for ( let i = 1; i <= pageCount; i++ ) {

        doc.setPage( i );
        
        // Datum und Zeit links
        doc.text( `Erstellt am: ${dateString} (${wochentag}), ${timeString} Uhr`, 15, pageHeight - 10 );

        // Seitenzahl rechts
        doc.text( `Seite ${i} von ${pageCount}`, pageWidth - 15, pageHeight - 10, { align: "right" });
    }
}
