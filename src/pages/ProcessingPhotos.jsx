import Logo from "../components/Logo";

export default function ProcessingPhotos() {
    return(
        <div className="form form-sm">
            <Logo size="logo-sm" css="mb-sm" />
            <h2>Ci siamo <span>campione</span> !</h2>
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