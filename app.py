from flask import Flask, render_template, make_response, request
import pandas as pd
import json
from datetime import datetime

app = Flask(__name__)

data = pd.read_excel('data/letter_latest.xlsx')
original_data = data.to_dict(orient='records')

@app.route('/')
def index():
    timestamp = int(datetime.now().timestamp())
    return render_template('/home.html', data = original_data, timestamp = timestamp)

if __name__ == '__main__':
    # app.run(port=45982)
    app.run()
