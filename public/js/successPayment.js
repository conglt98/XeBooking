$(document).ready(function () {
    now = 3;
    var x = setInterval(function() {
        //block page
        // tao page 
       now--;
        document.getElementById("secondLeft").innerText=  now;

        if (now <= 0) {
          clearInterval(x);
          opener.callSuccess(); 
        
        //   if ( !localStorage["reloaded"] ){
        //     localStorage["reloaded"] = true
        //     location.reload()
        // }
        
        }
      }, 1000);

      window.onbeforeunload = (e)=>{
          opener.callSuccess();
      }
});