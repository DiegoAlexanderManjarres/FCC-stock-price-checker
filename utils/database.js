const mongodb = require('mongodb')


let _db

const mongoConnect = async callback => {
   try {
   const client = await mongodb.MongoClient
      .connect(process.env.DB, { useNewUrlParser: true })
   if (!client) { throw 'databade err' }   
   
   _db = client.db('exercise-tracker').collection('stock-prices')
   callback()
   } catch(err) { console.log('====\n', err, '\n====') }
}

const getDb = () => {
   if (!_db) { throw 'Database err' }
   return _db
}


module.exports.mongoConnect = mongoConnect
module.exports.getDb = getDb