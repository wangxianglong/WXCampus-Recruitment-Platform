// pages/others/this.calendar/this.calendar.js
Page({
  data: {
    curDate: '',//选中的几月几号
    curWeek: '',//选中的星期几
    curYear: 2019,//当前年份
    curMonth: 2,//当前月份
    daysCountArr: [// 保存各个月份的长度，平年
      31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
    ],
    weekArr: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    dateList: [],
    selectedDate: '',
    selectedWeek: ''
  },
  // 页面初始化 options为页面跳转所带来的参数
  onLoad: function (options) {
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    let today = new Date();//当前时间  
    let y = today.getFullYear();//年  
    let mon = today.getMonth() + 1;//月  
    let d = today.getDate();//日  
    let i = today.getDay();//星期  
    this.setData({
      curYear: y,
      curMonth: mon,
      curDate: y + '-' + mon + '-' + d,
      curWeek: this.data.weekArr[i]
    });
    this.getDateList(y, mon - 1);
    // 加载今天热门校招信息
    let selectedDate = this.data.curDate;
    this.visitInterface(selectedDate);
  },
  getDateList: function (y, mon) {
    let vm = this;
    //如果是否闰年，则2月是29日
    let daysCountArr = this.data.daysCountArr;
    if (y % 4 == 0 && y % 100 != 0) {
      this.data.daysCountArr[1] = 29;
      this.setData({
        daysCountArr: daysCountArr
      });
    }
    //第几个月；下标从0开始实际月份还要再+1  
    let dateList = [];
    // console.log('本月', vm.data.daysCountArr[mon], '天');
    dateList[0] = [];
    let weekIndex = 0;//第几个星期
    for (let i = 0; i < vm.data.daysCountArr[mon]; i++) {
      let week = new Date(y, mon, (i + 1)).getDay();
      // 如果是新的一周，则新增一周
      if (week == 0) {
        weekIndex++;
        dateList[weekIndex] = [];
      }
      // 如果是第一行，则将该行日期倒序，以便配合样式居右显示
      if (weekIndex == 0) {
        dateList[weekIndex].unshift({
          value: y + '-' + (mon + 1) + '-' + (i + 1),
          date: i + 1,
          week: week
        });
      } else {
        dateList[weekIndex].push({
          value: y + '-' + (mon + 1) + '-' + (i + 1),
          date: i + 1,
          week: week
        });
      }
    }
    // console.log('本月日期', dateList);
    vm.setData({
      dateList: dateList
    });
  },
  curHot: function (e) {
    let vm = this;
    let selectedDate = e.currentTarget.dataset.date.value;
    //console.log('选中', e.currentTarget.dataset.date.value);
    vm.setData({
      selectedDate: selectedDate,
      selectedWeek: vm.data.weekArr[e.currentTarget.dataset.date.week]
    });
    // 根据被选中的日期调用接口动态改变日历下面的推荐信息
    vm.visitInterface(selectedDate);
  },
  preMonth: function () {
    // 上个月
    let vm = this;
    let curYear = vm.data.curYear;
    let curMonth = vm.data.curMonth;
    curYear = curMonth - 1 ? curYear : curYear - 1;
    curMonth = curMonth - 1 ? curMonth - 1 : 12;
    // console.log('上个月', curYear, curMonth);
    vm.setData({
      curYear: curYear,
      curMonth: curMonth
    });

    vm.getDateList(curYear, curMonth - 1);
  },
  nextMonth: function () {
    // 下个月
    let vm = this;
    let curYear = vm.data.curYear;
    let curMonth = vm.data.curMonth;
    curYear = curMonth + 1 == 13 ? curYear + 1 : curYear;
    curMonth = curMonth + 1 == 13 ? 1 : curMonth + 1;
    // console.log('下个月', curYear, curMonth);
    vm.setData({
      curYear: curYear,
      curMonth: curMonth
    });
    vm.getDateList(curYear, curMonth - 1);
  },
  // 访问接口函数
  visitInterface: function (selectedDate) {
    let vm = this;
    wx.request({
      url: 'https://xiaoyuan.shixiseng.com/wx/xj/criteria?order=hot&d=' + selectedDate + '&p=1',
      headers: {
        "Context-Type": "application/json"
      },
      success: function (res) {
        console.log('请求指定日期的接口信息成功')
        vm.setData({
          list: res.data.data
        })
      }
    })
  },
  // 监听校招信息点击事件，进入详情查看页
  viewDetails: function(){
    let vm = this;
    
  }
})