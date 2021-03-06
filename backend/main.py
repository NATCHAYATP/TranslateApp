from flask import Flask, request
from googletrans import Translator
import base64
import pytesseract
import time;
from PIL import Image
import io

app = Flask(__name__)

textTran = {}
@app.route('/')
def hello():
  q = request.args.get('q')
  print(q)
  return { "message": "Hello!" }, 201

@app.route('/learn', methods=['POST','GET'])
def learn():
    if request.method == 'POST':
        t0 = int(round(time.time() * 1000))
        new_txt = ""
        translator = Translator()
        body = request.get_json()

        pic1 = body['picture']
        pic2 = pic1.encode('utf-8')
        pic3 = base64.decodebytes(pic2)
            
        byte_array_image = bytes_to_image(pic3)
        txt = pytesseract.image_to_string(byte_array_image, lang='eng')

        txt = txt.split('\n')
        for i in txt :
            new_txt = new_txt+' '+i
        
        r=translator.translate(new_txt, dest='th', src='en')
        textTran['data'] = r.text
        textTran['word'] = new_txt

        #data.append(body)
        t1 = int(round(time.time() * 1000))
        print('post use',t1-t0, 'milliseconds.')

        return { "message": "finish", "tranFinish": textTran }, 201
    elif request.method == 'GET':

        return { "translate": (textTran['data']), "word":(textTran['word'])}, 200

def bytes_to_image(image_bytes):
    io_bytes = io.BytesIO(image_bytes)
    return Image.open(io_bytes)

if __name__ == '__main__':
    app.run(debug = True)