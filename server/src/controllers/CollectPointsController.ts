import knex from '../database/connection';
import {Request, Response } from 'express';

class CollectPointsController{
    async index(request: Request, response: Response){
        const { city, uf, items } = request.query;

        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));
        
        const collectPoints = await knex('collectPoints')
            .join('collectPoints_items', 'collectPoints.id', '=', 'collectPoints_items.collectPoint_id')
            .whereIn('collectPoints_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('collectPoints.*');

        const serializedPoints = collectPoints.map(collectPoint => {
            return {
                ...collectPoint,
                image_url: `http://192.168.0.9:3333/uploads/${collectPoint.image}`
            };
        })
        
        return response.json(serializedPoints);

    }

    async show(request: Request, response: Response){
        const { id } = request.params;

        const collectPoint = await knex('collectPoints').where('id', id).first();

        if(!collectPoint) {
            return response.status(400).json({success: false, message: 'Collect Point not found.'});
        }

        const serializedPoint = {
            ...collectPoint,
            image_url: `http://192.168.0.9:3333/uploads/${collectPoint.image}`
        };

        const items = await knex('items')
            .join('collectPoints_items', 'item_id', '=', 'collectPoints_items.item_id')
            .where('collectPoints_items.collectPoint_id', id).select('items.title');

        return response.json({serializedPoint, items });
    };

    async showAll(request: Request, response: Response) {
        const collectPoints = await knex('collectPoints');

        const serializedCollectPoints = collectPoints.map(collectPoint => {
            return {
                ...collectPoint,
                image_url: `http://192.168.0.9:3333/uploads/${collectPoint.image}`
            };
        })

        return response.json(serializedCollectPoints);
    }

   async create(request: Request, response: Response){
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;
    
        const trx = await knex.transaction();
        
        const collectPoint = {
            image: request.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        };
        const insertedIds = await trx('collectPoints').insert(collectPoint);
        
        const collectPoint_id = insertedIds[0];
    
        const collectPointItems = items.split(', ')
                                        .map((item: string) => Number(item.trim()))
                                        .map((item_id: Number) => {
                                return ({
                                            item_id,
                                            collectPoint_id
                                        });
                                });
    
        await trx('collectPoints_items').insert(collectPointItems);

        await trx.commit();
    
        return response.json({ id: collectPoint_id, ...collectPoint});
    };
}

export default CollectPointsController