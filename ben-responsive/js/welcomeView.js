$(".header").html(welcomeHeader);
$(".main-text").html(welcomeText);

$("#buttonOne").html(button1_Text);
$("#buttonTwo").html(button2_Text);
$("#buttonThree").html(button3_Text);

applyMagicLinks(button1_MagicLink,"button1_MagicLink");
applyMagicLinks(button2_MagicLink,"button2_MagicLink");
applyMagicLinks(button3_MagicLink,"button3_MagicLink");

function setVisibleButtons(numberOfButtons)
{
	setAppropriateClass(numberOfButtons)
}



function setAppropriateClass(numberOfButtons,name)
{
	var buttonsInt = parseInt(numberOfButtons);

	if (buttonsInt == 0)
	{
		$(".button").hide();
	}
	else if (buttonsInt == 1)
	{
		$(".button").removeClass("one-half");
		$(".button").removeClass("one-third");
		$('#buttonOne').show();
		$('#buttonTwo').hide();
		$('#buttonThree').hide();
	}
	else if (buttonsInt == 2)
	{
		$(".button").removeClass("one-third");
		$(".button").addClass("one-half");
		$('#buttonOne').show();
		$('#buttonTwo').show();
		$('#buttonThree').hide();
	}
	else if (buttonsInt == 3)
	{
		$(".button").removeClass("one-half");
		$(".button").addClass("one-third");
		$('#buttonOne').show();
		$('#buttonTwo').show();
		$('#buttonThree').show();
	}
}



function detectDevice()
{
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  if( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) )
  {
    return 'ios';
  }
  else if( userAgent.match( /Android/i ) )
  {
    return 'android';
  }
  else
  {
    return 'ios';
  }
}


// magic link choices at the moment are latest, editions, downloads, login, and logout

function applyMagicLinks(link,targetElement)
{

	// in this particular template, my json metadata file identified the buttons as button1_MagicLink etc
	// however, there's only 3 actual buttons that can have a magic link applied to
	// therefore! i need to simply get the integer from the name, and add it to the first, second, or third button

	var buttonNumber = targetElement;
		buttonNumber = buttonNumber.substr(6,1);

	if (detectDevice() == "android")
	{
		switch (link)
		{
			case "latest":
				applySyntax("about:latest-edition");
				break;
			case "editions":
				applySyntax("about:my-editions");
				break;
			case "downloads":
				applySyntax("about:my-downloads");
				break;
			case "login":
				applySyntax("about:login");
				break;
			case "logout":
				applySyntax("about:logout");
				break;
			default:
				applySyntax("#");
				break;
		}
	}
	else if (detectDevice() == "ios")
	{
		switch (link)
		{
			case "latest":
				applySyntax("latest_link");
				break;
			case "editions":
				applySyntax("editions_link");
				break;
			case "downloads":
				applySyntax("downloads_link");
				break;
			case "login":
				applySyntax("login_link");
				break;
			case "logout":
				applySyntax("logout_link");
				break;
			default:
				applySyntax("#");
				break;
		}
	}


	function applySyntax(code)
	{
		$("#buttonContainer a:nth-child("+buttonNumber+")").attr("href",code);
	}

}

try
{
	setAppropriateClass(numberOfButtons);
	setAppropriateClass(numberOfButtons);
}
catch (error)
{
	console.log(error);
}
finally
{
	console.log("after");
}



