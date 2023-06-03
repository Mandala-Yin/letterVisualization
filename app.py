from flask import Flask, render_template
import pandas as pd

app = Flask(__name__)

@app.route('/')
def index():
    # 读取 Excel 文件
    df = pd.read_excel('data/letter.xlsx')

    # 将数据转换为字典列表
    data = df.to_dict(orient='records')

    return render_template('/home.html', data=data)

if __name__ == '__main__':
    app.run()
