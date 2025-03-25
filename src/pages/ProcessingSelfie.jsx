import { useEffect, useState } from "react";
import { useDispatch } from "@reduxjs/toolkit";
import { useLocation } from "react-router-dom";

/**
 * Pagina di elaborazione selfie
 * 
 * @returns {React.ReactElement}  Pagina di elaborazione selfie.
 */
export default function ProcessingSelfie() {
    //impostare sse in ascolto
    //una volta ottenuti i dati li carica nello store
    const receivedData = useLocation().state;
    const dispatch = useDispatch();
    
    const [isLoading, setIsLoading] = useState(true);

    //upload della foto
    useEffect(() => {
        async function ProcessSelfie() {
            const formData = new FormData();
    
            formData.append("email", receivedData.email);
            formData.append("image", receivedData.selfie);
        
            const response = await fetch("http://localhost:8080/contents/fetch", {
              method: "POST",
              body: formData,
            });

            // navigazione verso shop
        }      
        
        ProcessSelfie();
    }, []);

   

    return (<>
    
    </>);
}