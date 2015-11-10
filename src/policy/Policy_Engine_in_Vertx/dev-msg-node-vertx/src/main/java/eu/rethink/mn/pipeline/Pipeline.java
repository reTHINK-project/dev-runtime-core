package eu.rethink.mn.pipeline;

import java.util.ArrayList;
import java.util.Iterator;

import io.vertx.core.Handler;

public class Pipeline {
	final PipeRegistry register;
	
	final ArrayList<Handler<PipeContext>> handlers = new ArrayList<Handler<PipeContext>>();
	Handler<String> failHandler = null;
	
	void process(PipeResource resource, PipeMessage msg) {
		final Iterator<Handler<PipeContext>> iter = handlers.iterator();
		if(iter.hasNext()) {
			iter.next().handle(new PipeContext(this, resource, iter, msg));
		}
	}
	
	public Pipeline(PipeRegistry register) {
		this.register = register;
	}
	
	public PipeRegistry getRegister() { return register; }
	
	public PipeResource createResource(String uid, Handler<Void> closeCallback, Handler<String> replyCallback) {
		final PipeResource resource = new PipeResource(uid, this, closeCallback, replyCallback);
		return resource;
	}
	
	public Pipeline addHandler(Handler<PipeContext> handler) {
		handlers.add(handler);
		return this;
	}
	
	public Pipeline failHandler(Handler<String> handler) {
		failHandler = handler;
		return this;
	}
}
