var backgroundcolors = ['#1ABC9C','#16A085','#2ECC71','#27AE60','#3498DB','#2980B9','#9B59B6','#8E44AD','#34495E','#2C3E50','#F1C40F','#F39C12','#E67E22','#D35400','#E74C3C','#C0392B','#ECF0F1','#BDC3C7','#95A5A6','#7F8C8D'];
	
function initclickevent()
{
	$('#btn-load-resource')[0].addEventListener('click', function (e) {
		if(validRequiredField($('#resourceModal'))){
			var filename = $('#resource-name').val();
			var result = getDataFromXml(filename);
			loadResource(jQuery.parseJSON(result));
			$('#resourceModal').modal('hide');
		}
	},false);

	$('#btn-new-thread')[0].addEventListener('click', function (e) {
		if(validRequiredField($('#myModal'))){
			fillThreadModalBody();
			initdragevent();
			$('#myModal').modal('hide');
			resetThreadModal();
		}
	},false);

	$(document).on("click", ".task-add", function () {
	     var threadid = $(this).data('id');
	     var taskname = $(this).data('name'); 
	     $("#addTaskModal #newTaskModalLabel").text('New Task @ '+taskname);
	     $("#addTaskModal #newTaskModalLabel").attr('data-source', threadid);
	     //$("#addTaskModal #task-name").val('taskname');
	});
	$('#btn-new-task')[0].addEventListener('click', function (e) {
		if(validRequiredField($('#addTaskModal')) && validIntRequiredField($('#addTaskModal'))){
			var sourceid = $("#addTaskModal #newTaskModalLabel").attr('data-source');
			var source = $('.'+ sourceid);
			var newtaskleft = 120;
			if(source.children('.plan').length > 0){
				var lastchild = $(source.children('.plan')[source.children('.plan').length-1]);
				/*if(lastchild.css('left')!=undefined){
					if(lastchild.css('left')!='auto'){
						console.log(lastchild.css('left'));
						newtaskleft = convertToInt(lastchild.css('left'));
					}
					newtaskleft += convertToInt(lastchild.css('width'));
				}*/
				newtaskleft += convertToInt(lastchild.css('width'));
			}
			var newtaskid = sourceid + '-task'+ source.children('.plan').length;
			addTaskAndChildren($("#addTaskModal"), source, newtaskid, newtaskleft);
		}
	},false);

	$('#btn-edit-task')[0].addEventListener('click', function (e) {
		if(validRequiredField($('#editTaskModal')) && validIntRequiredField($('#editTaskModal'))){
			var sourceid = $("#editTaskModal #editTaskModalLabel").attr('data-source');
			var source = $('.'+ sourceid);
			var sourcetaskid = $("#editTaskModal #editTaskModalLabel").attr('source-task');
			var sourcetask = $('#'+ sourcetaskid);
			var sourcetaskclass = $("#editTaskModal #editTaskModalLabel").attr('data-class');
			removeTaskAndChildren(sourcetaskclass);
			addTaskAndChildren($('#editTaskModal'), source, sourcetaskid, convertToInt(sourcetask.css('left')));
		}
	},false);

	$('#btn-del-task')[0].addEventListener('click', function(e){
		var sourcetaskclass = $("#editTaskModal #editTaskModalLabel").attr('data-class');
		removeTaskAndChildren(sourcetaskclass);
		$('#editTaskModal').modal('hide');
		resetTaskModal();
	});

	$('#btn-save')[0].addEventListener('click', function (e) {
		if(validRequiredField($('#saveModal'))){
			downloadFile();
			$('#saveModal').modal('hide');
		}
	},false);

	$('#btn-load')[0].addEventListener('click', function (e) {
		if(validRequiredField($('#saveModal'))){
			loadFile();
			$('#saveModal').modal('hide');
		}
	},false);

	$('#btn-enlarge')[0].addEventListener('click', function (e) {
		console.log('btn-enlarge click,container width', $('.container').css('width'));
		var newwidth = convertToInt($('.container').css('width')) + 1000;
		loadContainerWidth(newwidth);
		//fileref.append("@media (min-width: 1200px) { .container{ width: 2170px; }}")
		//console.log('after click,container width', $('.container').width()*2);
	},false);
}

var fillThreadModalBody = function(){
	var threadName = $('#thread-name').val();
	var threadClass = 'thread' + $('.task-add').length + '-' + threadName.split(' ').join('');
	$('.thread-rows').append('<div class="row">\
			<div class="threadrow">\
				<div class="backline"></div>\
				<div class="'+ threadClass +' thread" id="'+ threadClass +'">\
				</div>\
				<div class="rowtitle">'+ threadName +'</div>\
				<div class="task-add" data-toggle="modal" data-target="#addTaskModal" data-id="'+ threadClass +'" data-name="'+ threadName +'">\
					<div class="task-add-ico">+</div>\
				</div>\
			</div>');
}

var removeTaskAndChildren = function(taskclass){
	updateAllFreeLeft(taskclass);
	$('.'+taskclass).remove();
}

