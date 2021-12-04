import pandas as pd
import math

import json
from typing import List, Dict

import requests
import re
# pd.set_option('display.max_columns', 30)

from pathlib import Path

def load_credentials():
    CREDENTIALS_FILE = Path(".credentials.json")

    if not CREDENTIALS_FILE.is_file():
        with open(CREDENTIALS_FILE, "w") as f:
            json.dump(dict(email="", password=""), f, indent="  ")
        raise Exception(f"No credentials file found, please populate {CREDENTIALS_FILE}")

    with open(CREDENTIALS_FILE, "r") as f:
        credentials = json.load(f)
        if not len(credentials["email"]) or not len(credentials["password"]):
            raise Exception(f"Credentials in {CREDENTIALS_FILE} are empty")
        return credentials

class API:
    ROLLE_MOVE_CREW_ID = 5
    def __init__(self, base_url: str, email: str, password: str):
        self._base_url = base_url.strip("/")
        self._email = email
        self._password = password
        self._token = None
        self._user = None

    def login(self):
        r = requests.post(
            self._base_url + "/auth/authenticate",
            json=dict(password=self._password, email=self._email, mode="jwt"),
        )
        assert r.status_code == 200
        data = r.json()["data"]
        self._token = data["token"]
        self._user = data["user"]
        print(f"Logged in as {self._user['email']}")

    def get(self, url_path: str, **xx):
        if "headers" not in xx:
            xx["headers"] = dict()
        xx["headers"]["Authorization"] = f"bearer {self._token}"
        r = requests.get(self._base_url + url_path, **xx)
        # print (r.headers)
        # print (r.request.headers)
        assert r.status_code == 200
        return r.json()

    def post(self, url_path: str, json_: Dict, **xx):
        if "headers" not in xx:
            xx["headers"] = dict()
        xx["headers"]["Authorization"] = f"bearer {self._token}"
        r = requests.post(self._base_url + url_path, json=json_, **xx)
        assert r.status_code == 200
        return r.json()

def load_emails(file: Path):
    # we don't really read the CSV, we simple get all the emails we can find
    with open(file, "r") as f:
        emails = re.findall(r"[a-zA-Z._\-]+@bula21.ch", f.read())
        emails = [e.lower() for e in emails]
        return emails

def create_users(emails: List[str], api: API):
    for email in emails:
        first, _, last = email.partition("@")[0].partition(".")
        first = first.capitalize()
        last = last.replace(".", " ").capitalize()
        user = dict(
            status="active",
            role=ROLLE_MOVE_CREW_ID,
            first_name=first,
            last_name=last,
            email=email,
            password=None,
            company="Automatically Imported",
        )
        resp = api.post("/users", user)["data"]
        print(
            f"Created first_name={resp['first_name']} last_name={resp['last_name']} email={resp['email']}"
        )

def load_collections(api, collection):
    collection_dict = api.get(collection)['data']
    # print (collection_dict)
    #print (collection_dict['fields'])
    collection_df = pd.DataFrame.from_dict(collection_dict)
    return collection_df

def lookup_user(users, user_id):
    if math.isnan(user_id):
        user_name = '-'
    else:
        first_name = users.loc[users['id'] == user_id]['first_name'].values[0]
        last_name = users.loc[users['id'] == user_id]['last_name'].values[0]
        user_name = ' '.join([first_name, last_name])
    #print (user_name)
    return user_name

if __name__ == "__main__":
    creds = load_credentials()
    api = API(BASE_URL, creds["email"], creds["password"])
    api.login()

    users_df = load_collections(api, '/users')
    # print (users_df)
    ressorts_df = load_collections(api, '/items/ressort')
    anlagen_df = load_collections(api, '/items/anlage')
    projekte_df = load_collections(api, '/items/projekt')
    objekte_df = load_collections(api, '/items/objekt')