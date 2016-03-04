$(document).on("ready",function(e)
{
  if (typeof data == 'undefined') data = {};
  if (typeof version == 'undefined') version = '';

  /*
    Hide all the individual diff displays.
  */
  $('.diffs').hide();

  // $('.column-two-thirds').prepend('<div class="diffs"> <h2 class="heading-large">'+version+' changes</h2> <p>The changes between this and the previous version of the prototype.<p> <p class="font-xsmall">Use the links on the side to view the details. <strong style="font-weight:bold">Changed</strong> files are listed first, followed by <strong style="font-weight:bold">New</strong> files, and <strong style="font-weight:bold">Deleted</strong> files. The <strong style="font-weight:bold">Ignore</strong> files are ones with small cosmetic changes which aren\'t really pertinent to the iteration of the prototype</p></div>');
  $('.column-two-thirds').prepend('<div id="summary"><h2 class="heading-large">Summary</h2><dl></dl></div>');

  var vprev = 'v'+(version-1);
  var vthis = 'v'+version;

  console.log(data);

  for(var a in data)
  {
    console.log(a);
    $('#summary dl').append('<dt class="heading-small">'+a+'.html</dt>');
    $('#summary dl').append('<dd>'+data[a]+'</dd>');
    $('#summary dl').append('<dd>'
      // +'<a class="screen" href="/public/images/shots/'+vprev+'/'+a+'-full.png" data-lightbox="'+a+'">'+vprev+'<br /><img src="/public/images/shots/'+vprev+'/'+a+'-full.png" width="100"></a>'
      // +'<a class="screen" href="/public/images/shots/'+vthis+'/'+a+'-full.png" data-lightbox="'+a+'">'+vthis+'<br /><img src="/public/images/shots/'+vthis+'/'+a+'-full.png" width="100"></a>'
      +'</dd>');
  }

  $('#changed a').each(function(i,e)
  {
    // grab the href
    var href = $(e).attr('href');
    // remove .html
    href = href.substr(1);
    // either add the description to the Summary or move it into Ignore.
    if (data[href]) $('#'+href+'html h2').after('<p>'+data[href]+'</p>');
    else $("#ignored").append($(e).parent('li'));
  });

  $('#changed a, #ignored a').on('click',function(e)
  {
    e.preventDefault();
    $("#summary").hide();
    var id = $(this).attr('href');
    $('.diffs').hide();
    $(id).show();
  });
});
