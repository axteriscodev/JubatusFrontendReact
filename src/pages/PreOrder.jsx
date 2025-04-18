import { useState, useEffect } from "react";
import Logo from "../components/Logo";

export default function PreOrder() {
    const eventData = useLoaderData();

    //carico tema evento
    useEffect(() => {
        setUiPreset(eventData.data);
        setHeaderData(eventData.data);
    }, []);
    return (
        <div className="form-sm">
            <Logo
                src={import.meta.env.VITE_API_URL + "/" + eventData.data.logo}
                css="mb-sm"
            />
        </div>
    );
}