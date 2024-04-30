import {createClient} from "@rspc/client";
import {Procedures} from "@/rspc_bindings.ts";
import {TauriTransport} from "@rspc/tauri";

export const rspcClient = createClient<Procedures>({
    transport: new TauriTransport(),
});