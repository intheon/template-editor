// welcomeView calls this file as soon as it's opened.
// it tests which user agent the device/browser returns and calls addCSS
// addCSS is told which stylesheet to load -- simples!

function addCSS(cssFile) 
{

    var newlink = document.createElement("link")
		newlink.setAttribute("href", cssFile);
        newlink.setAttribute("type", "text/css");
		newlink.setAttribute("rel", "stylesheet");

    document.getElementsByTagName('head')[0].appendChild(newlink);
}

if (/(iPhone|iPod)/i.test(navigator.userAgent))
{
	addCSS("css/phone.css");
}

else if (/(iPad)/i.test(navigator.userAgent))
{
	addCSS('css/tablet.css');
}

else if(/(Android)/i.test(navigator.userAgent))
{
	if (/(Mobile)/i.test(navigator.userAgent)) 
	{
        addCSS('css/phone.css');
	}
	else 
	{
        addCSS('css/tablet.css');
	}
}

