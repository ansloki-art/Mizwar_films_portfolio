import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { supabase } from "../supabaseClient";
import { services as defaultServices } from "../data/services";

const SiteContext = createContext(null);

const DEFAULT_CONTACT = {
    whatsapp: "6282213723022",
    instagram: "@mizwar_films",
    email: "mizwar797@gmail.com",
};

function merge(db) {
    if (!db) return { services: defaultServices, contact: DEFAULT_CONTACT };
    return {
        services: db.services?.length ? db.services : defaultServices,
        contact:  { ...DEFAULT_CONTACT, ...(db.contact || {}) },
    };
}

export function SiteProvider({ children }) {
    const [db, setDb]       = useState(null);
    const [ready, setReady] = useState(false);

    const load = useCallback(async () => {
        const { data } = await supabase
            .from("site_settings").select("settings").eq("id", 1).single();
        setDb(data?.settings ?? {});
        setReady(true);
    }, []);

    useEffect(() => { load(); }, [load]);

    const value = useMemo(() => ({ ...merge(db), ready, refresh: load }), [db, ready, load]);

    return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export const useSite = () => useContext(SiteContext);
