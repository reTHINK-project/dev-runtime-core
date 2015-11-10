package eu.rethink.mn;

import eu.rethink.mn.pipeline.PipeContext;
import io.vertx.core.Handler;

public interface IComponent extends Handler<PipeContext> {
	String getName();
}
