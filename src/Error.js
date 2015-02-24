var Yudu = window.Yudu || {};
Yudu.TemplateEditor = Yudu.TemplateEditor || {};

//=============================================================================
// Static class : Error
// 
// Error handling utility code
//
// throwFatalError: Clears the screen and displays a helpful (?) message.
//=============================================================================
(function(Error, undefined)
{
	Error.throwNonFatalError = function(message)
	{
		alert(message);
	}
	
	Error.throwFatalError = function(message)
	{
		var errorHtml = 
"<h2>Sorry, the editor hit an unrecoverable error.</h2>" +
"<h3>This usually means that a data file is not formatted correctly - double check " +
"any recent changes to the template files. The error message was: " +
"<span style='color: red'>" + message + "</span></h3>";
		$('body').html(errorHtml);

	}
}(Yudu.TemplateEditor.Error = Yudu.TemplateEditor.Error || {} ));