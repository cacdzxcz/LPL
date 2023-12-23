console.log('player_page loaded');
const playerName = document.getElementById('playerName').innerText;
const radarChart = document.getElementById('radarChart');
const round_group = document.getElementById('round-group');
const radarChartDiv = document.querySelector('.player-info .info-chart');
radarChart.style.width = radarChartDiv.offsetWidth + 'px';
radarChart.style.height =  radarChartDiv.offsetWidth + 'px';
const w = document.querySelector('body').offsetWidth;
const h = document.querySelector('body').offsetHeight;


function round(elm,data1,data2,color,str1,str2,str3) {
        // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(document.getElementById(elm));
    const v2 = data1;//自己
    const v3 = data2;//最高
    var v1=v3-v2//总消费
    option = {
        tooltip: {
            trigger: 'item',
        },
        series: [{
            type: 'pie',
            radius: ['60%', '70%'],
            color:color,
            label: {
                normal: {
                position: 'center'
                }
            },
        data: [{
            value: v2,
            name: str1,
            label: {
                normal: {
                    formatter: v2 +'',
                    textStyle: {
                        fontSize: 20,
                        color:'#fff',
                    }
                }
            }
        }, {
            value: v1,
            name: str2,
            label: {
                normal: {
                    formatter : function (params){
                        return str3
                    },
                    textStyle: {
                        color: '#aaa',
                        fontSize: 12
                    }
                }
            },
            itemStyle: {
                normal: {
                    color: 'rgba(255,255,255,.2)'
                },
                emphasis: {
                    color: '#fff'
                }
            },
        }]
        }]
    };
    myChart.setOption(option);
    myChart.resize();
    window.addEventListener("resize",function(){
        myChart.resize();
    });
}

function show_data() {
    $.ajax({
        url: '/get_player_data/',
        data: {},
        type: 'POST',
        async: false,
        dataType: 'json',
        success: function (data) {
            const teamIndex = data["en_name"].indexOf(playerName);
            console.log(playerName)
            console.log(teamIndex);
            // 获取其他信息
            const cn_name = data["cn_name"][teamIndex];
            const link = data["link"][teamIndex];
            const kill = data["kill"][teamIndex];
            const assist = data["assist"][teamIndex];
            const survive = data["survive"][teamIndex];
            const damage = data["damage"][teamIndex];
            const views = data["views"][teamIndex];
            const economy = data["economy"][teamIndex];
            /*
            * todo:修改team_logo
            */
            const player_img = document.querySelector(".player img");
            const team_logo = document.querySelector(".team img");
            const player_cn_name = document.querySelector(".player-name");
            const player_en_name = document.querySelector(".player-id");
            player_cn_name.innerHTML = cn_name;
            player_en_name.innerHTML = playerName;
            $.ajax({
                url: '/get_logo/' + playerName + '/',
                data: {},
                type: 'POST',
                async: false,
                dataType: 'json',
                success: function (data) {
                    console.log(data['link'])
                    team_logo.src = data['link'];
                }
            })

            player_img.src = link;
            // 创建新的雷达图实例
            const radar = echarts.init(radarChart);
            radar.resize();
            const option = {
                radar: {
                    radius: '60%', // 控制雷达图的大小
                    splitNumber: 6, // 分割的圈数
                    indicator: [
                        {name: '击杀总数', max: Math.max(...data["kill"])},
                        {name: '助攻总数', max: Math.max(...data["assist"])},
                        {name: '生存得分', max: Math.max(...data["survive"])},
                        {name: '造成伤害', max: Math.max(...data["damage"])},
                        {name: '视野得分', max: Math.max(...data["views"])},
                        {name: '经济得分', max: Math.max(...data["economy"])},
                    ],
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#ffffff', // 深色表示
                            width: 1, // 雷达图边界线宽度
                            type: 'solid' // 使用实线表示
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#B5B5B5', // 雷达图分隔线颜色
                            width: 1, // 雷达图分隔线宽度
                            type: 'solid' // 雷达图分隔线类型
                        }
                    },
                    splitArea: {
                        show: true,
                        areaStyle: {
                            color: 'rgba(80,76,76,0)' // 区域填充颜色
                        }
                    }
                },
                series: [{
                    type: 'radar',
                    data: [{
                        value: [
                            parseInt(kill),
                            parseInt(assist),
                            parseInt(survive),
                            parseInt(damage),
                            parseInt(views),
                            parseInt(economy),
                        ],
                        name: playerName,
                        lineStyle: {
                            color: '#ffffff', // 线条颜色
                            width: 1 // 线条宽度
                        },
                        areaStyle: {
                            color: 'rgb(255,215,0)', // 区域填充颜色
                            emphasis: {
                                color: 'rgb(255,136,0)' // 鼠标悬停时的颜色
                            }
                        },
                        itemStyle: {
                            color: '#ffffff',
                        }
                    }]
                }],
                tooltip: {
                    trigger: 'axis',
                    textStyle: {
                        color: '#333' // 提示框文字颜色
                    }
                },
                textStyle: {
                    fontFamily: "微软雅黑", // Change font family for radar chart
                    fontSize: 18, // 字体大小
                    color: '#ffffff' // Set the default text color for the chart
                }
            };
            radar.setOption(option);

            // 创建文字图,使用相同的数据
            round('r1', data["kill"][teamIndex], Math.max(...data["kill"]), '#37A2DA', '击杀', 'gap', '最高击杀');
            round('r2', data["assist"][teamIndex], Math.max(...data["assist"]), '#32C5E9', '助攻', 'gap', '最高助攻');
            round('r3', data["survive"][teamIndex], Math.max(...data["survive"]), '#67E0E3', '生存得分', 'gap', '总插眼');
            round('r4', data["damage"][teamIndex], Math.max(...data["damage"]), '#FFDB5C', '伤害', 'gap', '最高伤害');
            round('r5', data["views"][teamIndex], Math.max(...data["views"]), '#9FE6B8', '视野得分', 'gap', '总击杀');
            round('r6', data["economy"][teamIndex], Math.max(...data["economy"]), '#9FE6B8', '经济得分', 'gap', '经济得分');
            radarChart.style.display = 'none';
        },
        error: function (msg) {
            console.log(msg);
            alert('系统发生错误!战队排行榜');
        }
    })
}
function choose() {
      var teamSelection = $('#teamSelection');
      // 使用slideToggle方法来切换显示和隐藏状态，并添加动画效果
      teamSelection.slideToggle();

      var chooseTeam = $('#chooseTeam');
      // 切换三角形方向
        chooseTeam.toggleClass('down');
    }
//雷达图和环形图的切换
const switch_mode = document.querySelectorAll('.switch-text span');
const toggleSwitch = document.getElementById('toggleSwitch');
toggleSwitch.addEventListener('change', function () {
    if(toggleSwitch.checked) {
        switch_mode[0].style.color = '#455173';
        switch_mode[1].style.color = 'white';
        radarChart.style.display = '';
        round_group.style.display = 'none';
    }
    else {
        switch_mode[0].style.color = 'white';
        switch_mode[1].style.color = '#455173';
        radarChart.style.display = 'none';
        round_group.style.display = '';
    }
});

show_data();
var teamSelection = $('#teamSelection');
// 使用slideToggle方法来切换显示和隐藏状态，并添加动画效果
teamSelection.slideToggle();