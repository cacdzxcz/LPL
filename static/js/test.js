console.log('test.js loaded');
// 为选手的a标签提供href
const playerCols = document.querySelectorAll('.player_col');
playerCols.forEach(function(playerCol) {
    playerCol.addEventListener('click', function() {
        // 获取点击的 a 标签中的 href 属性
        const a = playerCol.querySelector('a');
        const div = playerCol.querySelector('div');
        const name = div.textContent;
        a.href = '/player/' + name + '/';
    });
});


function show_team_players(team_name) {
    /*
    获取战队图标和选手的信息
     */
    console.log(team_name);
    $.ajax({
        url: '/show_team_img/' + team_name + '/',
        data: {},
        type: 'POST',
        async: false,
        dataType:'json',
        success: function (data) {
            console.log(data);
            const team_logo_link = data["logo_link"];
            const en_names = data["en_name"];
            const links = data["link"];
            const team_logo = document.getElementById('team_logo');
            team_logo.src = team_logo_link;
            const player_img = document.querySelectorAll('.player_col a img')
            const player_name = document.querySelectorAll('.player_col a div')
            for(let i = 0; i < en_names.length; ++i) {
                player_img[i].style.visibility = '';
                player_name[i].style.visibility = '';
                player_img[i].src = links[i];
                player_name[i].innerHTML = en_names[i];
            }
            for(let i = en_names.length; i < 6; ++i) {
                player_img[i].src = "//img.crawler.qq.com/lolwebvideo/20231010192811/fe4a547c3bc524c7bcc78f2d0cac8480/0";
                player_name[i].innerHTML = "369";
                player_img[i].style.visibility = 'hidden';
                player_name[i].style.visibility = 'hidden';
            }
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

//todo：根据队伍名称获取队伍logo，队伍选手的图片和名字，替换到#team_logo.src, .player_col img.src || div.TextContent,分前三个和后三个
function show_teammates(team_name) {
  $.ajax({
    url:'/team_data',
    data: {},
    type: 'POST',
    async: false,
    dataType:'json',
    success:function (data) {
      // 首先绘制雷达图
      var teamIndex = data["name"].indexOf(team_name);

      // 获取其他信息
      var kill_sum = data["data1"][teamIndex];
      var insert_eye = data["data2"][teamIndex];
      var drop_eye = data["data3"][teamIndex];
      var money = data["data4"][teamIndex];
      var s_dragon = data["data5"][teamIndex];
      var b_dragon = data["data6"][teamIndex];
      var describe_team = data["data7"][teamIndex];

      // 增加队伍名
      var teame_Name = document.getElementById('team_detail_team_name')
      teame_Name.innerText = team_name;

      // 增加队伍介绍
      var team_introduce = document.getElementById('team_introduce')
      team_introduce.innerText = describe_team

      var team_data_introduce = document.getElementById('team_data_introduce')

        // 创建竖直条元素
      var verticalBar = document.getElementById('vertical-bar')
        verticalBar.style.display = 'block';

      // 将竖直条插入到文本元素之前
      team_data_introduce.innerText = "战队数据";

      // 获取雷达图的 div 元素
      var radarChartDiv = document.getElementById('radarChart');

      // 创建新的雷达图实例
      var radarChart = echarts.init(radarChartDiv);
      radarChart.resize()

      var option = {
        radar: {
            radius: '70%', // 控制雷达图的大小
            splitNumber: 4, // 分割的圈数
            indicator: [
                { name: '场均击杀', max: Math.max(...data["data1"]) },
                { name: '场均插眼', max: Math.max(...data["data2"]) },
                { name: '场均排眼', max: Math.max(...data["data3"]) },
                { name: '场均金钱', max: Math.max(...data["data4"]) },
                { name: '场均小龙', max: Math.max(...data["data5"]) },
                { name: '场均大龙', max: Math.max(...data["data6"]) }
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
                    parseInt(kill_sum),
                    parseInt(insert_eye),
                    parseInt(drop_eye),
                    parseInt(money),
                    parseInt(s_dragon),
                    parseInt(b_dragon),
                ],
                name: team_name,
                lineStyle: {
                    color: '#ffffff', // 线条颜色
                    width: 1 // 线条宽度
                },
                areaStyle: {
                    color: 'rgb(211,177,0)', // 区域填充颜色
                  emphasis: {
                    color: 'rgb(255,204,0)' // 鼠标悬停时的颜色
        }
                }
            }]
        }],
        tooltip: {
            trigger: 'axis',
            textStyle: {
                color: '#ffffff' // 提示框文字颜色
            }
        },
        textStyle: {
          fontFamily: "微软雅黑", // Change font family for radar chart
          fontSize: 15, // 字体大小
          color: '#ffffff' // Set the default text color for the chart
        }
      };
      // 使用配置项显示图表
      radarChart.setOption(option);
    },
    error:function (msg) {
        console.log(msg);
        alert('系统发生错误!战队排行榜');
    }
})
}

const teamName = document.getElementById('team-name').innerText;
show_teammates(teamName);
show_team_players(teamName);
var teamSelection = $('#teamSelection');
// 使用slideToggle方法来切换显示和隐藏状态，并添加动画效果
teamSelection.slideToggle();