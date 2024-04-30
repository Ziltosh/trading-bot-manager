import {getTauriVersion, getVersion} from "@tauri-apps/api/app"
import {useQuery} from "@tanstack/react-query";
import {queries} from "@/queries/queries.ts";

export const Versions = () => {
    const version = useQuery({queryKey: [queries.version], queryFn: getVersion})
    const tauriVersion = useQuery({queryKey: [queries.tauri_version], queryFn: getTauriVersion})

    return (
        <div className="flex font-medium text-sm h-full items-center">
            App v{version.data} | Tauri v{tauriVersion.data}
        </div>
    )
}