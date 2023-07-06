
// 不能将 table_No 放onLoad中，否则无法对data中的table_No赋值
const left_24 = 24
const right_31 = 31
function new_table_No(left, right){
  var table_No=[];
  for (var i=left; i<right+1; i++){
    table_No[i-left] = i;
}
  return table_No
}
var table_No_1 = new_table_No(left_24, right_31)
var table_No_2 = new_table_No(101, 105)
var table_No = table_No_1.concat(table_No_2)

Page({
  data: {
    symbol: '', 
    table_No: table_No,
    table_id:'无',
    if_claer: false,
    if_replace: false,
    if_symbol:false,
    replace_table:'', 
    replace_symbol:'',
    dont_replace: true,
    replace_content:''
  },

  // 显示换座位或退费信息
  showManage(e){
    var current_index = parseInt(e.currentTarget.id.split('-')[1])
    // 属于24-31之间
    if (current_index <= 7) {
      var c_id = current_index + 24
      this.setData({table_id: current_index, current_table: parseInt(c_id)})
    } else {
      // 属于101-105之间
      var c_id = current_index -8 + 101
      this.setData({table_id: current_index, current_table: parseInt(c_id)})
    }
    // console.log(this.data.table_id)
    // console.log(this.data.current_table);
  },
  // 隐藏换座位信息
  hideManage(){this.setData({table_id: '无'})},

  // 删除座位信息
  clearConfirm(){
    this.setData({if_claer: true})
  },
  clearExit(){this.setData({if_claer:false})},
  clearTable(e){
    let that = this 
    var seat_number = parseInt(e.target.id.split('-')[1]) 
    var clear_id = that.data.current_table
    that.setData({clear_id: clear_id})
    var seat_info = this.data.table_No[seat_number]
    var delet_date = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
    // 先将座位信息添入历史记录
    wx.cloud.callFunction({
      name:'addSeatHistory',
      data:{table_id: that.data.clear_id, symbol: that.data.symbol,
        fee:seat_info.fee, payment: seat_info.payment, 
        original_date: seat_info.original_date,
        arrive_date: seat_info.arrive_date,
        duration_time: seat_info.duration_time, 
        kaoyan:seat_info.kaoyan,
        terminal_date: seat_info.terminal_date,
        fee_history: seat_info.fee_history,
        payment_history: seat_info.payment_history,
        duration_history: seat_info.duration_history,
        delet_date:delet_date}
    })
    .then(res => {
      wx.cloud.callFunction({
        name: 'deleteData',
        data: {symbol: that.data.symbol,
          clear_id: that.data.clear_id}
      }).then(() => {wx.showToast({title: '删除成功'})
      }).catch(err => {console.log(err)})
    })
    // 将当前座位内容设为空（通过更改table_No的值）
    var table_No = that.data.table_No
    table_No[seat_number] = clear_id
    that.setData({table_No:table_No})
    setTimeout(() => {that.clearExit()}, 300)
  },  

  // 更换座位信息
  replaceConfirm(){
    this.setData({if_replace: true}) 
  },
  replaceExit(){
    this.setData({if_replace:false})
  },
  symbolChange(e) {
    this.setData({
      replace_symbol:e.detail.value,
      dont_replace: true
    })
  },
  getReplaceID(e){
    this.setData({replace_table:parseInt(e.detail.value)})
  },
  cancelDefine(){
    this.setData({dont_replace: true})
  },
  checkSeat(){
    var rpl_smb =  this.data.replace_symbol
    var rpl_tb = this.data.replace_table
    var target_table_empty
    // 学院西路
    wx.cloud.callFunction({  
      name: 'getSingleData',
      data: {symbol:rpl_smb, table_id:rpl_tb} // left: 大于left; right: 小于right 
    })
    .then(res => {
      res.result.data[0]?target_table_empty=false:target_table_empty=true
    })
    .then(res => {
      if (!target_table_empty) {
        wx.showToast({
          title: '目标座位已有人',
          icon:'error'
        })
        this.setData({dont_replace:true})
      }else{
        wx.showToast({
          title: '目标座位是空位',
          icon:'success'
        })
        this.setData({dont_replace:false})
      }
    })
  },
  // 更改座位号
  replaceTable(e){
    wx.cloud.callFunction({
      name: 'replaceData',
      data: {table_id:this.data.current_table, symbol:this.data.symbol,
            replace_table:this.data.replace_table, replace_symbol:this.data.replace_symbol}
    })
    .then(() => {wx.showToast({title: '修改成功'})
    }).catch(err => {console.log(err)})
  
    // 将座位信息显示到目标座位, 再将当前座位内容设为空（通过更改table_No的值）
    var replace_id= parseInt(e.target.id.split('-')[1]) 
    var table_No = this.data.table_No
    table_No[replace_id] = this.data.current_table
    this.setData({table_No:table_No})
    setTimeout(() => {this.replaceExit()}, 300)
  },

  // 向空座位记录信息
  tableAdd(e){
  var current_index = parseInt(e.currentTarget.id.split('-')[1]) 
  if (current_index <=7) {
    var table_id = current_index + 24
  } else {
    var table_id = current_index -8 + 101
  }
  // 路由到添加页面
  wx.navigateTo({
    url: '/pages/fill_current/fill_current',
    success: res => {res.eventChannel.emit(
      'acceptData', {table_id: table_id, symbol: this.data.symbol})}
    })
  },
  
  /* 生命周期函数--监听页面加载 */
  onLoad: function (option) {

  },
 
  onShow: function () {
    // 页面加载时显示座位信息，已订座位及空座位
    wx.cloud.callFunction({
      name: 'getData',
      data: {symbol:this.data.symbol, left:left_24-1, right:right_31+1} // left: 大于left; right: 小于right
    })
    .then(res => { 
      var table_No_half1 = new_table_No(left_24, right_31)
      for (var i=0; i<res.result.data.length; i++){
        table_No_half1[table_No_half1.indexOf(res.result.data[i].table_id)] = res.result.data[i]
      }
      this.setData({table_No_half1:table_No_half1})
      // console.log(table_No_half1);
    })
    .then(res => {
      wx.cloud.callFunction({
        name: 'getData',
        data: {symbol:this.data.symbol, left:101-1, right:105+1} // left: 大于left; right: 小于right
      })
      .then(res => { 
        var table_No_half2 = new_table_No(101, 105)
        for (var i=0; i<res.result.data.length; i++){
          table_No_half2[table_No_half2.indexOf(res.result.data[i].table_id)] = res.result.data[i]
        }
        this.setData({table_No_half2:table_No_half2})
        // console.log(table_No_half2);

        var table_No = this.data.table_No_half1.concat(this.data.table_No_half2)
        this.setData({table_No: table_No})
      })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})