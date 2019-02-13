const fetch = require('node-fetch')
const db = require('../utils/database').getDb;


exports.getStock = async (req, res, next) => {
   try {  
      const ip = req.header('x-forwarded-for') || req.connection.remoteAddress 
      const url = `https://api.iextrading.com/1.0/stock/market/batch?symbols=${req.query.stock}&types=price`

      const priceResponse = await fetch(url)
      if (priceResponse.status !== 200) { 
         throw new Error(priceResponse.status) 
      }            
      const price = await priceResponse.json()
      if (Object.entries(price).length <= 0) { throw 'stock not found' }
      if (typeof req.query.likes === 'object') { throw 'only one instance of likes' }
      
      const postQuery = [] 
      const getQueryFilter = { stock: { $in: [] } }
      for (let property in price) {
        let newkey = property 
         getQueryFilter.stock.$in.push(newkey) 
         postQuery.push({
            updateOne: req.query.likes === 'true' ? {
               filter: { stock: newkey },
               update: { $addToSet: { likes: ip } },                     
               upsert: true,
            } : {
               filter: { stock: newkey },
               update: { $setOnInsert: { likes: [] } }, 
               new: true,                     
               upsert: true, 
            }
         })
      }
      
      const checkStock = await db().bulkWrite(postQuery)       
      
      const stockPrice = await db().aggregate([
        { $match: getQueryFilter }, 
        { $project: { stock: 1,  numberOfLikes: { $size: "$likes" } } },
        { $sort: { numberOfLikes: -1 } }            
      ]).toArray()
     
      let rel_likes = 0
      const formatedStockPrice = stockPrice
         .map(({ stock, numberOfLikes, _id}, index) => {
            if (stockPrice.length > 1) {
               rel_likes = numberOfLikes - stockPrice[1 - index].numberOfLikes
               return { stock, price: price[stock].price, rel_likes }
            }
            return { stock, price: price[stock].price, likes: numberOfLikes } 
         })
      
      const stockData = { 
         stockData: formatedStockPrice.length > 1
            ? formatedStockPrice 
            : formatedStockPrice[0] 
         }  

      return res.status(200).json(stockData)

   } catch (err) {
      console.log('===========\n', err, '\n===========')

      return res.status(200)
         .json(typeof err === 'string' ? err : 'technical error')
   }
}