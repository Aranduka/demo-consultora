"use client";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert, Box, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, IconButton, InputAdornment, MenuItem, Skeleton,
  Snackbar, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";
import InboxIcon from "@mui/icons-material/Inbox";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { api } from "@/lib/http";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "number" | "email" | "multiline" | "select" | "switch";
  options?: { value: string | number; label: string }[];
  required?: boolean;
  help?: string;
  half?: boolean;
};
export type Column = { label: string; render: (row: any) => ReactNode; search?: (row: any) => string };

type Props = {
  title: string;
  subtitle?: string;
  singular: string;
  endpoint: string;
  columns: Column[];
  fields: Field[];
  defaults?: Record<string, any>;
  canDelete?: boolean;
  actions?: (row: any, reload: () => void) => ReactNode;
  onSaved?: (data: any, mode: "create" | "edit") => void;
};

export default function CrudPage({ title, subtitle, singular, endpoint, columns, fields, defaults = {}, canDelete = true, actions, onSaved }: Props) {
  const [rows, setRows] = useState<any[] | null>(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<any | null>(null); // null cerrado, {} nuevo
  const [form, setForm] = useState<Record<string, any>>({});
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [aBorrar, setABorrar] = useState<any | null>(null);

  const load = useCallback(() => {
    api<any[]>(endpoint).then(setRows).catch((e) => setError(e.message));
  }, [endpoint]);
  useEffect(load, [load]);

  const visibles = useMemo(() => {
    if (!rows) return null;
    const t = q.trim().toLowerCase();
    if (!t) return rows;
    return rows.filter((r) => JSON.stringify(Object.values(r)).toLowerCase().includes(t) || columns.some((c) => c.search?.(r).toLowerCase().includes(t)));
  }, [rows, q, columns]);

  const open = (row?: any) => {
    setForm(row ? { ...row } : { ...defaults });
    setEditing(row ?? {});
    setErrs({});
    setFormError("");
  };

  async function save() {
    setSaving(true);
    setErrs({});
    setFormError("");
    const body: Record<string, any> = {};
    for (const f of fields) {
      let v = form[f.name];
      if (f.type === "switch") v = Boolean(v);
      else if (v === "" || v === undefined) v = f.required ? "" : null;
      body[f.name] = v;
    }
    const isEdit = editing?.id !== undefined;
    try {
      const data = await api(isEdit ? `${endpoint}/${editing.id}` : endpoint, { method: isEdit ? "PUT" : "POST", body });
      setEditing(null);
      load();
      setToast(isEdit ? "Cambios guardados" : `${singular[0].toUpperCase()}${singular.slice(1)} creado`);
      onSaved?.(data, isEdit ? "edit" : "create");
    } catch (e: any) {
      setErrs(e.fields ?? {});
      setFormError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(row: any) {
    try {
      await api(`${endpoint}/${row.id}`, { method: "DELETE" });
      load();
      setToast("Registro eliminado");
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <Box>
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={<Button variant="contained" startIcon={<AddIcon />} onClick={() => open()}>Nuevo {singular}</Button>}
      />
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>{error}</Alert>}
      <Card>
        <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
          <TextField
            placeholder="Buscar…" value={q} onChange={(e) => setQ(e.target.value)} sx={{ maxWidth: 360 }}
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }, htmlInput: { "aria-label": "Buscar" } }}
          />
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((c) => <TableCell key={c.label}>{c.label}</TableCell>)}
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibles === null && [0, 1, 2].map((i) => <TableRow key={i}><TableCell colSpan={columns.length + 1}><Skeleton height={28} /></TableCell></TableRow>)}
              {visibles?.map((r) => (
                <TableRow key={r.id} hover>
                  {columns.map((c) => <TableCell key={c.label}>{c.render(r)}</TableCell>)}
                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    {actions?.(r, load)}
                    <Tooltip title="Editar"><IconButton aria-label="Editar" onClick={() => open(r)}><EditOutlinedIcon fontSize="small" /></IconButton></Tooltip>
                    {canDelete && <Tooltip title="Eliminar"><IconButton aria-label="Eliminar" color="error" onClick={() => setABorrar(r)}><DeleteOutlineIcon fontSize="small" /></IconButton></Tooltip>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {visibles?.length === 0 && (
          <EmptyState icon={<InboxIcon />} title={q ? "Sin resultados" : `Aún no hay ${singular}s`} text={q ? "Pruebe con otra búsqueda." : `Cree el primer ${singular} para comenzar.`}
            action={!q ? <Button variant="contained" startIcon={<AddIcon />} onClick={() => open()}>Nuevo {singular}</Button> : undefined} />
        )}
      </Card>

      <Dialog open={editing !== null} onClose={() => setEditing(null)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>{editing?.id !== undefined ? "Editar" : "Nuevo"} {singular}</DialogTitle>
        <DialogContent>
          <Stack direction="row" flexWrap="wrap" gap={2} sx={{ pt: 1 }}>
            {formError && <Alert severity="error" sx={{ width: "100%" }}>{formError}</Alert>}
            {fields.map((f) => {
              const w = f.half ? "calc(50% - 8px)" : "100%";
              if (f.type === "switch")
                return (
                  <Box key={f.name} sx={{ width: w }}>
                    <FormControlLabel control={<Switch checked={Boolean(form[f.name])} onChange={(e) => setForm({ ...form, [f.name]: e.target.checked })} />} label={f.label} />
                  </Box>
                );
              return (
                <TextField
                  key={f.name}
                  sx={{ width: w }}
                  label={f.label}
                  required={f.required}
                  type={f.type === "number" || f.type === "email" ? f.type : "text"}
                  select={f.type === "select"}
                  multiline={f.type === "multiline"}
                  minRows={f.type === "multiline" ? 2 : undefined}
                  value={form[f.name] ?? ""}
                  onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                  error={!!errs[f.name]}
                  helperText={errs[f.name] || f.help}
                >
                  {f.options?.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                </TextField>
              );
            })}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1 }}>
          <Button color="inherit" onClick={() => setEditing(null)}>Cancelar</Button>
          <Button variant="contained" onClick={save} disabled={saving}>{saving ? "Guardando…" : "Guardar"}</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog open={!!aBorrar} danger title={`¿Eliminar este ${singular}?`} text="Esta acción no se puede deshacer." confirmLabel="Eliminar" onClose={() => setABorrar(null)} onConfirm={() => aBorrar && remove(aBorrar)} />
      <Snackbar open={!!toast} autoHideDuration={3000} onClose={() => setToast("")} message={toast} anchorOrigin={{ vertical: "bottom", horizontal: "center" }} />
    </Box>
  );
}
