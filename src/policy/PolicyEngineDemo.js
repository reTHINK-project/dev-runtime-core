/**
 * @file Basic demonstrations of the authorisation decision for 3 examples of requests when subject to the policies of the system.
 * @project Trustful hyper-linked entities in dynamic networks (reTHINK)
 * @institution INESC-ID, IST, Universidade de Lisboa
 * @author Ana Caldeira, ana.caldeira@tecnico.ulisboa.pt
 * @version 0.1
 */


/**
 * Loads the policies of the system.
 * @function
 * @returns {array} policies
 */
function loadPolicies() {
	var policy1 = JSON.parse('{"ID": "admin_can", "Subject": "admin", "Resource": "secrets.txt"}');
	var policy2 = JSON.parse('{"ID": "ITguy_can", "Subject": "ITguy", "Resource": "ITstuff.txt"}');
	return [policy1, policy2];
}


/**
 * Policy Decision Point: evaluates access requests against authorisation policies.
 * @function
 * @param {object} request - JSON with 2 fields, "Subject" and "Resource".
 * @returns {string} decision - "Deny" by default; "Permit" if the request matches the authorisation policy that targets the resource to be accessed.
 */
function evaluate(request) {
	var decision = "Deny";
	var policies = loadPolicies();
	var num_policies = policies.length;
	for (var i = 0; i < num_policies; i++) {
		if ((request.Resource == policies[i].Resource) && (request.Subject == policies[i].Subject)) {
			decision = "Permit";
		}
	}
	console.log("\nREQUEST: " + request.Subject + " -> " + request.Resource);
	console.log("DECISION: " + decision);
	return decision;
}


var request1 = JSON.parse('{"Subject": "admin", "Resource": "secrets.txt"}');
var request2 = JSON.parse('{"Subject": "intern", "Resource": "ITstuff.txt"}');
var request3 = JSON.parse('{"Subject": "stranger", "Resource": "secrets.txt"}');

evaluate(request1);
evaluate(request2);
evaluate(request3);