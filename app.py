from flask import Flask, render_template, make_response, request
import pandas as pd
import json
from datetime import datetime

app = Flask(__name__)

data = pd.read_excel('data/letter.xlsx')
original_data = data.to_dict(orient='records')
filtered_data = original_data

def filter():
    filterBy = {'通讯关系': False, '作者生年': True, '作者卒年': True}
    relationFtr = ['致书Y', '答Y书', '向Y致贺', '致Y啓', '代Y作文']
    birthYFtr = {'startY': 1500, 'endY': 1601}  # 含左不含右
    deathYFtr = {'startY': 1500, 'endY': 1601}  # 含左不含右

    if filterBy['通讯关系']:
        filtered_data = [item for item in filtered_data if item['通讯关系'] in relationFtr]
    if filterBy['作者生年']:
        filtered_data = [
            item for item in filtered_data if not pd.isna(item['作者生年'])]
        filtered_data = [item for item in filtered_data if birthYFtr['startY'] <= int(
            float(str(item['作者生年']).replace('≈', ''))) < birthYFtr['endY']]
    if filterBy['作者卒年']:
        filtered_data = [
            item for item in filtered_data if not pd.isna(item['作者卒年'])]
        filtered_data = [item for item in filtered_data if deathYFtr['startY'] <= int(
            float(str(item['作者卒年']).replace('≈', ''))) < deathYFtr['endY']]

    filtered_df = pd.DataFrame(filtered_data)
    # filtered_df.to_excel('data/filtered_data.xlsx', index=False)

@app.route('/search', methods=['POST'])
def search():
    data = request.get_json()
    search_key = data.get('searchKey')
    
    # 在这里处理传递过来的搜索关键字search_key
    # 进行相应的搜索操作，可以调用其他函数或者API来处理搜索逻辑

    # 返回响应给前端
    response_data = {'status': 'success', 'message': 'Search successful'}
    return jsonify(response_data)

@app.route('/')
def index():
    timestamp = int(datetime.now().timestamp())
    return render_template('/home.html', data = original_data, timestamp = timestamp)

if __name__ == '__main__':
    # app.run(port=45982)
    app.run()
