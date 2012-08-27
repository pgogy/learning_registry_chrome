
	chrome.browserAction.onClicked.addListener(function(tab_something) {
		
		chrome.tabs.getSelected(null, function(tab) {
						
			chrome.tabs.sendMessage(tab.id, {command: "parse"}, function(response) {
			
			});
			
		});
								
	});
	
	chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	
		if(request.command=="ajax"){
		
			var xmlHttpRequest = new XMLHttpRequest();
			
			url = request.link;
																
			xmlHttpRequest.open("GET","http://alpha.mimas.ac.uk/harvest/getrecord?by_resource_id=TRUE&request_id=" + escape(url), true);
			
			xmlHttpRequest.onreadystatechange=function(){  
			  
			if (xmlHttpRequest.readyState==4){
													
				var my_JSON_object = JSON.parse(xmlHttpRequest.responseText);
					
				if(my_JSON_object.getrecord.record!=""){
								
					var results_text = new Array();
					
					for(x = 0; x<my_JSON_object.getrecord.record.length; x++){
																			
						xml_data = my_JSON_object.getrecord.record[x].resource_data.resource_data;
															
						if (window.DOMParser){
								
							parser=new DOMParser();
							xmlDoc=parser.parseFromString(xml_data,"text/xml");
									
						}
								
						n = xmlDoc;
						rootNode = n;
								
						while (n) {
						
							node_name = n.nodeName.split("dc:").join("");
							
							switch(node_name){
									
								default : if(n.firstChild!=null){

											results_text.push(node_name + " : " + n.firstChild.nodeValue);

										  }
										  
										  break;									
									
							}
										
							if (n.v) {
							
								n.v = false;
								
								if (n == rootNode) {
									break;
								}
										
								if (n.nextSibling) {
										
									n = n.nextSibling;
											
								}else{
										
									n = n.parentNode;
											
								}
										
							}else{
									
								if (n.firstChild) {
										
									n.v = true;
									n = n.firstChild;
											
								}else if (n.nextSibling) {
										
									n = n.nextSibling;
												
								}else{
										
									n = n.parentNode;
												
								}
																			
							}
									
						}							
							
					}
					
					chrome.tabs.sendMessage(sender.tab.id, {command: "present", data:results_text, node: request.node_id}, function(response) {
			
					});
																						
				}		
						
			}
				
		};				
		
		xmlHttpRequest.send();			
		
		}
		
	
	});
         