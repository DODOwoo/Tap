var backgroundcolors = ['#1ABC9C','#16A085','#2ECC71','#27AE60','#3498DB','#2980B9','#9B59B6','#8E44AD','#34495E','#2C3E50','#F1C40F','#F39C12','#E67E22','#D35400','#E74C3C','#C0392B','#ECF0F1','#BDC3C7','#95A5A6','#7F8C8D'];
	
function initclickevent()
{
	$('#btn-new-thread')[0].addEventListener('click', function (e) {
		fillThreadModalBody();
		initdragevent();
		$('#myModal').modal('hide');
	},false);

	$(document).on("click", ".task-add", function () {
	     var threadid = $(this).data('id');
	     var taskname = $(this).data('name'); 
	     $("#addTaskModal #newTaskModalLabel").text('New Task @ '+taskname);
	     $("#addTaskModal #newTaskModalLabel").attr('data-source', threadid);
	     //$("#addTaskModal #task-name").val('taskname');
	});
	$('#btn-new-task')[0].addEventListener('click', function (e) {
		
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
	},false);

	$('#btn-edit-task')[0].addEventListener('click', function (e) {
		var sourceid = $("#editTaskModal #editTaskModalLabel").attr('data-source');
		var source = $('.'+ sourceid);
		var sourcetaskid = $("#editTaskModal #editTaskModalLabel").attr('source-task');
		var sourcetask = $('#'+ sourcetaskid);
		var sourcetaskclass = $("#editTaskModal #editTaskModalLabel").attr('data-class');
		removeTaskAndChildren(sourcetaskclass);
		addTaskAndChildren($('#editTaskModal'), source, sourcetaskid, convertToInt(sourcetask.css('left')));
	},false);

	$('#btn-del-task')[0].addEventListener('click', function(e){
		var sourcetaskclass = $("#editTaskModal #editTaskModalLabel").attr('data-class');
		removeTaskAndChildren(sourcetaskclass);
		$('#editTaskModal').modal('hide');
	});

	$('#btn-save')[0].addEventListener('click', function (e) {
		downloadFile();
		$('#saveModal').modal('hide');
	},false);

	$('#btn-load')[0].addEventListener('click', function (e) {
		loadFile();
		$('#saveModal').modal('hide');
	},false);

	$('#btn-enlarge')[0].addEventListener('click', function (e) {
		console.log('btn-enlarge click,container width', $('.container').css('width'));
		$('.container')[0].width = '2170px';
		//console.log('after click,container width', $('.container').width()*2);
	},false);
}

var fillThreadModalBody = function(){
	var threadName = $('#thread-name').val();
	var threadClass = 'thread' + $('.task-add').length + '-' + threadName.split(' ').join('');
	$('.thread-rows').append('<div class="row">\
			<div class="threadrow">\
				<div class="rowtitle">'+ threadName +'</div>\
				<div class="backline"></div>\
				<div class="'+ threadClass +' thread" id="'+ threadClass +'">\
				</div>\
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
			 prolog-width="'+ newtaskprologwidth +'px">'+ newtaskname +'</div>');
	//$('#'+newtaskid)[0].addEventListener('dragstart', handleStart, false);
	

	taskmodal.find('.select-resources .comp').each(function(){
		if($(this).hasClass('checked')){
			var newtaskchildwidth = newtaskcompwidth;
			var newtaskchildleft = newtaskleft + newtaskprologwidth;
			var newtaskchildprologleft = newtaskprologwidth;
			if($(this).parent().prev().children('.prolog').hasClass('checked')){
				newtaskchildwidth = newtaskwidth;
				newtaskchildleft = newtaskleft;
				newtaskchildprologleft = 0;
			}
			var sourceinstance = $(this).parent().prev().prev().children('label');
			var tooltipText = sourceinstance.attr('component');
			if(sourceinstance.attr('description')!=='undefined'){
				tooltipText += (':' + sourceinstance.attr('description'));
			}
			$('.' + sourceinstance.text().trim()).append('<div class="task '+ newtaskclass +'"  data-toggle="tooltip" data-placement="top" title="'+ tooltipText +'"\
				style="width:'+newtaskchildwidth+'px; left:'+ newtaskchildleft +'px; background-color:'+ newtaskcolor +';"\
				prolog-left="'+ newtaskchildprologleft +'px">'+ sourceinstance.text() +'</div>')
		}
	})

	$("[data-toggle=tooltip]").tooltip();
	initdragevent();
	initDblClick($('#'+newtaskid));
	updateAllOccupiedLeft(newtaskclass);

	$('#threadLength').text(getMaxLength());
	taskmodal.modal('hide'); //$('#addTaskModal').modal('hide');
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
	//$('.thread').children('.plan').dblclick(function(){
	target.dblclick(function(){
		$('#editTaskModal').modal('toggle');
		var taskid = this.id;
		var threadid = $(this).parent().attr('id'); //.attr('class').split(' ')[0];
	    var taskname = $(this).text(); 
	    var taskclass = $(this).attr('class').split(' ').reverse()[0];
	    console.log($(this))
	    var taskwidth = convertToClock(convertToInt($(this).css('width')));
	    var taskprologwidth = convertToClock(convertToInt($(this).attr('prolog-width')));
	    var taskcompwidth = taskwidth - taskprologwidth;
	    $("#editTaskModal #editTaskModalLabel").text('Edit Task:' + taskname);
	    $("#editTaskModal #editTaskModalLabel").attr('data-source', threadid);
	    $("#editTaskModal #editTaskModalLabel").attr('source-task', taskid);
	    $("#editTaskModal #editTaskModalLabel").attr('data-class', taskclass);
	    $("#editTaskModal #edittask-name").val(taskname);
	    $("#editTaskModal #edittask-comp-length").val(taskcompwidth);
	    $("#editTaskModal #edittask-prolog-length").val(taskprologwidth);

	    
	});
}