// pages/overview/overview.js
Page({

  data: {
    navbar: ['学院西路', '健康路'],
    currentTab: 0,
    selected : 0,
    table_all: '',
    table_all_2: '',
    current_id: 999,
    test:false,
    has_expire_table: [],
    has_expire_table_2: [],
    will_expire_table: [],
    will_expire_table_2: [],

    data_info : '',
    show_data_info : false,
    add_note:false,

    show_data_delete:false
  },

  // 已经到期||即将到期||查看所有
  navbarTap(e){
    this.setData({currentTab:e.currentTarget.dataset.idx})
  },

  // 查看所有座位
  showAllRecord(){   
    this.setData({selected: 3})
    // 学院西路 
    wx.cloud.callFunction({ 
      name: 'getWholeData'   
    })
    .then(res => {
      this.setData({table_all: res.result.data})
    })
    // 健康路
    wx.cloud.callFunction({ 
      name: 'getWholeData2'   
    })
    .then(res => {
      this.setData({table_all_2: res.result.data})
    })
  }, 

  // 查看已经到期的座位
  showHasExpire(){
    this.setData({selected: 1})
    // 学院西路 
    var table_all
    wx.cloud.callFunction({
      name: 'getWholeData' 
    })
    .then(res => {
      table_all = res.result.data
    })
    .then(res => {                           // 检查是否到期， 0是未到期， 1是快到期， 2是已到期
      var data_set = table_all
      var now_time = (new Date()).getTime()
      var has_expire_table = []
      for (var i=0; i<data_set.length; i++) {
        var remainder = (new Date(data_set[i].terminal_date)).getTime() - now_time
        if (remainder < 0) {
          has_expire_table[has_expire_table.length] = data_set[i]
        }
      }
      this.setData({has_expire_table: has_expire_table})
      })
      
    // 健康路
    var table_all_2
    wx.cloud.callFunction({
      name: 'getWholeData2' 
    })
    .then(res => {
      table_all_2 = res.result.data
    })
    .then(res => {                           // 检查是否到期， 0是未到期， 1是快到期， 2是已到期
      var data_set_2 = table_all_2
      var now_time = (new Date()).getTime()
      var has_expire_table_2 = []
      for (var i=0; i<data_set_2.length; i++) {
        var remainder = (new Date(data_set_2[i].terminal_date)).getTime() - now_time
        if (remainder < 0) {
          has_expire_table_2[has_expire_table_2.length] = data_set_2[i]
        }
      }
      this.setData({has_expire_table_2: has_expire_table_2})
    })
  },

  // 查看即将到期的座位
  showWillExpire(){
    this.setData({selected: 2})
    // 学院西路 
    var table_all
    wx.cloud.callFunction({
      name: 'getWholeData' 
    })
    .then(res => {
      table_all = res.result.data
    })
    .then(res => {                           // 检查是否到期， 0是未到期， 1是快到期， 2是已到期
      var data_set = table_all
      var now_time = (new Date()).getTime()
      var three_day = 1000 * 60 * 60 * 24 * 3
      var will_expire_table = []
      for (var i=0; i<data_set.length; i++) {
        var remainder = (new Date(data_set[i].terminal_date)).getTime() - now_time
        if (remainder < three_day && 0 < remainder) {
          will_expire_table[will_expire_table.length] = data_set[i]
        }
      }
      this.setData({will_expire_table: will_expire_table})
    })
    // 健康路
    var table_all_2
    wx.cloud.callFunction({
      name: 'getWholeData2' 
    })
    .then(res => {
      table_all_2 = res.result.data
    })
    .then(res => {                           // 检查是否到期， 0是未到期， 1是快到期， 2是已到期
      var data_set_2 = table_all_2
      var now_time = (new Date()).getTime()
      var three_day = 1000 * 60 * 60 * 24 * 3
      var will_expire_table_2 = []
      for (var i=0; i<data_set_2.length; i++) {
        var remainder = (new Date(data_set_2[i].terminal_date)).getTime() - now_time
        if (remainder < three_day && 0 < remainder) {
          will_expire_table_2[will_expire_table_2.length] = data_set_2[i]
        }
      }
      this.setData({will_expire_table_2: will_expire_table_2})
    })
  },

  onTap(e){
    this.setData({current_id: parseInt(e.currentTarget.id.split('-')[1])})
  },
 
  // 续
  renewal(e){
    var item_id = e.currentTarget.id
    var store_place = this.data.currentTab
    var item_key
      // 学院西路 & 已到期
      if (store_place==0) {
        if (this.data.selected == 1) {
          var _id = this.data.has_expire_table[item_id]._id
        }
        // 学院西路 & 即将到期
        else if(this.data.selected == 2){
          var _id = this.data.will_expire_table[item_id]._id
        }
        // 学院西路 & 查看所有
        else if(this.data.selected == 3){
          var _id = this.data.table_all[item_id]._id
        }   
        wx.cloud.callFunction({
          name: 'getSingleID',
          data: {_id:_id}
        })
        .then(res => {
          item_key = res.result.data[0]._id
        })
        .then(res => {
          //  路由到添加页面
          wx.navigateTo({
            url: '/pages/renewal_form/renewal_form',
            success: res => {res.eventChannel.emit(
              'acceptData', {table_key: item_key,
                             store_place:store_place}
            )}
        })
        })
      }
      else if (store_place==1){
        // 健康路 & 已到期
        if (this.data.selected == 1){
          var _id = this.data.has_expire_table_2[item_id]._id
        }
        // 健康路 & 即将到期
        else if(this.data.selected == 2){
          var _id = this.data.will_expire_table_2[item_id]._id
        }
        // 健康路 & 查看所有
        else if(this.data.selected == 3){
          var _id = this.data.table_all_2[item_id]._id
        }
        wx.cloud.callFunction({
          name: 'getSingleID2',
          data: {_id:_id}
        })
        .then(res => {
          item_key = res.result.data[0]._id
        })
        .then(res => {
          //  路由到添加页面
          wx.navigateTo({
            url: '/pages/renewal_form/renewal_form',
            success: res => {res.eventChannel.emit(
            'acceptData', {table_key: item_key,
                           store_place:store_place}
            )}
        })
        })
      }
  },

  // 获取所选择的座位信息
  getDataInfo(e){
    var item_id = e.currentTarget.id
      // 学院西路 & 已到期
      if (this.data.currentTab==0) {
        if (this.data.selected == 1) {
          var _id = this.data.has_expire_table[item_id]._id
        }
        // 学院西路 & 即将到期
        else if(this.data.selected == 2){
          var _id = this.data.will_expire_table[item_id]._id
        }
        // 学院西路 & 查看所有
        else if(this.data.selected == 3){
          var _id = this.data.table_all[item_id]._id
        }   
        wx.cloud.callFunction({
          name: 'getSingleID',
          data: {_id:_id}
        })
        .then(res => {
          this.setData({data_info:res.result.data[0]})
        })
      }
      else if (this.data.currentTab==1){
        // 健康路 & 已到期
        if (this.data.selected == 1){
          var _id = this.data.has_expire_table_2[item_id]._id
        }
        // 健康路 & 即将到期
        else if(this.data.selected == 2){
          var _id = this.data.will_expire_table_2[item_id]._id
        }
        // 健康路 & 查看所有
        else if(this.data.selected == 3){
          var _id = this.data.table_all_2[item_id]._id
        }
        wx.cloud.callFunction({
          name: 'getSingleID2',
          data: {_id:_id}
        })
        .then(res => {
          this.setData({data_info:res.result.data[0]})
        })
      }
  },

  // 详
  info(e){
    this.getDataInfo(e)
    this.setData({show_data_info:true})
  },

  // 删
  delete(e){
    this.getDataInfo(e)
    this.setData({show_data_delete:true})
    
  },

  // 添加备注
  addNote(){
    this.setData({add_note:true})
  },
  submitNote(e){
    this.setData({show_data_info:false, add_note:false})

    var table_key = this.data.data_info._id
    var note_content = e.detail.value.note_content

    if (note_content) {
      wx.cloud.callFunction({
        name: 'updateData',
        data: {_id : table_key,
              note : note_content}
      })
      // .then(res =>{
      //   console.log(res);
      // })
    }
  },

  clearTable(){
    // currentTab==0（学院西路）  1（健康路）
    var delete_id = this.data.data_info._id
    if (this.data.currentTab==0){
      wx.cloud.callFunction({
        name:'deleteDataByID',
        data:{_id:delete_id}
      })
      .then(() => {wx.showToast({title: '删除成功'})  })
      .catch(err => {console.log(err)})
    }
    else if (this.data.currentTab==1) {
      wx.cloud.callFunction({
        name:'deleteDataByID2',
        data:{_id:delete_id}
      })
      .then(() => {wx.showToast({title: '删除成功'})  })
      .catch(err => {console.log(err)})
    }
    this.setData({show_data_delete:false})
  },

  clearExit(){this.setData({show_data_delete:false})},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.showHasExpire()
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