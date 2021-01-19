let App = getApp();

Page({
  data: {
    list: [],
    operateText:{},
    default_id: null,
  },

  onLoad: function(options) {
    // 当前页面参数
    this.data.options = options;
    if(options.from == "flow"){
      this.setData({
        operateText:{Selected:'已选择',UnSelected:'选择'}
      })
    }else{
      this.setData({
        operateText:{Selected:'默认地址',UnSelected:'设为默认'}
      })
    }
  },

  onShow: function() {
    // 获取收货地址列表
    this.getAddressList();
  },

  /**
   * 获取收货地址列表
   */
  getAddressList: function() {
    let _this = this;
    App._get('GetAddressList', {}, function(result) {
      _this.setData(result.data);
    });
  },

  /**
   * 添加新地址
   */
  createAddress: function() {
    wx.navigateTo({
      url: './create'
    });
  },

  /**
   * 编辑地址
   */
  editAddress: function(e) {
    wx.navigateTo({
      url: "./detail?address_id=" + e.currentTarget.dataset.id
    });
  },

  /**
   * 移除收货地址
   */
  removeAddress: function(e) {
    let _this = this,
      address_id = e.currentTarget.dataset.id;
    wx.showModal({
      title: "提示",
      content: "您确定要移除当前收货地址吗?",
      success: function(o) {
        o.confirm && App._post_form('DeleteAddress', {
          address_id
        }, function(result) {
          _this.getAddressList();
        });
      }
    });
  },

  /**
   * 设置为默认地址
   */
  setDefault: function(e) {
    let _this = this,
      address_id = e.detail.value;
    _this.setData({
      default_id: parseInt(address_id)
    });
    App._post_form('SetDefaultAddress', {
      address_id
    }, function(result) {
      _this.data.options.from === 'flow' && wx.navigateBack();
    });
    return false;
  },

});