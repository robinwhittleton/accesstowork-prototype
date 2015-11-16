$(document).on('ready',function()
{
// hmm 
jQuery.fx.off = false;    
$('#help').hide();

$(document).idleTimer( {
    timeout:20000,
    events:'keydown',
});
$( document ).on( "idle.idleTimer", function(event, elem, obj){
    // function you want to fire when the user goes idle
    console.log('idle!!');
    $('#help').fadeIn(2000);
});
});