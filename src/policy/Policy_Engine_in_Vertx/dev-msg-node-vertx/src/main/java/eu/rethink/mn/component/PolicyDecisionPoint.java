package eu.rethink.mn.component;

import eu.rethink.mn.pipeline.PipeMessage;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;

public class PolicyDecisionPoint {

	private List<Policy> policies;
	private List<String> blackList;
    private static final String BLOCK = "block";
    private static final String FORWARD = "forward";

    public PolicyDecisionPoint() {
    	this.policies = new PolicyLoader().load();
    	this.blackList = new ArrayList<String>();
        //blackList.add("Alice");
    }

    public String check(PipeMessage message) {
        ArrayList<String> results = new ArrayList<String>();
        for (Policy policy : policies) {
        	switch(policy.getFunction()) {
        		case "userLegitimacy":
        			results.add(checkUserInLists(message.getFrom(), message.getTo()));
                    break;
                case "communicationType":
                    results.add(checkCommunicationType(message, policy));
                    break;
            }
        }
        return decideResult(results);
    }

    public String checkUserInLists(String subject, String target) {
        return (blackList.contains(subject) || blackList.contains(target)) ?  BLOCK : FORWARD;
    }

    public String checkCommunicationType(PipeMessage message, Policy policy) {
        return (message.getTo().equals(policy.getSubject()) && message.getType().equals(policy.getTarget()))
            ? FORWARD : BLOCK;
    }

    public String decideResult(ArrayList<String> partialResults) {
        return partialResults.contains(BLOCK) ? BLOCK : FORWARD;
    }
}
