from flask import Flask
from flask.json import jsonify
from flask import request
from flask import render_template
import requests
app = Flask(__name__)


@app.route('/getindexcards')
def get_index_cards():
    contents = requests.get("https://lingua-9c27a.firebaseio.com/.json").text
    return contents

@app.route('/practice')
def practice():
    return render_template('flash.html')

@app.route('/createindexcard', methods=['POST'])
def create_index_card():
    payload = {
        'original': request.values['original'],
        'translation': request.values['translation'],
        'url': request.values['url']
    }
    contents = requests.post("https://lingua-9c27a.firebaseio.com/.json", json=payload).text
    return contents
