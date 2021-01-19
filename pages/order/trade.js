let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    expressno:"",
    expresscompany:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.expressno = options.expressno;
    this.data.expresscompany = options.expresscompany;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取帮助列表
    this.getTrade();
  },

  /**
   * 获取帮助列表
   */
  getTrade: function () {
    let _this = this;
    App._get('OrderTradeInfo', {expressno:_this.data.expressno,expresscompany:_this.data.expresscompany}, function (result) {
      _this.setData({list : result.data});
    });
  },

})