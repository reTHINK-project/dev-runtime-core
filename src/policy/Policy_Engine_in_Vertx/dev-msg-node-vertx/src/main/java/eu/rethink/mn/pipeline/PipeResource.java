package eu.rethink.mn.pipeline;

import io.vertx.core.Handler;

public class PipeResource {
	final String uid;
	final Pipeline pipeline;
	
	final Handler<Void> closeCallback;
	final Handler<String> replyCallback;
	
	PipeResource(String uid, Pipeline pipeline, Handler<Void> closeCallback, Handler<String> replyCallback) {
		this.uid = uid;
		this.pipeline = pipeline;
		
		this.closeCallback = closeCallback;
		this.replyCallback = replyCallback;
	}
	
	public String getUid() { return uid; }
	
	public void processMessage(PipeMessage msg) {
		pipeline.process(this, msg);
	}
	
	public void reply(PipeMessage msg) {
		msg.setType("reply");
		replyCallback.handle(msg.toString());
	}
	
	public void disconnect() {
		closeCallback.handle(null);
	}
}
