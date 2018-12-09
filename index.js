const {readFile, readFileSync} = require('fs');
const decodeImage = require('jimp').read;
const qrcodeReader = require('qrcode-reader');

const express = require('express');
const app = express();
const port = 3000;
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

const indexCache = readFileSync('./index.html');

app.get('/', function(req, res) {
  res.redirect('/index.html');
});
app.get('/index.html', function(req, res) {
  res.setHeader('charset', 'utf-8');
  res.setHeader('Content-Type', 'text/html');
  res.send(indexCache);
});

app.post('/api/decode', multipartMiddleware, function(req, res) {
  let filePath = '';

  try {
    if (req.files.imageFile.path) filePath = req.files.imageFile.path;
  } catch (e) {
    return res.json({code: 500, content: 'request params error.'});
  }

  readFile(filePath, function(errorWhenReadUploadFile, fileBuffer) {
    if (errorWhenReadUploadFile) return res.json({code: 501, content: 'read upload file error.'});
    decodeImage(fileBuffer, function(errorWhenDecodeImage, image) {
      if (errorWhenDecodeImage) return res.json({code: 502, content: errorWhenDecodeImage});
      let decodeQR = new qrcodeReader();
      decodeQR.callback = function(errorWhenDecodeQR, result) {
        if (errorWhenDecodeQR) return res.json({code: 503, content: errorWhenDecodeQR});
        if (!result) return res.json({code: 404, content: 'gone with wind'});
        return res.json({code: 200, content: result.result, points: result.points});
      };
      decodeQR.decode(image.bitmap);
    });
  });
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
