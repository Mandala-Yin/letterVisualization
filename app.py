from flask import Flask, render_template
import pandas as pd

app = Flask(__name__)

filterBy = {'通讯关系': False, '作者生年': True, '作者卒年': True}
relationFtr = ['致书Y', '答Y书', '向Y致贺', '致Y啓', '代Y作文']
birthYFtr = {'startY': 1500, 'endY': 1601} # 含左不含右
deathYFtr = {'startY': 1500, 'endY': 1601} # 含左不含右

df = pd.read_excel('data/letter.xlsx')
# df = pd.read_excel('data/test.xlsx')
filtered_data = df.to_dict(orient='records')
if filterBy['通讯关系']:
    filtered_data = [item for item in filtered_data if item['通讯关系'] in relationFtr]
if filterBy['作者生年']:
    filtered_data = [item for item in filtered_data if not pd.isna(item['作者生年'])]
    filtered_data = [item for item in filtered_data if birthYFtr['startY'] <= int(float(str(item['作者生年']).replace('≈', ''))) < birthYFtr['endY']]
if filterBy['作者卒年']:
    filtered_data = [item for item in filtered_data if not pd.isna(item['作者卒年'])]
    filtered_data = [item for item in filtered_data if deathYFtr['startY'] <= int(float(str(item['作者卒年']).replace('≈', ''))) < deathYFtr['endY']]

# print(filtered_data)
filtered_df = pd.DataFrame(filtered_data)
filtered_df.to_excel('data/filtered_data.xlsx', index=False)

# @app.route('/')
# def index():
#     return render_template('/home.html', data=data)

if __name__ == '__main__':
    # app.run(host='0.0.0.0', port=5000)
    pass