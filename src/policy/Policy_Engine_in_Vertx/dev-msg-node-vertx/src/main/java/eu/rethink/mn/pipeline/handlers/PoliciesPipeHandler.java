package eu.rethink.mn.pipeline.handlers;

import eu.rethink.mn.component.PolicyDecisionPoint;
import eu.rethink.mn.component.PolicyLoader;
import eu.rethink.mn.component.Policy;
import io.vertx.core.Handler;
import eu.rethink.mn.pipeline.PipeContext;
import eu.rethink.mn.pipeline.PipeMessage;
import eu.rethink.mn.pipeline.PipeResource;

import java.util.ArrayList;

public class PoliciesPipeHandler implements Handler<PipeContext> {

    public static String NAME = "";
    PolicyDecisionPoint pdp = new PolicyDecisionPoint();

    @Override
    public void handle(PipeContext ctx) {
        final PipeMessage msg = ctx.getMessage();
        
        if(pdp.check(msg).equals("forward")) {
            System.out.println("Policies passed!");
            ctx.next();
        } else {
            ctx.fail(NAME, "Policies failed");
        }
    }
}