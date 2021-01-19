// pages/user/points.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalpoints:0,
    record:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    App._get('WxMiniAppUserPointsLog', {}, result => {
      that.setData(result.data)
    });
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
  showRelation:function(e){
    var record = e.currentTarget.dataset.item;
    if(record.type == "order"){
      wx.navigateTo({
        url: '/pages/order/detail?order_id=' + record.relationid
      });
    }
  }
})