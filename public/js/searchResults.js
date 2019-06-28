
// $("#searchResultPartialDiv").data("Chuyens");



function divChange(id) {
    if ($("#seats" + id).text() == '') {
        $('#continueBtn' + id).fadeOut();
    }
    else $('#continueBtn' + id).fadeIn();
}

function addSeats(seat, chuyenId) {
    let seatsDiv = $('#seats' + chuyenId).text();
    if (seatsDiv == '') {
        $('#seats' + chuyenId).text(' ' + seat.attr('id'));
    } else {
        $('#seats' + chuyenId).text(seatsDiv + ', ' + seat.attr('id'));
    }   

}

function removeSeats(seat, chuyenId) {
    let seatsDiv = $('#seats' + chuyenId).text();

    let pos = seatsDiv.search(' ' + seat.attr('id'));
    let tmp;
    if (pos != 0) {
        tmp = seatsDiv.replace(', ' + seat.attr('id'), '');
    }
    else {
        tmp = seatsDiv.replace(' ' + seat.attr('id'), '');
        if (tmp.length > 0 && tmp[0] == ',') {
            tmp = tmp.substr(1);
        }
    }
    $('#seats' + chuyenId).text(tmp);

}

function getSeatsArray(btn) {
    let cBtn = $('#' + btn.id);
    let id = parseInt(cBtn.data("id"));
    let tmp = $('#seats' + id).text();
    tmp = tmp.substr(1);
    let seats = tmp.split(', ');
    seats.sort();
    return seats;
}

function changeID(id, newID) {
    $('#' + id).attr('id', newID);
}

function changeRadioID(id, newID){
    changeID(id, newID);
    $('[for="'+id+'"]').attr('for',newID);
}

function loadSeats(btn, id, isUserSesstion) {
    if (!isUserSesstion){
        href = (window.location.href).substr((window.location.href).search('/search'));
        href = encodeURIComponent(href);
        href = '/users/login?returnURL='+href;
        window.open(href, "_self");
        return;
    }
    let seats = getSeatsArray(btn);
    let htmlPassengerDetail = $('#passengerDetailContainer'+id).data('html');
    if (htmlPassengerDetail){
        $('#passengerDetailContainer'+id).html(htmlPassengerDetail);
        $('#home').addClass('active');
        $('#home').removeClass('fade');
        $('#menu1').removeClass('active');
        $('#menu2').removeClass('active');
        $('#menu1').addClass('fade');
        $('#menu2').addClass('fade');
        $('#ahome').addClass('active');

        $('#amenu1').removeClass('active');
        $('#amenu2').removeClass('active');

        $('#amenu1').addClass('disabled');
        $('#amenu2').addClass('disabled');
    }
    else{
        htmlPassengerDetail = $('#passengerDetailContainer'+id).html();
        $('#passengerDetailContainer'+id).data('html',htmlPassengerDetail);
     }


     
    changeID('passengerDetail'+id, 'passengerDetail'+id+1);

    changeID('genderDiv'+id, 'genderDiv'+id+'1');
    changeID('passengerName'+id, 'passengerName'+id+'1');
    changeID('namSinh'+id, 'namSinh'+id+'1');


    changeRadioID('male'+id, 'male'+id+'1');
    changeRadioID('female'+id, 'female'+id+'1');
    changeRadioID('other'+id, 'other'+id+'1');
    $('#passengerDetail'+id+'1 #detailSeat').text(seats[0]);
    $('#passengerDetail'+id+'1 #number').text(1);


    for (let i = 1; i < seats.length; i++) {
        $('#passengerDetailContainer'+id).append(htmlPassengerDetail);
        changeID('passengerDetail'+id, 'passengerDetail'+id + (i + 1));
        $('#passengerDetail'+id + (i + 1) + ' #detailSeat').text(seats[i]);
        $('#passengerDetail'+ id+(i + 1)+ ' #number').text(i + 1);
        $('#genderDiv'+id+' input').attr('name','gender'+(i+1));
        changeID('passengerName'+id, 'passengerName'+id+(i+1));
        changeID('namSinh'+id, 'namSinh'+id+(i+1));

        changeRadioID('male'+id, 'male'+id+(i+1));
        changeRadioID('female'+id, 'female'+id+(i+1));
        changeRadioID('other'+id, 'other'+id+(i+1));
        changeID('genderDiv'+id, 'genderDiv'+id+(i+1));

    }

}



function updateTotal(chuyenId) {
    let totalDiv = $('#total' + chuyenId);
    let price;
    if (totalDiv.data('price')[0]=='$')
        price = parseInt(totalDiv.data('price').substr(1));
    else
        price = parseInt(totalDiv.data('price'));
    let seatsList = $('#seats' + chuyenId).text();
    if (seatsList == '') totalDiv.text('$0')
    else {
        let numSeats = (seatsList.split(', ')).length;
        price = price * numSeats;
        totalDiv.text('$' + price);
    }

}


function getDataToSumary(btn,chuyenId){
    let id = $(btn).closest('.modal').attr('id');

    let fullname = $('#passengerName'+chuyenId+'1').val();
    let phone = $('#'+id + ' #ticketPhone').val();
    let email = $('#'+id + ' #ticketEmail').val();

    $('#'+id + ' #sumaryFullName').text(fullname);
    $('#'+id + ' #sumaryPhone').text(phone);
    $('#'+id + ' #sumaryEmail').text(email);

    chuyenId = id.substring(7);
    console.log(id);
    console.log(chuyenId);

    seatID = '#seats'+chuyenId;
    totalId = '#total'+chuyenId;

    $('#'+id + ' #sumarrySeats').text($(seatID).text());
    $('#'+id + ' #sumarryTotal').text($(totalId).text());

}

