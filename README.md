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

## Info

Token im User-Objekt via API erscheinen nur für Admins, für normale Benutzer nicht.

## Fonts

We host fonts and icons locally.

* Fonts: See `public/fonts.css`. Generated using <https://google-webfonts-helper.herokuapp.com>.
* Icons: To choose icons: <https://materialdesignicons.com/>. Hosted via `@mdi/font` package.

## Resources

* Logomat Admin Page: <https://avanti.bula21.ch/x/oQTJAQ>
