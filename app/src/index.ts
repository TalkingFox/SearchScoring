import { TestService } from "./test-service";
import { TestComponent } from "./test-component";

var service = new TestService();

async function init() {
    var parent = document.getElementById('app') as HTMLElement;
    var component = new TestComponent(service, parent);
    component.init();
}

init().then();
