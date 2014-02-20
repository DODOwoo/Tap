var loadAll = function(){
	var objs = jQuery.parseJSON(FileData);
	loadContainer(objs.container);
	loadThread(objs.threads);
	loadResource(objs.resources);
	loadTasks(objs.tasks)
	loadOccupied(objs.occupied);
}

var loadThread = function(threads){
	$.each(threads, function(i, thread){
		if($('.thread-rows #'+thread.id).length == 0){
			$('.thread-rows').append('<div class="row">\
				<div class="threadrow">\
					<div class="rowtitle">'+ thread.name +'</div>\
					<div class="backline"></div>\
					<div class="'+ thread.class +'" id="'+ thread.id +'">\
					</div>\
					<div class="task-add" data-toggle="modal" data-target="#addTaskModal" data-id="'+ thread.id +'" data-name="'+ thread.name +'">\
						<div class="task-add-ico">+</div>\
					</div>\
				</div>');
		}
	});	
}

var loadResource = function(resources){
	resetResource();
	$.each(resources, function(i, resource){
		$('.instances').append('<div class="row">\
				<div class="threadrow '+ resource.instanceid +'" id="'+resource.instanceid+'thread">\
					<div class="rowtitle">'+ resource.instanceid +'</div>\
					<div class="backline"></div>\
				</div>\
			</div>');

		$('.select-resources').append('<div>\
	    		<div class="col-md-4"><label component="'+ resource.componentid +'" description="'+ resource.description +'"">'+ resource.instanceid +'</label></div>\
	    		<div class="col-md-4">\
	    			<label class="checkbox prolog" for="checkbox1'+ i +'">\
		        		<input type="checkbox" value="" id="checkbox1'+ i +'" data-toggle="checkbox">\
	        		</label>\
	    		</div>\
	    		<div class="col-md-4">\
	    			<label class="checkbox comp" for="checkbox2'+ i +'">\
		        		<input type="checkbox" value="" id="checkbox2'+ i +'" data-toggle="checkbox">\
	        		</label>\
	    		</div>\
			</div>').find(":checkbox").checkbox();
	});
}

var loadTasks = function(tasks){
	$.each(tasks, function(i, task){
		var source = $('.' + task.threadid);
		source.append('<div id="'+ task.id +'" class="'+ task.class +'"\
			 draggable="true" style="width:'+ task.width +'; left:'+ task.left +'; '+ getMixPlanColor(task.color, convertToInt(task.prologwidth)) +'"\
			 prolog-width="'+ task.prologwidth +'" task-color="'+ task.color +'";>'+ task.name +'</div>');

		

		$.each(task.taskresources, function(k, taskresource){
			var backgroundcolor = 'background-color:'+ task.color + ';';
			if(task.prologwidth !== '0px' && taskresource.prologleft === '0px'){
				backgroundcolor = getMixPlanColor(task.color, convertToInt(task.prologwidth));
			}
			$('.' + taskresource.resourceinstanceid).append('<div class="'+ taskresource.class +'"  data-toggle="tooltip" data-placement="top" title="'+ taskresource.title +'"\
				style="width:'+ taskresource.width +'; left:'+ taskresource.left +'; '+ backgroundcolor +'"\
				prolog-left="'+ taskresource.prologleft +'" task-color="'+ taskresource.color +'";>'+ taskresource.resourceinstanceid +'</div>');
		})

		initDblClick($('#'+task.id));
	})
}

var loadContainer = function(container){
	loadContainerWidth(convertToInt(container.width));
	$('#threadLength').text(container.clock);
}

var loadContainerWidth = function(newwidth){
	var newstyle=document.createElement("style");
	newstyle.setAttribute("type", "text/css");
	var containerwidth = document.createTextNode('@media (min-width: 1200px) { .container{ width: '+ newwidth +'px;}}');
	newstyle.appendChild(containerwidth);
	$('head').append(newstyle);
	loadRule();
}

var loadRule = function(){
	$('.rulenumber').empty();
	var maxlinewidth = convertToInt($('.ruleline').css('width'));
	for (var i = 5; i <= maxlinewidth/20; i+=5) {
		$('.rulenumber').append('<label style="left:'+(titleLeft+20*i-10)+'px; position:absolute;">'+i+'</label>');
	};
}

var loadOccupied = function(occupied){
	var threadObj = jQuery.parseJSON(threadLeftObjs);
	threadObj.obj = occupied;
	threadLeftObjs = JSON.stringify(threadObj)
}

var loadFile = function () {
	var filename = $('#file-name').val()
	var data = loadFromRemote(filename, 'text/json');
	FileData = data;
	clearAllData();
	loadAll();
}

var clearAllData = function () {
	$('.plan').remove();
	$('.task').remove();
	$('.instances').empty();
	$('.select-resources').empty();
	initSelectedResources();
	$('.rulenumber').empty();
	resetOccupiedLeft();
}

var resetResource = function(){
	$('.instances').empty();
	$('.select-resources').empty();
}

var initSelectedResources = function(){
	$('.select-resources').append('<div>\
		        		<div class="col-md-3"></div>\
		        		<div class="col-md-4">\
		        			<label>\
				        		Prolog Resource\
			        		</label>\
		        		</div>\
		        		<div class="col-md-5">\
		        			<label>\
				        		Comp. Resource\
			        		</label>\
		        		</div>\
	        		</div>');
}