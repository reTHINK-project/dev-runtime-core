import RuntimeUACore from './runtime/RuntimeUA';
import SandboxBase from './sandbox/Sandbox';

// TODO: Remove this before compiling
// This is only for testing
// import Sandbox from '../test/sandboxes/SandboxBrowser';
// var sandbox = new Sandbox();
// window.runtime = new RuntimeUA(sandbox);

export var RuntimeUA = RuntimeUACore;
export var Sandbox = SandboxBase;
