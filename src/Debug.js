var Yudu = window.Yudu || {};
Yudu.TemplateEditor = Yudu.TemplateEditor || {};

//=============================================================================
// Static class : Debug
// 
// Utility class to display debug messages on the screen if enabled.
//
// enable(): must be called before any debug messages may be written
// write(): write a debug message to the debug window
//=============================================================================
(Yudu.TemplateEditor.Debug = function()
{
	var enabled = false;

	function enable()
	{
		enabled = true;
	}

	function write(string)
	{
		if (!enabled) return;
		
		var message = $('<div></div>').html(string);
		getFrame().append(message);
	}

	function getFrame()
	{
		var frame = $('#DebugFrame');
	
		if (frame.length == 0)
		{
			frame = $('<div></div>').attr('id', 'DebugFrame');
			$('body').append(frame);
		}
	
		return frame;
	}

	return (
	{
		enable: enable,
		write: write
	});
}());