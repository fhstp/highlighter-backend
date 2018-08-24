Readme Backend Installation von ContractViz 
============================================

Server Voraussetzungen:

-   Eine NPM und NodeJS kompatible Serverarchitektur

-   NPM Version \> 5.6.0

-   NVM Version \> 0.33.8

-   NodeJS Version \> 8.10.0

-   HTTPS SSL Zertifikat (lets encrypt oder acme.sh oder aus anderer Quelle)

    -   Benötigt werden: cert.pem und key.pem

-   Port Freigabe in der Firewall

NPM Packages (nur projektspezifische Packages werden erklärt, für alle anderen
siehe package.json):

-   Text-miner -\> 1.0.5

    -   <https://github.com/Planeshifter/text-miner>

        -   Viele Text-Mining Methoden bereits implementiert

        -   Text Cleaner, Weighting, Corpus Erstellung

NodeJS Einrichtung

-   Nach der Installation kann das Repository in ein Verzeichnis Ihrer Wahl
    geclont oder entpackt werden.

-   „npm install“ – zur Installation aller benötigten Packages nach package.json
    ausfüllen.

-   Im Projekt die .env Datei öffnen oder anlegen und die benötigten Daten
    entsprechend ausfüllen:

    -   SERVER_PORT = XXXX

-   In den Ordner ssl die benötigten SSL Zertifikate cert.pem und key.pem
    kopieren oder verlinken.

-   „npm start“ ausführen.

Endpoints

-   https://url/agb -> url ist die Domain des betreffenden Servers!

- Übergeben werden müssen im Body:
    -   text -> Die zu prozessierende AGB.
    -   search -> Ein Array aus Begriffen nach denen im Text gesucht werden soll.