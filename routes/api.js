/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;
const { getStock } = require('../controllers/stockHandler')


const checkStock = (req, res, next) => {
   try {
      if (typeof req.query.stock === 'string' && req.query.stock.length > 7 ) {
         throw 'max characters are 7'
      }
      if (typeof req.query.stock === 'object' && req.query.stock.length <= 2) {
         req.query.stock = req.query.stock
            .filter(s => (s && s.length < 7)).join()
      }
      for (let akey in req.query) { 
         if (typeof req.query[akey] === 'string') {
            req.query[akey] = req.query[akey].trim().toUpperCase() 
         }
      }
      if (!req.query.stock) { throw 'value not provided cucu' }
      return next()
   } catch (err) { next(err) }   
}


module.exports = function (app) {

   app.route('/api/stock-prices')
      .get(checkStock, getStock);
    
};
