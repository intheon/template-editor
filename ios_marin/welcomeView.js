// Placeholder branding variables
var insetBgColor = "#3ba5dc";
var titleColor = "rgba(255, 255, 255, 0.9)";
var textColor = "#ffffff";
var titleContent = "";
var insetContent = "";
var useLogoForTitle = false;
var useDropShadows = false;
var useRoundedButtons = false;
var numberOfButtons = 6;

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

function updateOptionalElements()
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
	
	if (useDropShadows)
	{
		$('div#Title').css('text-shadow', '7px 7px 10px rgba(0, 0, 0, 0.75)');
		$('div#InsetContent').css('box-shadow', '7px 7px 10px rgba(0, 0, 0, 0.75)');
		$('.button').css('box-shadow', '7px 7px 10px rgba(0, 0, 0, 0.75)');
	}
	else
	{
		$('div#Title').css('text-shadow', 'none');
		$('div#InsetContent').css('box-shadow', 'none');
		$('.button').css('box-shadow', 'none');
	}
	
	if (useRoundedButtons)
	{
		$('.button').css('border-radius', '20px');
	}
	else
	{
		$('.button').css('border-radius', '0px');
	}
}

function updateUseLogoForTitle(newValue)
{
	useLogoForTitle = (newValue == "true");
	updateOptionalElements();
}

function updateUseDropShadows(newValue)
{
	useDropShadows = (newValue == "true");
	updateOptionalElements();
}

function updateUseRoundedButtons(newValue)
{
	useRoundedButtons = (newValue == "true");
	updateOptionalElements();
}

function setVisibleButtons(newNumberOfButtons)
{
	if (newNumberOfButtons == 0) $('#but1').hide();
		else $('#but1').show();
		
	if (newNumberOfButtons <= 1) $('#but2').hide();
		else $('#but2').show();

	if (newNumberOfButtons <= 2) $('#but3').hide();
		else $('#but3').show();
		
	if (newNumberOfButtons <= 3) $('#but4').hide();
		else $('#but4').show();
		
	if (newNumberOfButtons <= 4) $('#but5').hide();
		else $('#but5').show();
		
	if (newNumberOfButtons <= 5) $('#but6').hide();
		else $('#but6').show();
}

function setTitleTextColour(newValue)
{
	titleColor = newValue;
	setColours();
}

function initialise()
{
	$('#TitleContent').append(titleContent);
	$('#InsetContent').append(insetContent);
	setColours();
	updateOptionalElements();
	setVisibleButtons(numberOfButtons);
}
