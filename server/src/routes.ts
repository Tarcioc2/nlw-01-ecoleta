import express from 'express';
import multer from 'multer';
import multerConfig from './config/multer'
import { celebrate, Joi } from 'celebrate';

//Import controllers
import CollectPointsController from './controllers/CollectPointsController';
import ItemsController from './controllers/ItemsController';

const routes = express.Router();
const upload = multer(multerConfig);
const collectPointsController = new CollectPointsController();
const itemsController = new ItemsController();

// index, show, create, update, delete
 routes.get('/items', itemsController.index);

 routes.get('/collectPoints', collectPointsController.index);

 routes.get('/collectPoints-all', collectPointsController.showAll);
 
 routes.get('/collectPoints/:id', collectPointsController.show);
 
 routes.post('/collectPoints', 
                upload.single('image'),
                celebrate({
                body: Joi.object().keys({
                    name: Joi.string().required(),
                    email: Joi.string().required().email(),
                    whatsapp: Joi.number().required(),
                    latitude: Joi.number().required(),
                    longitude: Joi.number().required(),
                    city: Joi.string().required(),
                    uf: Joi.string().required().max(2),
                    items: Joi.string().required()
                })
                }, {
                abortEarly: false
                }),
    collectPointsController.create);






 export default routes;

 //estudar Service Pattern e Repository Pattern