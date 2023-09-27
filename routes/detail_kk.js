const express = require('express');
const router = express.Router();
//import express validator
const {body, validationResult} = require('express-validator');
//import database
const connection = require('../config/db');
const { json } = require('body-parser');

router.get('/', (req, res) => {
    connection.query('SELECT detail_kk.id_detail, detail_kk.no_kk, ktp_nama.nama_lengkap AS nama, detail_kk.status_hubungan_dalam_keluarga, ktp_ayah.nama_lengkap AS ayah, ktp_ibu.nama_lengkap AS ibu FROM detail_kk LEFT JOIN ktp AS ktp_nama ON detail_kk.nik = ktp_nama.nik LEFT JOIN ktp AS ktp_ayah ON detail_kk.ayah = ktp_ayah.nik LEFT JOIN ktp AS ktp_ibu ON detail_kk.ibu = ktp_ibu.nik', (err, rows) => {
        if (err) {
            console.error('Error retrieving detail_kk data:', err);
            return res.status(500).json({ status: false, message: 'Server Error' });
        }
        console.log('detail_kk data retrieved successfully');
        return res.status(200).json({ status: true, message: 'Data detail_kk', data: rows });
    });
});

router.post('/store',[
    //validation
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

router.get('/:id', function (req, res) {
    connection.query('SELECT detail_kk.id_detail, detail_kk.no_kk, ktp_nama.nama_lengkap AS nama, detail_kk.status_hubungan_dalam_keluarga, ktp_ayah.nama_lengkap AS ayah, ktp_ibu.nama_lengkap AS ibu FROM detail_kk LEFT JOIN ktp AS ktp_nama ON detail_kk.nik = ktp_nama.nik LEFT JOIN ktp AS ktp_ayah ON detail_kk.ayah = ktp_ayah.nik LEFT JOIN ktp AS ktp_ibu ON detail_kk.ibu = ktp_ibu.nik', (err, rows) => {
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
                const result = {
                    status: true,
                    message: 'Detail no_kk',
                    data: rows[0]
                };
                return res.status(200).json(result);
            }
        }
    )
    })




router.patch('/update/:id', [
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