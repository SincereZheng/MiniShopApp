// pages/goods/comment.js
let App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ServerFileHost:App.ServerFileHost,
      ServerNoFileHost:App.ServerNoFileHost
    })
    let _this = this;
    // 商品id
    _this.data.goods_id = options.goodsid;
    _this.getGoodsComment();
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

  },
  getGoodsComment : function() {
    let _this = this;
    App._get('GetGoodsComment', {
      goods_id: _this.data.goods_id
    }, function(result) {
      // 初始化商品详情数据
      _this.setData(result.data);
    });
  },
})