/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
   suite('GET /api/stock-prices => stockData object', function() {
      
      test('1 stock', function(done) {
         chai.request(server)
            .get('/api/stock-prices')
            .query({ stock: 'GOOG' })
            .end(function(err, res){
               assert.equal(res.status, 200)
               assert.exists(res.body.stockData)
               assert.exists(res.body.stockData.stock)
               assert.exists(res.body.stockData.price)
               assert.exists(res.body.stockData.likes)
               assert.property(res.body, 'stockData')
               assert.property(res.body.stockData, 'stock')
               assert.property(res.body.stockData, 'price')
               assert.property(res.body.stockData, 'likes')
               assert.isNumber(res.body.stockData.likes)
               assert.equal(res.body.stockData.stock, 'GOOG')
               done();
         })
      })
      
      test('1 stock with like', function(done) {
         chai.request(server)
            .get('/api/stock-prices')
            .query({ stock: 'MSFT', likes: 'true' })
            .end(function(err, res){
               assert.equal(res.status, 200)
               assert.exists(res.body.stockData)
               assert.exists(res.body.stockData.stock)
               assert.exists(res.body.stockData.price)
               assert.exists(res.body.stockData.likes)
               assert.property(res.body, 'stockData')
               assert.property(res.body.stockData, 'stock')
               assert.property(res.body.stockData, 'price')
               assert.property(res.body.stockData, 'likes')
               assert.isNumber(res.body.stockData.likes)
               assert.equal(res.body.stockData.stock, 'MSFT')
               assert.isAbove(res.body.stockData.likes, 0)
               done();
         })
      })
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
         chai.request(server)
            .get('/api/stock-prices')
            .query({ stock: 'GOOG', likes: ['true', 'true'] })
            .end(function(err, res){
               assert.equal(res.status, 200)
               assert.equal(res.body, 'only one instance of likes')
               done();
         })
      })
      
      test('2 stocks', function(done) { 
         chai.request(server)
            .get('/api/stock-prices')
            .query({ stock: ['GOOG','MSFT'] })
            .end(function(err, res){
               assert.equal(res.status, 200)
               assert.isArray(res.body.stockData)
               assert.exists(res.body.stockData[0].stock)
               assert.exists(res.body.stockData[0].price)
               assert.exists(res.body.stockData[0].rel_likes)
               assert.property(res.body.stockData[0], 'stock')
               assert.property(res.body.stockData[0], 'price')
               assert.property(res.body.stockData[0], 'rel_likes')
               assert.isNumber(res.body.stockData[0].rel_likes)
               assert.exists(res.body.stockData[1].stock)
               assert.exists(res.body.stockData[1].price)
               assert.exists(res.body.stockData[1].rel_likes)
               assert.property(res.body.stockData[1], 'stock')
               assert.property(res.body.stockData[1], 'price')
               assert.property(res.body.stockData[1], 'rel_likes')
               assert.isNumber(res.body.stockData[1].rel_likes)
               assert.oneOf(res.body.stockData[1].stock, ['GOOG','MSFT'])
               assert.oneOf(res.body.stockData[0].stock, ['GOOG','MSFT'])
               done();
         })
      })
      
      test('2 stocks with like', function(done) {
         chai.request(server)
            .get('/api/stock-prices')
            .query({ stock: ['GOOG','MSFT'], likes: 'true' })
            .end(function(err, res){
               assert.equal(res.status, 200)
               assert.isArray(res.body.stockData)
               assert.exists(res.body.stockData[0].stock)
               assert.exists(res.body.stockData[0].price)
               assert.exists(res.body.stockData[0].rel_likes)
               assert.property(res.body.stockData[0], 'stock')
               assert.property(res.body.stockData[0], 'price')
               assert.property(res.body.stockData[0], 'rel_likes')
               assert.isNumber(res.body.stockData[0].rel_likes)
               assert.exists(res.body.stockData[1].stock)
               assert.exists(res.body.stockData[1].price)
               assert.exists(res.body.stockData[1].rel_likes)
               assert.property(res.body.stockData[1], 'stock')
               assert.property(res.body.stockData[1], 'price')
               assert.property(res.body.stockData[1], 'rel_likes')
               assert.isNumber(res.body.stockData[1].rel_likes)
               assert.oneOf(res.body.stockData[1].stock, ['GOOG','MSFT'])
               assert.oneOf(res.body.stockData[0].stock, ['GOOG','MSFT'])
               done();
         })
      })
      
   })
  
})

