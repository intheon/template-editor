var Yudu = window.Yudu || {};
Yudu.TemplateEditor = Yudu.TemplateEditor || {};

//=============================================================================
// Static class : ProgressIndicator
// 
// Utility class to freeze the UI and display a message with a 'working' 
// spinner image.
//
// (This is exposed as stateless utility methods so that code using the 
// indicator doesn't need to pass around an indicator object - it all calls
// through to the same UI elements anyhow.)
//
// Public interface:
//   show(message): freeze the screen and show the specified message
//   update(message): update the message for an already-visible indicator
//   close(): dismiss the indicator
//=============================================================================
(function (ProgressIndicator, undefined)
{
	var className = "YuduProgressIndicatorContent";
	var messageBoxId = "ProgressIndicatorMessageBox";
	
	ProgressIndicator.show = function(message)
	{
		if ($('.' + className).length == 0)
		{
			createControls();
		}
		
		ProgressIndicator.update(message);
		
		$('.' + className).show();
	}
	
	ProgressIndicator.update = function(message)
	{
		$('#' + messageBoxId).children('span').html(message);
	}
	
	ProgressIndicator.close = function()
	{
		$('.' + className).hide();
	}
	
	function createControls()
	{
		var veil = $('<div></div>')
			.attr('class', className)
			.css('position', 'fixed')
			.css('width', '100%')
			.css('height', '100%')
			.css('background-color', 'black')
			.css('opacity', '0.6')
			.css('z-index', '99');
			
		var messageWindowFrame = $('<div></div>')
			.attr('id', messageBoxId)
			.attr('class', className)
			.css('z-index', '99');
		messageWindowFrame.append('<span></span>');
		var spinner = $('<img></img>').attr('src', 'Progress.gif');
		messageWindowFrame.append($('<br/>'));
		messageWindowFrame.append(spinner);
		$('body').append(veil);
		$('body').append(messageWindowFrame);
	}

}(Yudu.TemplateEditor.ProgressIndicator = Yudu.TemplateEditor.ProgressIndicator || {}));
