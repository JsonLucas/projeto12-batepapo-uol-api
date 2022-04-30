import routes from "./routes.js";
import app from './expressConfig.js';
import { port } from './dot-env.js';
function init(){
    routes(app);
    app.listen(port, () => { console.log(`running at port ${port}`); });
}

init();