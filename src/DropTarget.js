var Yudu = window.Yudu || {};
Yudu.TemplateEditor = Yudu.TemplateEditor || {};

//=============================================================================
// Static class : DropTarget
// 
// bind(targetDiv, callback) - sets up a div as a drag-drop target for files, 
//     using the provided function as the callback when a file is dropped.
//=============================================================================
(function(DropTarget, undefined)
{
	DropTarget.bind = function(targetDiv, callback)
	{
		makeDropTarget(targetDiv, callback);
	}

	function makeDropTarget(targetDiv, callback)
	{
		targetDiv.addEventListener('dragenter', eventCancel, false);
		targetDiv.addEventListener('dragexit', eventCancel, false);
		targetDiv.addEventListener('dragover', eventCancel, false);
		targetDiv.addEventListener('drop', function(e) { handleDrop(e, callback); });
	}
	
	function eventCancel(event)
	{
		event.stopPropagation();
		event.preventDefault();
	}
	
	function handleDrop(event, callback)
	{
		eventCancel(event);
		var files = event.dataTransfer.files;
		
		if (!files || files.length == 0)
		{
			return;
		}
		
		if (files.length > 1)
		{
			Yudu.TemplateEditor.Error.throwNonFatalError('Please drop only one image at a time!');
			return;
		}
		
		Yudu.TemplateEditor.ProgressIndicator.show("Loading '" + files[0].name + "'");
		var reader = new FileReader();
		reader.onload = function(e) { handleReaderLoad(e, files[0], callback); }
		reader.readAsDataURL(files[0]);
	}
	
	function handleReaderLoad(event, file, callback)
	{
		Yudu.TemplateEditor.ProgressIndicator.close();
		callback(file, event.target.result);
	}
}(Yudu.TemplateEditor.DropTarget = Yudu.TemplateEditor.DropTarget || {}));
