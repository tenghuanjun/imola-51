$(document).ready(function(){
    var params = Imola.getUrlParams.init('params') ? Imola.getUrlParams.init('params'):{},
        userData = Imola.getLocalData.init('userData', 'object'),
        token = params.token ? params.token : userData.token;
    
    $.post('' + baseUrl + 'wxa/api/app', {
        "method": "getTurnTablePrizeList",
        "version": "1",
        "token": token
    }, function(res){
        if(res.Ack == 'Success'){
            var temp = Handlebars.compile($('#award-item-temp').html()),
                html = temp(res);
            $('.own-award-list').append(html);
        }else{
            Imola.hint.init(res.LongMessage);
        }
    });
    // 返回抽奖页面
    $('.back').on('click', function(){
        // window.history.back();
        window.location.href = '/wxa/plugin/20180501/home.html?params=' + Imola.getUrlParams.init('params', true);
    });
});