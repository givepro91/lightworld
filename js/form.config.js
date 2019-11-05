$(document).ready(function () {
    // var pcode = getUrlParameter('pcode');

    /* 티켓 구매하기 */
    $("#ticket-buy").click(function() {
        var ticket_opt = $("select[name=ticket-opt] option:selected").val();

        if (ticket_opt === 'none') {
            alert("상품 옵션을 선택해주세요.");
            return false;
        } else {
            // 상품을 선택후 처리
            var pcode;

            // 상품코드 설정
            switch (ticket_opt) {
                case 'opt-1':
                    pcode = '18TP1SD00001';
                    break;
                case 'opt-2':
                    pcode = '18TP1SD00002';
                    break;
                default:
                    break;
            }
            location.replace('buy.html?pcode=' + pcode);
        }
    });

    $('.btn-number').click(function(e){
        e.preventDefault();
        
        fieldName = $(this).attr('data-field');
        type      = $(this).attr('data-type');
        var input = $("input[name='"+fieldName+"']");
        var price = parseInt(input.data('price'));
        var amount = parseInt($("input[name=amount]").val());
        var currentVal = parseInt(input.val());
        if (!isNaN(currentVal)) {
            if(type == 'minus') {
                
                if(currentVal > input.attr('min')) {
                    input.val(currentVal - 1).change();
                } 
                if(parseInt(input.val()) == input.attr('min')) {
                    $(this).attr('disabled', true);
                }

                /* 결제금액 처리 */
                if (amount < price) {
                    amount = 0;
                } else {
                    amount = amount - price;
                }
                $("input[name=amount]").val(amount);

                /* 결제금액 텍스트 표시 */
                var amount_txt = numberWithCommas(amount);
                $(".amount-txt").html(amount_txt);

            } else if(type == 'plus') {

                if(currentVal < input.attr('max')) {
                    input.val(currentVal + 1).change();
                }
                if(parseInt(input.val()) == input.attr('max')) {
                    $(this).attr('disabled', true);
                }

                /* 결제금액 처리 */
                amount = amount + price;
                $("input[name=amount]").val(amount);

                /* 결제금액 텍스트 표시 */
                var amount_txt = numberWithCommas(amount);
                $(".amount-txt").html(amount_txt);
            }
        } else {
            input.val(0);
        }
    });

    $('.input-number').focusin(function(){
       $(this).data('oldValue', $(this).val());
    });

    $('.input-number').change(function() {    
        minValue =  parseInt($(this).attr('min'));
        maxValue =  parseInt($(this).attr('max'));
        valueCurrent = parseInt($(this).val());
        
        name = $(this).attr('name');
        if(valueCurrent >= minValue) {
            $(".btn-number[data-type='minus'][data-field='"+name+"']").removeAttr('disabled')
        } else {
            alert('죄송합니다. 최소 구매수보다 적게 설정 할 수 없습니다.');
            $(this).val($(this).data('oldValue'));
        }
        if(valueCurrent <= maxValue) {
            $(".btn-number[data-type='plus'][data-field='"+name+"']").removeAttr('disabled')
        } else {
            alert('죄송합니다. 최대 구매수보다 많게 설정 할 수 없습니다.');
            $(this).val($(this).data('oldValue'));
        }
    });

    $(".input-number").keydown(function (e) {
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
             // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) || 
             // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
                 return;
        }
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });

    // 입력시 휴대폰번호 하이픈 자동설정
    $("input[name=user_phone]").keydown(function (e) {
        var value = autoHypenPhone($(this).val());
        $(this).val(value);
    });

    // form 검증
    $("#buy").click(function() {
        var user_name = $("input[name=user_name]");
        var user_email = $("input[name=user_email]");
        var user_phone = $("input[name=user_phone]");
        var agree1 = $("input[name=agree1]:checked");
        var agree2 = $("input[name=agree2]:checked");
        var tic_adult = $("input[name=adult]");
        var tic_student= $("input[name=student]");
        var tic_child = $("input[name=child]");
        var pay_type = $("input:radio[name=pay_type]:checked")
        
        if (tic_adult.val() == 0 && tic_student.val() == 0 && tic_child.val() == 0) {
            alert("입장권은 최소 1장 이상 구매해야합니다.");
            return false;
        }
        if (user_name.val() == "") {
            alert("구매자 이름을 입력해주세요.");
            user_name.focus();
            return false;
        }
        if (user_email.val() == "") {
            alert("구매자 이메일을 입력해주세요.");
            user_email.focus();
            return false;
        }
        if (user_phone.val() == "") {
            alert("구매자 핸드폰번호를 입력해주세요.");
            user_phone.focus();
            return false;
        }
        if (pay_type.val() == "") {
            alert("결제방법을 선택해주세요.");
            return false;
        }
        if (agree1.val() != "Y") {
            alert("개인정보 수집 이용 동의를 해야합니다.");
            return false;
        }
        if (agree2.val() != "Y") {
            alert("제 3자에 대한 개인정보 제공 동의를 해야합니다.");
            return false;
        }
    });
});

/* 숫자 콤마 찍기 */
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/* 핸드폰번호 자동 하이픈 */
function autoHypenPhone(str){
  str = str.replace(/[^0-9]/g, '');
  var tmp = '';
  if( str.length < 4){
    return str;
  }else if(str.length < 7){
    tmp += str.substr(0, 3);
    tmp += '-';
    tmp += str.substr(3);
    return tmp;
  }else if(str.length < 11){
    tmp += str.substr(0, 3);
    tmp += '-';
    tmp += str.substr(3, 3);
    tmp += '-';
    tmp += str.substr(6);
    return tmp;
  }else{        
    tmp += str.substr(0, 3);
    tmp += '-';
    tmp += str.substr(3, 4);
    tmp += '-';
    tmp += str.substr(7);
    return tmp;
  }
  return str;
}