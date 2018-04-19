$(document).ready(function(){
    var params = Imola.getUrlParams.init('params') ? Imola.getUrlParams.init('params'):{},
        userData = Imola.getLocalData.init('userData'),
        count,
        remainCount,
        status;
    // 获取城市中奖人员名单数据
    Imola.getAwardList.init();
    // 获取抽奖次数
    function chanceCount (){
        $.post('' + baseUrl + 'wxa/api/app', {
            "method": 'getTurnTableDrewCount',
            "version": '1',
            "token": params.token
        }, function(res){
            if (res.Ack == 'Success'){
                // 可抽奖
                var allChanceCount = res.allChanceCount,
                    chanceCount = res.chanceCount;
                $('#remain-count').html(chanceCount);
                if (chanceCount < allChanceCount){
                    if (chanceCount<=0){
                        status = false;
                        $('#next').addClass('hidden');
                        $('#myAward').removeClass('hidden');
                        $('.award-count').html('您的抽奖次数已用完');
                    }else{
                        status = true;
                        $('#next, #myAward').removeClass('hidden');

                    }
                } else if (chanceCount == allChanceCount){
                    // 还未抽过
                    status = true;
                }else{
                    status = false;
                    $('#next').addClass('hidden');
                }
            }else{
                // 不可抽奖
                status = false;
                Imola.hint.init(res.LongMessage);
            }
        });
        return status;
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
            status = chanceCount();
        if (status){
            self.attr('disabled', 'disabled');
            $.post('' + baseUrl + 'wxa/api/app', {
                "method": "doTurnTableDrew",
                "version": "1",
                "token": params.token
            }, function(res){
                if(res.Ack == 'Success'){
                    Imola.getAwardList.init();
                    var rank = getAwardRank(res.prize);
                    rotateFn(rank);
                    var status = chanceCount();
                    if( !status ){
                        Imola.hint.init(res.LongMessage);
                        $('#next').addClass('hidden');
                    }
                    $('#next, #myAward').removeClass('hidden');
                    $('#remain-count').html(remainCount);
                }else{
                    Imola.hint.init(res.LongMessage)
                }
            });
        }else{
            Imola.hint.init('你的抽奖次数已用完');
            $('.turn-pointer').attr('disabled', 'disabled');
        }
    });
    // 跳转我的奖品页面
    $('#myAward').on('click', function () {
        window.location.href = '/wxa/plugin/20180501/list.html?params=' + Imola.getUrlParams.init('params', true)
    });    
});