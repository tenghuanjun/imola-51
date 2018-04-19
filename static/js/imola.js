var Imola = {} || '',
    baseUrl = 'https://www.zhuke.com/';
$.ajaxSetup({
    "contentType" : "application/x-www-form-urlencoded"
});    
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
    this.init = function(name, url){
        // debugger
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
            r = window.location.search.substr(1).match(reg),
            data;
        if (r != null){
            if(url){
                return decodeURIComponent(r[2]);
            }else{
                data = JSON.parse(decodeURIComponent(r[2]));
                return data;
            } 
        }return null;
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
    var params = Imola.getUrlParams.init('params') ? Imola.getUrlParams.init('params'):{};
    params['method'] = 'getCityTurnTablePrizeList';
    params['version'] = '1';
    params['offset'] = '0';
    params['limit'] = '10';
    this.init = function(){
        $.post('' + baseUrl + 'wxa/api/app', params, function (res) {
            if (res.Ack == 'Success') {
                var temp = Handlebars.compile($('#award-news-temp').html()),
                    html = temp(res);               
                $('.award-list-ul').append(html);
                Imola.awardNews.init('.award-list-ul', 2000);
            }
        });
        Handlebars.registerHelper('rank', function(award, options){
            if(award == 'A'){
                this.award = '一'
                return options.fn(this);
            } else if (award == 'B'){
                this.award = '二'
                return options.fn(this);
            } else if (award == 'C') {
                this.award = '三'
                return options.fn(this);
            } else if (award == 'D') {
                this.award = '四'
                return options.fn(this);
            }
        })          
    }
}
Imola.getAwardList.init();

Imola.awardNews = new function(){
    this.init = function (obj, time){
        var timer = null,
            count = 0,
            move = 0,
            length = $(obj).children('li').size();
        function autoPlay(){
            count++;
            if (count >= length){
                count = 0;
                move = 0;
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
        $('.turn-pointer, #next').removeAttr('disabled');
    }
}
