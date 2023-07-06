// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command;

// 云函数入口函数
exports.main = async (e, context) => {
  try {
    const table_data = await db.collection('wenyan_seat_record').where({
      symbol: e.symbol,
      table_id: e.table_id
    }).update({  
      data:{
        openid: e.openid,
        avatar: e.avatar,
        nickname: e.nickname
      }
    })
    return await table_data
  } catch(e) {
    console.error(e)
  }  
}

