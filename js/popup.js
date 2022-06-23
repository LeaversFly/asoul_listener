// 滚动到底部加载的次数
let count = 0

// 导航栏的名字
let tab = 'diana'

// 初始化函数
function init(count, tab) {
    // 加载中...
    let preload = $("<div class='preload' style='text-align:center;margin-top:80px'>加载中...</div>")
    $('body').append(preload)
    // 发请求
    axios.get(`http://150.158.164.18/${tab}.json`).then((result) => {
        $('.preload').remove()
        let data = result.data
        let length = count * 12 + 12
        for (let i = count + count * 11; i < length; i++) {
            let card = $("<div class='content'><div class='text'><span style='font-weight:700'></span><span style='font-style:italic'></span><span></span></div><img></div>")
            card.attr('id', `${i}`)
            $('body').append(card)
            // 分析标题出现的不同位置
            if (data[i].title)
                $('.text')[i].children[0].append(data[i].title)
            // 分析简介出现的不同位置
            if (data[i].desc)
                $('.text')[i].children[1].append(data[i].desc)
            else if (data[i].item.description)
                $('.text')[i].children[1].append(data[i].item.description)
            else
                $('.text')[i].children[1].append(data[i].item.content)
            // 分析时间戳出现的不同位置
            var time, index
            // 视频
            if (data[i].ctime)
                time = dateTransForm(data[i].ctime)
            // 文字加图片动态
            else if (data[i].item.upload_time)
                time = dateTransForm(data[i].item.upload_time)
            // 纯文字动态
            else if (data[i].item.timestamp)
                time = dateTransForm(data[i].item.timestamp)
            // 转发动态
            else {
                index = data[i].origin.indexOf('timestamp')
                if (index != '-1') {
                    index = index + 12
                    time = data[i].origin.substring(index, index + 10)
                }
                else {
                    index = data[i].origin.indexOf('ctime')
                    if (index != '-1') {
                        index = index + 7
                        time = data[i].origin.substring(index, index + 10)
                    }
                    else {
                        index = data[i].origin.indexOf('upload_time') + 13
                        time = data[i].origin.substring(index, index + 10)
                    }
                }
                time = '原动态发布时间：' + dateTransForm(time)
            }
            // 追加时间
            $('.text')[i].children[2].append(time)
            // 分析图片出现的不同位置
            data[i].pic == undefined ? $('img')[i].remove : $('img')[i].src = data[i].pic
            // 分析链接出现的位置,点击后打开视频页面
            if (data[i].short_link)
                $(`#${i}`).click(function () {
                    window.location.href = data[i].short_link;
                    window.open(data[i].short_link);
                })
        }
    })
    return count + 1
}

// 将时间戳转换成标准时间
function dateTransForm(ctime) {
    var now = new Date(ctime * 1000),
        y = now.getFullYear(),
        m = ("0" + (now.getMonth() + 1)).slice(-2),
        d = ("0" + now.getDate()).slice(-2);
    var time = y + "-" + m + "-" + d + " " + now.toTimeString().substring(0, 8);
    return time
}

// 滚动到底部触发更新
function windowOnScroll(thisE) {
    $(window).on("scroll", function (e) {
        let scrollTop = Math.ceil(Number($(window).scrollTop()));
        let heightMinus = Number($(document).height() - $(window).height());
        if (scrollTop == heightMinus && count <= 6) {
            //每次滚动到底部,更新数据
            if (count < 6)
                count = init(count, tab)
            else if (count++ == 6)
                $('body').append('<div class="demo_line_02"><span>最多加载60条哦!</span></div>')
        }
    });
}

//导航栏改变的事件
$('li').on("click", function () {
    $(this).addClass("active").siblings().removeClass("active")
    // 获取点击元素id
    tab = $(this).attr('id')
    // 移除原有的信息
    $('.content').remove()
    $('.demo_line_02').remove()
    // 加载次数置0
    count = 0
    count = init(count, tab)
})

// 开始初始化
count = init(count, tab)

// 滚动到底部触发事件
windowOnScroll(this)

