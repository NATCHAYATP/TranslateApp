import json
from flask import Flask, request
from googletrans import Translator
import base64
import pytesseract

app = Flask(__name__)

data = []

@app.route('/')
def hello():
  q = request.args.get('q')
  print(q)
  data.append(q)
  return { "message": "Hello!" }, 201

@app.route('/learn', methods=['POST','GET'])
def learn():
    if request.method == 'POST':
        body = request.get_json()
        data.append(body)

        return { "message": "finish", "data": body }, 201
    elif request.method == 'GET':
        new_txt = ""
        translator = Translator()
        #pic = json.dumps(data)
        #txt = data.text
        #txt = translator.translate(txt, dest='th', src='en')
        pic1 = data[0]
        pic2 = pic1['picture']
        pic3 = pic2.encode('utf-8')
        with open("imageToSave.png", "wb") as fh:
            fh.write(base64.decodebytes(pic3))

        txt = pytesseract.image_to_string("imageToSave.png", lang='eng')
        txt = txt.split('\n')
        for i in txt :
            new_txt = new_txt+' '+i
    
        r=translator.translate(new_txt, dest='th', src='en')


        return { "translate": r.text}, 200

if __name__ == '__main__':
    app.run(debug = True)