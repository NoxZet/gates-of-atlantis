import RenderFrame from "Graphics/RenderFrame";
import World from "Graphics/World";
import WSClient from "Network/WSClient";

const wsClient = new WSClient();
wsClient.addConnectionListener(user => {
    console.log('connection!');
    user.addMessageListener(message => {
        console.log(message);
        user.send(`Pong: ${message}`);
    });
});
wsClient.connect();

window.onload = () => {
    const frame = new RenderFrame();
    const world = new World(frame);
    frame.renderableChange(world, world.getGraphics());
}
