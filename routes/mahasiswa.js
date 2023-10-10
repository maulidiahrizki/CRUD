const express = require('express');
const router = express.Router();
//import express validator
const {body, validationResult} = require('express-validator');
//import database
const connection = require('../config/db');
const fs = require('fs')
const { json } = require('body-parser');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload= multer({storage: storage})


router.get('/', function(req, res){
    connection.query('select * from mahasiswa order by id_m desc', function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Failed',
            })
        }else{
            return res.status(200).json({
                status:true,
                message: 'Data mahasiswa',
                data: rows
            })
        }
    })
})

router.post('/store', upload.single("gambar"),[
    //validation
    body('nama').notEmpty(),
    body('nrp').notEmpty(),
    body('id_jurusan').notEmpty()
],(req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        });
    }
let Data = {
    nama: req.body.nama,
    nrp: req.body.nrp,
    id_jurusan: req.body.id_jurusan,
    gambar: req.file.filename
}
connection.query('insert into mahasiswa set ?', Data, function(err, rows){
    if(err){
        return res.status(500).json({
            status: false,
            message: 'Server Error',
        })
    }else{
        return res.status(201).json({
            status:true,
            message: 'Succes..!',
            data: rows[0]
        })
    }
})
})

router.get('/:id', function (req, res) {
    connection.query('select a.nama, b.nama_jurusan as jurusan ' + 
    'from mahasiswa a join jurusan b ' +
    'on b.id_j=a.id_jurusan order by a.id_m desc', function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Failed'
            });
        }else {
            return res.status(200).json({
                status: true,
                message: 'Data Mahasiswa',
                data: rows[0]
            });
        }
    });
});

router.patch('/update/:id', upload.single("gambar"), [
    body('nama').notEmpty(),
    body('nrp').notEmpty(),
    body('id_jurusan').notEmpty()
], (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(422).json({
            error: error.array()
        });
    }
    let id = req.params.id;
    // Lakukan pengecekan apakah ada file yang diunggah
    let gambar = req.file ? req.file.filename : null;

    connection.query(`select * from mahasiswa where id_m = ${id}`, function(err, rows) {
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            })
        }
        if(rows.length ===0){
            return res.status(404).json({
                status: false,
                message: 'Not Found',
            })
        }
        const namaFileLama = rows[0].gambar;

        // hapus file lama jika ada
        if (namaFileLama && gambar) {
            const pathFileLama = path.join(__dirname, '../public/images', namaFileLama);
            fs.unlinkSync(pathFileLama)
        }
        
            let Data = {
                nama: req.body.nama,
                nrp: req.body.nrp,
                id_jurusan: req.body.id_jurusan
            };
            connection.query(`UPDATE mahasiswa SET ? WHERE id_m = ${id}`, Data, function (err, rows) {
                if (err) {
                    return res.status(500).json({
                        status: false,
                        message: 'Server Error',
                    });
                } else {
                    return res.status(200).json({
                        status: true,
                        message: 'Update succes..!'
                    })
                }
            })
        })
    })


router.delete('/delete/:id', function(req, res){
    let id = req.params.id;
    if (!id) {
        return res.status(400).json({
            status: false,
            message: 'Bad Request: ID parameter is missing',
        });
    }else{
        connection.query('DELETE FROM mahasiswa WHERE id_m = ?', [id], function(err, result) {
        if (err) {
               return res.status(500).json({
                   status: false,
                   message: 'Server Error',
               });
           } else if (result.affectedRows === 0) {
               return res.status(404).json({
                   status: false,
                   message: 'Data not found',
               });
           } else {
               return res.status(200).json({
                   status: true,
                   message: 'Data has been deleted!',
               });
           }
         })
        }
        });


module.exports = router;