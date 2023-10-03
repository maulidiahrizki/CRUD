const express = require('express');
const app = express();
const port = 2023;

//membuat route baru dengan method GET yang isinya kalimat halo dek
// app.get('/', (req,res) => {
//   res.send('Halo lovedek')
// })

//import route posts

const bodyPs = require('body-parser'); //import body parsernya
app.use(bodyPs.urlencoded({extended: false}));
app.use(bodyPs.json());

const alattangkapRouter = require('./routes/alattangkap');
const dpiRouter = require('./routes/dpi');
const kapalRouter = require('./routes/kapal');
const pemilikRouter = require('./routes/pemilik');
app.use('/api/alattangkap', alattangkapRouter);
app.use('/api/dpi', dpiRouter);
app.use('/api/kapal', kapalRouter);
app.use('/api/pemilik', pemilikRouter);

//KITA LISTEN eXPRESS.JS KEDALAM PORT YANG KITA BUAT DIATAS
app.listen(port,() =>{
    //dan kita tampilkan log sebagai penanda bahwa express.js berhasil
    console.log(`aplikasi berjalan di http:://localhost:${port}`);
})