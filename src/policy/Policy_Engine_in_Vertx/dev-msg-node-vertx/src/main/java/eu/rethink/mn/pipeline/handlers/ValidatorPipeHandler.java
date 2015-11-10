package eu.rethink.mn.pipeline.handlers;

import io.vertx.core.Handler;
import io.vertx.core.json.JsonObject;
import eu.rethink.mn.pipeline.PipeContext;
import eu.rethink.mn.pipeline.PipeMessage;

public class ValidatorPipeHandler implements Handler<PipeContext> {
	public static String NAME = ""; 

	@Override
	public void handle(PipeContext ctx) {
		final PipeMessage msg = ctx.getMessage();
		
		//header validation...
		final JsonObject header = msg.getHeader();
		if(header == null) {
			ctx.fail(NAME, "No mandatory field 'header' in message");
		} 
		
			if(!header.containsKey("id")) {
				ctx.fail(NAME, "No mandatory field 'id' in header");
			}
			
			if(!header.containsKey("type")) {
				ctx.fail(NAME, "No mandatory field 'type' in header");
			}
			
			final String from = header.getString("from");
			if(from == null) {
				ctx.fail(NAME, "No mandatory field 'from' in header");
			}
	
			final String to = header.getString("to");
			if(to == null) {
				ctx.fail(NAME, "No mandatory field 'to' in header");
			}

		ctx.next();
	}

}
