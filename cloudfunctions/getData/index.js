// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const table_data = await db.collection('wenyan_seat_record').where({
      symbol: event.symbol,
      table_id:_.and(_.gt(event.left), _.lt(event.right))}).get()
    return await table_data
  } catch(e) {
    console.error(e)
  }  
}

