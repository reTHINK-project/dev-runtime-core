package eu.rethink.mn.component;

import eu.rethink.mn.pipeline.PipeMessage;

import java.util.ArrayList;
import java.util.List;

public class PolicyLoader {

	public PolicyLoader() {}
	
    public ArrayList<Policy> load() {
        ArrayList<Policy> policies = new ArrayList<Policy>();
        policies.add(new Policy(null, null, "userLegitimacy"));
        policies.add(new Policy("Alice", "chat", "communicationType"));
        return policies;
    }
}
