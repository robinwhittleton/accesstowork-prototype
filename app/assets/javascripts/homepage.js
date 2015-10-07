$(document).on('ready',function()
{
  var show = $('.show-pages');
  show.hide();

  show.on('mouseleave',function()
  {
    show.hide();
  });

  $('.pages-link').on('mouseover',function(e)
  {
    if (e.currentTarget != e.target) return;

    var num = $(this).data('num');

    show.find('.pages').empty();
    $(this).append(show);

    $.get('/api/'+num+'/', {}, function(data, status, xhr)
    {
      for(var i in data)
      {
        var d = data[i];
        if (d)
        {           
          var link = '<li><a href="/'+num+d.substring(0,d.length-5 )+'">'+d+'</a></li>'         
          $('.show-pages ul').append(link);           
        }         
      }
      var h = show.outerHeight()/2;
      show.css({top:-h,left:"50px"});
      show.find(".tag").css({top:h+38});
      show.show();
    });
  });
  
});