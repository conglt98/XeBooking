function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#b3-header-avatar')
                .attr('src', e.target.result).width(170)
                .height(170);
        };

        reader.readAsDataURL(input.files[0]);
    }
}


function updateHeader(url) {
    let type = ['time', 'desc'];
    let query = getPageNumber('order', url);
    if (query != 1)
        type = query.split('_');

    let newActive = $('#header' + type[0]);
    $('.listHeader').each(function () {
        let href = $(this).attr('href');

        if ($(this).attr('id') == newActive.attr('id')) {
            let html = (newActive.text());
            if (type[1] == 'asc') html += '<i class="fas fa-arrow-up ml-1"></i>';
            else html += '<i class="fas fa-arrow-down ml-1"></i>';
            $(this).html(html);
            href = href.replace(type[1], getOppositeOrder(type[1]));
        }

        let newhref = getNewHref('order', url, href);
        $(this).attr('href', newhref);

    });

    switch (type[0]) {
        case 'licensePlate': {
            $('.active-filter').removeClass('active-filter');
            $('#headerlicensePlate').addClass('active-filter');
            $('.licensePlateData').addClass('active-filter');
            break;
        }
        case 'time': {
            $('.active-filter').removeClass('active-filter');
            $('#headertime').addClass('active-filter');
            $('.timeData').addClass('active-filter');
            break;
        }
        case 'departure': {
            $('.active-filter').removeClass('active-filter');
            $('#headerdeparture').addClass('active-filter');
            $('.departureData').addClass('active-filter');
            break;
        }
        case 'information': {
            $('.active-filter').removeClass('active-filter');
            $('#headerinformation').addClass('active-filter');
            $('.informationData').addClass('active-filter');

            break;
        }
        case 'price': {
            $('.active-filter').removeClass('active-filter');
            $('#headerprice').addClass('active-filter');
            $('.priceData').addClass('active-filter');
            break;
        }

        default:
            break;
    }
}

function getOppositeOrder(ord) {
    return ord == 'asc' ? 'desc' : 'asc';
}
function getNewHref(pattern, url, hreff) {
    let href = hreff.substr(1);
    if (url.search('\\?')<0) return hreff;
    let uri = url.substr(url.search('history?') + 7);
    console.log(uri);

    if (uri.search(pattern) >= 0) {
        lists = uri.substr(1).split('&');
        for (let i = 0; i < lists.length; i++) {
            if (lists[i].search(pattern) >= 0) {
                lists[i] = href;

            }
        }
        uri = '?' + lists.join('&');
    }
    else {
        uri += '&' + href;
    }
    return uri;
}

function getPageNumber(pattern, url) {
    if (url.search('\\?')<0) return 1;

    let uri = url.substr(url.search('history?') + 7);

    if (uri.search(pattern) >=0 ) {
        let tmp = uri.substr(uri.search(pattern) + pattern.length + 1);
        tmp1 = tmp.search('&');
        let page;
        if (tmp1 >= 1)
            page = tmp.substr(0, tmp1);
        else
            page = tmp;
        return page;
    }
    else {
        return 1;
    }
}


$(document).ready(function()
{
 $('#b3-icon-edit-fullname').click(function()
 {
    if ($("input[name='fullname']").is("[readonly]")) {
        $("input[name='fullname']").removeAttr("readonly");  
        $('#b3-icon-edit-fullname').attr('src','/img/icon/baseline-done-24px.svg');
    }
    else
        {$("input[name='fullname']").attr("readonly",true); 
        $('#b3-icon-edit-fullname').attr('src','/img/icon/baseline-create-24px-grey.svg');    
    }
 });

 $('#b3-icon-edit-password').click(function()
 {
    if ($("input[name='pasw']").is("[readonly]")) {
        $("input[name='pasw']").removeAttr("readonly");  
        $('#b3-icon-edit-password').attr('src','/img/icon/baseline-done-24px.svg');
    }
    else
        {$("input[name='pasw']").attr("readonly",true); 
        $('#b3-icon-edit-password').attr('src','/img/icon/baseline-create-24px-grey.svg');    
    }
 });

 $('#b3-icon-edit-phone').click(function()
 {
    if ($("input[name='phone']").is("[readonly]")) {
        $("input[name='phone']").removeAttr("readonly");  
        $('#b3-icon-edit-phone').attr('src','/img/icon/baseline-done-24px.svg');
    }
    else
        {$("input[name='phone']").attr("readonly",true); 
        $('#b3-icon-edit-phone').attr('src','/img/icon/baseline-create-24px-grey.svg');    
    }
 });

 $('#b3-icon-edit-email').click(function()
 {
    if ($("input[name='email']").is("[readonly]")) {
        $("input[name='email']").removeAttr("readonly");  
        $('#b3-icon-edit-email').attr('src','/img/icon/baseline-done-24px.svg');
    }
    else
        {$("input[name='email']").attr("readonly",true); 
        $('#b3-icon-edit-email').attr('src','/img/icon/baseline-create-24px-grey.svg');    
    }
 });

 $('#b3-icon-edit-location').click(function()
 {
    if ($("input[name='location']").is("[readonly]")) {
        $("input[name='location']").removeAttr("readonly");  
        $('#b3-icon-edit-location').attr('src','/img/icon/baseline-done-24px.svg');
    }
    else
        {$("input[name='location']").attr("readonly",true); 
        $('#b3-icon-edit-location').attr('src','/img/icon/baseline-create-24px-grey.svg');    
    }
 });

 let url = window.location.href
 updateHeader(url);
  let nPage = getPageNumber('page',url);
  let n = $('ul.pagination li a').length;
  let i = 0;
  $('ul.pagination li a').each(function () {
    let text = 0;
    if (i == 0) {
      if (nPage == 1) {
        $(this).parent().addClass('disabled');
        text = 0;
      }
      else text = nPage - 1;
    } else if (i == n - 1) {
        if (nPage == n - 1) {
          $(this).parent().addClass('disabled');
          text = 0;
        }
        else text = parseInt(nPage) + 1;
      } else
        text = i;
    if (text != 0) {
      let href = '?page=' + text;
      let newhref = getNewHref('page',url, href);
      $(this).attr('href', newhref);
    }
    i++;
  });




 });