// Placeholder branding variables
var insetBgColor = "rgba(255, 255, 255, 0.9)";
var titleColor = "rgba(255, 255, 255, 0.9)";
var textColor = "rgba(68, 68, 68, 0.9)";
var titleContent = "";
var insetContent = "";
var useLogoForTitle = false;

// Code for toggling the inset on the phone view
var insetMayBeHidden = false;

function showInset()
{
	$('#Inset').show();
	insetMayBeHidden = true;
}

function hideInset()
{
	if (insetMayBeHidden)
	{
		$('#Inset').hide();
	}
}

// Code to initialise the elements to the branding colours.
// Also to toggle which 'Powered By' logo is used, based
// on the branding colours, to try to use whichever version
// will show up better.
function setColours()
{
	var useLightImage = false;

	$('#InsetContent').css('background-color', insetBgColor);
	$('#InsetContent').css('color', textColor);
	$('#Title').css('color', titleColor);
	$('.button').css('background-color', insetBgColor);
	$('.button').css('color', textColor);
	
	if (elementColourIsLight('Title', 'color'))
	{
		$('#PoweredByLogo').attr('src', 'powered_by_logo.png');
	}
	else
	{
		$('#PoweredByLogo').attr('src', 'powered_by_logo_black.png');
	}
}

function elementColourIsLight(elementId, cssAttribute)
{
	var element = $('#' + elementId);
	
	if (element == null) return;
	
	var colorString = element.css(cssAttribute);
	
	// Regex matches strings such as 'rgb(0, 50, 255)' and 
	// 'rgba(0, 50, 255, 0.6)'. Checking for unexpected input is
	// minimal since JQuery is fairly reliable in the format it
	// uses.
	var regex = /rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)\s*(,\s*[\d\.]+)?\s*\)/;
	var matches = regex.exec(colorString);

	if (!matches || matches.length < 4) return;
	
	var colourAverage = 
		(parseInt(matches[1]) + 
		parseInt(matches[2]) + 
		parseInt(matches[3])) / 3;
	return (colourAverage >= 128);
}

function elementIsOrIsChildOf(element, id)
{
	while (element)
	{
		if (element.id == id) return true;
		element = element.parentNode;
	}
	return false;
}

function updateUseLogoForTitle(newValue)
{
	useLogoForTitle = newValue;
	updateMainTitle();
}

function updateMainTitle()
{
	if (useLogoForTitle)
	{
		$('#TitleContent').hide();
		$('#TitleLogo').show();
	}
	else
	{
		$('#TitleLogo').hide();
		$('#TitleContent').show();
	}
}

function initialise()
{
	$('#TitleContent').append(titleContent);
	$('#InsetContent').append(insetContent);
	setColours();
	updateMainTitle();
}
