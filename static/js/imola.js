var Imola = {} || '';
Imola.hint = new function(){
    this.init = function(msg){
        layer.open({
            content: msg,
            time: 2
        });
    }
}
// 获取页面地址参数
Imola.getUrlParams = new function(){
    this.init = function(name){
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
            r = window.location.search.substr(1).match(reg),
            obj;
            if (r != null && r[2])
            obj = r[2];
        return JSON.parse(decodeURI(obj));
    }
}

// 获取本地存储数据
Imola.getLocalData = new function(){
    this.init = function(name, type){
        var data;
        if (type == 'object'){
            data = JSON.parse(localStorage.getItem(name)) ? JSON.parse(localStorage.getItem(name)) : {};
        }else{
            data = localStorage.getItem(name) ? localStorage.getItem(name):''
        }
        return data;
    }
}

// 获取获奖人员名单数据
Imola.getAwardList = new function(){
    this.init = function(url, params){
        $.get(url, params, function (res) {
            if (res.success) {
                var temp = Handlebars.compile($('#award-news-temp').html()),
                    html = temp(res);
                $('.award-list-ul').append(html);
            }
        });        
    }
}

Imola.awardNews = new function(){
    this.init = function (obj, time){
        var timer = null,
            count = 0,
            move = 0,
            length = $(obj).children('li').size();
        function autoPlay(){
            count++;
            if(count > 3){
                count = 0;
                move = 0;
                $(obj).delay(time).animate({ 'top': move }, 0);
            }
            move = - count * 0.5 + 'rem';
            $(obj).delay(time).animate({ 'top': move }, 500);
        }
        timer = setInterval(autoPlay, 1000);
    }
}
// 关闭获奖提示
Imola.closeAwardHint = new function(){
    this.init = function(){
        $('.result-wrap').removeClass('award1, award2, award3, award4').addClass('hidden');
    }
}
