package eu.rethink.mn.pipeline;

import java.util.Iterator;

import io.vertx.core.Handler;

public class PipeContext {
	boolean inFail = false;
	
	final Pipeline pipeline;
	final PipeResource resource;
	
	final Iterator<Handler<PipeContext>> iter;
	final PipeMessage msg;
	
	PipeContext(Pipeline pipeline, PipeResource resource, Iterator<Handler<PipeContext>> iter, PipeMessage msg) {
		this.pipeline = pipeline;
		this.resource = resource;
		this.iter = iter;
		this.msg = msg;
	}
	
	public PipeMessage getMessage() { return msg; }
	public String getResourceUid() { return resource.getUid(); }
	
	public void deliver() {
		final PipeRegistry register = pipeline.getRegister();
		final String uid = register.resolve(msg.getTo());
		
		if(uid == null) {
			//send to internal component...
			register.getEventBus().publish(msg.getTo(), this);
		} else {
			register.getEventBus().publish(uid, getMessage().toString());
		}
	}
	
	public void reply(PipeMessage reply) {
		resource.reply(reply);
	}
	
	public void replyOK(String from) {
		final PipeMessage reply = new PipeMessage();
		reply.setId(msg.getId());
		reply.setFrom(from);
		reply.setTo(msg.getFrom());
		reply.setReplyCode("ok");
		
		reply(reply);
	}
	
	public void replyError(String from, String error) {
		final PipeMessage reply = new PipeMessage();
		reply.setId(msg.getId());
		reply.setFrom(from);
		reply.setTo(msg.getFrom());
		reply.setReplyCode("error");
		reply.setErrorDescription(error);
		
		reply(reply);
	}
	
	public void disconnect() {
		resource.disconnect();
	}
	
	public void next() {
		if(!inFail) {
			if(iter.hasNext()) {
				iter.next().handle(this);
			} else {
				deliver();
			}
		}
	}
	
	public void fail(String from, String error) {
		if(!inFail) {
			inFail = true;
			replyError(from, error);
			if(pipeline.failHandler != null) {
				pipeline.failHandler.handle(error);
			}
		}
	}
}
