"use client";

import { useState, useEffect } from "react";
import { DataTable, Column } from "@/components/data-table";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/file-upload";

interface Client {
  id: string;
  name: string;
  logoUrl: string;
  order: number;
  isActive: boolean;
}

export default function ClientsPage() {
  const [items, setItems] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<Partial<Client> | null>(null);
  const [isNew, setIsNew] = useState(false);

  const load = () => {
    setLoading(true);
    api.get<Client[]>("/clients").then(setItems).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setIsNew(true); setEditItem({ name: "", logoUrl: "", order: 0, isActive: true }); };
  const openEdit = (item: Client) => { setIsNew(false); setEditItem({ ...item }); };

  const handleSave = async () => {
    if (!editItem) return;
    try {
      if (isNew) {
        await api.post("/clients", editItem);
        toast.success("Client created");
      } else {
        await api.put(`/clients/${editItem.id}`, editItem);
        toast.success("Client updated");
      }
      setEditItem(null);
      load();
    } catch (err: any) { toast.error(err.message); }
  };

  const handleDelete = async (item: Client) => {
    if (!confirm(`Delete "${item.name}"?`)) return;
    try {
      await api.delete(`/clients/${item.id}`);
      toast.success("Client deleted");
      load();
    } catch (err: any) { toast.error(err.message); }
  };

  const columns: Column<Client>[] = [
    { key: "name", label: "Name", sortable: true },
    { key: "order", label: "Order", sortable: true },
    { key: "isActive", label: "Active", render: (item) => item.isActive ? "Yes" : "No" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
        <p className="text-muted-foreground">Manage client logos displayed on the homepage</p>
      </div>
      <DataTable columns={columns} data={items} onEdit={openEdit} onDelete={handleDelete} onCreate={openNew} createLabel="Add Client" searchKeys={["name"]} loading={loading} />
      <Dialog open={!!editItem} onOpenChange={(o) => !o && setEditItem(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{isNew ? "New Client" : "Edit Client"}</DialogTitle></DialogHeader>
          {editItem && (
            <div className="space-y-4">
              <div className="space-y-2"><Label>Name</Label><Input value={editItem.name || ""} onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} /></div>
              <FileUpload label="Logo" value={editItem.logoUrl || ""} onChange={(url) => setEditItem({ ...editItem, logoUrl: url || "" })} />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Order</Label><Input type="number" value={editItem.order || 0} onChange={(e) => setEditItem({ ...editItem, order: parseInt(e.target.value) || 0 })} /></div>
                <div className="space-y-2"><Label>Active</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={editItem.isActive ? "true" : "false"} onChange={(e) => setEditItem({ ...editItem, isActive: e.target.value === "true" })}>
                    <option value="true">Yes</option><option value="false">No</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditItem(null)}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
