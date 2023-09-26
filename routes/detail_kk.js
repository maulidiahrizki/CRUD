const express = require('express');
const router = express.Router();
//import express validator
const {body, validationResult} = require('express-validator');
//import database
const connection = require('../config/db');
const { json } = require('body-parser');

router.get('/', function(req, res){
    connection.query('select * from detail_kk order by id_detail desc', function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Failed',
            })
        }else{
            return res.status(200).json({
                status:true,
                message: 'Data detail_kk',
                data: rows
            })
        }
    })
})

router.post('/store',[
    //validation
    body('id_detail').notEmpty(),
    body('no_kk').notEmpty(),
    body('nik').notEmpty(),
    body('status_hubungan_dalam_keluarga').notEmpty(),
    body('ayah').notEmpty(),
    body('ibu').notEmpty()
],(req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        });
    }
let Data = {
    id_detail: req.body.id_detail,
    no_kk: req.body.no_kk,
    nik: req.body.nik,
    status_hubungan_dalam_keluarga: req.body.status_hubungan_dalam_keluarga,
    ayah: req.body.ayah,
    ibu: req.body.ibu
}
connection.query('insert into detail_kk set ?', Data, function(err, rows){
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

router.get('/:nama', function (req, res) {
    const nama = req.params.nama;

    // Jalankan kueri SQL untuk menggabungkan data dari tiga tabel
    const query = `
        SELECT ktp.nik, ktp.nama_lengkap, ktp.tempat_lahir, ktp.tanggal_lahir,
               ktp.agama, ktp.pendidikan, ktp.jenis_pekerjaan, ktp.golongan_darah, ktp.kewarganegaraan,
               kartu_keluarga.alamat, kartu_keluarga.rt, kartu_keluarga.rw, kartu_keluarga.kode_pos,
               kartu_keluarga.desa_kelurahan, kartu_keluarga.kecamatan, kartu_keluarga.kabupaten_kota, kartu_keluarga.provinsi,
               detail_kk.status_hubungan_dalam_keluarga, detail_kk.ayah, detail_kk.ibu
        FROM ktp
        LEFT JOIN detail_kk ON ktp.nik = detail_kk.nik
        LEFT JOIN kartu_keluarga ON detail_kk.no_kk = kartu_keluarga.no_kk
        WHERE ktp.nama_lengkap = ?`;

    connection.query(query, [nama], function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error'
            });
        }
        if (rows.length <= 0) {
            return res.status(404).json({
                status: false,
                message: 'Data Not Found'
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data KTP, Kartu Keluarga, dan Detail KK',
                data: rows[0]
            });
        }
    });
});


router.patch('/update/:id', [
    body('id_detail').notEmpty(),
    body('no_kk').notEmpty(),
    body('nik').notEmpty(),
    body('status_hubungan_dalam_keluarga').notEmpty(),
    body('ayah').notEmpty(),
    body('ibu').notEmpty()
], (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(422).json({
            error: error.array()
        });
    }
    let id = req.params.id;
    let Data = {
        id_detail: req.body.id_detail,
        no_kk: req.body.no_kk,
        nik: req.body.nik,
        status_hubungan_dalam_keluarga: req.body.status_hubungan_dalam_keluarga,
        ayah: req.body.ayah,
        ibu: req.body.ibu
    };
    connection.query(`UPDATE detail_kk SET ? WHERE id_detail = ${id}`, Data, function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Update succes..!'
            });
        }
    });
});

router.delete('/delete/:id', function(req, res){
    let id = req.params.id;
    if (!id) {
        return res.status(400).json({
            status: false,
            message: 'Bad Request: ID parameter is missing',
        });
    }else{
        connection.query('DELETE FROM detail_kk WHERE id_detail = ?', [id], function(err, result) {
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