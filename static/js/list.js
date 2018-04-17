$(document).ready(function(){
    var userData = Imola.getLocalData.init('userData', 'object'),
        token = userData.token,
        params = {
            "token": token
        };
    $.get('static/api/myAwardList.json', params, function(res){
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
        window.location.href = '/';
    });
});