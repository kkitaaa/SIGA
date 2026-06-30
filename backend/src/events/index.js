// events/index.js
import { eventBus } from "./eventBus.js";
import { registrarAsignacionPIELog } from "../observers/asignacion.observer.js";

eventBus.on("asignacionPIE", registrarAsignacionPIELog);
