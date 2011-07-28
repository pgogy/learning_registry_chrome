chrome.extension.onRequest.addListener(
	 
	function(request, sender, sendResponse) {	
	
		if(request.command=="parse"){
	
			parse_document();
			
		}
		
		if(request.command=="present"){
			
			present_results(request);
			
		}
		
	}     
		
);

var urls_found = new Array();

function present_results(data_set){

	replace_node = document.getElementById(data_set.node);
	
	id_string = "node_found_" + Math.floor(Math.random()*5000);
	
	var marker_div = document.createElement("A");	
	marker_div.style.minHeight="20px";
	marker_div.style.backgroundColor="#fff";
	marker_div.style.color="#000";
	marker_div.style.fontWeight="bold";
	marker_div.style.display="inline";
	marker_div.setAttribute("onclick",'document.getElementById("' + id_string + '").style.display="block";');
	newtext=document.createTextNode('+');
	marker_div.appendChild(newtext);												
	replace_node.parentNode.insertBefore(marker_div, replace_node);
									
	var content_div = document.createElement("DIV");	
	content_div.style.clear="left";
	content_div.style.float="left";
	content_div.style.position="relative";
	content_div.style.minWidth="100%";
	content_div.style.backgroundColor="#fff";
	content_div.style.color="#000";
	content_div.style.border="1px solid #000";
	content_div.style.display="none";
	content_div.id = id_string;
	
	while(string = data_set.data.pop()){
		results_para = document.createElement("P");
		results_para.style.display="block";
		newtext=document.createTextNode(string);
		results_para.appendChild(newtext);
		content_div.appendChild(results_para);
	}
	
	replace_node.parentNode.parentNode.parentNode.parentNode.appendChild(content_div);											

}

function check_url(url, link_node) {

	if(urls_found[url]==undefined){
		
		urls_found[url]=true;
						
		chrome.extension.sendRequest({command:"ajax",link:url,node_id:link_node},function(){});
		
	}

}

function parse_document(){

	var n = document;			
								
	if(document.location.toString().indexOf("www.google")!=-1){				
				
		var n = document.getElementById("search");
			
	}
			
	if(document.location.toString().indexOf("search.yahoo.com")!=-1){	
			
		var n = document.getElementById("results");
			
	}
			
	if(document.location.toString().indexOf("bing.com")!=-1){	
				
		var n = document.getElementById("web");
			
	}
			
	var rootNode = n;
			
	while (n) {
	
		if(n.hasAttributes()){
				
			if(n.hasAttribute("href")){
			
				if(n.href.toString().indexOf("google")==-1){
				
					id_string = "node_" + Math.floor(Math.random()*5000);
					
					if(n.id==""){
					
						n.id = id_string;
						
					}
					
					check_url(n.href, id_string);
						
				}
					
			}
				
		}

		if (n.v) {
			n.v = false;
			if (n == rootNode) {
				break;
			}
			if (n.nextSibling) {
				n = n.nextSibling;
			} else {
				n = n.parentNode;
			}
		} else {
			if (n.firstChild) {
				n.v = true;
				n = n.firstChild;
			}else if (n.nextSibling) {
				n = n.nextSibling;
			}else {
				n = n.parentNode;
			}
		}
				
	}
			
	urls_found = new Array();

}