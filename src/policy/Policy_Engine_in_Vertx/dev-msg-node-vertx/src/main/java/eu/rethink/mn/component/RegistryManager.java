package eu.rethink.mn.component;

import eu.rethink.mn.IComponent;
import eu.rethink.mn.pipeline.PipeContext;
import eu.rethink.mn.pipeline.PipeMessage;
import eu.rethink.mn.pipeline.PipeRegistry;

public class RegistryManager implements IComponent {
	final PipeRegistry register;
	
	public RegistryManager(PipeRegistry register) {
		this.register = register;
	}
	
	@Override
	public String getName() { return "mn:/registry"; }
	
	@Override
	public void handle(PipeContext ctx) {
		final PipeMessage msg = ctx.getMessage();
		System.out.println(msg);
		
		final String url = msg.getBody().getString("url");
		if(url != null) {
			ctx.fail(getName(), "No url present in body!");
			return;
		}
		
		if(msg.getType().equals("add")) {
			register.bind(url, ctx.getResourceUid());
			ctx.replyOK(getName());
		}
		
		if(msg.getType().equals("remove")) {
			register.unbind(url);
			ctx.replyOK(getName());
		}
	}
}
