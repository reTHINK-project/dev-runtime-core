package eu.rethink.mn.pipeline;

import io.vertx.core.json.JsonObject;

public class PipeMessage {
	final JsonObject msg;
	
	public PipeMessage() {
		this(new JsonObject());
		msg.put("header", new JsonObject());
	}

	public PipeMessage(String json) {
		this(new JsonObject(json));
		if(!msg.containsKey("header")) {
			msg.put("header", new JsonObject());
		}
	}
	
	public PipeMessage(JsonObject msg) {
		this.msg = msg;
		if(!msg.containsKey("header")) {
			msg.put("header", new JsonObject());
		}
	}
	
	public JsonObject getJson() { return msg; }
	
	public JsonObject getHeader() { return msg.getJsonObject("header"); }
	
	public JsonObject getBody() {
		if(!msg.containsKey("body")) {
			msg.put("body", new JsonObject());
		}
		
		return msg.getJsonObject("body"); 
	}
	
	public int getId() { return getHeader().getInteger("id", 0); }
	public PipeMessage setId(int id) {
		getHeader().put("id", id);
		return this;
	}
	
	public String getFrom() { return getHeader().getString("from"); }
	public PipeMessage setFrom(String from) {
		getHeader().put("from", from);
		return this;
	}
	
	public String getTo() { return getHeader().getString("to"); }
	public PipeMessage setTo(String to) {
		getHeader().put("to", to);
		return this;
	}
	
	public String getType() { return getHeader().getString("type"); }
	public PipeMessage setType(String type) {
		getHeader().put("type", type);
		return this;
	}
	
	public String getReplyCode() { return getBody().getString("code"); }
	public PipeMessage setReplyCode(String code) {
		getBody().put("code", code);
		return this;
	}
	
	public String getErrorDescription() { return getBody().getString("desc"); }
	public PipeMessage setErrorDescription(String desc) {
		getBody().put("desc", desc);
		return this;
	}
	
	@Override
	public String toString() {
		return msg.toString();
	}
}
