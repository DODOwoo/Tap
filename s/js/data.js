var loadFromRemote = function(filename, datatype)
{
	return $.ajax({
		type:'GET',
		url:filename,
		dataType:datatype,
		async:false,
	}).responseText;
}

var getDataFromXml = function(filename){
	var xmlDoc=loadFromRemote(filename, "text/xml");
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
  					if($(this).attr('description')){
  						resource.description = $(this).attr('description');
  					}
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
	return Resources;
}