document.addEventListener('DOMContentLoaded', async function () {
  //保证dom内容加载完，不等图片css资源加载，性能高
  //接口需要请求头中携带token
  //401状态码：身份认证失败(要么没token 要么token失效)
  const token = localStorage.getItem('user-token')
  // const res = await axios.get('/dashboard',{
  //   //配置请求头
  //   headers:{
  //     'Authorization': token
  //   }
  // })
  const { data } = await axios.get('/dashboard')
  console.log(data)
  //遍历overview数据
  for (let k in data.overview) {
    // console.log(k)
    document.querySelector(`[name = ${k}]`).innerHTML = data.overview[k]
  }
  initYearChart(data.year)
  initSalaryChart(data.salaryData)
  initGroupChart(data.groupData)
  initGenderChart(data.salaryData)
  initMapChart(data.provinceData)
})




//封装函数
function initYearChart(year) {
  //初始化
  const myChart = echarts.init(document.getElementById('line'))
  //准备配置项
  const option = {
    //标题组件
    title: {
      text: '2021全学科薪资走势',
      textStyle: {
        fontSize: 16,
      },
      left: 10, //居左
      top: 12
    },
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '10%',
      top: '20%'
    },
    color: [{
      type: 'linear',
      x: 0,
      y: 0,
      x2: 1,
      y2: 1,
      colorStops: [{
        offset: 0, color: 'rgba(81,171,255)' // 0% 处的颜色
      }, {
        offset: 1, color: '#6582ff' // 100% 处的颜色
      }],
      global: false // 缺省为 false
    }],
    xAxis: {
      type: 'category',
      data: year.map(item => item.month),
      axisLine: {//x轴线控制
        lineStyle: {
          color: '#ccc',
          type: 'dashed'
        }
      }
    },
    axisLabel: {
      show: true,
      color: '#666'
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed',
        }
      }
    },
    series: [
      {
        data: year.map(item => item.salary),
        type: 'line',
        symbol: '',
        symbolSize: 10,//标记图形大小
        lineStyle: {
          width: 3,
        },
        smooth: true,//是否平滑过渡
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: 'rgba(154,202,255,.8)' // 0% 处的颜色
            },
            {
              offset: 0.8, color: 'rgba(255,255,255,.1)' // 100% 处的颜色
            },
            {
              offset: 1, color: 'rgba(255,255,255,0)' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          },
        }
      },

    ]
  };
  //基于配置项渲染
  myChart.setOption(option)
}

//渲染饼图
function initSalaryChart(salaryData) {
  console.log(salaryData);
  //初始化
  const myChart = echarts.init(document.getElementById('salary'))
  //准备配置项
  const option = {
    title: {
      text: '班级薪资分布',
      top: 15,
      left: 10,
      textStyle: {
        fontSize: 16
      }
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      bottom: '6%',
      left: 'center' //水平居中
    },
    color: ['#fda224', '#5097ff', '#3abcfa', '#34d39a'],
    series: [
      {
        name: '班级薪资分布', //鼠标悬停标识名
        type: 'pie',
        radius: ['50%', '65%'], //内外圆半径
        center: ['50%', '45%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: false,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        // data: [
        //   { value: 200, name: '1.0万以下' },
        //   { value: 735, name: '1-1.5万' },
        //   { value: 580, name: '1-2.0万' },
        //   { value: 484, name: '2-2.5万' },
        // ]
        data: salaryData.map(item => {
          console.log(item);
          return {
            name: item.label,
            value: item.g_count + item.b_count
          }
        })
      }
    ]
  };
  //基于配置项渲染
  myChart.setOption(option)
}

//渲染班级每组薪资
function initGroupChart(groupData) {
  console.log(groupData);
  const myChart = echarts.init(document.getElementById('lines'))
  //准备配置项
  const option = {
    grid: {
      left: 70,
      top: 30,
      right: 30,
      bottom: 50
    },
    tooltip: {
      trigger: 'item'
    },
    xAxis: {
      type: 'category',
      data: groupData[1].map(item => item.name),
      axisLine: {//x轴线控制
        lineStyle: {
          color: '#ccc',
          type: 'dashed'
        }
      }
    },
    axisLabel: {
      show: true,
      color: '#666'
    },
    yAxis: {
      type: 'value',
      splitNumber: 5,
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
          color: '#ccc'
        }
      }
    },
    series: [
      {
        name: '期望薪资',
        data: groupData[1].map(item => item.hope_salary),
        type: 'bar'
      },
      {
        name: '实际薪资',
        data: groupData[1].map(item => item.salary),
        type: 'bar'
      }
    ],
    color: [{
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [{
        offset: 0, color: 'rgba(62,213,158,1)' // 0% 处的颜色
      },
      {
        offset: 1, color: 'rgba(205,244,230,0.1)' // 100% 处的颜色
      }],
      global: false // 缺省为 false
    }, {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 1,
      y2: 1,
      colorStops: [{
        offset: 0, color: 'rgba(79,162,238,1)' // 0% 处的颜色
      },
      {
        offset: 1, color: 'rgba(212,233,251,0.1)' // 100% 处的颜色
      }],
      global: false // 缺省为 false
    },]
  };
  //基于配置项渲染
  myChart.setOption(option)




  //点击切换
  //利用事件委托，给按钮绑定点击事件
  const btns = document.querySelector('#btns')
  btns.addEventListener('click', e => {
    // console.log(e.target);
    if (e.target.tagName === 'BUTTON') {
      btns.querySelector('.btn-blue').classList.remove('btn-blue')
      e.target.classList.add('btn-blue')



      //获取组号
      const group = e.target.innerText
      //点击修改option配置项
      //重新setOption
      option.xAxis.data = groupData[group].map(item => item.name)
      option.series[0].data = groupData[group].map(item => item.hope_salary)
      option.series[1].data = groupData[group].map(item => item.salary)
      myChart.setOption(option)
    }
  })
  //干掉有btn-blue类的盒子(排他思想)，给当前点击的盒子加上

}

