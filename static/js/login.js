$(document).ready(function(){
    var params = Imola.getUrlParams.init('params');
    Imola.getAwardList.init('static/api/awardList.json', Imola.getUrlParams.init('params'));
    Imola.awardNews.init('.award-list-ul', 2000);
    $('#submitBtn').on('click', function(){
        var city = params.city,
            token = params.token,
            name = $.trim($('#name').val()),
            mobile = $.trim($('#mobile').val()),
            money = $.trim($('#money').val());
        if(city == ''){
            city = ''
        }else if( token == '' ){
            token = ''
        }else if( name == '' ){
            Imola.hint.init('请输入姓名');
        }else if( mobile == '' ){
            Imola.hint.init('请输入手机号');
        }else if(money == ''){
            Imola.hint.init('请输入实际购买金额');
        }else {
            $.get('static/api/userData.json', {
                'city': city,
                'token': token,
                'name': name,
                'mobile': mobile,
                'money': money
            }, function(res){
                var userData = {};
                userData['city'] = city;
                userData['token'] = token;
                userData['name'] = name;
                userData['mobile'] = mobile;
                userData['money'] = money;
                localStorage.setItem('status', true);
                localStorage.setItem('userData', JSON.stringify(userData));
                localStorage.setItem('count', Math.floor(parseInt(money) / 5));
                localStorage.removeItem('remainCount');
                if(res.Ack == 'Success'){
                    $('#real-num').html(money);
                    $('.msg-wrap').addClass('hidden');
                    $('.hint-wrap').removeClass('hidden');
                } else if (res.Ack == 'Error'){
                    Imola.hint.init(res.LongMessage);
                }
            });
        }
    });
    // back
    $('.back').on('click', function(){
        $('.msg-wrap').removeClass('hidden');
        $('.hint-wrap').addClass('hidden');
    });
    // start
    $('.start').on('click', function(){
        window.location.href = '/'
    });
});