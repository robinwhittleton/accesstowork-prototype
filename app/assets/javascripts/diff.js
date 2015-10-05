$(document).on("ready",function(e)
{
  if (typeof data == 'undefined') data = {};
  if (typeof version == 'undefined') version = '';

  $('.diffs').hide();

  $('.column-two-thirds').prepend('<div class="diffs"> <h2 class="heading-large">'+version+' changes</h2> <p>This page will show you the changes between this and the previous version of the prototype.<p> <p class="font-xsmall">Use the links on the side to view the details. <strong>Changed</strong> files are listed first, followed by <strong>New</strong> files, and <strong>Deleted</strong> files. The <strong>Ignore</strong> files are ones with small cosmetic changes which aren\'t really pertinent to the iteration of the prototype</p> <h2 class="heading-medium">Summary</h2> <dl id="summary"></dl> </div>');
  for(var a in data)
  {
    $('#summary').append('<dt class="heading-small">'+a+'.html</dt>');
    $('#summary').append('<dd>'+data[a]+'</dd>');
  }

  $(".column-third").append('<br /><h2>Ignore</h2>');
  $(".column-third").append('<ul id="ignored"></ul>');

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
    var id = $(this).attr('href');
    $('.diffs').hide();
    $(id).show();
  });
});