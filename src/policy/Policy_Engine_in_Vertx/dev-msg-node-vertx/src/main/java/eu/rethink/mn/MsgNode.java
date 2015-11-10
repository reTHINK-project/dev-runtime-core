package eu.rethink.mn;

import static java.lang.System.out;
import eu.rethink.mn.component.RegistryManager;
import eu.rethink.mn.component.SessionManager;
import eu.rethink.mn.pipeline.PipeRegistry;
import eu.rethink.mn.pipeline.Pipeline;
import eu.rethink.mn.pipeline.handlers.PoliciesPipeHandler;
import eu.rethink.mn.pipeline.handlers.ValidatorPipeHandler;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.Vertx;
import io.vertx.core.http.HttpServer;
import io.vertx.core.http.HttpServerOptions;

public class MsgNode extends AbstractVerticle {
    public static void main(String[] args) {
        Vertx vertx = Vertx.vertx();
        vertx.deployVerticle(new MsgNode());
    }

    @Override
    public void start() throws Exception {
        final PipeRegistry register = new PipeRegistry(vertx);

        final SessionManager sm = new SessionManager(register);
        register.install(sm);

        final RegistryManager rm = new RegistryManager(register);
        register.install(rm);

        final Pipeline pipeline = new Pipeline(register)
            .addHandler(new PoliciesPipeHandler())
            .failHandler(error -> {
                out.println("PIPELINE-FAIL: " + error);
            });

        final HttpServerOptions httpOptions = new HttpServerOptions();
        httpOptions.setTcpKeepAlive(true);

        final HttpServer server = vertx.createHttpServer(httpOptions);
        WebSocketServer.init(server, pipeline);
        server.listen(9090);
        System.out.println("Message Node -> port(9090)");
    }
}
