package eu.rethink.mn.pipeline;

import io.vertx.core.Vertx;
import io.vertx.core.buffer.Buffer;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.eventbus.MessageCodec;

import java.util.HashMap;
import java.util.Map;

import eu.rethink.mn.IComponent;

public class PipeRegistry {
	final EventBus eb;
	
	//TODO: persistence maps?
	
	//<url, resourceUID>
	final Map<String, String> address;
	
	public PipeRegistry(Vertx vertx) {
		this.eb = vertx.eventBus();
		this.eb.registerDefaultCodec(PipeContext.class, new MessageCodec<PipeContext, PipeContext>() {

			@Override
			public byte systemCodecID() { return -1; }
			
			@Override
			public String name() { return PipeContext.class.getName(); }
			
			@Override
			public PipeContext transform(PipeContext ctx) { return ctx; }
			
			@Override
			public void encodeToWire(Buffer buffer, PipeContext ctx) {
				System.out.println("encodeToWire");
				buffer.appendString(ctx.getMessage().toString());
			}

			@Override
			public PipeContext decodeFromWire(int pos, Buffer buffer) {
				return null; //not needed in this architecture
			}
		});
		
		this.address = new HashMap<String, String>(); //TODO: transform into ClusterMap
	}
	
	public EventBus getEventBus() { return eb; }
	
	public PipeRegistry install(IComponent component) {
		eb.consumer(component.getName(), msg -> {
			component.handle((PipeContext)msg.body());
		});
		
		return this;
	}
	
	public PipeRegistry bind(String url, String resourceUID) {
		address.put(url, resourceUID);
		return this;
	}
	
	public PipeRegistry unbind(String url) {
		address.remove(url);
		return this;
	}
	
	public String resolve(String url) {
		return address.get(url);
	}
}
