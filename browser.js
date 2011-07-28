/**
 *  Register window load listener which adds event listeners for tab,
 *  location, and state changes. 
 **/

var urls_found = new Array();

function check_url(url, link_node) {

		var replace_node = link_node;
	  
	    var xmlHttpRequest = new XMLHttpRequest();
		
		if(urls_found[url]!=true){
		
			urls_found[url]=true;
							    		
			xmlHttpRequest.open("GET","http://lrtest01.learningregistry.org/harvest/getrecord?by_resource_id=TRUE&request_id=" + escape(url), true);
			xmlHttpRequest.onreadystatechange=function(){
	      
				if (xmlHttpRequest.readyState==4){
									
					var my_JSON_object = JSON.parse(xmlHttpRequest.responseText);
					
					if(my_JSON_object.getrecord.record!=""){
																					
						//for(x in my_JSON_object.getrecord.record[0].resource_data){
						
						//	alert(x);
						
						//}
														
						var marker_div = document.createElement("DIV");	
						marker_div.style.minHeight="10px";
						marker_div.style.minWidth="10px";
						marker_div.style.padding="5px";
						marker_div.style.backgroundColor="#fff";
						marker_div.style.border="1px solid #000";
						marker_div.style.display="inline";
						marker_div.innerHTML = "<h2>I</h2>";
						replace_node.style.fontWeight = "bold";
						
						replace_node.parentNode.insertBefore(marker_div, replace_node);
														
					}		
					
				}
			
			};
					
	    xmlHttpRequest.send();
		
	}
		
}


var page_process = new function page_process() {

		this.init = function (content_passed) {
		
			var n = content_passed;			
					
			if(content_passed.location.toString().indexOf("www.google")!=-1){				
				
				var n = content_passed.getElementById("search");
			
			}
			//var n = content_passed.getElementById("results");
			//var n = content_passed.getElementById("web");
			
			var rootNode = n;
			
			while (n) {
	
				if(n.hasAttributes()){
				
					if(n.hasAttribute("href")){
					
						if(n.href.toString().indexOf("google")==-1){
				
							check_url(n.href,n);
						
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
					}
					else {
						n = n.parentNode;
					}
				}
				else {
					if (n.firstChild) {
						n.v = true;
						n = n.firstChild;
					}
					else 
						if (n.nextSibling) {
							n = n.nextSibling;
						}
						else {
							n = n.parentNode;
						}
				}
				
			}

		}; 
		
};
		