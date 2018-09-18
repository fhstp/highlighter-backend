# ![HighLighter](https://github.com/fhstp/highlighter-webextension/raw/master/app/images/Logo_contractVis.png) Backend

Buying a product or signing up for a service implicates a contract between the consumer and the merchant or provider.
The average web user is often worried about the possible consequences from such a contract.
They are worried in particular when they interact with a new web shop or when the general terms and conditions are updated.
However, each contract involves a multitude of legal text that is hard to read and understand.

**ContractVis HighLighter** provides sophisticated text visualization support for online shopping,
yet targets non-professional users in a casual context without training.

ContractVis HighLighter consists of three components:
* a [web extension](https://github.com/fhstp/highlighter-webextension),
* a [web app](https://github.com/fhstp/highlighter-webapp), and
* a backend server (this package).

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Tags**: node.js, TypeScript, and Visual Studio Code

## Installation

Server Voraussetzungen:

-   Eine NPM und NodeJS kompatible Serverarchitektur

-   NPM Version \> 5.6.0

-   NVM Version \> 0.33.8

-   NodeJS Version \> 8.10.0

-   HTTPS SSL Zertifikat (lets encrypt oder acme.sh oder aus anderer Quelle)

    -   Benötigt werden: cert.pem und key.pem

-   Port Freigabe in der Firewall

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

## Endpoints

-   https://url/agb -> url ist die Domain des betreffenden Servers!

- Übergeben werden müssen im Body:
    -   text -> Die zu prozessierende AGB.
    -   search -> Ein Array aus Begriffen nach denen im Text gesucht werden soll.

## Acknowledgments

This work is supported by the [Internet Foundation Austria (IPA)](https://www.netidee.at/)
via the netidee project [ContractVis](http://contractvis.fhstp.ac.at/) (no. 2116).
