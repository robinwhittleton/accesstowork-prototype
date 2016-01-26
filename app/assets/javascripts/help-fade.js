$(document).on('ready',function()
{
  // hmm
  jQuery.fx.off = false;

  var w = $(window).width();
  if (w >= 640)
  {
    $('#help').hide();
    $(document).idleTimer( {
        timeout:20000,
        events:'keydown focus select change',
    });
    $( document ).on( "idle.idleTimer", function(event, elem, obj){
        // function you want to fire when the user goes idle
        console.log('idle!!');
        $('#help').fadeIn(2000);
    });
  }
});
