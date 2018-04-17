$(document).ready(function(){
    var userData = Imola.getLocalData.init('userData'),
        money = userData.money ? userData.money: '',
        count = Imola.getLocalData.init('count', ''),
        remainCount = Imola.getLocalData.init('remainCount', '') ? Imola.getLocalData.init('remainCount', '') : count;
    $('#remain-count').html(remainCount);
    function nextBtnStatus(){
        var count = localStorage.getItem('count'),
            remainCount = localStorage.getItem('remainCount') ? localStorage.getItem('remainCount') : localStorage.getItem('count'),
            status = JSON.parse(localStorage.getItem('status'));
        if ( count > remainCount ){
            if( status ){
                $('#next').removeClass('hidden');
            }else{
                $('#next').addClass('hidden');
            }
            $('#myAward').removeClass('hidden');
        }
    }
    nextBtnStatus();
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
        var status = JSON.parse(localStorage.getItem('status'));
        var params = {
            "token": userData.token
        }
        if (status){
            $.get('static/api/startAward.json', params, function(res){
                if(res.Ack == 'Success'){
                    var rank = getAwardRank(res.data);
                    rotateFn(rank);
                    var remainCount = localStorage.getItem('remainCount') ? localStorage.getItem('remainCount') : count;
                        remainCount-=1;
                    if( remainCount <=0 ){
                        localStorage.setItem('status', false)
                    }
                    localStorage.setItem('remainCount', remainCount)
                    $('#remain-count').html(remainCount);
                    nextBtnStatus();
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