var addTaskAndChildren = function(taskmodal, source, newtaskid, newtaskleft){
	var newtaskcompwidth = taskmodal.find(".task-comp-length").val() * 20; //$("#addTaskModal #task-comp-length").val() * 20;
	var newtaskprologwidth = taskmodal.find(".task-prolog-length").val() * 20; //$("#addTaskModal #task-prolog-length").val() * 20;
	var newtaskwidth = newtaskcompwidth + newtaskprologwidth;
	var newtaskname = taskmodal.find(".task-name").val(); //$("#addTaskModal #task-name").val();
	
	var newtaskcolor = backgroundcolors[Math.round(Math.random()*20)];
	var newtaskclass = newtaskid+newtaskname.split(' ').join('');

	var targetParentIds = [source[0].id];
	taskmodal.find('.select-resources .comp').each(function(){
		if($(this).hasClass('checked')){
			targetParentIds.push($('.' + $(this).parent().prev().prev().children('label').text().trim())[0].id);
		}
	})
	if(!canPutHere(targetParentIds,newtaskleft,newtaskwidth))
	{
		newtaskleft = getMinFreeLeft(targetParentIds,newtaskleft,newtaskwidth);
	}

	source.append('<div id="'+newtaskid+'" class="plan '+ newtaskclass +'"\
			 draggable="true" style="width:'+newtaskwidth+'px; left:'+ newtaskleft +'px; '+ getMixPlanColor(newtaskcolor, newtaskprologwidth) +'"\
			 prolog-width="'+ newtaskprologwidth +'px" task-color="'+ newtaskcolor +'">'+ newtaskname +'</div>');
	//$('#'+newtaskid)[0].addEventListener('dragstart', handleStart, false);
	

	taskmodal.find('.select-resources .comp').each(function(){
		if($(this).hasClass('checked')){
			var newtaskchildwidth = newtaskcompwidth;
			var newtaskchildleft = newtaskleft + newtaskprologwidth;
			var newtaskchildprologleft = newtaskprologwidth;
			var backgroundcolor = 'background-color:'+ newtaskcolor + ';';
			if($(this).parent().prev().children('.prolog').hasClass('checked')){
				newtaskchildwidth = newtaskwidth;
				newtaskchildleft = newtaskleft;
				newtaskchildprologleft = 0;
				backgroundcolor = getMixPlanColor(newtaskcolor, newtaskprologwidth)
			}
			var sourceinstance = $(this).parent().prev().prev().children('label');
			var tooltipText = sourceinstance.attr('component');
			if(sourceinstance.attr('description')!=='undefined'){
				tooltipText += (':' + sourceinstance.attr('description'));
			}
			$('.' + sourceinstance.text().trim()).prepend('<div class="plan '+ newtaskclass +'"  data-toggle="tooltip" data-placement="top" title="'+ tooltipText +'"\
				style="width:'+newtaskchildwidth+'px; left:'+ newtaskchildleft +'px; ' + backgroundcolor + '"\
				prolog-left="'+ newtaskchildprologleft +'px" task-color="'+ newtaskcolor +'">'+ sourceinstance.text() +'</div>')
		}
	})

	$("[data-toggle=tooltip]").tooltip();
	initdragevent();
	initDblClick($('#'+newtaskid));
	updateAllOccupiedLeft(newtaskclass);

	$('#threadLength').text(getMaxLength());
	taskmodal.modal('hide'); //$('#addTaskModal').modal('hide');
	resetTaskModal();
}

var canPutHere = function(targetparentids, currentLeft, currentWidth){
	var isfree = true;
	$.each(targetparentids, function (index, value) {
		isfree = isFree(value, currentLeft, currentWidth);
		if(!isfree){
			return false;
		}
	});
	return isfree;
}

var initDblClick = function(target){
	target[0].addEventListener('dblclick', function (e) {
		showEditModal(this);
	},false);
}

var showEditModal = function(target){
	//$('.thread').children('.plan').dblclick(function(){
	//target.dblclick(function(){
		$('#editTaskModal').modal({backdrop:false});
		var taskid = target.id;
		var threadid = $(target).parent().attr('id'); //.attr('class').split(' ')[0];
	    var taskname = $(target).text(); 
	    var taskclass = $(target).attr('class').split(' ').reverse()[0];
	    console.log($(target))
	    var taskwidth = convertToClock(convertToInt($(target).css('width')));
	    var taskprologwidth = convertToClock(convertToInt($(target).attr('prolog-width')));
	    var taskcompwidth = taskwidth - taskprologwidth;
	    $("#editTaskModal #editTaskModalLabel").text('Edit Task:' + taskname);
	    $("#editTaskModal #editTaskModalLabel").attr('data-source', threadid);
	    $("#editTaskModal #editTaskModalLabel").attr('source-task', taskid);
	    $("#editTaskModal #editTaskModalLabel").attr('data-class', taskclass);
	    $("#editTaskModal #edittask-name").val(taskname);
	    $("#editTaskModal #edittask-comp-length").val(taskcompwidth);
	    $("#editTaskModal #edittask-prolog-length").val(taskprologwidth);

	    $.each($('.'+ taskclass), function(i,value){
	    	$('#editTaskModal').find('.select-resources .comp').each(function(){
	    		var sourceinstance = $(this).parent().prev().prev().children('label');
	    		//console.log(sourceinstance.text().trim(),value,$(value),sourceinstance.text().trim() === $(value).text().trim())
	    		if(sourceinstance.text().trim() == $(value).text().trim()){
	    			$(this).addClass('checked');
		    		if(taskprologwidth > 0 && $(value).attr('prolog-left') === '0px'){
		    			$(this).parent().prev().children('.prolog').addClass('checked');
		    		}
	    		}
	    	})
	    	
	    });
	//});
}

var validRequiredField = function(taskmodal){
	var validresult = true;
	taskmodal.find('.required').each(function(){
		if(!$(this).val()){
			alert('some required fields must be filled');
			validresult = false;
			return false;
		}
	});
	return validresult;
}

var validIntRequiredField = function(taskmodal){
	var validresult = true;
	taskmodal.find('.required-int').each(function(){
		if(!$(this).val() || !$.isNumeric($(this).val().trim())){
			alert('some fields must be a number');
			validresult = false;
			return false;
		}
	});
	return validresult;
}
	