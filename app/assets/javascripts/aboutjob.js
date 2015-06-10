/*
	Used to be puled into scripts.html but I stuck it 
	directly in the views instead because I want to be 
	able to change it with different versions of the prototype.
*/
$(document).on("ready",function()
{
	$('#nextbutton').on('click',function(e)
	{
		e.preventDefault();

		$('#havejob input').each(function(i,el)
		{
			if ($(el).is(':checked'))
			{
				var e = $(el).attr('id');				
				if (e == 'radio-indent-3partyyes')		
				{
					/*
						At this point the use has said they have a job	
					*/
					$('#employment-status input').each(function(i,el)
					{
						if ($(el).is(':checked'))
						{
							var dest = $(el).data('dest');
							$('form').attr('action',dest);
							$('form').submit();
							// window.location.href = dest;
						}
					});					
				} else {
					/*
						At this point the use has said they have a job	
					*/
					$('#csi-status input').each(function(i,el)
					{
						if ($(el).is(':checked'))
						{
							var dest = $(el).data('dest');
							$('form').attr('action',dest);
							$('form').submit();
							// window.location.href = dest;
						}
					});		
				}
			}
		});
	});
});