//渲染男生女生薪资分布
function initGenderChart(salaryData) {
  //初始化
  const myChart = echarts.init(document.getElementById('gender'))
  //准备配置项
  const option = {
    //大标题
    title: [{
      text: '男女薪资分布',
      textStyle: {
        fontSize: 16
      },
      top: 20,
      left: 10
    },

    {
      text: '男生',
      textStyle: {
        fontSize: 12
      },
      top: '48%',
      left: 'center'
    },

    {
      text: '女生',
      textStyle: {
        fontSize: 12
      },
      top: '88%',
      left: 'center'
    }],
    //提示框
    tooltip: {
      trigger: 'item'
    },
    //数据项
    series: [
      {
        name: '男生',
        type: 'pie',
        radius: ['20%', '30%'],
        center: ['50%', '30%'],
        // data: [
        //   { value: 1048, name: 'Search Engine' },
        //   { value: 735, name: 'Direct' },
        //   { value: 580, name: 'Email' },
        //   { value: 484, name: 'Union Ads' },
        // ]
        data: salaryData.map(item => {
          return {
            name: item.label,
            value: item.b_count
          }
        }),
        color: ['#fda224', '#5097ff', '#3abcfa', '#34d39a'],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          },

        }
      },
      {
        name: '女生',
        type: 'pie',
        radius: ['20%', '30%'],
        center: ['50%', '70%'],
        data: salaryData.map(item => {
          return {
            name: item.label,
            value: item.g_count
          }
        }),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          },

        }
      }
    ]
  };
  //基于配置项渲染
  myChart.setOption(option)
}

//地图渲染
const initMapChart = (provinceData) => {
  const myEchart = echarts.init(document.querySelector('#map'))
  //默认数据项
  const dataList = [
    { name: '南海诸岛', value: 0 },
    { name: '北京', value: 0 },
    { name: '天津', value: 0 },
    { name: '上海', value: 0 },
    { name: '重庆', value: 0 },
    { name: '河北', value: 0 },
    { name: '河南', value: 0 },
    { name: '云南', value: 0 },
    { name: '辽宁', value: 0 },
    { name: '黑龙江', value: 0 },
    { name: '湖南', value: 0 },
    { name: '安徽', value: 0 },
    { name: '山东', value: 0 },
    { name: '新疆', value: 0 },
    { name: '江苏', value: 0 },
    { name: '浙江', value: 0 },
    { name: '江西', value: 0 },
    { name: '湖北', value: 0 },
    { name: '广西', value: 0 },
    { name: '甘肃', value: 0 },
    { name: '山西', value: 0 },
    { name: '内蒙古', value: 0 },
    { name: '陕西', value: 0 },
    { name: '吉林', value: 0 },
    { name: '福建', value: 0 },
    { name: '贵州', value: 0 },
    { name: '广东', value: 0 },
    { name: '青海', value: 0 },
    { name: '西藏', value: 0 },
    { name: '四川', value: 0 },
    { name: '宁夏', value: 0 },
    { name: '海南', value: 0 },
    { name: '台湾', value: 0 },
    { name: '香港', value: 0 },
    { name: '澳门', value: 0 },
  ]
  //provinceData后台返回的数据项，将后台返回的数据项匹配到默认
  //遍历datalist，找同name项，有就更新value
  dataList.forEach(item => {
    const regExp = /省|回族自治区|吾尔自治区|壮族自治区|特别行政区|自治区/g
    const obj = provinceData.find(v => v.name.replace(regExp, '') === item.name)
    if (obj) {
      item.value = obj.value
    }
  })
  let option = {
    title: {
      text: '籍贯分布',
      top: 20,
      left: 10,
      textStyle: {
        fontSize: 16,
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} 位学员',
      borderColor: 'transparent',
      backgroundColor: 'rgba(0,0,0,0.5)',
      textStyle: {
        color: '#fff',
      },
    },
    visualMap: {
      min: 0,
      max: 6,
      left: 'left',
      bottom: '20',
      text: ['6', '0'],
      inRange: {
        color: ['#ffffff', '#0075F0'],
      },
      show: true,
      left: 40,
    },
    geo: {
      map: 'china',
      roam: false,
      zoom: 1.0,
      label: {
        normal: {
          show: true,
          fontSize: '10',
          color: 'rgba(0,0,0,0.7)',
        },
      },
      itemStyle: {
        normal: {
          borderColor: 'rgba(0, 0, 0, 0.2)',
          color: '#e0ffff',
        },
        emphasis: {
          areaColor: '#34D39A',
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowBlur: 20,
          borderWidth: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
    series: [
      {
        name: '籍贯分布',
        type: 'map',
        geoIndex: 0,
        data: dataList,
      },
    ],
  }
  myEchart.setOption(option)
}
