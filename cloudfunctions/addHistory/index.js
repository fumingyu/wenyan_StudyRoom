// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (e, context) => {
  try {
    return await db.collection('history_record').add({
      data:{symbol:e.symbol, table_id: e.table_id,
        openid: e.openid, avatar: e.avatar, nickname: e.nickname
      }
    })
  } catch(e) {
    console.error(e)
  }
}

