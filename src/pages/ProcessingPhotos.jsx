import Logo from "../components/Logo";

export default function ProcessingPhotos() {
    return(
        <div className="col-xl-4 col-lg-6 col-md-8 col-sm-10 mx-auto">
            <Logo size="logo-sm" css="mb-sm" />
            <h2>Ci SIAMO CAMPIONE!</h2>
            <h4 className="mt-sm mb-md">Stiamo elaborando<br />
                i tuoi contenuti in <span>MASSIMA</span> risoluzione<br />
                🌊 📸 🏄🏻</h4>
            <div className="progress mt-md" role="progressbar" aria-label="Basic example" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                <div className="progress-bar" style={{width: '25%'}}></div>
            </div>
            Caricamento
        </div>
    );
}