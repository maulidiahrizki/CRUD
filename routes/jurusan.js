const express = require('express');
const router = express.Router();
//import express validator
const {body, validationResult} = require('express-validator');
//import database
const connection = require('../config/db');
const { json } = require('body-parser');

const authenticateToken = require('../routes/auth/midleware/authenticateToken')

router.get('/', authenticateToken, function(req, res){
    connection.query('select * from jurusan order by id_j desc', function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Failed',
            })
        }else{
            return res.status(200).json({
                status:true,
                message: 'Data jurusan',
                data: rows
            })
        }
    })
})

router.post('/store', authenticateToken, [
    //validation
    body('nama_jurusan').notEmpty(),
],(req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        });
    }
let Data = {
    nama_jurusan: req.body.nama_jurusan
}
connection.query('insert into jurusan set ?', Data, function(err, rows){
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

router.get('/:id', authenticateToken,  function (req, res) {
    let id = req.params.id;
    connection.query(`select * from jurusan where id_j = ${id}`, function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Failed'
            });
        }else {
            return res.status(200).json({
                status: true,
                message: 'Data jurusan',
                data: rows[0]
            });
        }
    });
});

router.patch('/update/:id', authenticateToken, [
    body('nama_jurusan').notEmpty()
], (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(422).json({
            error: error.array()
        });
    }
    let id = req.params.id;
    let Data = {
        nama_jurusan: req.body.nama_jurusan
    };
    connection.query(`UPDATE jurusan SET ? WHERE id_j = ${id}`, Data, function (err, rows) {
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

router.delete('/delete/:id', authenticateToken, function(req, res){
    let id = req.params.id;
    if (!id) {
        return res.status(400).json({
            status: false,
            message: 'Bad Request: ID parameter is missing',
        });
    }else{
        connection.query('DELETE FROM jurusan WHERE id_j = ?', [id], function(err, result) {
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