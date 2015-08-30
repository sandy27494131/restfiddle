define(function(require) {

	require('backbone');
	var APP = require('commons/ns');
	var AppView = require('views/app-view');

	var StarView = require("views/star-view");
	var ProjectEvents = require('events/project-event');
	var tree = require('views/tree-view');

	var AppRouter = Backbone.Router.extend({
		
		initialize: function () {
			
	    },
		
		routes : {
			"" : "handleDefault",
			"starred" : "showStarred",
			"activityLog" : "showHistory",
			"project/:projectId" : "showProject"
		},
		
		handleDefault : function() {
			
		},
		
		showStarred : function() {
			$('#rf-col-1-body').find('li').each(function() {
				$(this).removeClass('active');
			});
			
			$(".starred").addClass('active');

			$.ajax({
				url : APP.config.baseUrl + '/nodes/starred',
				type : 'get',
				dataType : 'json',
				contentType : "application/json",
				success : function(response) {
					var starView = new StarView({
						model : response
					});
					starView.render();
					$('#starred-items').show();
				}
			});

			$('#tree').hide();
			$('#tagged-items').hide();
			$('#history-items').hide();
			
		},
		showHistory : function() {
			$('#rf-col-1-body').find('li').each(function(){
				$(this).removeClass('active');
			});
			$(".history").addClass('active');

			$.ajax({
				url : APP.config.baseUrl + '/conversations',
				type : 'get',
				dataType : 'json',
				contentType : "application/json",
				success : function(response) {
	                if(response != undefined){
	                    //var conversations = response.data;
					    APP.historyView.render(response);
					    $('#history-items').show();
	                }
				}
			});
			
			$('#tree').hide();
			$('#tagged-items').hide();
			$('#starred-items').hide();
		},
		showProject : function(projectId){
			$('#rf-col-1-body').find('li').each(function(){
                $(this).removeClass('active');
            });
            
			var element = $('#'+projectId);
			element.parent('li').addClass('active');

            $('#tagged-items').hide();
            $('#starred-items').hide();
            $('#history-items').hide();
            $('#tree').show();

            console.log('Project Id : ' + element.data('project-ref-id'))
            ProjectEvents.triggerChange(projectId);
            console.log('current project id is ' + APP.appView.getCurrentProjectId());
            tree.showTree(element.data('project-ref-id'));
		}
		
	});

	return AppRouter;
});