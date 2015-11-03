$(document).on("ready",function(e)
{
  if (typeof data == 'undefined') data = {};
  if (typeof version == 'undefined') version = '';

  $('.diffs').hide();

  // $('.column-two-thirds').prepend('<div class="diffs"> <h2 class="heading-large">'+version+' changes</h2> <p>The changes between this and the previous version of the prototype.<p> <p class="font-xsmall">Use the links on the side to view the details. <strong style="font-weight:bold">Changed</strong> files are listed first, followed by <strong style="font-weight:bold">New</strong> files, and <strong style="font-weight:bold">Deleted</strong> files. The <strong style="font-weight:bold">Ignore</strong> files are ones with small cosmetic changes which aren\'t really pertinent to the iteration of the prototype</p></div>');
  $('.column-two-thirds').prepend('<div id="summary"><h2 class="heading-large">Summary</h2><dl></dl></div>');
  for(var a in data)
  {
    $('#summary dl').append('<dt class="heading-small">'+a+'.html</dt>');
    $('#summary dl').append('<dd>'+data[a]+'</dd>');
  }  

  $('#navs a').each(function(i,e)
  {  
    var href = $(e).attr('href');
    href = href.substr(1,href.length-5);
    if (data[href])
    {
      $('#'+href+'html h2').after('<p>'+data[href]+'</p>');
    } else {
      $("#ignored").append($(e).parent('li'));
    }
  });

  $('#navs a, #ignored a').on('click',function(e)
  {
    e.preventDefault();
    $("#summary").hide();
    var id = $(this).attr('href');
    $('.diffs').hide();
    $(id).show();
  });
});