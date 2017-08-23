'use strict'

var path = require('path');
var ImageSchema = require('../models/imagen.model');
var Albumchema = require('../models/album.model');



function createImagen(req, res) {
    var params = req.body;
    var imageSchema = new ImageSchema();

    imageSchema.title = params.title;
    imageSchema.picture = params.title;
    imageSchema.album = params.album;


    imageSchema.save((err, imageSaved) => {
        if (err) {
            res.status(500).send({ message: 'ha ocurrido un error al guardar la imagen ' + err });
        } else {
            res.status(200).send({ created: true, message: 'Imagen guardada con exito' });
        }

    });
}




function getImages(req, res) {
    var albumId = req.params.album;
    var filtro = {};

    if (albumId) {
        filtro = { album: albumId }
    }
    ImageSchema.find(filtro).sort({}).exec((err, images) => {
        if (err) {
            res.status(500).send({ message: 'ha ocurrido un error al consultar las imagenes' + err });
        } else {
            if (!images) {
                res.status(404).send({ message: 'No se encontraron imagenes' });
            } else {
                Albumchema.populate(images, { path: 'album' }, (err, images) => {
                    if (err) {
                        res.status(500).send({ message: 'ha ocurrido un error al consultar el album de la image ' + err });
                    } else {
                        res.status(200).send({ images });
                    }
                });
            }
        }
    });

}




function getImage(req, res) {
    var imageId = req.params.id;
    ImageSchema.findById(imageId, (err, imageFound) => {
        if (err) {
            res.status(500).send({ message: 'Error al consultar la image ' + err });
        } else {
            if (imageFound) {
                Albumchema.populate(imageFound, { path: 'album' }, (err, imageFound) => {
                    if (err) {
                        res.status(500).send({ message: 'ha ocurrido un error al consultar el album de la image ' + err });
                    } else {
                        res.status(200).send({ imageFound });
                    }
                });
            } else {
                res.status(404).send({ message: 'No encontré la imagen con id' + imageId });
            }
        }
    });
}




function updateImage(req, res) {
    var imageId = req.params.id;
    var update = req.body;
    ImageSchema.findByIdAndUpdate(imageId, update, (err, imageUpdate) => {
        if (err) {
            res.status(500).send({ message: 'ha ocurrido un error al actualizar la  image ' + err });
        } else {
            res.status(200).send({
                update: true, message: 'Se ha actualizado la imagen',
                _imageUpdate: imageUpdate
            });

        }
    });
}



function deleteImage(req, res) {
    var imageId = req.params.id;
    ImageSchema.findById(imageId, (err, imageFound) => {
        if (err) {
            res.status(500).send({ message: 'ha ocurrido un error al consultar la image en el metodo deleteImage' + err });

        } else {
            res.status(202).send({
                delete: true, message: 'Se ha borrado con exito',
                albumDeleted: imageFound
            });
        }
    });

}


function uploadImage(req, res) {
    var imageId = req.params.id;
    var file_name = 'No subido...';
    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[1];
        console.log(file_path);
        console.log(file_name);

        var update = req.body;
        ImageSchema.findByIdAndUpdate(imageId, { picture: file_name }, (err, imageUpdate) => {
            if (err) {
                res.status(500).send({ message: 'ha ocurrido un error al actualizar la  image ' + err });
            } else {
                res.status(200).send({
                    update: true, message: 'Se ha actualizado la imagen',
                    _imageUpdate: imageUpdate
                });

            }
        });
    } else {
        res.status(200).send({ message: 'No ha subido una imagen ' + err });
    }
}


var fs = require('fs'); //file system
function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    fs.exists('./uploads/' + imageFile, (exists) => {
        if (exists) {
            res.sendFile(path.resolve('./uploads/' + imageFile));
        } else {
            res.status(200).send({ message: 'No se encontró la imagen ' });
        }
    });
}



module.exports = {
    createImagen,
    getImages,
    getImage,
    updateImage,
    deleteImage,
    uploadImage,
    getImageFile


}