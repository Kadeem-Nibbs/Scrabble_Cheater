![](https://i.imgur.com/qMKbh73.png)

# Scrabble Cheater

Scrabble Cheater uses a trie traversal algorithm to compute the top scoring plays in Words with Friends and Scrabble.  To display words to users, we connected a Flask API to a React frontend via websockets.  The application can be used at https://wordswithfiends.com.  We only support English games at the moment, but we will soon offer support for additional languages, beginning with French and Spanish.

## Installation

#### API:

  Navigate to to `scrabble_cheater/` to install dependencies: 
  ```
  pip install -r requirements.txt`
  ```

#### Frontend:
Need to have Praceljs installed globally:
```
npm install -g parcel-bundler
npm run install
```

## Deployment

To use PyPy:
  Create a virtualenv to use with PyPy:
    `virtualenv -p /path/to/pypy venv`
  Activate the virtualenv and install the requirements:
    `pip install -r requirements.txt`
  Run server:
    `pypy server.py`
   
To use CPython:
  ```
  pip install -r requirements.txt
  python server.py
  ```

After doing one of the above, nativate to `scrabble_cheater/frontend/` to run the development server:
```
npm run dev
```
The application will be running on localhost:1234

## Testing
Run frontend tests: 

`npm run test`

If you make changes to existing components, update the components snapshot by running:

`npm run jest --updateSnapshot`
