$(document).ready(function(){
    var params = Imola.getUrlParams.init('params') ? Imola.getUrlParams.init('params') : {};
    // 检验用户登录状态
    $.post('' + baseUrl + 'wxa/api/app', {
        'method': 'isTurnTableUser',
        'version': '1',
        'token': params.token
    }, function (res) {
        if (res.Ack == 'Success') {
            if (res.hasRegister) {
                // window.location.href = '/wxa/plugin/20180501/home.html?params=' + decodeURI(JSON.stringify(params))
                window.location.href = '/wxa/plugin/20180501/home.html?params=' + Imola.getUrlParams.init('params', true)
            }
        } else {
            Imola.hint.init(res.LongMessage);
        }
    });

    $('#submitBtn').on('click', function(){
        var money = $('#money').val();
        $('#real-num').html(money);
        $('.msg-wrap').addClass('hidden');
        $('.hint-wrap').removeClass('hidden');
    });
    // back
    $('.back').on('click', function(){
        $('.msg-wrap').removeClass('hidden');
        $('.hint-wrap').addClass('hidden');
    });
    // start
    $('.start').on('click', function(){
        var city = params.city,
            token = params.token,
            invite_code = $.trim($('#code').val())
        name = $.trim($('#name').val()),
            mobile = $.trim($('#mobile').val()),
            money = $.trim($('#money').val()),
            mobileReg = /^1[3|4|5|6|7|8][0-9]\d{4,8}$/;
        if (invite_code == '') {
            Imola.hint.init('请输入邀请码');
        } else if (name == '') {
            Imola.hint.init('请输入姓名');
        } else if (mobile == '') {
            Imola.hint.init('请输入手机号');
        } else if (!mobileReg.test(mobile) || mobile.length != 11) {
            Imola.hint.init('手机号格式不正确');
        } else if (money == '') {
            Imola.hint.init('请输入实际购买金额');
        } else {
            $.post('' + baseUrl + 'wxa/api/app', {
                'method': 'registerTurnTableUser',
                'version': '1',
                'city': city,
                'token': token,
                'invite_code': invite_code,
                'name': name,
                'mobile': mobile,
                'money': money
            }, function (res) {
                var userData = {};
                userData['city'] = city;
                userData['token'] = token;
                userData['name'] = name;
                userData['mobile'] = mobile;
                userData['money'] = money;
                // localStorage.setItem('userData', JSON.stringify(userData));
                // localStorage.setItem('count', Math.floor(parseInt(money) / 5));
                // localStorage.removeItem('remainCount');
                if (res.Ack == 'Success') {
                    $('.msg-wrap').addClass('hidden');
                    $('.hint-wrap').removeClass('hidden');
                    // localStorage.setItem('flag', true);
                    // 刷新城市获奖名单
                    Imola.getAwardList.init();
                    window.location.href = '/wxa/plugin/20180501/home.html?params=' + Imola.getUrlParams.init('params', true);
                } else if (res.Ack == 'Error') {
                    Imola.hint.init(res.LongMessage);
                }
            });
        }
    });
});