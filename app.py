from flask import Flask, render_template
import pandas as pd

app = Flask(__name__)

df = pd.read_excel('data/letter.xlsx')
original_data = df.to_dict(orient='records')
data = original_data

@app.route('/')
def index():
    return render_template('/home.html', data=data)

if __name__ == '__main__':

    app.run()