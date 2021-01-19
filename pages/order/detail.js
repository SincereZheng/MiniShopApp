let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id: null,
    order: {},
    ServerFileHost:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.order_id = options.order_id;
    
    this.setData({
      ServerFileHost:App.ServerFileHost
    })
  },
  onShow:function(){
    this.getOrderDetail(this.data.order_id);
  },

  /**
   * 获取订单详情
   */
  getOrderDetail: function (order_id) {
    let _this = this;
    App._get('GetUserOrderDetail', { order_id }, function (result) {
      _this.setData(result.data);
    });
  },

  viewTrade:function(e){
    let expressno = e.currentTarget.dataset.expressno;
    let expresscompany = e.currentTarget.dataset.expresscompany;
    wx.navigateTo({
      url: '../order/trade?expressno=' + expressno +'&expresscompany='+expresscompany
    });
  },
  /**
   * 跳转到商品详情
   */
  goodsDetail: function (e) {
    let goods_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../goods/index?goods_id=' + goods_id
    });
  },

  /**
   * 取消订单
   */
  cancelOrder: function (e) {
    let _this = this;
    let order_id = _this.data.order_id;
    wx.showModal({
      title: "提示",
      content: "确认取消订单？",
      success: function (o) {
        if (o.confirm) {
          App._post_form('CancelOrder', { order_id }, function (result) {
            wx.navigateBack();
          });
        }
      }
    });
  },

  /**
   * 发起付款
   */
  payOrder: function (e) {
    let _this = this;
    let order_id = _this.data.order_id;

    // 显示loading
    wx.showLoading({ title: '正在处理...', });
    App._post_form('PayOrder', { order_id:order_id }, function (result) {
      if (result.code === -10) {
        App.showError(result.msg);
        return false;
      }
      // 发起微信支付
      wx.requestPayment({
        timeStamp: result.data.timeStamp,
        nonceStr: result.data.nonceStr,
        package: 'prepay_id=' + result.data.prepay_id,
        signType: 'MD5',
        paySign: result.data.paySign,
        success: function (res) {
          App._post_form('CheckPayResult', {order_id:result.data.order_id},function(r){
            _this.getOrderDetail(order_id);
          });
          
        },
        fail: function () {
          App.showError('订单未支付');
        },
      });
    });
  },

  /**
   * 确认收货
   */
  receipt: function (e) {
    let _this = this;
    let order_id = _this.data.order_id;
    wx.showModal({
      title: "提示",
      content: "确认收到商品？",
      success: function (o) {
        if (o.confirm) {
          App._post_form('UserOrderReceipt', { order_id }, function (result) {
            _this.getOrderDetail(order_id);
          });
        }
      }
    });
  },
  comment:function(e){
    var orderdetailid=e.currentTarget.dataset.orderdetailid;
    var skuid=e.currentTarget.dataset.skuid;
    var goodsname = e.currentTarget.dataset.goodsname;
    var type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: 'comment?skuid=' + skuid + '&orderdetailid=' +orderdetailid+'&goodsname='+goodsname+'&type='+type
    });
  }

});