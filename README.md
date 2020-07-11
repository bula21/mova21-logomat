# Logomat Frontend - Bula Bauten Übersicht

## Dev setup

    yarn install
    yarn serve
    yarn lint

## Initial setup

    yarn global add @vue/cli
    vue create logomat-frontend

## Docker build

    docker build -t test .
    docker run -it --rm -p 8080:80 test

## Deployment

    ./deploy.sh

Check version deployed: <https://logomat.verteilt.com/version.txt>

## To Do

* CSV-Export: Für alle Tabellen, Export der Tabelle selber (ohne Verbindungen), gefiltert nach Suchfeld
* Übersicht: 1 Anlage aufs mal, siehe <https://avanti.bula21.ch/pages/viewpage.action?pageId=29955349>
* Feedback: <https://avanti.bula21.ch/display/0L/LOGomat+-+Admin>

## Keycloak SSO

> For Single Sign-On (SSO) to function properly, a user with a matching email address must already exist within directus_users. If you would like to manage users externally then you would use our SCIM endpoints. The following SSO options are supported:

1. Entweder: Nur 1 Gast-Login, und dann bei Bestellungen den Namen angeben
2. Oder: Diese App hat ein einfaches Formular, um viele Benutzer mit Email-Adressen und den richtigen Rechten schnell zu erstellen

## Hierarchie

* Anlage
  * Projekt
    * Objekt
    * Dienstleistung
