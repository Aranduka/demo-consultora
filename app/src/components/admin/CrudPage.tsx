"use client";
import { ReactNode, useCallback, useEffect, useState } from "react";
import {
  Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, IconButton, MenuItem, Paper, Stack, Switch,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
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
export type Column = { label: string; render: (row: any) => ReactNode };

type Props = {
  title: string;
  singular: string;
  endpoint: string;
  columns: Column[];
  fields: Field[];
  defaults?: Record<string, any>;
  canDelete?: boolean;
  actions?: (row: any, reload: () => void) => ReactNode;
  onSaved?: (data: any, mode: "create" | "edit") => void;
};

export default function CrudPage({ title, singular, endpoint, columns, fields, defaults = {}, canDelete = true, actions, onSaved }: Props) {
  const [rows, setRows] = useState<any[] | null>(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<any | null>(null); // null cerrado, {} nuevo
  const [form, setForm] = useState<Record<string, any>>({});
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    api<any[]>(endpoint).then(setRows).catch((e) => setError(e.message));
  }, [endpoint]);
  useEffect(load, [load]);

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
      onSaved?.(data, isEdit ? "edit" : "create");
    } catch (e: any) {
      setErrs(e.fields ?? {});
      setFormError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(row: any) {
    if (!confirm(`¿Eliminar este registro de ${singular}?`)) return;
    try {
      await api(`${endpoint}/${row.id}`, { method: "DELETE" });
      load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h5" fontWeight={500}>{title}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => open()}>Nuevo {singular}</Button>
      </Stack>
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>{error}</Alert>}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ "& th": { fontWeight: 600, bgcolor: "#E8EEF8" } }}>
              {columns.map((c) => <TableCell key={c.label}>{c.label}</TableCell>)}
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows === null && <TableRow><TableCell colSpan={columns.length + 1}>Cargando…</TableCell></TableRow>}
            {rows?.length === 0 && <TableRow><TableCell colSpan={columns.length + 1} align="center" sx={{ py: 4, color: "text.secondary" }}>Sin registros todavía</TableCell></TableRow>}
            {rows?.map((r) => (
              <TableRow key={r.id} hover>
                {columns.map((c) => <TableCell key={c.label}>{c.render(r)}</TableCell>)}
                <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                  {actions?.(r, load)}
                  <Tooltip title="Editar"><IconButton size="small" onClick={() => open(r)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                  {canDelete && <Tooltip title="Eliminar"><IconButton size="small" color="error" onClick={() => remove(r)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={editing !== null} onClose={() => setEditing(null)} fullWidth maxWidth="sm">
        <DialogTitle>{editing?.id !== undefined ? "Editar" : "Nuevo"} {singular}</DialogTitle>
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
        <DialogActions>
          <Button onClick={() => setEditing(null)}>Cancelar</Button>
          <Button variant="contained" onClick={save} disabled={saving}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
