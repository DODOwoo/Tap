var backgroundcolors = ['#1ABC9C','#16A085','#2ECC71','#27AE60','#3498DB','#2980B9','#9B59B6','#8E44AD','#34495E','#2C3E50','#F1C40F','#F39C12','#E67E22','#D35400','#E74C3C','#C0392B','#ECF0F1','#BDC3C7','#95A5A6','#7F8C8D'];
	
function initclickevent()
{
	$('#btn-new-thread')[0].addEventListener('click', function (e) {
		var threadName = $('#thread-name').val();
		var threadClass = 'thread' + $('.task-add').length + '-' + threadName.split(' ').join('');
		$('.thread-rows').append('<div class="row">\
				<div class="threadrow">\
					<div class="rowtitle">'+ threadName +'</div>\
					<div class="backline"></div>\
					<div class="'+ threadClass +'" id="'+ threadClass +'">\
					</div>\
					<div class="task-add" data-toggle="modal" data-target="#addTaskModal" data-id="'+ threadClass +'" data-name="'+ threadName +'">\
						<div class="task-add-ico">+</div>\
					</div>\
				</div>');
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
		var newtaskwidth = $("#addTaskModal #task-length").val() * 20;
		var sourceid = $("#addTaskModal #newTaskModalLabel").attr('data-source');
		var source = $('.'+ sourceid);
		var newtaskleft = 120;
		if(source.children('.plan').length > 0){
			var lastchild = $(source.children('.plan')[source.children('.plan').length-1]);
			if(lastchild.css('left')!=undefined){
				if(lastchild.css('left')!='auto'){
					console.log(lastchild.css('left'));
					newtaskleft = parseInt(lastchild.css('left').replace('px',''));
				}
				newtaskleft += parseInt(lastchild.css('width').replace('px',''));
			}
		}
		var newtaskname = $("#addTaskModal #task-name").val();
		var newtaskid = sourceid + '-task'+ source.children('.plan').length;
		var newtaskcolor = backgroundcolors[Math.round(Math.random()*20)];
		var newtaskclass = newtaskid+newtaskname.split(' ').join('');

		var targetParentIds = [source[0].id];
		$('.select-resources').children('.checked').each(function(){
			targetParentIds.push($('.' + $(this).text().trim())[0].id);
		})
		if(!canPutHere(targetParentIds,newtaskleft,newtaskwidth))
		{
			newtaskleft = getMaxFree(targetParentIds,newtaskleft,newtaskwidth);
		}

		source.append('<div id="'+newtaskid+'" class="plan '+ newtaskclass +'"\
				 draggable="true" style="width:'+newtaskwidth+'px; left:'+ newtaskleft +'px; background-color:'+ newtaskcolor +';">'+ newtaskname +'</div>');
		//$('#'+newtaskid)[0].addEventListener('dragstart', handleStart, false);
		
		$('.select-resources').children('.checked').each(function(){
			$('.' + $(this).text().trim()).append('<div class="plan '+ newtaskclass +'"\
				style="width:'+newtaskwidth+'px; left:'+ newtaskleft +'px; background-color:'+ newtaskcolor +';">Dest0</div>')
		})

		initdragevent();
		updateAllOccupiedLeft(newtaskclass);
		$('#addTaskModal').modal('hide');
	},false);
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