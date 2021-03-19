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

## Hierarchie

* Anlage
  * Projekt
    * Dienstleistung
    * Objekt
      * Dienstleistung

Dienstleistung:
* Strom
* Wasser
* Abfall
* Abwasser
* Telekom

## CI

Deployment happens through `azure-pipeline.yml`.
Build on every push, deployment on master.

## Resources

* Logomat Admin Page: <https://avanti.bula21.ch/display/0L/LOGomat+-+Admin>
