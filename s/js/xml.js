var loadXMLDoc = function(filename)
{
	if (window.XMLHttpRequest)
	{
		xhttp=new XMLHttpRequest();
	}
	else // code for IE5 and IE6
	{
		xhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xhttp.open("GET",filename,false);
	xhttp.send();
	return xhttp.responseXML;
}

var Resources = '';
var getDataFromXml = function(){
	var xmlDoc=loadXMLDoc("/s/sample.xml");
	var resources = [];
	if(xmlDoc){
		$xml = $( xmlDoc ),
  		//$instance = $xml.find( "Instance" );
  		$xml.find('Instance').each(function(){
  			var resource = {};
  			if($(this).attr('componentid')){
  				resource.componentid = $(this).attr('componentid');
  				resource.instanceid = $(this).attr('componentid');
  				if($(this).attr('instanceid')){
  					resource.instanceid = $(this).attr('instanceid');
  				}
  			}
  			resources.push(resource);
  		})
  		/*
  		for (var i = 0 ; i < $instance.length ; i++) {
  			if($($instance[i]).attr('instanceid')){
  				console.log($($instance[i]).attr('componentid'),$($instance[i]).attr('instanceid'));
  			}
		};*/
	}
	Resources = JSON.stringify(resources);
	console.log('Resources:',Resources);
}