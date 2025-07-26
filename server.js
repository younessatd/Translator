const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { OpenAI } = require('openai');
const translate = require('@vitalets/google-translate-api');

const app = express();
const upload = multer({ dest: 'uploads/' });
const openai = new OpenAI({
  apiKey: "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"
});

app.post('/upload', upload.single('audio'), async (req, res) => {
  try {
    const audioFilePath = req.file.path;

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioFilePath),
      model: "whisper-1"
    });

    const originalText = transcription.text;

    const translated = await translate(originalText, { to: 'ar' });

    fs.unlinkSync(audioFilePath); // حذف الملف المؤقت

    res.json({
      original: originalText,
      translated: translated.text
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("خطأ في السيرفر.");
  }
});

app.listen(3000, () => console.log("🔊 السيرفر شغال على المنفذ 3000"));
