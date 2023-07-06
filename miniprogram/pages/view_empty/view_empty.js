// pages/confirm_request/confirm_request.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    east_seat             : '搜索中',
    west_seat             : '搜索中',
    jiankang_seat         : '搜索中',
    sandian_seat          : '搜索中',
    east_empty_length     : 'NaN',
    west_empty_length     : 'NaN',
    jk_empty_length       : 'NaN',
    sandian_empty_length  : 0

  },

  //  学院西路店
  get_empty_seat(){
    var east_seat_ls  = [];       // 用于存放东区座位记录
    var east_all_ls   = [];       // 东区所有座位
    var west_a_ls     = [];       // 用于存放西区A房间座位记录
    var west_b_ls     = [];       // 用于存放西区B房间座位记录
    var west_c_ls     = [];       // 用于存放西区C房间座位记录
    var west_a_all_ls = [];       // 西区A房间所有座位
    var west_b_all_ls = [];       // 西区B房间所有座位
    var west_c_all_ls = [];       // 西区C房间所有座位
    // 东区
    for (let i = 0; i < 89; i++) {
       east_all_ls[i] = i+1;
    }
    for (let i = 101; i < 106; i++) {
      east_all_ls[east_all_ls.length] = i;
    }
    // 西区A
    for (let i = 1; i < 24; i++) {
      west_a_all_ls[west_a_all_ls.length] = i;
    }
    // 西区B
    for (let i = 1; i < 14; i++) {
      west_b_all_ls[west_b_all_ls.length] = i;
    }
    // 西区C
    for (let i = 1; i < 11; i++) {
      west_c_all_ls[west_c_all_ls.length] = i;
    }
    wx.cloud.callFunction({  
      name: 'getWholeData',
      data: { left:0, right:106} // left: 大于left; right: 小于right 
    })
    .then(res => {
      for (let i = 0; i < res.result.data.length; i++) {
        var current_symbol = res.result.data[i].symbol
        var current_id = res.result.data[i].table_id
        if (current_symbol=='') {
          east_seat_ls[east_seat_ls.length] = current_id;
        }
        else if(current_symbol=='A'){
          west_a_ls[west_a_ls.length] = current_id;
        }
        else if(current_symbol=='B'){
          west_b_ls[west_b_ls.length] = current_id;
        }
        else if(current_symbol=='C'){
          west_c_ls[west_c_ls.length] = current_id;
        }
      }
    })
    .then(res => {
      var east_empty_seat = east_all_ls.filter(v => !east_seat_ls.includes(v));
      var west_a_empty_seat = west_a_all_ls.filter(v => !west_a_ls.includes(v));
      var west_b_empty_seat = west_b_all_ls.filter(v => !west_b_ls.includes(v));
      var west_c_empty_seat = west_c_all_ls.filter(v => !west_c_ls.includes(v));

      var west_empty_seat = [];
      for (let i = 0; i < west_a_empty_seat.length; i++) {
        west_empty_seat[west_empty_seat.length] = 'A'+west_a_empty_seat[i];
      }
      for (let i = 0; i < west_b_empty_seat.length; i++) {
        west_empty_seat[west_empty_seat.length] = 'B'+west_b_empty_seat[i];
      }
      for (let i = 0; i < west_c_empty_seat.length; i++) {
        west_empty_seat[west_empty_seat.length] = 'C'+west_c_empty_seat[i];
      }
      
      this.setData({
        east_seat         : east_empty_seat,
        west_seat         : west_empty_seat,
        east_empty_length : east_empty_seat.length,
        west_empty_length : west_empty_seat.length
      })
    })

  },

  // 健康路店
  get_empty_seat_jiankang(){
    var z_ls = [];       // 用于存放Z房间座位记录
    var m_ls = [];       // 用于存放M房间座位记录
    var x_ls = [];       // 用于存放X房间座位记录
    var q_ls = [];       // 用于存放Q房间座位记录
    var l_ls = [];       // 用于存放L房间座位记录
    var h_ls = [];       // 用于存放H房间座位记录
    var z_all_ls = [];   // Z房间所有座位
    var m_all_ls = [];   // M房间所有座位
    var x_all_ls = [];   // X房间所有座位
    var q_all_ls = [];   // Q房间所有座位
    var l_all_ls = [];   // L房间所有座位
    var h_all_ls = [];   // H房间所有座位
    // Z房间
    for (let i = 1; i < 14; i++) {
      z_all_ls[z_all_ls.length] = i;
    }
    // M房间
    for (let i = 1; i < 14; i++) {
      m_all_ls[m_all_ls.length] = i;
    }
    // X房间
    for (let i = 1; i < 14; i++) {
      x_all_ls[x_all_ls.length] = i;
    }
    // Q房间
    for (let i = 1; i < 14; i++) {
      q_all_ls[q_all_ls.length] = i;
    }
    // L房间
    for (let i = 1; i < 33; i++) {
      l_all_ls[l_all_ls.length] = i;
    }
    // H房间
    for (let i = 1; i < 14; i++) {
      h_all_ls[h_all_ls.length] = i;
    }

    wx.cloud.callFunction({  
      name: 'getWholeData2',
      data: { left:0, right:34} // left: 大于left; right: 小于right 
    })
    .then(res => {
      for (let i = 0; i < res.result.data.length; i++) {
        var current_symbol = res.result.data[i].symbol
        var current_id = res.result.data[i].table_id
        if (current_symbol=='Z') {
          z_ls[z_ls.length] = current_id;
        }
        else if(current_symbol=='M'){
          m_ls[m_ls.length] = current_id;
        }
        else if(current_symbol=='X'){
          x_ls[x_ls.length] = current_id;
        }
        else if(current_symbol=='Q'){
          q_ls[q_ls.length] = current_id;
        }
        else if(current_symbol=='L'){
          l_ls[l_ls.length] = current_id;
        }
        else if(current_symbol=='H'){
          h_ls[h_ls.length] = current_id;
        }
      }
    })
    .then(res => {
      var z_empty_seat = z_all_ls.filter(v => !z_ls.includes(v));
      var m_empty_seat = m_all_ls.filter(v => !m_ls.includes(v));
      var x_empty_seat = x_all_ls.filter(v => !x_ls.includes(v));
      var q_empty_seat = q_all_ls.filter(v => !q_ls.includes(v));
      var l_empty_seat = l_all_ls.filter(v => !l_ls.includes(v));
      var h_empty_seat = h_all_ls.filter(v => !h_ls.includes(v));

      var jiankang_empty_seat = [];
      for (let i = 0; i < z_empty_seat.length; i++) {
        jiankang_empty_seat[jiankang_empty_seat.length] = 'Z'+z_empty_seat[i];
      }
      for (let i = 0; i < m_empty_seat.length; i++) {
        jiankang_empty_seat[jiankang_empty_seat.length] = 'M'+m_empty_seat[i];
      }
      for (let i = 0; i < x_empty_seat.length; i++) {
        jiankang_empty_seat[jiankang_empty_seat.length] = 'X'+x_empty_seat[i];
      }
      for (let i = 0; i < q_empty_seat.length; i++) {
        jiankang_empty_seat[jiankang_empty_seat.length] = 'Q'+q_empty_seat[i];
      }
      for (let i = 0; i < l_empty_seat.length; i++) {
        jiankang_empty_seat[jiankang_empty_seat.length] = 'L'+l_empty_seat[i];
      }
      for (let i = 0; i < h_empty_seat.length; i++) {
        jiankang_empty_seat[jiankang_empty_seat.length] = 'H'+h_empty_seat[i];
      }
      
      this.setData({
        jiankang_seat   : jiankang_empty_seat,
        jk_empty_length : jiankang_empty_seat.length
      })
    })
  },

  
  // 健康路店
  get_empty_seat_sandian(){
      var sandian_seat_ls = [];    // 用于存放三店座位记录
      var sandian_all_ls = [];     // 三店所有座位
      // 
      for (let i = 1; i < 99; i++) {
        sandian_all_ls[i] = i;
      }
    
      wx.cloud.callFunction({  
        name: 'getWholeData3',
        data: { left:0, right:99} // left: 大于left; right: 小于right 
      })
      .then(res => {
        for (let i = 0; i < res.result.data.length; i++) {
          // var current_symbol = res.result.data[i].symbol;
          var current_id = res.result.data[i].table_id;
          sandian_seat_ls[sandian_seat_ls.length] = current_id;
        }
      })
      .then(res => {
        var sandian_empty_seat = sandian_all_ls.filter(v => !sandian_seat_ls.includes(v));
        var len = sandian_empty_seat.length
        this.setData({
          sandian_seat          : sandian_empty_seat,
          sandian_empty_length  : len
        })
        console.log(len);
        console.log(this.sandian_empty_length);
      })
  
    },

  refuseUserInfo(){
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_empty_seat()
    this.get_empty_seat_jiankang()
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
    this.get_empty_seat();
    this.get_empty_seat_jiankang();
    this.get_empty_seat_sandian();
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