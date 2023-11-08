const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
app.use(cors())

//membuat route baru dengan method GET yang isinya kalimat halo dek
// app.get('/', (req,res) => {
//   res.send('Halo lovedek')
// })

//import route posts

const path = require('path')
app.use('/static', express.static(path.join(__dirname, 'public/images')))
const bodyPs = require('body-parser'); //import body parsernya
app.use(bodyPs.urlencoded({extended: false}));
app.use(bodyPs.json());

const kartuKeluargaRouter = require('./routes/kartukeluarga');
const ktpRouter = require('./routes/ktp');
const detailKKRouter = require('./routes/detail_kk');
const mhsRouter = require('./routes/mahasiswa');
const jrsRouter = require('./routes/jurusan');

//import rute register dan login
const auth = require('./routes/auth/auth.js');
app.use('/api/auth', auth);

app.use('/api/kartu-keluarga', kartuKeluargaRouter);
app.use('/api/ktp', ktpRouter);
app.use('/api/detail-kk', detailKKRouter);
app.use('/api/mhs', mhsRouter);
app.use('/api/jrs', jrsRouter);



//KITA LISTEN eXPRESS.JS KEDALAM PORT YANG KITA BUAT DIATAS
app.listen(port,() =>{
    //dan kita tampilkan log sebagai penanda bahwa express.js berhasil
    console.log(`aplikasi berjalan di http:://localhost:${port}`)
})