var windowPayment = null;
  
function parent_disable() {
    if(windowPayment && !windowPayment.closed)
    windowPayment.focus();
    }

function popupwindow(url, title, w, h) {
    var left = (screen.width / 2) - (w / 2);
    var top = (screen.height / 2) - (h / 2);
    return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
}


function submitForm(Chuyen, userId, element){
    let chuyenId = Chuyen.id;

    let divId = '#menu2'+chuyenId;
    let transaction = {
        "sdt": $(divId+' #sumaryPhone').text().trim(),
        "email": $(divId+' #sumaryEmail').text(),
        "total": $(divId+' #sumarryTotal').text().substr(1),
        "UserId": userId,
        "TransactionDetails": []
    }

    let divs = $('#passengerDetailContainer'+chuyenId+' .passengerDetail');
    for (let i=0; i<divs.length; i++){
        let div = divs[i];
        let id = (div.id).substr(15+chuyenId.toString().length);
        let nameId = '#passengerName'+chuyenId+id; 
        let namSinhId = '#namSinh'+chuyenId+id; 
        let genderId =  '#genderDiv'+chuyenId+id+' input[name="gender'+id+'"]:checked';
        let seatId =  '#'+div.id+' #detailSeat';

        let transactionDetail = {
            "ten":$(nameId).val(),
            "namSinh":$(namSinhId).val(),
            "GioiTinhId": $(genderId).val(),
            "viTriGheDat":$(seatId).text()
        }
        transaction.TransactionDetails.push(transactionDetail);
    }
    let htmlChuyen='<input type="text" name="Chuyen" class="hidden" value="'+encodeURI(JSON.stringify(Chuyen))+'">';
    let htmlUserId='<input type="text" name="UserId" class="hidden" value="'+userId+'">';
    let htmlTransaction='<input type="text" name="Transaction" class="hidden" value="'+encodeURI(JSON.stringify(transaction))+'">';

    let hiddenFormId = "#hiddenForm"+chuyenId;


    $(hiddenFormId).append(htmlChuyen);
    $(hiddenFormId).append(htmlUserId);
    $(hiddenFormId).append(htmlTransaction);
    $(hiddenFormId).attr('target', 'payment');
    windowPayment = popupwindow("/payment","payment",800,800);
    // windowPayment = window.open("/payment","payment","width=750,height=800,toolbar=0");
    $(hiddenFormId).submit();
    $("#unactivateDiv").removeClass("hidden");
    $(element).hide();
    var now = 10*60;
    var x = setInterval(function() {
        //block page
        // tao page 
       now--;
      
        var minutes = Math.floor(now/60);
        var seconds = Math.floor(now%60);
          
        document.getElementById("countDown"+chuyenId).innerText=  minutes + " : " + seconds;

        if (windowPayment.closed){
            callError()
        }
          // time out
        if (now <= 0) {
          clearInterval(x);
          windowPayment.close();
          callError();
            
        //   if ( !localStorage["reloaded"] ){
        //     localStorage["reloaded"] = true
        //     location.reload()
        // }
        
        }
      }, 1000);
}


function callSuccess() {
    localStorage["paymentStatus"] = 1;
    if (!windowPayment.closed){
        windowPayment.close();
    }
    location.reload();
}

function callError() {
    localStorage["paymentStatus"] = -1;
    if (!windowPayment.closed){
        windowPayment.close();
    }
    location.reload();

}


$(document).ready(function () {
    console.log(localStorage["paymentStatus"]);
    if (localStorage["paymentStatus"]!=0){
        if (localStorage["paymentStatus"] == 1){
            $('.alertSuccess').slideDown(100);
        }

        localStorage["paymentStatus"] =0;
    }
    let Chuyens = $("#searchResultPartialDiv").data("chuyens");
    let idChuyens = Chuyens.split(";");
    idChuyens.splice(-1, 1);

    idChuyens.forEach(id => {
        let tmp = $('#div' + id).data('seats');
        let seats = tmp.split(';');
        seats.splice(-1, 1);
        seats.forEach(seat => {
            $('#div' + id + " #" + seat).addClass('sleeper-disabled');
        });
    });

    $('.sleeper:not(.sleeper-disabled,.non-toggle),.seater:not(.sleeper-disabled,.non-toggle)').on('click', function () {
        $(this).toggleClass('sleeper-active');
        let tag = $(this).closest('.busDiv').attr('id');
        let chuyenId = tag.substring(3);
        if ($(this).hasClass('sleeper-active')) {
            addSeats($(this), chuyenId);
        }
        else {
            removeSeats($(this), chuyenId);
        }
        divChange(chuyenId);
        updateTotal(chuyenId);
    });




    $(".page-link").click(function () {
        let textthis = $(this).text();
        let text = $(".page-link.active").text();
        if (textthis === '<') {
            if (text != 1) {
                let tmp = parseInt(text) - 1;
                tmp = ".page-link." + tmp;
                $(".page-link.active").removeClass('active');
                $(tmp).addClass('active');
            }
        } else
            if (textthis == ">") {
                if (text != 3) {
                    let tmp = parseInt(text) + 1;
                    tmp = ".page-link." + tmp;
                    $(".page-link.active").removeClass('active');
                    $(tmp).addClass('active');
                }
            } else {
                $(".page-link.active").removeClass('active');
                $(this).addClass('active');
            }
    });



});




