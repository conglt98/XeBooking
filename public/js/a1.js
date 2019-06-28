$('#carouselExample').on('slide.bs.carousel', function (e) {

    var $e = $(e.relatedTarget);
    var idx = $e.index();
    var itemsPerSlide = 4;
    var totalItems = $('.carousel-item').length;

    if (idx >= totalItems - (itemsPerSlide - 1)) {
        var it = itemsPerSlide - (totalItems - idx);
        for (var i = 0; i < it; i++) {
            // append slides to end
            if (e.direction == "left") {
                $('.carousel-item').eq(i).appendTo('.carousel-inner');
            }
            else {
                $('.carousel-item').eq(0).appendTo('.carousel-inner');
            }
        }
    }
});

// var controller = require('../../controllers/diadiem');
// controller.getAll(function(stations){
//     console.log(stations);
// })


$('input[type=radio][name="searchform-type-trip"]').change(function () {
    if (this.value == '1') {
        $("#searchform-returnday").prop('disabled', true);
        $("searchform-returnday").prop('required',false);


    } else if (this.value == '2') {
        $("#searchform-returnday").prop('disabled', false);
        $("searchform-returnday").prop('required',true);
    }
});

// $('.dropdown-toggle').dropdown();

$('#swapbutton').click(()=>{
    let tempText = $('#fromInput').val();
    let tempId = $('#fromInput').data("id");
    $('#fromInput').val( $('#toInput').val());
    $('#toInput').val(tempText);
    $('#fromInput').data("id", $('#toInput').data("id"));
    $('#toInput').data("id",tempId);
});
