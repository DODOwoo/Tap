var loadAll = function(){
	var objs = jQuery.parseJSON(FileData);
	loadThread(objs.threads);
	loadResource(objs.resources);
	loadContainer(objs.container);
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
			</div>');
	});
}

var loadTasks = function(tasks){
	$.each(tasks, function(i, task){
		var source = $('.' + task.threadid);
		source.append('<div id="'+ task.id +'" class="'+ task.class +'"\
			 draggable="true" style="width:'+ task.width +'; left:'+ task.left +'; '+ getMixPlanColor(task.color, convertToInt(task.prologwidth)) +'"\
			 prolog-width="'+ task.prologwidth +'px">'+ task.name +'</div>');

		$.each(task.taskresources, function(k, taskresource){
			$('.' + taskresource.resourceinstanceid).append('<div class="'+ taskresource.class +'"  data-toggle="tooltip" data-placement="top" title="'+ taskresource.title +'"\
				style="width:'+ taskresource.width +'; left:'+ taskresource.left +'; background-color:'+ task.color +';"\
				prolog-left="'+ taskresource.prologleft +'">'+ taskresource.resourceinstanceid +'</div>');
		})
	})
}

var loadContainer = function(container){
	$('.container').width = container.width;
	$('#threadLength').text(container.clock);
}

var loadOccupied = function(occupied){
	var threadObj = jQuery.parseJSON(threadLeftObjs);
	threadObj.obj = occupied;
	threadLeftObjs = JSON.stringify(threadObj)
}