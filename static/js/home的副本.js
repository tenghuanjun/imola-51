$(document).ready(function(){
    var params = Imola.getUrlParams.init('params') ? Imola.getUrlParams.init('params') : {},
        userData = Imola.getLocalData.init('userData'),
        count,
        remainCount;
    // 获取抽奖次数
    function chanceCount (){
        $.get('' + baseUrl + 'wxa/api/app', {
            "method": 'getTurnTableDrewCount',
            "version": '1',
            "token": params.token
        }, function(res){
            if (res.Ack == 'Success'){
                $('#remain-count').html(res.chanceCount);
                localStorage.setItem('count', res.chanceCount);
                remainCount = res.chanceCount
            }else{
                Imola.hint.init(res.LongMessage);
            }
        });
        return remainCount;
    }
    chanceCount();

    // 抽奖
    var awards = ["A", "B", "C", "D"];
    function getAwardRank(key) {
        var item;
        switch (key) {
            case 'A':
                item = 1;
                break;
            case 'B':
                item = 2;
                break;
            case 'C':
                item = 3;
                break;
            case 'D':
                item = 4;
                break;
        }
        return item
    }
    // 转盘
    var rotateFn = function (item) {
        var angles = item * (360 / awards.length) - (360 / (awards.length * 2));
        if (angles < 90) {
            angles = 90 - angles;
        } else {
            angles = 360 - angles + 90;
        }
        $('#wheelcanvas').stopRotate();
        $('#wheelcanvas').rotate({
            angle: 0,
            animateTo: angles + 3600,
            duration: 5000,
            callback: function () {
                $('.result-wrap').removeClass('hidden').addClass('award' + item +'');
                // 获奖信息存储在本地
            }
        });
    };    
    
    $('.turn-pointer, #next').on('click', function(){
        // debugger
        var self = $(this),
            status = JSON.parse(localStorage.getItem('status'));
        if (status){
            self.attr('disabled', 'disabled');
            $.get('' + baseUrl + 'wxa/api/app', {
                "method": "doTurnTableDrew",
                "version": "1",
                "token": params.token
            }, function(res){
                if(res.Ack == 'Success'){
                    var rank = getAwardRank(res.prize);
                    rotateFn(rank);
                    var remainCount = chanceCount();
                    if( remainCount <=0 ){
                        localStorage.setItem('status', false);
                        Imola.hint.init(res.LongMessage);
                        $('#next').addClass('hidden');
                    }
                    self.removeAttr('disabled');
                    $('#next, #myAward').removeClass('hidden');
                    $('#remain-count').html(remainCount);
                }else{
                    Imola.hint.init(res.LongMessage)
                }
            });
        }else{
            Imola.hint.init(res.LongMessage);
        }
    });
    // 跳转我的奖品页面
    $('#myAward').on('click', function () {
        window.location.href = '/list.html'
    });    
});