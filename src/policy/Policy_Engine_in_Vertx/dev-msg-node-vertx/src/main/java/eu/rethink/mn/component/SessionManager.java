package eu.rethink.mn.component;

import eu.rethink.mn.IComponent;
import eu.rethink.mn.pipeline.PipeContext;
import eu.rethink.mn.pipeline.PipeMessage;
import eu.rethink.mn.pipeline.PipeRegistry;

public class SessionManager implements IComponent {
	final PipeRegistry register;
	
	public SessionManager(PipeRegistry register) {
		this.register = register;
	}
	
	@Override
	public String getName() { return "mn:/session"; }
	
	@Override
	public void handle(PipeContext ctx) {
		final PipeMessage msg = ctx.getMessage();
		System.out.println(msg);

		if(msg.getType().equals("open")) {
			register.bind(msg.getFrom(), ctx.getResourceUid());
			ctx.replyOK(getName());
		}
		
		if(msg.getType().equals("close")) {
			register.unbind(msg.getFrom());
			ctx.disconnect();
		}
	}
}
