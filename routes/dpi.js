const express = require('express');
const router = express.Router();
//import express validator
const {body, validationResult} = require('express-validator');
//import database
const connection = require('../config/db');
const { json } = require('body-parser');

router.get('/', function(req, res){
    connection.query('select * from dpi order by id_dpi desc', function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Failed',
            })
        }else{
            return res.status(200).json({
                status:true,
                message: 'Data dpi',
                data: rows
            })
        }
    })
})

router.post('/store',[
    //validation
    body('id_dpi').notEmpty(),
    body('nama_dpi').notEmpty(),
    body('luas').notEmpty()
],(req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        });
    }
let Data = {
    id_dpi: req.body.id_dpi,
    nama_dpi: req.body.nama_dpi,
    luas: req.body.luas
}
connection.query('insert into dpi set ?', Data, function(err, rows){
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
    let id = req.params.id;
    connection.query(`select * from dpi where id_dpi = ${id}`, function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error'
            });
        }
        if (rows.length <= 0) {
            return res.status(404).json({
                status: false,
                message: 'Not Found',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data Dpi',
                data: rows[0]
            });
        }
    });
});

router.patch('/update/:id', [
    body('id_dpi').notEmpty(),
    body('nama_dpi').notEmpty(),
    body('luas').notEmpty()
], (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(422).json({
            error: error.array()
        });
    }
    let id = req.params.id;
    let Data = {
        id_dpi: req.body.id_dpi,
        nama_dpi: req.body.nama_dpi,
        luas: req.body.luas
    };
    connection.query(`UPDATE dpi SET ? WHERE id_dpi = ${id}`, Data, function (err, rows) {
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
        connection.query('DELETE FROM dpi WHERE id_dpi = ?', [id], function(err, result) {
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