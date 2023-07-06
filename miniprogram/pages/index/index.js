// pages/index/index.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    table_info:'table_info',
    navbar: ['东区', '西区'],
    currentTab: 0
  },
  navbarTap(e){
    this.setData({currentTab:e.currentTarget.dataset.idx})
  },

  bindroom1 () {
    wx.navigateTo({
      url: '../room1/room1',
    })
  },
  bindroom2 () {
    wx.navigateTo({
      url: '../room2/room2',
    })
  },
  bindroom3 () {
    wx.navigateTo({
      url: '../room3/room3',
    })
  },
  bindroom4 () {
    wx.navigateTo({
      url: '../room4/room4',
    })
  },
  bindroom5 () {
    wx.navigateTo({
      url: '../room5/room5',
    })
  },
  bindroom6 () {
    wx.navigateTo({
      url: '../room6/room6',
    })
  },
  bindroom7 () {
    wx.navigateTo({
      url: '../room7/room7',
    })
  },

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