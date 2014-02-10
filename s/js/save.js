var threadTaskObjs = '{"threads":[],"resources":[],"tasks":[],"container":{},"occupied":[]}';
//'{"threads":[{"id":"thread0-x","name":"Thread 0","order":0},{"id":"thread1","name":"Thread 1","order":1}],
//"resources":[{"componentid":"core","instanceid":"core","order":0,"description":""},{"componentid":"vmem_fft","instanceid":"vmem0","order":1,"description":""}],
//"tasks":[{"id":"thread0-x-task0","name":"t3","class":"plan thread0-x-task0xxx","width":"80px","prolog-width":"20px","left":"120px","color":"rgb(241, 196, 15)",
//"task-resources":[{"class":"task thread0-x-task0t3","resource-instanceid":"core","title":"","prolog-left":"0px"},{"class":"thread0-x-task0xxx","resource-instanceid":"vmem0","title":"vmem_fft","prolog-left":"20px"}]
//}], "container":{"width":"1170px","clock":15}, "occupied":[]}'
var saveAll = function(){
	saveThreads();
	saveResources();
	saveTasks();
	saveContainer();
	saveOccupied();
}

var saveThreads = function(){
	var objs = jQuery.parseJSON(threadTaskObjs);
	$('.thread-rows .threadrow').each(function(i){
		var that = this;
		var temp = $.grep(objs.threads,function(n,j){
			return n.id == $(that).children('.thread').attr('id');
		});
		if(temp.length==0){
			objs.threads.push(
				{
					id:$(that).children('.thread').attr('id'),
					name:$(that).children('.rowtitle').text(),
					class:$(that).children('.thread').attr('class'),
					order:i
				});
		}
	});
	threadTaskObjs = JSON.stringify(objs);
}

var saveResources = function(){
	var objs = jQuery.parseJSON(threadTaskObjs);
	$.each(jQuery.parseJSON(Resources), function(i, resource){
		var temp = $.grep(objs.resources,function(n,j){
			return n.instanceid == resource.instanceid;
		});
		if(temp.length == 0){
			objs.resources.push(
				{
					componentid:resource.componentid,
					instanceid:resource.instanceid,
					order:i,
					description:resource.description
				});
		}
	})
	threadTaskObjs = JSON.stringify(objs)
}

var saveTasks = function(){
	var objs = jQuery.parseJSON(threadTaskObjs);
	$('.thread-rows .plan').each(function(i){
		var that = this;
		var temp = $.grep(objs.tasks,function(n,j){
			return n.id == that.id;
		});
		var allClass = $(that).attr('class').split(' ');
		var className = allClass[allClass.length-1];
		var taskresources = [];
		var color;
		$('.instances .'+className).each(function(k){
			taskresources.push({
				class:$(this).attr('class'),
				resourceinstanceid:$(this).text(),
				title:$(this).attr('data-original-title'),
				width:$(this).css('width'),
				left:$(this).css('left'),
				color: $(this).attr('task-color'),
				prologleft: $(this).attr('prolog-left')
			});
			//color = $(this).css('background-color');
		})
		if(temp.length==0){
			objs.tasks.push(
				{
					id: that.id,
					threadid: $(that).parent().attr('id'),
					name:$(that).text(),
					class:$(that).attr('class'),
					width:$(that).css('width'),
					left:$(that).css('left'),
					prologwidth:$(that).attr('prolog-width'),
					color: $(that).attr('task-color'),
					taskresources:taskresources
				});
		}
	})
	threadTaskObjs = JSON.stringify(objs)
}

var saveContainer = function(){
	var objs = jQuery.parseJSON(threadTaskObjs);
	objs.container.clock = $('#threadLength').text();
	objs.container.width = $('.container').css('width');
	threadTaskObjs = JSON.stringify(objs)
}

var saveOccupied = function(){
	var objs = jQuery.parseJSON(threadTaskObjs);
	objs.occupied = jQuery.parseJSON(threadLeftObjs).obj;
	threadTaskObjs = JSON.stringify(objs)
}

var output = $('output')[0];

const MIME_TYPE = 'text/plain';

var cleanUp = function(a) {
	a.textContent = 'Downloaded';
	a.dataset.disabled = true;

	// Need a small delay for the revokeObjectURL to work properly.
	setTimeout(function() {
	window.URL.revokeObjectURL(a.href);
	}, 1500);
};

var downloadFile = function() {
	saveAll();
	window.URL = window.webkitURL || window.URL;

	var prevLink = output.querySelector('a');
	if (prevLink) {
	window.URL.revokeObjectURL(prevLink.href);
	output.innerHTML = '';
	}

	var bb = new Blob([threadTaskObjs], {type: MIME_TYPE});

	var a = document.createElement('a');
	a.download = $('#file-name').val();
	a.href = window.URL.createObjectURL(bb);
	a.textContent = 'Download ready';

	a.dataset.downloadurl = [MIME_TYPE, a.download, a.href].join(':');
	a.draggable = true; // Don't really need, but good practice.
	a.classList.add('dragout');

	output.appendChild(a);

	a.onclick = function(e) {
		if ('disabled' in this.dataset) {
		  return false;
		}

		//cleanUp(this);
	};
};