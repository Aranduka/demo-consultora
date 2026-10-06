import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

type Props = { open: boolean; title: string; text?: string; confirmLabel?: string; danger?: boolean; onClose: () => void; onConfirm: () => void };

export default function ConfirmDialog({ open, title, text, confirmLabel = "Confirmar", danger, onClose, onConfirm }: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>
      {text && <DialogContent><DialogContentText>{text}</DialogContentText></DialogContent>}
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button color="inherit" onClick={onClose}>Volver</Button>
        <Button variant="contained" color={danger ? "error" : "primary"} onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</Button>
      </DialogActions>
    </Dialog>
  );
}
