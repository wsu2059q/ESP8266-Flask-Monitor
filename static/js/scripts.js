// 定义一个包含多个句子的数组
const hitokotoArray = [
    "挺起胸膛，正视天空，不这样怎么算是活着？",
    "人的梦想是不会终结的！",
    "连最起码的努力都没付出过的人没资格去羡慕有才能的人,无法成功的人是因为想象不到成功者付出过多少努力所以才无法成功。",
    "能相互支撑的不仅仅是同伴，向敌人学习更多，从敌人哪里获得更多，直到再次重逢那日为止，仅是那个人的存在，就足以使自己忍受孤独，竞技者之间，是连敌人也能互相支撑的。",
    "我迷路了，不是因为没有地图，我没有的，是目的地。"
];

// 获取一个随机的句子
function getRandomHitokoto() {
    const randomIndex = Math.floor(Math.random() * hitokotoArray.length);
    return hitokotoArray[randomIndex];
}

// 异步获取数据
async function fetchData(endpoint) {
    const response = await fetch(endpoint);
    const data = await response.json();
    return data;
}

// 格式化日期
function formatDate(dateString, format) {
    const date = new Date(dateString);
    if (format === 'hour') {
        return date.toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
    } else if (format === 'day') {
        return date.toLocaleString('zh-CN', { month: '2-digit', day: '2-digit' });
    } else {
        return date.toLocaleString('zh-CN', { hour12: false });
    }
}

// 渲染图表
async function renderCharts() {
    const data = await fetchData('/environment/info/average');

    // 过滤5分钟内的数据
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const realtimeData = data.realtime.filter(item => new Date(item.timestamp) >= fiveMinutesAgo);

    // 只显示最近的30项实时数据
    const realtimeLabels = realtimeData.slice(-30).map(item => formatDate(item.timestamp, 'hour'));
    const realtimeHumidityData = realtimeData.slice(-30).map(item => item.humidity);
    const realtimeTemperatureData = realtimeData.slice(-30).map(item => item.temperature);

    // 确保 hourly 和 daily 数据按时间顺序排列
    const hourlyLabels = data.hourly.map(item => `${item.hour}:00`);
    const hourlyHumidityData = data.hourly.map(item => item.avg_humidity);
    const hourlyTemperatureData = data.hourly.map(item => item.avg_temperature);

    const dailyLabels = data.daily.map(item => formatDate(item.date, 'day'));
    const dailyHumidityData = data.daily.map(item => item.avg_humidity);
    const dailyTemperatureData = data.daily.map(item => item.avg_temperature);

    // 渲染实时数据图表
    const realtimeCtx = document.getElementById('realtimeChart').getContext('2d');
    new Chart(realtimeCtx, {
        type: 'line',
        data: {
            labels: realtimeLabels,
            datasets: [
                {
                    label: '湿度 (%)',
                    data: realtimeHumidityData,
                    borderColor: 'blue',
                    fill: false
                },
                {
                    label: '温度 (°C)',
                    data: realtimeTemperatureData,
                    borderColor: 'red',
                    fill: false
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // 渲染每小时平均数据图表
    const hourlyCtx = document.getElementById('hourlyChart').getContext('2d');
    new Chart(hourlyCtx, {
        type: 'line',
        data: {
            labels: hourlyLabels,
            datasets: [
                {
                    label: '平均湿度 (%)',
                    data: hourlyHumidityData,
                    borderColor: 'green',
                    fill: false
                },
                {
                    label: '平均温度 (°C)',
                    data: hourlyTemperatureData,
                    borderColor: 'orange',
                    fill: false
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // 渲染每天平均数据图表
    const dailyCtx = document.getElementById('dailyChart').getContext('2d');
    new Chart(dailyCtx, {
        type: 'line',
        data: {
            labels: dailyLabels,
            datasets: [
                {
                    label: '平均湿度 (%)',
                    data: dailyHumidityData,
                    borderColor: 'purple',
                    fill: false
                },
                {
                    label: '平均温度 (°C)',
                    data: dailyTemperatureData,
                    borderColor: 'pink',
                    fill: false
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// 显示或隐藏图表
function showChart(chartType) {
    const containers = document.querySelectorAll('.chart-container');
    containers.forEach(container => container.style.display = 'none');

    const buttons = document.querySelectorAll('.menu button');
    buttons.forEach(button => button.classList.remove('active'));

    const selectedContainer = document.getElementById(`${chartType}ChartContainer`);
    selectedContainer.style.display = 'block';

    const selectedButton = document.querySelector(`.menu button[onclick="showChart('${chartType}')"]`);
    selectedButton.classList.add('active');
}

// 显示随机的句子
function displayHitokoto() {
    const hitokotoElement = document.getElementById('hitokoto');
    hitokotoElement.innerText = getRandomHitokoto();
}

// 初始化图表、显示默认图表和显示随机句子
renderCharts();
showChart('realtime');
displayHitokoto();