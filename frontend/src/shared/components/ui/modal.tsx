import GenericModal from "./genericModal"

type LegacyClientModalProps = {
    isOpen: boolean
    onClose: () => void
}

const ClientModal = ({ isOpen, onClose }: LegacyClientModalProps) => {
    return (
        <GenericModal isOpen={isOpen} onClose={onClose} title="Cliente">
            <p>El modulo de clientes no esta conectado al backend actual.</p>
        </GenericModal>
    )
}

export default ClientModal
