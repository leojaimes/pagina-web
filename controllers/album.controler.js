'use strict'
var Album = require('../models/album.model');

function getAlbum(req, res) {
    var albumId = req.params.id;
    Album.findById(albumId, (err, album) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición' + err });
        } else {
            if (album) {
                res.status(200).send({ album });
            }
            else {
                res.status(404).send({ message: 'El album no existe' });
            }
        }
    });

}//end función getAlbum


function getAlbums(req, res) {
    Album.find({}).sort({ title: 'asc' }).exec((err, albumnes) => {
        if (err) {
            res.status(500).send({ message: 'Error al consultar los albumnes' + err });
        }
        if (albumnes) {
            res.status(200).send({ albumnes });
        } else {
            res.status(404).send({ message: 'No encontré albumnes' });
        }
    });

}


function createAlbum(req, res) {
    var params = req.body;
    var album = new Album();
    album.title = params.title;
    album.description = params.description;



    album.save((err, albumStored) => {
        if (err) {
            res.status(500).send({ message: 'Error al ejecutar createAlbum' + err });
        } else {
            res.status(200).send({
                created: true, message: 'Se ha guardado con exito el album',
                _albumStored: albumStored
            });
        }

    });
}


function updateAlbum(req, res) {
    var albumId = req.params.id;
    var update = req.body;
    Album.findByIdAndUpdate(albumId, update, (err, albumUpdate) => {
        if (err) {
            res.status(500).send({ message: 'Error al ejecutar updateAlbum' + err });

        } else {
            res.status(200).send({
                update: true, message: 'Se ha actualizado con el album',
                _albumUpdated: albumUpdate
            });
        }

    });

}


function deleteAlbum(req, res) {
    var albumId = req.params.id;
    Album.findById(albumId, (err, albumFound) => {
        if (err) {
            res.status(500).send({ message: 'Error al ejecutar deleteAlbum' + err });
        } else {
            if (!albumFound) {
                res.status(404).send({ message: 'No existen registros en albums' });
            } else {
                res.status(202).send({
                    delete: true, message: 'Se ha borrado con exito',
                    albumDeleted: albumFound
                });
            }
        }
    });
}




module.exports = {
    getAlbum,
    getAlbums,
    createAlbum,
    updateAlbum,
    deleteAlbum

}